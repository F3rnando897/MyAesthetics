// Config.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Parse from 'parse/react-native.js';
import {styles} from './style';
import { AntDesign, SimpleLineIcons, Entypo } from '@expo/vector-icons';
export default function Config({ navigation }) {
  // Função para lidar com a ação quando o botão "Voltar" é pressionado
  const handleBackButtonPress = () => {
    navigation.goBack(); // Isso levará você de volta à tela anterior (Profile)
  };

  // Função para lidar com a verificação de conta
  const handleManageMyAccount = () => {
    navigation.navigate('ManageMyAccount'); 
  };

  // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      // Redirecione o usuário para a tela de login ou qualquer outra tela inicial do seu aplicativo
      navigation.navigate('Login'); // Substitua 'Login' pelo nome de sua tela de login.
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações</Text>

      <Text style={{marginVertical: 10, marginLeft: 10}}>Conta</Text>
      <TouchableOpacity style={styles.options} onPress={handleManageMyAccount}>
        <Text style={styles.optionsText}> Gerenciar minha conta</Text>
        <AntDesign name="right" size={18} color="black" style={{alignSelf: 'center'}} />
      </TouchableOpacity>

      <Text style={{marginVertical: 10, marginLeft: 10}}>Suporte</Text>
      <TouchableOpacity style={styles.options} onPress={handleLogout}>
        <Text style={styles.optionsText}> Sair</Text>
        <AntDesign name="right" size={18} color="black" style={{alignSelf: 'center'}} />
      </TouchableOpacity>
    </View>
  );
}
