// AvaliationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import { Parse } from 'parse/react-native.js';
import { styles } from './style';
import Avatar from '../../../../assets/Icons/avatar.png';
const AvaliationsScreen = ({ route }) => {
  const { empreendimentoId } = route.params;
  const [avaliationsData, setAvaliationsData] = useState([]);

  useEffect(() => {
    const fetchAvaliations = async () => {
      const Avaliations = Parse.Object.extend('Avaliations');
      const query = new Parse.Query(Avaliations);

      const empreendimentoPointer = Parse.Object.extend('Empreendimentos').createWithoutData(empreendimentoId);
      query.equalTo('avaliationEmpreendimentoId', empreendimentoPointer);

      try {
        const avaliations = await query.include('userAvaliationId').find();
        setAvaliationsData(avaliations.map((avaliacao) => avaliacao.toJSON()));
      } catch (error) {
        console.error('Error fetching avaliations:', error);
      }
    };

    fetchAvaliations();
  }, [empreendimentoId]);

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginVertical: 10 }}>Avaliações</Text>
      <FlatList
        data={avaliationsData}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <View style={styles.avaliationsItem}>
            {item.userAvaliationId.imgProfile ? (
              <Image source={{ uri: item.userAvaliationId.imgProfile.url }} style={[styles.userImg, { marginTop: 9 }]} />
            ) : (
              <Image source={Avatar} style={[styles.userImg, { marginTop: 9 }]} />
            )}

            <View style={{ flexDirection: 'column', paddingHorizontal: 2 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[styles.description, { fontSize: 18, marginTop: 5, marginRight: 2 }]}>{item.userAvaliationId.username}</Text>
                <AirbnbRating
                  defaultRating={item.numberAvaliation}
                  size={15}
                  showRating={false}
                  isDisabled
                  reviews={false}
                />
              </View>
              <Text style={[styles.description, { fontSize: 15 }]}>{item.comentary}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default AvaliationsScreen;
