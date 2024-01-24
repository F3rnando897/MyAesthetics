import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js';
import * as Yup from 'yup';

export default function ChangePassword({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Defina o esquema de validação com Yup
  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Senha atual é obrigatória'),
    newPassword: Yup.string()
      .min(6, 'A nova senha deve conter pelo menos 6 caracteres')
      .required('Nova senha é obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'As senhas não coincidem')
      .required('Confirme a nova senha'),
  });

  // Use o estado para controlar os erros
  const [errors, setErrors] = useState({});

  const handleChangePassword = async () => {
    try {
      // Valide os campos usando Yup
      validationSchema
        .validate({ currentPassword, newPassword, confirmPassword }, { abortEarly: false })
        .then(() => {
          // Se a validação passar, continue com a lógica de alteração da senha
          const user = Parse.User.current();
          Parse.User.logIn(user.getUsername(), currentPassword)
            .then(() => {
              user.setPassword(newPassword);
              user.save().then(() => {
                Alert.alert('Senha alterada com sucesso!');
                navigation.navigate('ManageMyAccount');
              });
            })
            .catch((error) => {
              console.error('Erro ao logar com a senha atual:', error);
              Alert.alert('Erro ao logar com a senha atual. Verifique e tente novamente.');
            });
        })
        .catch((validationErrors) => {
          // Se houver erros de validação, exiba as mensagens de erro abaixo dos campos
          const errorMessages = {};
          validationErrors.inner.forEach((error) => {
            errorMessages[error.path] = error.message;
          });
          setErrors(errorMessages);
        });
    } catch (error) {
      console.error('Erro ao alterar a senha:', error);
      Alert.alert('Erro ao alterar a senha. Verifique a senha atual e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>
      <Text>Insira sua senha atual, a nova senha e confirme a nova senha.</Text>

      <TextInput
        style={styles.input}
        placeholder="Senha Atual"
        onChangeText={(text) => setCurrentPassword(text)}
        secureTextEntry={true}
      />
      {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nova Senha"
        onChangeText={(text) => setNewPassword(text)}
        secureTextEntry={true}
      />
      {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirme a Nova Senha"
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry={true}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

      <Button title="Alterar Senha" onPress={handleChangePassword} />
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
  errorText: {
    color: 'red',
  },
});
