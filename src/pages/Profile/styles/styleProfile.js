import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
  },

  customDenounceReasonInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 15,
      paddingLeft: 10,
  },

  gradientContainer: {
      flex: 1,
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
      color: 'white',
  },

  userImage: {
      width: 120,
      height: 120,
      borderRadius: 75,
      marginBottom: 20,
  },
  username: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  title: {
      fontSize: 18,
      paddingHorizontal: 15,
      marginBottom: 10,
      paddingTop: 10,
      fontFamily: 'Montserrat_700Bold',
      color: '#4f4a4a',
  },
  text: {
      fontSize: 18,
      marginBottom: 10,
  },
  description: {
      fontSize: 16,
      marginBottom: 20,
  },
  followButton: {
      backgroundColor: '#fff',
      width: 160,
      paddingHorizontal: 80,
      height: 50,
      marginTop: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#0e1014',
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center'
      
  },
  followButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  activityContainer: {
      paddingHorizontal: 15,
      marginBottom: 20,
  },
  imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  activityType: {
      width: '100%', // Dois itens por linha com algum espaço entre eles
      height: 160,
      resizeMode: 'cover',
      marginBottom: 5,
  },
  seeMoreButton: {
      backgroundColor: '#3498db',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginHorizontal: 5,
      marginVertical: 5,
  },
  seeMoreButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },

  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
  },
  modalText: {
      fontSize: 18,
      marginBottom: 20,
  },
  modalButton: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: 'gray',
  },
  modalButtonText: {
      color: 'black',
      fontSize: 15,
  },

  containerEmpreendimento: {
      shadowColor: "#000",
      shadowOffset: {
  width: 5,
  height: 5,
      },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      marginTop: 20,
      backgroundColor: 'white',
      height: 250,
      width:  "95%",
      borderRadius: 10,
      padding: 10,
      marginRight: 20,
      marginLeft: 10,
      marginBottom: 15,
      borderWidth: 0.5,
      borderColor: 'gray'
  },

  cover: {
      width: "100%",
      height: "60%",
      borderRadius: 10,
  },

  content: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 10,
  
  },

  titleEmpreendimento: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 13,
      color: '#4f4a4a'
  },

  badge: {
      fontFamily: 'Montserrat_700Bold',
      fontSize: 12,

  },

  description: {
      fontFamily: 'Montserrat_600SemiBold',
      fontSize: 12,
      color: '#4f4a4a'
  },

  menuContainer: {
  flex: 1,
  backgroundColor: 'transparent',
  },
  menuContent: {
  position: 'absolute',
  backgroundColor: 'white',
  padding: 5,
  borderRadius: 5,
  alignItems: 'center',
  },

  modalBackground: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark background
  justifyContent: 'center',
  alignItems: 'center',
  },

  denounceOption: {
  paddingHorizontal: 10,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderColor: 'gray',
      width: "100%"
  },

  selectedDenounceOption: {
  backgroundColor: '#3498db42', // Adapte a cor de fundo conforme necessário
  borderColor: '#3498db42', // Adapte a cor da borda conforme necessário
  borderWidth: 1,
  },

  modalDescription: {
  fontSize: 16,
  textAlign: 'left',
  marginBottom: 15,
  borderBottomWidth: 1,
  borderColor: 'gray',
  width: '100%'
  },

  drawerItem: {
      // Estilos comuns dos itens do menu
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 15,


  },
  drawerItemText: {
      // Estilos do texto do item do menu
      fontSize: 16,
      marginLeft: 10, // Espaçamento entre o ícone e o texto
  },

  backButton: {
      marginLeft: "80%",
      justifyContent: 'space-between',
  },

  menuContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '70%',
      height: 1000,
      backgroundColor: 'white',
      paddingTop: 30,  // Ajuste conforme necessário para acomodar o ícone do menu
  },

  modalContainerFullScreen: {
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

    activityImageWrapper: {
      width: 186,
      marginBottom: 10,
    },

  });
  