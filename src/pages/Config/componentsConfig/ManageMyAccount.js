// ManageMyAccount.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js';

export default function ManageMyAccount({ navigation }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleChangeEmail = async () => {
    try {
      const user = await Parse.User.currentAsync();
      if (user) {
        user.setEmail(email);
        await user.save();
        Alert.alert('E-mail alterado com sucesso!');
      } else {
        Alert.alert('Usuário não autenticado. Faça o login primeiro.');
        navigation.navigate('Login'); // Substitua 'Login' pelo nome da tela de login.
      }
    } catch (error) {
      console.error('Erro ao alterar o e-mail:', error);
      Alert.alert('Erro ao alterar o e-mail. Tente novamente mais tarde.');
    }
  };

  const handleChangePhone = async () => {
    try {
      const user = await Parse.User.currentAsync();
      if (user) {
        user.set('phone', phone);
        await user.save();
        Alert.alert('Telefone alterado com sucesso!');
      } else {
        Alert.alert('Usuário não autenticado. Faça o login primeiro.');
        navigation.navigate('Login'); // Substitua 'Login' pelo nome da tela de login.
      }
    } catch (error) {
      console.error('Erro ao alterar o telefone:', error);
      Alert.alert('Erro ao alterar o telefone. Tente novamente mais tarde.');
    }
  };

  const handleNavigateToChangePassword = () => {
    navigation.navigate('ChangePassword'); // Substitua 'ChangePassword' pelo nome da tela de alteração de senha.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Minha Conta</Text>
      
      <Text>Altere seu e-mail:</Text>
      <TextInput
        style={styles.input}
        placeholder="Novo E-mail"
        onChangeText={text => setEmail(text)}
      />
      <Button title="Alterar E-mail" onPress={handleChangeEmail} />
      
      <Text>Altere seu telefone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Novo Telefone"
        onChangeText={text => setPhone(text)}
      />
      <Button title="Alterar Telefone" onPress={handleChangePhone} />

      <TouchableOpacity onPress={handleNavigateToChangePassword}>
        <Text style={styles.changePasswordText}>Alterar Senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  changePasswordText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});
