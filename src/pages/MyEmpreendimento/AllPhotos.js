import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

import Header from '../headerComponent/header';
const AllPhotos = ({ route }) => {
  const { empreendimentoPictures } = route.params;
  console.log(empreendimentoPictures)

  return (
    <View style={styles.container}>
      <Header/>
      <FlatList
        data={empreendimentoPictures}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // Mantém a proporção 1:1 (quadrada)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
},
});

export default AllPhotos;
