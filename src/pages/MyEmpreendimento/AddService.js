import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { styles } from './styles/Editstyle';
import { Parse } from 'parse/react-native.js';
import { Calendar } from 'react-native-calendars';

export default function AddService({ navigation, route }) {
  const empreendimentoId = route.params?.empreendimentoId || '';
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [selectedHour, setSelectedHour] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});

  const handleDayPress = (date) => {
    const newSelectedDays = { ...selectedDays };
    newSelectedDays[date] = {
      selected: !newSelectedDays[date]?.selected,
      selectedColor: 'blue',
    };
    setSelectedDays(newSelectedDays);
  };

  const handleAddHour = () => {
    if (selectedHour.trim() !== '') {
      setHorarios([...horarios, { hour: selectedHour, days: { ...selectedDays } }]);
      setSelectedHour('');
    }
  };

  const handleRemoveHour = (index) => {
    const newHorarios = [...horarios];
    newHorarios.splice(index, 1);
    setHorarios(newHorarios);
  };

  const renderHorarios = ({ item, index }) => (
    <View style={styles.horarioContainer}>
      <Text>{item.hour}</Text>
      <TouchableOpacity onPress={() => handleRemoveHour(index)}>
        <Text style={styles.removerBtn}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAddService = async () => {
    try {
      const Services = Parse.Object.extend('Services');
      const serviceObject = new Services();

      serviceObject.set('nameService', serviceName);
      serviceObject.set('description', serviceDescription);
      const priceAsNumber = parseFloat(servicePrice);
      serviceObject.set('price', priceAsNumber);


      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentoPointer = Empreendimentos.createWithoutData(empreendimentoId);
      serviceObject.set('serviceEmpreendimento', empreendimentoPointer);

      // Salvar o objeto do serviço no Parse
      await serviceObject.save();

      // Agora, adicione a lógica para salvar os horários associados a este serviço
      const Schedules = Parse.Object.extend('Schedules');
      for (const hourData of horarios) {
        for (const day of Object.keys(hourData.days)) {
          if (hourData.days[day].selected) {
            const scheduleObject = new Schedules();
            scheduleObject.set('empreendimentoId', empreendimentoPointer);
            scheduleObject.set('hour', hourData.hour);
            scheduleObject.set('serviceId', serviceObject);
            scheduleObject.set('day', day);

            // Salvar o objeto do horário no Parse
            await scheduleObject.save();
          }
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar o serviço:', error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={[styles.text, { marginLeft: 10 }]}>Adicionar Novo Serviço</Text>
        <TextInput
          style={[styles.input, { borderBottomWidth: 1, borderColor: 'gray', paddingHorizontal: 10 }]}
          placeholder="Nome do Serviço"
          value={serviceName}
          onChangeText={(text) => setServiceName(text)}
        />
        <TextInput
          style={[styles.input, { borderBottomWidth: 1, borderColor: 'gray', paddingHorizontal: 10 }]}
          placeholder="Descrição do Serviço"
          value={serviceDescription}
          onChangeText={(text) => setServiceDescription(text)}
        />
        <TextInput
          style={[styles.input, { borderBottomWidth: 1, borderColor: 'gray', paddingHorizontal: 10 }]}
          placeholder="Preço do Serviço"
          value={servicePrice}
          onChangeText={(text) => setServicePrice(text)}
        />
        <TextInput
          style={[styles.input, { borderBottomWidth: 1, borderColor: 'gray', paddingHorizontal: 10 }]}
          placeholder="Horário do Serviço"
          value={selectedHour}
          onChangeText={(text) => setSelectedHour(text)}
          />
          <Text style={{fontSize: 14, color: 'black', marginLeft: 10}}>Modelo: (13:00), (14:00)...</Text>
          <Text style={{fontSize: 14, color: 'red', marginLeft: 10}}>Sugestão: Selecione todos os horarios possiveis!</Text>
        <TouchableOpacity
          style={[styles.button, { width: '70%', alignSelf: 'center' }]}
          onPress={handleAddHour}
        >
          <Text style={styles.buttonTxt}>Adicionar Horário</Text>
        </TouchableOpacity>
        <Text style={[styles.text, { marginLeft: 10 }]}>Dias de Funcionamento</Text>
        <Text style={{fontSize: 14, color: 'red', marginLeft: 10}}>Sugestão: Selecione todos os dias até o final do ano!</Text>
        {/* Componente Calendar */}
        <Calendar
          markedDates={selectedDays}
          onDayPress={(day) => handleDayPress(day.dateString)}
        />
        {/* Lista de Horários */}
        <FlatList
          data={horarios}
          renderItem={renderHorarios}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity
          style={[styles.button, { width: '70%', alignSelf: 'center' }]}
          onPress={handleAddService}
        >
          <Text style={styles.buttonTxt}>Adicionar Serviço</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
