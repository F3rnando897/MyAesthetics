import React, { useState } from "react";
import * as yup from 'yup';
import {Text, View, TextInput,TouchableOpacity} from "react-native";
import {useForm, Controller} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Animatable from 'react-native-animatable';
import { Parse } from "parse/react-native.js";
import { useNavigation } from "@react-navigation/native";
import { styles } from './style';
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";


const schema = yup.object({
  email: yup.string().email("Email Inválido!").required("Informe seu email!"),
  password: yup.string().min(6, "A sua senha deve ter pelo menos 6 caracteres!").required("Informe sua senha"),
  
});

export default function Login() {
  const [loginStatus, setLoginStatus] = useState({ success: false, error: "" });
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const Navigation = useNavigation();

  const doUserLogin = async function ({ email, password }) {
    

    try {
      const loggedInUser = await Parse.User.logIn(email, password);
      console.log('Sucesso!', `O usuário ${loggedInUser.get('email')} entrou com sucesso!`);

      const currentUser = await Parse.User.currentAsync();
      console.log(loggedInUser === currentUser);

      // Definir o estado para login bem-sucedido
      setLoginStatus({ success: true, error: "" });

      // Usar a função de navegação fornecida como argumento
      Navigation.navigate('Home');
      return true;
    } catch (error) {
      console.log('Erro!', error.message);

      if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
        // Definir o estado para erro de login
        setLoginStatus({ success: false, error: "Ops! Algo deu errado. Email ou Senha incorretos!" });
      }
      return false;
    }
  }

  return (
    
    <View style={styles.container}>
      <Animatable.View animation="fadeInLeft" delay={400} style={styles.containerHeader}>
        <Text style={styles.text}>Bem-vindo(a)</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" style={styles.containerForm}>
        <Controller
          defaultValue=""
          control={control} 
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.title}>Email</Text>
              <TextInput
                name="email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Email"
                style={styles.input}
              />
            </View>
          )}
        />
        <Text style={{ color: 'red' }}>{errors.email?.message}</Text>
        <Controller
          defaultValue=""
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text style={styles.title}>Senha</Text>
              <TextInput
                name="password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={true}
                placeholder="Senha"
                style={styles.input}
              />
            </View>
          )}
        />
        <Text style={{ color: 'red' }}>{errors.password?.message}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSubmit(doUserLogin)}>
          <Text style={styles.buttonTxt}>Acessar</Text>
        </TouchableOpacity>
        {loginStatus.error && <Text style={{ color: 'red', textAlign: 'center' }}>{loginStatus.error}</Text>}
        <TouchableOpacity style={styles.buttonCad} onPress={() => Navigation.navigate('SignIn')}>
          <Text style={styles.cadTxt}>Não possui conta? Cadastre-se.</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
