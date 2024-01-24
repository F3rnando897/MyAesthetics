import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import Parse from 'parse/react-native.js';
import { Calendar } from 'react-native-calendars';

const Agendar = ({ route, navigation }) => {
  const { empreendimentoId, serviceId } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [serviceDetails, setServiceDetails] = useState(null);
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const Services = Parse.Object.extend('Services');
        const serviceQuery = new Parse.Query(Services);
        const service = await serviceQuery.get(serviceId);

        setServiceDetails(service.toJSON());

        const availableHoursForDate = await fetchAvailableHours(selectedDate);
        console.log('Available Hours for Date:', availableHoursForDate);
        setAvailableHours(availableHoursForDate);
      } catch (error) {
        console.error('Erro ao buscar detalhes do serviço:', error);
      }
    };

    fetchServiceDetails();
  }, [serviceId, selectedDate]);

  const fetchAvailableHours = async (date) => {
    try {
      const Schedules = Parse.Object.extend('Schedules');
      const schedulesQuery = new Parse.Query(Schedules);
      schedulesQuery.equalTo('empreendimentoId', {
        __type: 'Pointer',
        className: 'Empreendimentos',
        objectId: empreendimentoId,
      });
      schedulesQuery.equalTo('serviceId', {
        __type: 'Pointer',
        className: 'Services',
        objectId: serviceId,
      });
      schedulesQuery.equalTo('day', date.toISOString().split('T')[0]);
      const schedules = await schedulesQuery.find();

      const availableHoursForDate = schedules.map((schedule) => schedule.get('hour'));
      console.log('Schedules:', schedules);
      console.log('Available Hours:', availableHoursForDate);
      return availableHoursForDate;
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      return [];
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(new Date(day.timestamp));
    const fetchAndSetAvailableHours = async () => {
      const availableHoursForDate = await fetchAvailableHours(new Date(day.timestamp));
      console.log('Available Hours for New Date:', availableHoursForDate);
      setAvailableHours(availableHoursForDate);
    };
    fetchAndSetAvailableHours();
  };

  const handleAgendar = async () => {
    navigation.navigate('Payment', {
      amount: serviceDetails.price,
      title: serviceDetails.nameService,
      empreendimentoId: empreendimentoId,
      serviceId: serviceId,
      selectedDate: selectedDate,
      selectedHour: selectedHour,
      serviceDescription: serviceDetails.description,
      serviceName: serviceDetails.nameService
    });
  };

  const renderAvailableHours = ({ item }) => (
    <TouchableOpacity
      style={selectedHour === item ? styles.selectedHourButton : styles.hourButton}
      onPress={() => setSelectedHour(item)}
    >
      <Text>{item}</Text>
    </TouchableOpacity>
  );

  return (

    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Serviço:</Text>

      {serviceDetails && (
        <View style={styles.serviceDetailsContainer}>
          <Text style={styles.serviceDetailLabel}>Nome do Serviço:</Text>
          <Text style={styles.serviceDetailText}>{serviceDetails.nameService}</Text>

          <Text style={styles.serviceDetailLabel}>Descrição:</Text>
          <Text style={styles.serviceDetailText}>{serviceDetails.description}</Text>

          <Text style={styles.serviceDetailLabel}>Preço: R${serviceDetails.price}</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Selecione a data para agendar:</Text>
      <Calendar onDayPress={handleDayPress} markedDates={{ [selectedDate.toISOString().split('T')[0]]: { selected: true } }} />

      <Text style={styles.sectionTitle}>Selecione o horário:</Text>
      <FlatList
        data={availableHours}
        renderItem={renderAvailableHours}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <View style={styles.buttonContainer}>
        <Button title="Agendar" onPress={handleAgendar} />
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  serviceDetailsContainer: {
    marginTop: 20,
  },
  serviceDetailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceDetailText: {
    fontSize: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
  },
  hourButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  selectedHourButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default Agendar;
