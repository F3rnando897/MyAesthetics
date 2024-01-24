// AddPromotionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Parse } from 'parse/react-native.js';
import { AntDesign } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const AddPromotion = ({ route }) => {
    const empreendimentoId = route.params;
console.log(empreendimentoId.empreendimentoId)
const empreendimento = empreendimentoId.empreendimentoId;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState({});
  console.log(services)
  const navigation = useNavigation();

  async function fetchServices() {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser) {
        const Empreendedores = Parse.Object.extend('Empreendedores');
        const empreendedoresQuery = new Parse.Query(Empreendedores);
        empreendedoresQuery.equalTo('empUser', currentUser);
  
        const Empreendimentos = Parse.Object.extend('Empreendimentos');
        const empreendimentosQuery = new Parse.Query(Empreendimentos);
        empreendimentosQuery.matchesQuery('emp_empreendedores', empreendedoresQuery);
  
        const empreendimento = await empreendimentosQuery.first();
        if (empreendimento) {
          const empreendimentoId = empreendimento.id; // Get the objectId of the current Empreendimento
  
          // Create a Parse Query for the "Services" class
          const Services = Parse.Object.extend('Services');
          const servicesQuery = new Parse.Query(Services);
  
          // Include the pointer to the "Empreendimento" class
          servicesQuery.include('serviceEmpreendimento');
  
          // Filter services by the current Empreendimento objectId
          servicesQuery.equalTo('serviceEmpreendimento', {
            __type: 'Pointer',
            className: 'Empreendimentos',
            objectId: empreendimentoId,
          });
  
          // Fetch services related to the current Empreendimento
          const services = await servicesQuery.find();

  
          // Set the services data in the state
          setServices(services.map((service) => service.toJSON()));
        }
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const addPromotion = async () => {
    try {
      const Promotions = Parse.Object.extend('Promotions');
      const promotionObject = new Promotions();

      promotionObject.set('title', titulo);
      promotionObject.set('description', descricao);
      promotionObject.set('discount', 0);
      promotionObject.set('startDate', startDate ? new Date(startDate) : null);
      promotionObject.set('finishDate', finishDate ? new Date(finishDate) : null);
      promotionObject.set('empreendimentoId', {
        __type: 'Pointer',
        className: 'Empreendimentos',
        objectId: empreendimento,
      });

      const selectedServicesIds = selectedServices.map((serviceId) => serviceId);

      // Adiciona os descontos para cada serviço
      const servicesWithDiscounts = selectedServicesIds.map((serviceId) => ({
        serviceId,
        discount: discounts[serviceId] || 0,
      }));

      promotionObject.set('services', servicesWithDiscounts);

      await promotionObject.save();
      navigation.goBack();
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Promoção</Text>
      <TextInput
        style={styles.input}
        placeholder="Título da Promoção"
        onChangeText={(text) => setTitulo(text)}
        value={titulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição da Promoção"
        onChangeText={(text) => setDescricao(text)}
        value={descricao}
      />
      <View style={styles.calendarContainer}>
        <Text>Data de Início:</Text>
        <Calendar
          onDayPress={(day) => setStartDate(day.dateString)}
          markedDates={{ [startDate]: { selected: true, marked: true, selectedColor: 'blue' } }}
        />
      </View>
      <View style={styles.calendarContainer}>
        <Text>Data de Término:</Text>
        <Calendar
          onDayPress={(day) => setFinishDate(day.dateString)}
          markedDates={{ [finishDate]: { selected: true, marked: true, selectedColor: 'blue' } }}
        />
      </View>

      <Text>Selecione os serviços:</Text>
      {services.map((service) => (
        <View key={service.objectId} style={styles.serviceContainer}>
          <Text style={styles.serviceText}>{service.nameService}</Text>
          <TextInput
            style={styles.input}
            placeholder="Desconto (%)"
            keyboardType="numeric"
            onChangeText={(text) => {
              const discountValue = parseFloat(text);
              setDiscounts((prevDiscounts) => ({
                ...prevDiscounts,
                [service.objectId]: isNaN(discountValue) ? 0 : discountValue,
              }));
            }}
            value={discounts[service.objectId] ? discounts[service.objectId].toString() : ''}
          />
          <CheckBox
            value={selectedServices.includes(service.objectId)}
            onValueChange={() => {
              setSelectedServices((prevServices) =>
                prevServices.includes(service.objectId)
                  ? prevServices.filter((id) => id !== service.objectId)
                  : [...prevServices, service.objectId]
              );
            }}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addPromotion}>
        <Text style={styles.addButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
    },
    calendarContainer: {
      marginBottom: 20,
    },
    serviceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    serviceText: {
      fontSize: 18,
      flex: 1,
    },
    addButton: {
      backgroundColor: '#3498db',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default AddPromotion;
