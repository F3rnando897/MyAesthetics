import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js'; // Importe o Parse
import Avatar from '../../../assets/Icons/avatar.png';
import { useNavigation } from '@react-navigation/native';

export default function FollowingUsers() {
  const [followingUsers, setFollowingUsers] = useState([]);
  const navigation = useNavigation();
 console.log(followingUsers)

 // Função para navegar para o perfil do usuário
 const goToUserProfile = (objectId) => {
    navigation.navigate('UserProfile', { objectId }); // Passe o ID do usuário para a tela de perfil do usuário
  };
  // Função para buscar os usuários que o usuário está seguindo
  const fetchFollowingUsers = async () => {
    try {
      const currentUser = Parse.User.current();

      const Follow = Parse.Object.extend('Follow');
      const followQuery = new Parse.Query(Follow);
      followQuery.equalTo('follower', currentUser);

      // Execute a consulta para obter os objetos de "Follow" em que o usuário atual é o seguidor
      const followResults = await followQuery.find();
        console.log(followResults)
      // Crie uma matriz de ponteiros de usuário para os objetos "following"
      const followingUsersPointers = followResults.map((follow) => follow.get('following').id);

      console.log(followingUsersPointers)
      // Execute uma consulta para obter os usuários com base nos ponteiros
      const User = Parse.Object.extend('User');
      const userQuery = new Parse.Query(User);
      userQuery.containedIn('objectId', followingUsersPointers);

      // Execute a consulta para obter os usuários que o usuário segue
      const followingUsersData = await userQuery.find();
      console.log(followingUsersData)
      setFollowingUsers(followingUsersData);
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  useEffect(() => {
    fetchFollowingUsers();
  }, []);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => goToUserProfile(item.id)}>
      <View style={styles.userItem}>
      {item.get('imgProfile') ? (
        <Image source={{ uri: item.get('imgProfile').url() }} style={styles.userImage} />
      ) : (
        <Image source={Avatar} style={styles.userImage} />
      )}
      <Text style={styles.username}>{item.get('username')} {item.get('surname')}</Text>
      <Text style={styles.email}>{item.get('email')}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={followingUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: 'black'
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginLeft: 16,
    fontSize: 18,
  },
  email: {
    marginLeft: 16,
    fontSize: 16,
  },
});
