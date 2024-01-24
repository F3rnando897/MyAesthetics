import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Parse } from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { Feather } from '@expo/vector-icons';
import {styles} from './styles/styleFavorites';
import imgCover from '../../../assets/grayBackground.png';
export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [removedItemId] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchFavorites() {
      const currentUser = Parse.User.current();
      if (currentUser) {
        const Favorite = Parse.Object.extend('Favorite');
        const query = new Parse.Query(Favorite);
        query.equalTo('favorite_user', currentUser);

        try {
          const results = await query.find();

          const favoriteEmpreendimentos = await Promise.all(
            results.map(async (favorite) => {
              const empreendimentoPointer = favorite.get('favorite_empreendimento');
              const empreendimento = await empreendimentoPointer.fetch();
              return {
                objectId: empreendimento.id,
                name: empreendimento.get('name'),
                address: empreendimento.get('address'),
                imgCover: empreendimento.get('imgCover'),
                numberAddress: empreendimento.get('numberAddress'),
                telephone: empreendimento.get('telephone'),
              };
            })
          );

          setFavorites(favoriteEmpreendimentos);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    }

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (objectId) => {
    const currentUser = Parse.User.current();
    if (currentUser) {
      const Favorite = Parse.Object.extend('Favorite');
      const query = new Parse.Query(Favorite);
      query.equalTo('favorite_user', currentUser);

      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentoPointer = Empreendimentos.createWithoutData(objectId);
      query.equalTo('favorite_empreendimento', empreendimentoPointer);

      try {
        const favorite = await query.first();
        if (favorite) {
          await favorite.destroy();
          // Atualize a lista de favoritos após a exclusão
          const updatedFavorites = favorites.filter((item) => item.objectId !== objectId);
          setFavorites(updatedFavorites);
    
          // Mostrar a mensagem de sucesso com animação de baixo para cima
          setShowSuccessMessage(true);
    
          // Aguarde alguns segundos e depois oculte a mensagem com animação de cima para baixo
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000); // Ocultar após 5 segundos (ajuste conforme necessário)
        }
      } catch (error) {
        console.error('Erro ao remover dos favoritos:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Favoritos</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.favoriteItem}
            onPress={() => {
              // Navegue para a tela de detalhes do empreendimento passando o item como parâmetro
              navigation.navigate('Details', { objectId: item.objectId });
            }}
          >
            <Image source={item.imgCover ? { uri: item.imgCover.url() } : imgCover} style={styles.favoriteImage} />
            <View style={styles.favoriteInfo}>
              <Text style={styles.favoriteName}>{item.name}</Text>
              <Text style={styles.favoriteAddress}>{item.type}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                handleRemoveFavorite(item.objectId); // Chamada para remover dos favoritos
              }}
            >
              {removedItemId === item.objectId ? ( // Aplicar animação se o item foi removido
                <Animatable.View animation="fadeOutRight" duration={1000}>
                  <View>
                  <Feather name="x" size={24} color="red" style={{padding: 10, justifyContent: 'center', alignItems: 'center'}} />
                  </View>
                </Animatable.View>
              ) : (
                <Feather name="x" size={24} color="red" style={{padding: 10}} />
              )}
            </TouchableOpacity>
          </TouchableOpacity>
          
        )}
      />
      {showSuccessMessage && (
      <Animatable.View
      animation="slideInUp" // Animação de baixo para cima
      duration={600} // Duração da animação em milissegundos
      
      style={styles.successMessage}
    >
      <Text style={styles.successMessageText}>Empreendimento removido com sucesso!</Text>
    </Animatable.View>
    )}
    </View>
  );
}

