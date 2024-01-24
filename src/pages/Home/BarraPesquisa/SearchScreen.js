import React from 'react';
import { StyleSheet } from 'react-native';

import * as Animatable from 'react-native-animatable';

export default function SearchScreen() {
  return (
    <Animatable.View animation="fadeInDown" duration={900} delay={100}>
    </Animatable.View>
  );
} 

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  
})