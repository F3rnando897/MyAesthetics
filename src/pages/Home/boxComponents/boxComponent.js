import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AirbnbRating } from 'react-native-ratings';
import { Parse } from "parse/react-native.js";
import imgCover from '../../../../assets/grayBackground.png';
import {styles} from './style';

export default function Recomendation(props){
  const [avaliationsData, setAvaliationsData] = useState([]);
  const [empreendimentoAddress, setEmpreendimentoAddress] = useState({});

  async function fetchAvaliations() {
    const Avaliations = Parse.Object.extend('Avaliations');
    const query = new Parse.Query(Avaliations);

    // Use o `empreendimentoPointer` para buscar as avaliações associadas ao empreendimento
    const empreendimentoPointer = Parse.Object.extend('Empreendimentos').createWithoutData(props.objectId);
    query.equalTo('avaliationEmpreendimentoId', empreendimentoPointer);

    try {
      const avaliations = await query.include('userAvaliationId').find();
      setAvaliationsData(avaliations.map((avaliacao) => avaliacao.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar avaliações do empreendimento:', error);
    }
  }

  async function fetchEmpreendimentoAddress() {
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const query = new Parse.Query(Empreendimentos);
  
    // Suponha que 'props.objectId' seja o ID do empreendimento que você deseja buscar.
    query.equalTo('objectId', props.objectId);
    query.include('addressEmpreendimentoId'); // Inclua a relação com 'AddressesEmpreendimento'.
  
    try {
      const empreendimento = await query.first(); // Recupere o primeiro resultado.
      if (empreendimento) {
        // Agora você pode acessar os campos de endereço.
        const addressObject = empreendimento.get('addressEmpreendimentoId');
        if (addressObject) {
          const state = addressObject.get('state');
          const city = addressObject.get('city');
          const neighborhood = addressObject.get('neighborhood');
  
          // Atualize o estado com o endereço
        setEmpreendimentoAddress({
          state,
          city,
          neighborhood,
        });
        }
      } else {
        console.log('Empreendimento não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar empreendimento:', error);
    }
  }
  

  const calculateAverageRating = () => {
    if (avaliationsData.length === 0) {
      return 0; // Default to 0 if there are no ratings
    }

    const totalRating = avaliationsData.reduce((sum, avaliacao) => sum + avaliacao.numberAvaliation, 0);
    const averageRating = totalRating / avaliationsData.length;

    return averageRating;
  };

  const averageRating = calculateAverageRating();

  useEffect(() => {
    fetchEmpreendimentoAddress();
    fetchAvaliations();
  
}, []);


      return (
        <View>
            <TouchableOpacity onPress={props.onPress} style={styles.container}>
            <Image
          source={props.imgCover && props.imgCover.url() ? {uri: props.imgCover.url()} : imgCover }
          style={styles.cover}
        />
                <Text style={styles.title}>{props.name}</Text>
                <Text style={styles.description}>{empreendimentoAddress.state}, {empreendimentoAddress.city}, {empreendimentoAddress.neighborhood}</Text>
        
                <View style={{flex: 1, alignSelf: 'center', marginBottom: 10, marginLeft: '38%'}}>
          <AirbnbRating
          defaultRating={averageRating}
          size={18}
          showRating
          isDisabled
          reviews={false}
        />
        <Text style={{fontSize: 16, color: '#000', fontFamily: 'Montserrat_600SemiBold', left: 120, top: -20}}>({averageRating.toFixed(2)})</Text>
        </View>
            </TouchableOpacity>
        </View>
    );
}
