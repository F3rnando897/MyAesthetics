import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, ScrollView, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Parse } from 'parse/react-native.js';

const OpeningHours = ({ route, navigation }) => {
  const { empreendimentoId } = route.params;
  const [openingHours, setOpeningHours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  // Move the loadOpeningHours outside the useEffect
  const loadOpeningHours = async () => {
    try {
      const OpeningHours = Parse.Object.extend('OpeningHours');
      const query = new Parse.Query(OpeningHours);
      query.equalTo('empreendimentoId', {
        __type: 'Pointer',
        className: 'Empreendimentos',
        objectId: empreendimentoId,
      });
      const results = await query.find();
      const openingHoursData = results.map((result) => ({
        objectId: result.id,
        dayOfWeek: result.get('dayOfWeek'),
        startTime: result.get('startTime'),
        endTime: result.get('endTime'),
      }));
      setOpeningHours(openingHoursData);
    } catch (error) {
      console.error('Error loading opening hours:', error);
    }
  };

  useEffect(() => {
    loadOpeningHours();
  }, [empreendimentoId]);

  const addOpeningHours = async () => {
    try {
      const OpeningHours = Parse.Object.extend('OpeningHours');
      const openingHoursObject = new OpeningHours();

      openingHoursObject.set('dayOfWeek', selectedDay);
      openingHoursObject.set('startTime', startTime);
      openingHoursObject.set('endTime', endTime);
      openingHoursObject.set('empreendimentoId', {
        __type: 'Pointer',
        className: 'Empreendimentos',
        objectId: empreendimentoId,
      });

      await openingHoursObject.save();

      // Now you can call the loadOpeningHours directly
      await loadOpeningHours();

      setModalVisible(false);
    } catch (error) {
      console.error('Error adding opening hours:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Horários de Funcionamento</Text>
        </View>

        <FlatList
          data={openingHours}
          keyExtractor={(item) => item.objectId}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.dayText}>{item.dayOfWeek}</Text>
              <Text style={styles.timeText}>{`${item.startTime} - ${item.endTime}`}</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Adicionar Novo Horário</Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <ScrollView>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeader}>Adicionar Novo Horário</Text>

                <View style={styles.dayButtonsContainer}>
                <View style={{flexDirection: 'row', alignSelf: 'center', marginBottom: 10}}>
                  {daysOfWeek.slice(0, 4).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                
                <View style={styles.dayButtonsContainer}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  {daysOfWeek.slice(4).map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
                      onPress={() => setSelectedDay(day)}
                    >
                      <Text style={[styles.dayButtonText, selectedDay === day && styles.selectedDayButtonText]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                </View>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Horário de Início"
                  value={startTime}
                  onChangeText={setStartTime}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Horário de Término"
                  value={endTime}
                  onChangeText={setEndTime}
                />
                
                <View style={{flexDirection: 'row'}}>
                <TouchableOpacity style={[styles.addButton, {marginHorizontal: 5}]} onPress={addOpeningHours}>
                  <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.cancelButton, {marginHorizontal: 5}]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Fechar</Text>
                </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 16,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    width: '100%', // Ajuste a largura desejada para o modal
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', // Centralize verticalmente
    alignSelf: 'center',
    marginTop: '35%',
    // Remova a propriedade marginTop
  },
  modalHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonsContainer: {
    flex:1,
    marginBottom: 16,
  },
  dayButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    marginRight: 8,
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#007bff',
  },
  dayButtonText: {
    color: '#007bff',
  },
  selectedDayButtonText: {
    color: 'white',
  },
});

export default OpeningHours;
