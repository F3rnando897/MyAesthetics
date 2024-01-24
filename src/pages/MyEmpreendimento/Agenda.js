import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Agenda as CalendarAgenda, LocaleConfig } from 'react-native-calendars';
import Parse from 'parse/react-native.js';
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
  dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
  dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.'],
};
LocaleConfig.defaultLocale = 'pt-br';

const Agenda = () => {
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAppointments();
    checkAndDeleteExpiredAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const Agenda = Parse.Object.extend('Agenda');
      const query = new Parse.Query(Agenda);
      const results = await query.find();

      const updatedAppointments = results.map(result => ({
        objectId: result.id,
        date: result.get('dateService'),
        details: {
          userId: result.get('userId'),
          empreendimentoId: result.get('empreendimentoId'),
          serviceId: result.get('serviceId'),
          hourService: result.get('hourService'),
        },
      }));

      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const checkAndDeleteExpiredAppointments = async () => {
    try {
      const currentDate = new Date();
      const Agenda = Parse.Object.extend('Agenda');
      const query = new Parse.Query(Agenda);
      query.lessThan('expirationDate', currentDate);

      const expiredAppointments = await query.find();
      if (expiredAppointments.length > 0) {
        // Delete expired appointments
        const deletionPromises = expiredAppointments.map(async (expiredAppointment) => {
          try {
            await expiredAppointment.destroy();
          } catch (error) {
            console.error('Error deleting expired appointment:', error);
          }
        });

        await Promise.all(deletionPromises);
      }
    } catch (error) {
      console.error('Error checking and deleting expired appointments:', error);
    }
  };
  const renderItem = (item) => {
    if (!item || !item.details) {
      return null;
    }
  
    const isPaid = payments[item.details.userId] || false;
    console.log(isPaid)
    return (
      <TouchableOpacity>
        <View style={{marginTop: 20}}>
          <Text>Nome do Usuário: {item.details.userId.get('username')}</Text>
          <Text>Horário: {item.details.hourService}</Text>
          <Text>Serviço: {item.details.serviceId.get('nameService')}</Text>
  
          {/* Adiciona o botão de pagamento ou exibe "Finalizado" */}
          {isPaid ? (
            <TouchableOpacity style={styles.payButton} onPress={() => handlePayment(item)}>
              <Text style={styles.payButtonText}>Finalizado</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ marginRight: 5 }}>Finalizado</Text>
              <AntDesign name="check" size={24} color="black" />
            </View>
          )}
  
          {/* Adicione mais detalhes conforme necessário */}
        </View>
      </TouchableOpacity>
    );
  };
  

  const handlePayment = async (item) => {
    try {
      const Agenda = Parse.Object.extend('Agenda');
      const query = new Parse.Query(Agenda);
      const agendaObject = await query.get(item.objectId);
      agendaObject.set('isPaid', true);

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 15);
      agendaObject.set('expirationDate', expirationDate);

      await agendaObject.save();

      setPayments((prevPayments) => ({
        ...prevPayments,
        [item.details.userId]: true,
      }));

      setModalVisible(true);
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    fetchAppointments();
    checkAndDeleteExpiredAppointments();
  };

  return (
    <View style={{ flex: 1 }}>
      <CalendarAgenda
        items={appointments.reduce((acc, appointment) => {
          const formattedDate = formatDate(appointment.date);
          if (!acc[formattedDate]) {
            acc[formattedDate] = [];
          }
          acc[formattedDate].push(appointment);
          return acc;
        }, {})}
        renderItem={(item) => renderItem(item)}
        renderEmptyDate={() => <View />}
        rowHasChanged={(r1, r2) => r1.details.userId !== r2.details.userId}
        pastScrollRange={1}
        futureScrollRange={1}
      />

      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Serviço pago com sucesso!</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: 'green',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
    width: 100
  },
  payButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Agenda;
