import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Parse from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
import Avatar from '../../../assets/Icons/avatar.png';

const UserChat = ({ route }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const currentUser = Parse.User.current();
  const { userId } = route.params;
  const navigation = useNavigation();

  const Conversation = Parse.Object.extend('Conversation');
  const User = Parse.Object.extend('_User');

  const [userProfile, setUserProfile] = useState({
    username: '',
    imgProfile: null,
  });

  const fetchUserProfile = async () => {
    try {
      const userQuery = new Parse.Query(User);
      const user = await userQuery.get(userId.id);
      setUserProfile({
        username: user.get('username'),
        imgProfile: user.get('imgProfile') ? user.get('imgProfile').url() : null,
      });
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
    }
  };

  const fetchNewMessages = () => {
    const query1 = new Parse.Query(Conversation);
    query1.equalTo('emissorId', currentUser);
    query1.equalTo('receptorId', userId);

    const query2 = new Parse.Query(Conversation);
    query2.equalTo('emissorId', userId);
    query2.equalTo('receptorId', currentUser);

    const mainQuery = Parse.Query.or(query1, query2);

    mainQuery.ascending('createdAt');

    mainQuery.find().then((results) => {
      setChat(results);
    }).catch((error) => {
      console.error('Erro ao carregar mensagens:', error);
    });
  };

  useEffect(() => {
    fetchNewMessages();
    fetchUserProfile();

    const interval = setInterval(() => {
      fetchNewMessages();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleSendMessage = () => {
    const conversation = new Conversation();
    conversation.set('emissorId', currentUser);
    conversation.set('receptorId', userId);
    conversation.set('message', message);
    conversation.set('timeStamp', new Date());

    conversation.save().then((response) => {
      setMessage('');
      setChat([...chat, response]);
    }).catch((error) => {
      console.error('Erro ao enviar mensagem:', error);
    });
  };

  const formatTimestamp = (timestamp) => {
    // Formate o horário para mostrar apenas a hora e os minutos (HH:mm)
    const options = { hour: '2-digit', minute: '2-digit' };
    return timestamp.toLocaleTimeString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}><AntDesign name="arrowleft" size={24} color="black" /></TouchableOpacity>
        {userProfile.imgProfile ? (
          <Image
            source={{ uri: userProfile.imgProfile }}
            style={styles.avatar}
          />
        ) : (
          <Image source={Avatar} style={styles.avatar} />
        )}
        <Text style={styles.username}>{userProfile.username}</Text>
      </View>
      <FlatList
        data={chat}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.get('emissorId').id === currentUser.id ? styles.myMessage : styles.otherMessage
          ]}>
            <Text style={styles.messageText}>{item.get('message')}</Text>
            <Text style={styles.timestamp}>
              {formatTimestamp(item.get('timeStamp'))} {/* Exibe o horário da mensagem */}
            </Text>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Digite sua mensagem"
        />
        <TouchableOpacity onPress={handleSendMessage} ><Ionicons name="send" size={24} color="black" /></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginLeft: 5
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  myMessage: {
    backgroundColor: 'gray',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: 'blue',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  timestamp: {
    fontSize: 10,
    color: 'white',
    alignSelf: 'flex-end',
  },
});

export default UserChat;
