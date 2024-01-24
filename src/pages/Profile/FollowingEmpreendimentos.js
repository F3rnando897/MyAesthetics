import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Parse from 'parse/react-native.js'; // Importe o Parse
import { useNavigation } from '@react-navigation/native';
import imgCover from '../../../assets/grayBackground.png';
export default function FollowingEmpreendimentos() {
  const [followingEmpreendimentos, setFollowingEmpreendimentos] = useState([]);
  const navigation = useNavigation();
  console.log(followingEmpreendimentos);

  // Função para navegar para a página do empreendimento
  const goToEmpreendimento = (objectId) => {
    navigation.navigate('Details', { objectId });
  };

  // Função para buscar os empreendimentos que o usuário está seguindo
  const fetchFollowingEmpreendimentos = async () => {
    try {
      const currentUser = Parse.User.current();

      const FollowEmpreendimentos = Parse.Object.extend('FollowEmpreendimentos');
      const followQuery = new Parse.Query(FollowEmpreendimentos);
      followQuery.equalTo('follower', currentUser);

      // Execute a consulta para obter os objetos de "FollowEmpreendimentos" em que o usuário atual é o seguidor
      const followResults = await followQuery.find();

      // Crie uma matriz de objetos "followingEmpreendimentos" a partir dos resultados de "FollowEmpreendimentos"
      const followingEmpreendimentosObjects = followResults.map((follow) => follow.get('followingEmpreendimentos'));

      // Execute uma consulta para obter os empreendimentos correspondentes
      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentosQuery = new Parse.Query(Empreendimentos);
      empreendimentosQuery.containedIn('objectId', followingEmpreendimentosObjects.map((e) => e.id));
      empreendimentosQuery.include('imgCover'); // Para buscar o campo imgCover como um File

      // Execute a consulta para obter os empreendimentos que o usuário segue
      const followingEmpreendimentosData = await empreendimentosQuery.find();

      setFollowingEmpreendimentos(followingEmpreendimentosData);
    } catch (error) {
      console.error('Error fetching following empreendimentos:', error);
    }
  };

  useEffect(() => {
    fetchFollowingEmpreendimentos();
  }, []);

  // Função para renderizar cada item da lista
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToEmpreendimento(item.id)}>
      <View style={styles.empreendimentoCard}>
        <Image
          source={item.get('imgCover') ? { uri: item.get('imgCover').url()} : imgCover}
          style={styles.empreendimentoImage}
        />
        <View style={styles.empreendimentoDetails}>
          <Text style={styles.empreendimentoName}>{item.get('name')}</Text>
          <Text style={styles.empreendimentoAddress}>{item.get('type')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={followingEmpreendimentos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empreendimentoItem: {
    alignItems: 'center',
    padding: 16,
    flexDirection: 'row'
  },
  empreendimentoImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  empreendimentoName: {
    marginTop: 8,
    fontSize: 18,
  },

  empreendimentoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: 'black'
  },
  empreendimentoDetails: {
    flex: 1,
    marginLeft: 16,
  },
  empreendimentoAddress: {
    fontSize: 14,
    color: 'gray',
  },
});
