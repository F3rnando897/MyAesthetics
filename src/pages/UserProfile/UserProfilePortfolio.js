import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import Parse from 'parse/react-native.js';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Header from '../headerComponent/header';

export default function UserProfilePortfolio({ route }) {
  const { userId } = route.params;
  const [userActivities, setUserActivities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

  useEffect(() => {
    async function fetchUserActivities() {
      try {
        const Activity = Parse.Object.extend('UserActivity');
        const activityQuery = new Parse.Query(Activity);
        const user = new Parse.User();
        user.id = userId;
        activityQuery.equalTo('userId', user);
        activityQuery.descending('date'); // Assuming you want to display the latest activities first
        const activities = await activityQuery.find();
        setUserActivities(activities);
      } catch (error) {
        console.error('Error fetching user activities:', error);
      }
    }
 
    fetchUserActivities();
  }, [userId]);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  return (
    <ScrollView>
      {/* Header */}
      <Header/>
      <View style={styles.container}>
        <Text style={styles.title}>Portfolio</Text>
        <View style={styles.imageContainer}>
          {userActivities.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.activityImageWrapper}
              onPress={() => handleImagePress(activity.get('type').url())}>
              <Image style={styles.activityImage} source={{ uri: activity.get('type').url() }} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
  
      {/* Modal para exibir a imagem em tela cheia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}>
        <View style={styles.modalContainer}>
          <Image style={styles.fullScreenImage} source={{ uri: selectedImage }} />
          <View style={styles.imageInfoContainer}>
            <Text style={styles.imageInfoText}>{selectedImage && userActivities.find(activity => activity.get('type').url() === selectedImage)?.get('content')}</Text>
            <Text style={styles.imageInfoDate}>{selectedImage && userActivities.find(activity => activity.get('type').url() === selectedImage)?.get('date').toString()}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingTop: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#4f4a4a',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activityImageWrapper: {
    width: 180,
    marginBottom: 10,
  },
  activityImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  fullScreenImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  imageInfoContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // fundo semi-transparente
    padding: 10, // espaço interno
    borderRadius: 5, // bordas arredondadas
  },
  imageInfoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5, // espaço abaixo do texto
  },
  imageInfoDate: {
    color: 'white',
    fontSize: 14,
  },
  
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerIcon: {
    color: 'black',
  },
});
