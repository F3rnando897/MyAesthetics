// UserList.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Parse } from 'parse/react-native.js';
import Avatar from '../../../../assets/Icons/avatar.png';
export default function UsersList() {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Carregue a lista completa de usuários da tabela 'User'
    const User = Parse.Object.extend('_User');
    const query = new Parse.Query(User);

    query.find().then((results) => {
      const userList = results.map((user) => ({
        username: user.get('username'),
        surname: user.get('surname'),
        imgProfile: user.get('imgProfile') ? user.get('imgProfile').url() : null,
        objectId: user.id,
      }));

      setUsers(userList);
    });
  }, []);
  const handleUserPress = (user) => {
    // Navegue para a tela UserProfile e passe o objeto do usuário como parâmetro
    navigation.navigate('UserProfile', { objectId: user });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item.objectId)}>
          <View style={styles.userContainer}>
            <Image source={item.imgProfile ? { uri: item.imgProfile } : Avatar} style={styles.userImage} />
            <View style={styles.text} >
            <Text style={{fontSize: 16}}>{item.username} </Text>
            <Text style={{fontSize: 16}}>{item.surname}</Text>
            </View>
          </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingTop: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#4f4a4a',
  },
  userContainer: {
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row'
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  text: {
    marginLeft: 10,
    flexDirection: 'row',
  }
});
