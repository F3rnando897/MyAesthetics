import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
  
    img: {
      alignSelf: 'center',
      width: '100%',
      height: 200,
    },
  
    top: {
      flex: 1,
      height: '7%',
      marginTop: 5,
      paddingTop: 9,
      paddingHorizontal: 3,
      paddingRight: 5,
      justifyContent: 'space-between',
      alignContent: 'center',
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'center'
    },
    
    mid: {
      flex: -1,
      paddingHorizontal: 3,
  
    },
    mid2: {
      paddingHorizontal: 3,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-between'
    },
  
    bottom: {
  
      flexDirection: 'row',
      alignItems: 'center',
      padding: 9,
      justifyContent: 'space-between',
     },
     
     bottomTxt: {
      fontSize: 20  ,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
     },
  
  
    heart: {
      height: 32,
      width: 32,
      marginRight: 20,
      marginLeft: 50
    },
  
    emptyStar: {
      color: '#d4d4d4',
    },
  
    fullStar: {
      color: '#539afc'
    },
  
    icons: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
    },
    
    button: {
      backgroundColor: '#fff',
      width: 160,
      paddingHorizontal: 80,
      height: 50,
      marginTop: 12,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#0e1014',
      justifyContent: 'center',
      alignItems: 'center'
    },
 
    buttonTxt: {
        color: 'black',
        fontSize: 18
    },  
    title: {
      paddingTop: 3,
      fontSize: 22,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
    },
  
    subTitle: {
      marginTop: 10,
      paddingTop: 3,
      fontSize: 18,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
    },

    btnMid:{
      backgroundColor: '#fff',
        width: 100,
        paddingHorizontal: 80,
        paddingVertical: 20,
        height: 35,
        marginTop: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#0e1014',
        justifyContent: 'center',
        alignItems: 'center',
    },

    socialMediaContainer: {
      flexDirection: 'row',
      marginTop: 10,
      alignSelf: 'center'
    },
    socialMediaIcon: {
      width: 50,
      marginHorizontal: 15
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro e transparente
    },
    headerIcon: {
      color: 'white',
    },

    menuOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '70%',
      height: '100%',
      backgroundColor: 'white',
      paddingTop: 30,  // Ajuste conforme necessário para acomodar o ícone do menu
    },
    backButton: {
      marginLeft: "80%",
      justifyContent: 'space-between',
    },
    drawerItem: {
      // Estilos comuns dos itens do menu
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    drawerItemText: {
      // Estilos do texto do item do menu
      fontSize: 16,
      marginLeft: 10, // Espaçamento entre o ícone e o texto
    },
    serviceItem:{
      flex: 1, 
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: 'gray',
      marginTop: 20,
      paddingHorizontal: 10
    },
  
    description: {
      fontSize: 15,
      marginLeft: 5,
      color: '#000',
      fontFamily: 'Montserrat_600SemiBold',
      marginBottom: 5,
    },
  
    description2: {
      fontSize: 16,
      marginLeft: 5,
      color: '#5b5757',
      fontFamily: 'Montserrat_600SemiBold',
    },
  
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    activeTab: {
      backgroundColor: 'blue', // Cor de fundo da aba ativa
    },
    inactiveTab: {
      backgroundColor: 'gray', // Cor de fundo da aba inativa
    },
    activeTabText: {
      color: 'white', // Cor do texto da aba ativa
      fontWeight: 'bold',
    },
    inactiveTabText: {
      color: 'black', // Cor do texto da aba inativa
    },
  
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    fotoEmpreendimento: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius: 10,
    },
  
    containerFotos: {
      flexDirection: 'row', // Certifique-se de que os itens sejam dispostos na horizontal
    },
  
    itemContainer: {
      width: 200,
      height: 200,
      margin: 10,
    },

    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: '60%'
    },
    modalOverlay: {
      flex: 1,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background with some transparency
    },
    modalContent: {
      width: '80%',
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      justifyContent: "center",
      alignSelf: 'center',
      marginTop: '50%', // ou outra porcentagem ou valor fixo para ajustar a posição vertical
    },  
    comodidadeItem:{
      flexDirection: 'row',
      marginVertical: 5,
      marginLeft: 10
    },
    modalTextInput: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
    },
    modalSaveButton: {
      padding: 10,
      backgroundColor: 'lightblue',
      alignItems: 'center',
    },

    showAllPhotosButton: {
      alignSelf: 'center',
      alignItems: 'center',
      padding: 5
    }
    
  
  })