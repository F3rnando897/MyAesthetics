// Importações necessárias
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Parse } from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import { styles } from './style';

export default function Services({ route }) {
  const { empreendimentoId } = route.params;
  const [servicesData, setServicesData] = useState([]);
  const [avaliationsData, setAvaliationsData] = useState([]);
  const navigation = useNavigation();

  async function fetchServicesData() {
    const Services = Parse.Object.extend('Services');
    const query = new Parse.Query(Services);
    
    // Crie um objeto Pointer para a classe 'Empreendimentos' com base no `empreendimentoId`
    const Empreendimentos = Parse.Object.extend('Empreendimentos');
    const empreendimentoPointer = Empreendimentos.createWithoutData(empreendimentoId);
    query.equalTo('serviceEmpreendimento', empreendimentoPointer);

    try {
      const services = await query.find();
      setServicesData(services.map((service) => service.toJSON()));
    } catch (error) {
      console.error('Erro ao buscar serviços do empreendimento:', error);
    }
  }

  useEffect(() => {
    fetchServicesData();
  }, [empreendimentoId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todos os Serviços</Text>
      <FlatList
        data={servicesData}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => {
              // Navegue para a tela de detalhes do serviço (você precisa criar a tela de detalhes do serviço)
              navigation.navigate('DetalhesServico', { serviceId: item.objectId });
            }}
          >
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Text style={styles.description}>{item.nameService}</Text>
              <Text style={styles.description2}>{item.description}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.description, { fontWeight: 'bold', marginRight: 5 }]}>R${item.price}</Text>
              <TouchableOpacity style={[styles.button, { marginTop: 0, paddingHorizontal: 20 }]}>
                <Text style={styles.buttonTxt}>Agendar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
