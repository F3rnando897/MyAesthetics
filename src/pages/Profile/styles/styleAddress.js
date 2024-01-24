import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      containerForm: {
        backgroundColor: '#ffff',
        borderColor: 'gray',
        borderBottomWidth: 1,
        padding: 5,
        marginBottom: 10
      },
      text: {
        fontSize: 15,
      marginLeft: 5,
      color: '#000',
      fontFamily: 'Montserrat_600SemiBold',
      marginBottom: 5,
      },
      title: {
        fontSize: 16,
        marginTop: '5%',
        marginBottom: '5%',
        fontFamily: 'Montserrat_700Bold',
      },  
      button: {
        shadowColor: "#000",
        shadowOffset: {
	    width: 5,
	    height: 5,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        position: 'absolute',
        backgroundColor: '#0e1014',
        width: '60%',
        paddingVertical: 15,
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonTxt: {
        color: '#fff',
        fontSize: 18,
    },  

      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },  

      successMessage: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
      },
      

});