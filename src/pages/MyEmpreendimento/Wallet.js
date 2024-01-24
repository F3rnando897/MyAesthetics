import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Parse } from 'parse/react-native.js';
import { Entypo } from '@expo/vector-icons';

export default function Wallet({ route }) {
  const { empreendedorId } = route.params;
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const Transacao = Parse.Object.extend('Transacoes');
      const transacaoQuery = new Parse.Query(Transacao);

      const empreendedorPointer = Parse.Object.extend('Empreendedores').createWithoutData(empreendedorId);
      transacaoQuery.equalTo('empreendedorId', empreendedorPointer);

      const result = await transacaoQuery.find();

      const paymentsData = result.map((payment) => {
        const paymentJSON = payment.toJSON();
        paymentJSON.data = new Date(paymentJSON.data.iso).toLocaleDateString();
        return paymentJSON;
      });

      setPayments(paymentsData);
    } catch (error) {
      console.error('Error fetching payments data:', error);
    }
  }

  const calculateTotal = () => {
    // Use a função reduce para somar os valores de todos os pagamentos
    return payments.reduce((total, payment) => total + payment.valor, 0).toFixed(2);
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.paymentItem}>
      <Text style={styles.paymentText}>{`Valor: ${item.valor}`}</Text>
      <Text style={styles.paymentText}>{`Data: ${item.data}`}</Text>
      {/* Adicione outros detalhes do pagamento conforme necessário */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wallet</Text>
        <Entypo name="wallet" size={24} color="black" style={styles.icon} />
        <Text style={styles.total}>{`Total: ${calculateTotal()}`}</Text>
      </View>

      <Text style={styles.total}>Histórico de vendas</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.objectId}
        renderItem={renderPaymentItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  paymentItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  paymentText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
