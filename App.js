import React from 'react';
import { StatusBar, AppRegistry } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/Stack';
import {
  useFonts,
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light_Italic,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';

// Importação do parse do Back4App
import Parse from "parse/react-native.js";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Sincronização com o banco de dados do Back4App
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize("J2PloKE4YlWOjekgv4i6xlOMvUFgBCHzZ6vuu0IM", "9aH21o4AYuXfdzDEqTgMAzfrPF8amXgGy8g89uSo");
Parse.serverURL = 'https://parseapi.back4app.com';


export default function App() {

  let [fontsLoaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });
  return (
    
      <NavigationContainer>
        <StatusBar backgroundColor="black" barStyle={"light-content"}/>
        
        <Routes/>
      </NavigationContainer>  
  );
}