// EditEmpreendimento.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Parse } from 'parse/react-native.js';
import {styles} from './styles/Editstyle';
import * as ImagePicker from 'expo-image-picker';

export default function EditEmpreendimento({ route, navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const [empreendimentoData, setEmpreendimentoData] = useState({
    name: '',
    description: '',
    telephone: '',
    imgCover: null,
  });

  useEffect(() => {
    // Carregue os dados do empreendimento para edição
    const empreendimento = route.params.empreendimento;
    if (empreendimento) {
      setEmpreendimentoData(empreendimento);
    }
  }, [route.params]);

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) { // Substitua 'cancelled' por 'canceled'
        // Exiba previamente a nova imagem selecionada
        setSelectedImage(result.uri);
        setEmpreendimentoData({ ...empreendimentoData, imgCover: result.uri });
      }
      
    } catch (error) {
      console.error('Erro ao selecionar a imagem:', error);
    }
  };

  const handleSaveEmpreendimento = async () => {
    try {
      const empreendimento = new Parse.Object('Empreendimentos');
      empreendimento.set('objectId', empreendimentoData.objectId);
      empreendimento.set('name', empreendimentoData.name);
      empreendimento.set('description', empreendimentoData.description);
      empreendimento.set('telephone', empreendimentoData.telephone);

      if (empreendimentoData.imgCover) {
        // Verifica se imgCover é uma URI (indicando uma imagem recém-selecionada) ou uma URL de Parse File (uma imagem existente)
        if (typeof empreendimentoData.imgCover === 'string' && empreendimentoData.imgCover.startsWith('http')) {
          // URL de imagem existente, não é necessário fazer o upload novamente
          empreendimento.set('imgCover', empreendimentoData.imgCover);
        } else if (typeof empreendimentoData.imgCover === 'string') {
          // Imagem recém-selecionada, faça o upload para o Parse
          const parseFile = new Parse.File('imgCover', {
            uri: empreendimentoData.imgCover,
          });
          await parseFile.save();
          empreendimento.set('imgCover', parseFile);
        }
      }
      

      await empreendimento.save();

      // Atualize os dados do empreendimento na tela anterior
      route.params.updateEmpreendimento(empreendimentoData);

      // Navegue de volta para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar o empreendimento:', error);
    }
  };

  return (
    <ScrollView>
      
    <View style={styles.containerForm}>
      <View>
        {empreendimentoData.imgCover && (
          <Image
            source={{ uri: empreendimentoData.imgCover.url }}
            style={styles.imgEmpreendimento}
          />
        )}
        < TouchableOpacity style={styles.button} onPress={() => handleSelectImage()}>
          <Text style={styles.buttonTxt}>Selecionar Imagem</Text>  
        </TouchableOpacity> 
      </View>

      <Text style={styles.title}>Nome:</Text>
      <View style={styles.inputContainer}>
        
        <TextInput
        style={styles.input}
          value={empreendimentoData.name}
          onChangeText={(text) => setEmpreendimentoData({ ...empreendimentoData, name: text })}
        />
      </View>
      <Text style={styles.title}>Descrição:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={empreendimentoData.description}
          onChangeText={(text) => setEmpreendimentoData({ ...empreendimentoData, description: text })}
        />
      </View>

      <Text style={styles.title}>Telefone:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={empreendimentoData.telephone}
          onChangeText={(text) => setEmpreendimentoData({ ...empreendimentoData, telephone: text })}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleSaveEmpreendimento()}>
        <Text style={styles.buttonTxt}>Salvar</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
