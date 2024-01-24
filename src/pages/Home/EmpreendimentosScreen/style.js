import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
  
    img: {
      marginTop: 10,
      borderRadius: 10,
      alignSelf: 'center',
      width: '98%',
      height: 200,
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
    
  
    title: {
      paddingTop: 3,
      fontSize: 24,
      paddingLeft: 5,
      fontFamily: 'Montserrat_700Bold',
    },
  
    description: {
      fontSize: 18,
      marginLeft: 5,
      color: '#000',
      fontFamily: 'Montserrat_600SemiBold',
      marginBottom: 5,
    },
  
    box: {
      shadowColor: "#000",
          shadowOffset: {
          width: 5,
          height: 5,
          },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      flex: 1,
      width: 350,
      height: 350,
      backgroundColor: 'red',
      borderWidth: 2,
      borderColor: 'black',
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: 20,
      borderRadius: 10,
      padding: 10
      
    },
  })