import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    info: {
      flex: 1,
    },
  
    name: {
      paddingTop: 5,
      fontSize: 18,
      fontFamily: 'Montserrat_600SemiBold'
    },
  
  
    infoCont: {
      padding: 5,
      backgroundColor: 'white',
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
    },
  
    avatar: {
      height: 100,
      width: 100,
      alignSelf: 'flex-start',
      borderRadius: 20,
      margin: 5,
    },
  
    statusCont: {
      flex: 2,
  
    },
  
    btnImgProfile: {
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      position: 'absolute',
      backgroundColor: 'gray',
      borderRadius: '100%',
      width: 45,
      height: 45,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 80,
      marginLeft: 70,
      marginBottom: 20
    },
  
    title: {
      marginTop: 30,
      marginLeft: 10,
      fontSize:18,
      fontFamily: 'Montserrat_700Bold'
    },
  
    options: {
      backgroundColor: 'white',
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
      marginRight: 10,
      borderWidth: 1,
      borderColor: 'gray'
    },
  
    optionsText: {
      fontFamily: 'Montserrat_600SemiBold',
      fontWeight: 'bold',
      fontSize: 14,
      width: "95%",
    }
  
  });
  