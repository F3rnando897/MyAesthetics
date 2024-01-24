import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import Parse from 'parse/react-native.js';
import CheckIcon from '../../../../assets/Icons/check.gif';

const PaymentSuccess = ({ navigation, route }) => {
  const { empreendimentoId, serviceId, selectedDate, selectedHour, amount, serviceDescription, serviceName } = route.params;

  const [empreendimentoDetails, setEmpreendimentoDetails] = useState({
    name: '',
    address: {
      street: '',
      number: '',
      city: '',
      local: '',
      cep: '',
      neighborhood: '',
      state: '',
    },
  });

  useEffect(() => {
    Agendar();
    loadAgendamentoDetails(); // Carregar detalhes do agendamento
  }, []);

  const Agendar = async () => {
    try {
      const currentUser = await Parse.User.currentAsync();
      if (currentUser && selectedHour) {
        const Agenda = Parse.Object.extend('Agenda');
        const novoAgendamento = new Agenda();

        const Empreendimentos = Parse.Object.extend('Empreendimentos');
        const empreendimento = new Empreendimentos();
        empreendimento.id = empreendimentoId;
        novoAgendamento.set('empreendimentoId', empreendimento);

        novoAgendamento.set('userId', currentUser);

        const Services = Parse.Object.extend('Services');
        const service = new Services();
        service.id = serviceId;
        novoAgendamento.set('serviceId', service);

        const Schedules = Parse.Object.extend('Schedules');
        const scheduleQuery = new Parse.Query(Schedules);
        scheduleQuery.equalTo('empreendimentoId', empreendimentoId);
        scheduleQuery.equalTo('serviceId', serviceId);
        scheduleQuery.equalTo('date', selectedDate);
        scheduleQuery.equalTo('hour', selectedHour);
        const schedule = await scheduleQuery.first();
        console.log('Schedule for Agendamento:', schedule);
        novoAgendamento.set('ScheduleId', schedule);

        novoAgendamento.set('dateService', selectedDate);
        novoAgendamento.set('hourService', selectedHour);

        await novoAgendamento.save();
      }
    } catch (error) {
      console.error('Erro ao agendar:', error);
    }
  };

  const loadAgendamentoDetails = async () => {
    try {
      const Empreendimentos = Parse.Object.extend('Empreendimentos');
      const empreendimentoQuery = new Parse.Query(Empreendimentos);
      empreendimentoQuery.equalTo('objectId', empreendimentoId);
      const empreendimentoObject = await empreendimentoQuery.first();

      const addressEmpreendimento = empreendimentoObject.get('addressEmpreendimentoId');
      const AddressesEmpreendimento = Parse.Object.extend('AddressesEmpreendimento');
      const addressQuery = new Parse.Query(AddressesEmpreendimento);
      addressQuery.equalTo('objectId', addressEmpreendimento.id);
      const addressObject = await addressQuery.first();

      setEmpreendimentoDetails({
        name: empreendimentoObject.get('name'),
        address: {
          street: addressObject.get('street'),
          number: addressObject.get('number'),
          city: addressObject.get('city'),
          local: addressObject.get('local'),
          cep: addressObject.get('cep'),
          neighborhood: addressObject.get('neighborhood'),
          state: addressObject.get('state'),
        },
      });
    } catch (error) {
      console.error('Erro ao carregar detalhes do agendamento:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.centeredContainer}>
        <Image source={CheckIcon} style={styles.checkIcon} />
        <Text style={styles.successText}>Agendamento realizado com sucesso!</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailLabel}>Empreendimento:</Text>
        <Text style={styles.detailValue}>{empreendimentoDetails.name}</Text>
        <Text style={styles.detailLabel}>Serviço agendado:</Text>
        <Text style={styles.detailValue}>{serviceName}</Text>
        <Text style={styles.detailLabel}>Detalhes do serviço:</Text>
        <Text style={styles.detailValue}>{serviceDescription}</Text>
        <Text style={styles.detailLabel}>Preço:</Text>
        <Text style={styles.detailValue}>${amount}</Text>
        <Text style={styles.detailLabel}>Endereço:</Text>
        <Text style={styles.detailValue}>
          {`${empreendimentoDetails.address.street}, ${empreendimentoDetails.address.number}, ${empreendimentoDetails.address.city}`}
        </Text>
        <Text style={styles.detailLabel}>Data:</Text>
        <Text style={styles.detailValue}>{selectedDate.toLocaleDateString()}</Text>
        <Text style={styles.detailLabel}>Horário:</Text>
        <Text style={styles.detailValue}>{selectedHour}</Text>
      </View>
      <Button title="Voltar à Página Principal" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centeredContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkIcon: {
    width: 150,
    height: 150,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  detailsContainer: {
    width: '80%',
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default PaymentSuccess;
