import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Parse from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../../../assets/Icons/avatar.png';
import { AntDesign, Ionicons, Entypo } from '@expo/vector-icons';
const ChatListProfile = () => {
  const [userList, setUserList] = useState([]);
  const currentUser = Parse.User.current();
  const navigation = useNavigation();
  useEffect(() => {
    fetchUserConversations();
  }, []);

  const fetchUserConversations = async () => {
    try {
      const Conversation = Parse.Object.extend('Conversation');
      const query1 = new Parse.Query(Conversation);
      query1.equalTo('emissorId', currentUser);
      const query2 = new Parse.Query(Conversation);
      query2.equalTo('receptorId', currentUser);

      const mainQuery = Parse.Query.or(query1, query2);
      mainQuery.ascending('timeStamp');
      const conversations = await mainQuery.find();

      const uniqueUserIds = conversations.map((conversation) => {
        if (conversation.get('emissorId').id !== currentUser.id) {
          return conversation.get('emissorId').id;
        }
        return conversation.get('receptorId').id;
      });

      const userQuery = new Parse.Query(Parse.User);
      userQuery.containedIn('objectId', uniqueUserIds);
      const users = await userQuery.find();

      setUserList(users);
    } catch (error) {
      console.error('Error fetching user conversations:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => navigation.goBack()}><AntDesign name="arrowleft" size={24} color="black" /></TouchableOpacity>
      <Text style={styles.title}>Conversas</Text>
      </View>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.id}
        
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
              navigation.navigate('UserChat', { userId: item });
            }}
          >
            {item.get('imgProfile') ? (
              <Image
                source={{ uri: item.get('imgProfile').url() }} // Exibe a foto de perfil do usuário
                style={styles.avatar}
              />
            ) : (
              <Image source={Avatar} style={styles.avatar} /> // Exibe a imagem "Avatar" se não houver foto de perfil
            )}
            <Text>{item.get('username')}</Text>
            {console.log(item)}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5
  },
  userItem: {
    flexDirection: 'row', // Para alinhar a imagem e o nome na horizontal
    alignItems: 'center', // Para centralizar verticalmente
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ChatListProfile;
