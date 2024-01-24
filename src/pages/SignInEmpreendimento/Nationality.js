// NationalityScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';

const Nationality = () => {
  const [countries, setCountries] = useState([]);
  const Navigation = useNavigation();
  const Route = useRoute();

  const handleCountrySelection = (selectedCountry) => {
    // Usa navigation.navigate para voltar à tela anterior e passar o valor selecionado como parâmetro
    Navigation.navigate("SignInEmpreendimento", { selectedCountry });
  };

  useEffect(() => {
    // Função para carregar a lista de países e ordená-los em ordem alfabética
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all'); // Endpoint para obter todos os países
        const sortedCountries = response.data.sort((a, b) => {
          const nameA = a.name.common.toLowerCase();
          const nameB = b.name.common.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Erro ao buscar a lista de países:', error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Montserrat_700Bold' }}>
        Lista de Nacionalidades
      </Text>
      <FlatList
        data={countries}
        keyExtractor={(item) => item.cca3}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCountrySelection(item.name.common)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>
                <Text source={{fontFamily: 'Montserrat_700Bold', fontSize: 18, fontWeight: 'bold'}}>{item.name.common}</Text>
                {Route.params && Route.params.selectedCountry === item.name.common && (
                  <Text> ✔️</Text> // Exibe um indicador de seleção ao lado do país selecionado
                )}
              </View>
            </TouchableOpacity>
          )}
      />
    </View>
  );
};

export default Nationality;
