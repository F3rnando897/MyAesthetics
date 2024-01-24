import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {styles} from './style';


export default function Empreendimentos(props){
    return(  
        <TouchableOpacity onPress={props.onPress}> 
            <View style={styles.container}>
                <Image source={props.cover}
                style={styles.cover}
                />
                
            </View>
        <View><Text style={styles.title}>{props.title}</Text></View>
    </TouchableOpacity>
    );
}