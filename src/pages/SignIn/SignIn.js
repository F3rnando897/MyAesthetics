import React, {useState} from "react";
import * as yup from 'yup';
import { Text, View, TextInput, TouchableOpacity, ScrollView} from "react-native";
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from "@react-navigation/native";
import {styles} from './style';
import Parse from "parse/react-native.js";


// Mensagens de erro com a api Hook Form
const schema = yup.object({
    username: yup.string().min(3, "Informe seu nome corretamente!").required("Informe seu nome!"),
    surname: yup.string().min(3, "Informe seu sobrenome corretamente!").required("Informe seu sobrenome!"),
    email: yup.string().email("Email Invalido!").required("Informe seu email!"),
    password: yup.string().min(6, "A sua senha deve ter pelo menos 6 digitos!").required("Informe sua senha")
})

export default function SignIn() {
    const { control, handleSubmit, formState: { errors } } = useForm({
      resolver: yupResolver(schema)
    });
  
    const Navigation = useNavigation();
    const [accountExists, setAccountExists] = useState(false); // Mova a declaração aqui
  
    async function handleSignIn(data) {
      console.log(data);
      const usernameValue = data.username;
      const surnameValue = data.surname;
      const passwordValue = data.password;
      const emailValue = data.email;
  
      // Verificar se o usuário já existe antes de criar a conta
      const User = new Parse.User();
      const query = new Parse.Query(User);
      query.equalTo("email", emailValue);
  
      try {
        const user = await query.first();
  
        if (user) {
          // O usuário já existe, exiba uma mensagem de validação
          setAccountExists(true);
        } else {
          // O usuário não existe, crie a conta
          const newUser = new Parse.User();
          newUser.set("username", usernameValue);
          newUser.set("surname", surnameValue);
          newUser.set("password", passwordValue);
          newUser.set("email", emailValue);
  
          await newUser.signUp();
          console.log("Usuário criado");
          Navigation.navigate('Login');
          return true;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    return(
        <ScrollView style={{backgroundColor: '#fff'}}>
    <View style={styles.container}>
        <Animatable.View animation="fadeInLeft" delay={400} style={styles.containerHeader}>
        <Text style={styles.text}>Crie sua conta</Text>
        </Animatable.View>

        {/* Formulario de cadastro */}
        
        <View style={styles.containerForm}>
        <Animatable.View animation="fadeInUp" style={styles.containerForm}>
            <Controller 
                defaultValue=""
                control={control} 
                name={"username"} 
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                    <Text style={styles.title}>Nome</Text>
                    <TextInput name ="username" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Nome" style={styles.input}/>
                    </View>
                )}
                />
                {errors.username &&<Text style={styles.labelError}>{errors.username?.message}</Text> }

                <Controller 
                    defaultValue=""
                    control={control} 
                    name={"surname"} 
                    render={({field: {onChange, onBlur, value}}) => (
                        <View>
                            <Text style={styles.title}>Sobrenome</Text>
                            <TextInput name="surname" value={value} onChangeText={onChange} onBlur={onBlur} placeholder="Sobrenome" style={styles.input}/>
                        </View>
                    )}
                />
                {errors.surname && <Text style={styles.labelError}>{errors.surname?.message}</Text>}


                <Controller 
                defaultValue=""
                control={control} 
                name={"email"} 
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                    <Text style={styles.title}>Email</Text>
                    <TextInput name ="email" value={value} onChangeText={onChange}  onBlur={onBlur} placeholder="Email" style={styles.input}/>
                    </View>
                )}
                />
                {errors.email &&<Text style={styles.labelError}>{errors.email?.message}</Text> }

                <Controller 
                defaultValue=""
                control={control} 
                name={"password"} 
                render={({field: {onChange, onBlur, value}}) => (
                    <View>
                    <Text style={styles.title}>Senha</Text>
                    <TextInput name ="password" value={value} onChangeText={onChange} onBlur={onBlur} secureTextEntry={true} placeholder="Senha" style={styles.input}/>
                    </View>
                )}
                />
                {errors.password &&<Text style={styles.labelError}>{errors.password?.message}</Text> }

            <TouchableOpacity style={styles.button} title={"Sign Up"} onPress={handleSubmit(handleSignIn)}  >
                <Text style={styles.buttonTxt}>Cadastrar</Text>
            </TouchableOpacity>
            {accountExists && <Text style={styles.labelError}>Esta conta já existe. Tente fazer login em vez disso!</Text>}
            
            <TouchableOpacity style={styles.buttonCad}
            onPress={ () => Navigation.navigate('Login')}>
                <Text style={styles.cadTxt}>Já possui uma conta? Faça login.</Text>
            </TouchableOpacity>
        </Animatable.View>
        </View>
        
        
    </View>
    </ScrollView>
    );  
}