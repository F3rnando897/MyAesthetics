import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, Button, StyleSheet } from 'react-native';
import Parse from 'parse/react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddPortfolio({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDescription, setImageDescription] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Desculpe, precisamos da permissão para acessar a galeria de imagens.');
      }
    })();
  }, []);

  const handleImageSelection = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleAddPortfolioItem = async () => {
    try {
      if (!selectedImage) {
        console.error('Nenhuma imagem selecionada');
        return;
      }

      const base64 = await fetch(selectedImage)
        .then((response) => response.blob())
        .then((blob) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }));

      const imageFile = new Parse.File('portfolio_image.jpg', {
        base64: base64.split(',')[1],
      });

      await imageFile.save();

      const UserActivity = Parse.Object.extend('UserActivity');
      const userActivity = new UserActivity();

      userActivity.set('type', imageFile);
      userActivity.set('content', imageDescription);
      userActivity.set('date', new Date());
      userActivity.set('userId', Parse.User.current());

      await userActivity.save();

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar ao portfólio:', error);
    }
  };

  const openImageModal = () => {
    setImageModalVisible(true);
  };

  const closeImageModal = () => {
    setImageModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleImageSelection} style={styles.imagePickerContainer}>
        <View style={styles.imagePicker}>
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePickerText}>Selecione uma imagem</Text>
          )}
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Descrição da imagem"
        value={imageDescription}
        onChangeText={(text) => setImageDescription(text)}
      />

      <Button title="Adicionar ao Portfólio" onPress={handleAddPortfolioItem} />

      <Modal transparent={true} visible={imageModalVisible} onRequestClose={closeImageModal}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          <Button title="Fechar" onPress={closeImageModal} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    fontSize: 16,
    color: '#757575',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
});
