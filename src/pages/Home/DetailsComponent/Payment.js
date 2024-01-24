import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';
import Parse from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = ({ route }) => {
  const {
    amount,
    title,
    empreendimentoId,
    serviceId,
    selectedDate,
    selectedHour,
    serviceDescription,
    serviceName,
  } = route.params;

  const [paymentUrl, setPaymentUrl] = useState(null);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  console.log(paymentProcessed)
  const navigation = useNavigation();
  const user = Parse.User.current();

  useEffect(() => {
    const empreendimentoQuery = new Parse.Query('Empreendimentos');
    empreendimentoQuery
      .get(empreendimentoId)
      .then((empreendimento) => {
        const empreendedorPointer = empreendimento.get('emp_empreendedores');
        const empreendedorId = empreendedorPointer.id;
        // Agora você pode usar empreendedorId como necessário
      })
      .catch((error) => {
        console.error('Erro ao obter informações do empreendimento:', error);
      });

    const initializeWebView = async () => {
      try {
        const clientId =
          '(ClientID)';
        const response = await axios.post(
          'https://api.mercadopago.com/checkout/preferences',
          {
            items: [
              {
                title: title,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: parseFloat(amount),
              },
            ],
            auto_return: 'approved',
            back_urls: {
              failure: 'https://www.myAesthetics.com',
              pending: 'https://www.myAesthetics.com',
              success: 'https://www.myAesthetics.com',
            },
            payment_methods: {
              excluded_payment_types: [{ id: 'ticket' }],
            },
            application_fee: parseFloat(amount) * 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${clientId}`,
            },
          }
        );

        const preferenceId = response.data.id;
        setPaymentUrl(response.data.init_point);
      } catch (error) {
        console.error('Erro no pagamento:', error);
        alert('Erro no pagamento. Tente novamente.');
      }
    };

    initializeWebView();
  }, []);

  const handleWebViewNavigationStateChange = async (newNavState) => {
    const url = newNavState.url;
    console.log(url);

    if (newNavState.canGoBack === true && !url.includes('mercadopago')) {
      if (url.includes('approved') && !paymentProcessed) {
        try {
          const empreendimentoQuery = new Parse.Query('Empreendimentos');
          const empreendimento = await empreendimentoQuery.get(empreendimentoId);
          const empreendedorPointer = empreendimento.get('emp_empreendedores');
          const empreendedorId = empreendedorPointer.id;

          // Adicione uma transação à tabela Transacoes
          const Transacao = Parse.Object.extend('Transacoes');
          const transacao = new Transacao();
          transacao.set('cliente', user);
          transacao.set('empreendedorId', {
            __type: 'Pointer',
            className: 'Empreendedores',
            objectId: empreendedorId,
          });
          transacao.set('valor', parseFloat(amount) * 0.9);
          transacao.set('data', new Date());
          transacao.set('aprovada', true);
          await transacao.save();

          // Altere o estado para indicar que o processamento foi concluído
          setPaymentProcessed(true);

          // Agora você pode navegar para a tela de sucesso
          navigation.navigate('PaymentSuccess', {
            empreendimentoId,
            serviceId,
            selectedDate,
            selectedHour,
            amount,
            serviceDescription,
            serviceName,
          });
        } catch (error) {
          console.error('Erro ao adicionar transação:', error);
        }
      } else {
        navigation.navigate('PaymentFail');
      }
    }
  };

  return (
    <View style={styles.container}>
      {paymentUrl && (
        <WebView
          source={{ uri: paymentUrl }}
          style={{ flex: 1 }}
          originWhitelist={['*']}
          startInLoadingState={true}
          onNavigationStateChange={handleWebViewNavigationStateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default PaymentScreen;
