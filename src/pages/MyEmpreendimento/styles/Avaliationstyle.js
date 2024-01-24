import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
  
    img: {
      borderRadius: 10,
      alignSelf: 'center',
      width: '98%',
      height: 200,
    },
  
    top: {
      flex: -1,
      height: '7%',
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
      justifyContent: 'space-between',
      marginVertical: 5
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
      marginLeft: 'auto', // This will move the heart icon to the right
      marginRight: 20,
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
    
  
    title: {
      paddingTop: 3,
      fontSize: 24,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
    },
  
    subTitle: {
      marginTop: 10,
      marginLeft: 10,
      paddingTop: 3,
      fontSize: 18,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
    },

    productContainer: {
      flex: 1,
      width: 150,
      height: 190,
      borderWidth: 0.5,
      borderColor: 'gray',
      marginHorizontal: 10,
      marginVertical: 15
    },

    productImg:{
      width: 120,
      height: 140,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignSelf: 'center'
    },
    productText: {
      fontSize: 14,
      fontFamily: 'Montserrat_700Bold',
      marginVertical: 6,
      marginHorizontal: 5,
    },

  
    description: {
      fontSize: 18,
      marginLeft: 5,
      color: '#000',
      fontFamily: 'Montserrat_600SemiBold',
      marginBottom: 5,
    },
  
    description2: {
      fontSize: 16,
      marginLeft: 5,
      color: '#a1a1a1',
      fontFamily: 'Montserrat_600SemiBold',
    },
  
    button: {
      backgroundColor: '#0e1014',
      width: 100,
      paddingHorizontal: 80,
      paddingVertical: 20,
      height: 35,
      marginTop: 12,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
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

  buttonTxt: {
      color: '#fff',
      fontSize: 18
  }, 

  serviceItem:{
    flex: 1, 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'gray',
    marginTop: 20,
    paddingHorizontal: 10
  },

  avaliationsItem:{
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 10,
    borderTopWidth: 1,
    borderColor: 'gray'

  },

  userImg: {
    width: 60,
    height: 60,
  },
  
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 5,
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
    
  
  })