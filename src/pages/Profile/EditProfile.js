import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import avatar from '../../../assets/Icons/avatar.png';
import Parse from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [surnameError, setSurnameError] = useState(null);
  const navigation = useNavigation();

  const profileSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Precisa ter pelo menos 3 caracteres!').required('Nome é obrigatório'),
    surname: Yup.string().min(3, 'Precisa ter pelo menos 3 caracteres!').required('Sobrenome é obrigatório'),
  });

  useEffect(() => {
    const currentUser = Parse.User.current();
    const imgProfile = currentUser.get('imgProfile');

    if (imgProfile) {
      setImage(imgProfile.url());
    }
  }, []);

  const updateUserProfile = async () => {
    try {
      setNameError(null);
      setSurnameError(null);

      await profileSchema.validate({ name, surname }, { abortEarly: false });

      const currentUser = Parse.User.current();
      currentUser.set('username', name);
      currentUser.set('surname', surname);
      currentUser.set('description', description);

      if (image) {
        const imageFile = new Parse.File('profile.jpg', { uri: image });
        await imageFile.save();
        currentUser.set('imgProfile', imageFile);
      }

      await currentUser.save();

      const updatedUserData = {
        username: name,
        surname,
        description,
      };

      navigation.navigate('Profile', { updatedUserData });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((e) => {
          if (e.path === 'name') {
            setNameError(e.message);
          } else if (e.path === 'surname') {
            setSurnameError(e.message);
          }
        });
      } else {
        console.error('Erro ao atualizar perfil:', error);
      }
    }
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (status !== 'granted') {
      alert('A permissão para acessar a galeria de imagens foi negada.');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.cancelled) {
      // Instead of result.uri, use result.assets[0].uri
      setImage(result.assets[0].uri);
    }
  };
  

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.profileImage} />
      ) : (
        <Image source={avatar} style={styles.profileImage} />
      )}
      <TouchableOpacity style={styles.changeImageBtn} onPress={selectImage}>
        <Text style={styles.changeImageText}>Escolher imagem de perfil</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      {nameError && <Text style={styles.errorText}>{nameError}</Text>}
      <TextInput
        placeholder="Sobrenome"
        value={surname}
        onChangeText={setSurname}
        style={styles.input}
      />
      {surnameError && <Text style={styles.errorText}>{surnameError}</Text>}
      <TextInput
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={updateUserProfile}>
        <Text style={{color: 'black'}}>Salvar</Text>
      </TouchableOpacity> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeImageBtn: {
    marginTop: 10,
  },
  changeImageText: {
    color: 'blue',
  }, 
  input: {
    width: '100%',
    height: 40,
    borderColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    padding: 5,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#fff',
    width: '100%',
    height: 40,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'black'
  }
});

export default EditProfile;
