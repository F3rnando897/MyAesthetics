import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Parse } from 'parse/react-native.js';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

const PromotionsManagement = ({ route }) => {
  const { empreendimentoId } = route.params;
  const [promotions, setPromotions] = useState([]);
  const navigation = useNavigation();
console.log(promotions)
  const fetchPromotions = async () => {
    try {
      const Promotions = Parse.Object.extend('Promotions');
      const promotionsQuery = new Parse.Query(Promotions);
      promotionsQuery.equalTo('empreendimentoId', {
        __type: 'Pointer',
        className: 'Empreendimentos',
        objectId: empreendimentoId,
      });
      const results = await promotionsQuery.find();
      setPromotions(results.map((promotion) => promotion.toJSON()));
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const deletePromotion = async (promotionId) => {
    try {
      const Promotions = Parse.Object.extend('Promotions');
      const promotionObject = new Promotions({ objectId: promotionId });
      await promotionObject.destroy();
      fetchPromotions();
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const togglePromotionStatus = async (promotionId, currentStatus) => {
    try {
      const Promotions = Parse.Object.extend('Promotions');
      const promotionObject = new Promotions({ objectId: promotionId });
      promotionObject.set('active', !currentStatus);
      await promotionObject.save();
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  const fetchServiceName = async (serviceId) => {
    try {
      const Services = Parse.Object.extend('Services');
      const servicesQuery = new Parse.Query(Services);
      const service = await servicesQuery.get(serviceId);
      return service.get('name');
    } catch (error) {
      console.error('Error fetching service name:', error);
      return 'Serviço não encontrado';
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
  };

  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPromotion', { empreendimentoId: empreendimentoId })}
      >
        <Text style={styles.addButtonText}>Adicionar Promoção</Text>
      </TouchableOpacity>

      <FlatList
        data={promotions}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
            
          <View style={styles.promotionCard}>
            {console.log(item.services)}
            <Text style={styles.promotionTitle}>{item.title}</Text>
            <Text style={styles.promotionDescription}>{item.description}</Text>
            <Text style={styles.promotionDates}>
              {item.startDate.iso && `Data de Início: ${formatDate(item.startDate.iso)}`}
            </Text>
            <Text style={styles.promotionDates}>
              {item.finishDate.iso && `Data Final: ${formatDate(item.finishDate.iso)}`}
            </Text>


            {item.services && (
              <View>
                <Text style={styles.promotionDates}>Serviços:</Text>
                {item.services.map((service) => (
              
                  <Text key={service.serviceId} style={styles.promotionDates}>
                    - ID do Serviço: {service.serviceId}, Desconto: {service.discount}%
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => togglePromotionStatus(item.objectId, item.active)}
            >
              <Text style={styles.toggleButtonText}>{item.active ? 'Desativar' : 'Ativar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deletePromotion(item.objectId)}
            >
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
        container: {
          flex: 1,
          paddingHorizontal: 20,
          paddingTop: 20,
          backgroundColor: '#f0f0f0',
        },
        addButton: {
          backgroundColor: '#3498db',
          padding: 15,
          borderRadius: 5,
          marginBottom: 20,
          alignItems: 'center',
        },
        addButtonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        },
        promotionCard: {
          backgroundColor: 'white',
          padding: 20,
          marginBottom: 15,
          borderRadius: 10,
        },
        promotionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        promotionDescription: {
          fontSize: 16,
          marginBottom: 10,
        },
        promotionDates: {
          fontSize: 14,
          color: '#555',
        },
        deleteButton: {
          marginTop: 10,
        },
        toggleButton: {
          marginTop: 10,
          padding: 10,
          backgroundColor: '#27ae60',
          borderRadius: 5,
          alignItems: 'center',
        },
        toggleButtonText: {
          color: 'white',
          fontSize: 16,
          fontWeight: 'bold',
        },
      });

export default PromotionsManagement;