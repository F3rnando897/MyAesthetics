import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PaymentFail = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Falha no Pagamento!</Text>
      <Text style={styles.subtext}>Algo deu errado durante o processamento do pagamento. Por favor, tente novamente.</Text>
      <Button
        title="Tente novamente"
        onPress={() => navigation.navigate('Home')}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Cor de fundo
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF0000', // Cor do texto
  },
  subtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555', // Cor do texto
  },
  button: {
    backgroundColor: '#2196F3', // Cor de fundo do botão
    padding: 10,
    borderRadius: 5,
  },
});

export default PaymentFail;
