import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Logo from "../../../assets/Logo.png";
import {styles} from './style';
import * as Animatable from 'react-native-animatable';

import { useNavigation } from "@react-navigation/native";


export default function Welcome() {
    
    const Navigation = useNavigation();
    return(
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image animation="fadeInUp" duration={1700} style={styles.Image} source={Logo}/>
                <Animatable.Text animation="fadeInUp" duration={1700} style={styles.nomeLogo}>My Aesthetics</Animatable.Text>
            </View>

            <Animatable.View animation="fadeInUp" duration={1400} style={styles.containerForm}>
                <View style={styles.titleForm}>
                <Text style={styles.title}>Para  {'\n'}Especialistas! </Text>
                </View>

                <TouchableOpacity
                style={styles.button}
                onPress={ () => Navigation.navigate('Login')}>
                
                    <Text style={styles.buttonTxt}>Começar</Text>
                </TouchableOpacity>
                </Animatable.View>
            
        </View>
    );
}
