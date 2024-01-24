import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
      },
      containerForm: {
        backgroundColor: '#ffff',
        paddingStart: '5%',
        paddingEnd: '5%',
        marginTop: 10 
      },
      imgEmpreendimento: {
        width: "100%", 
        height: 200,
      },

      text: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
        marginTop: '10%',
        marginBottom: '5%',
      },
      title: {
        flex: 1,
        fontSize: 16,
        marginTop: 20
      },
      inputContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: 'gray',
      },
      input: {
        height: 40,
        width: "100%",
        fontSize: 16,
        marginVertical: 10
      },

      inputAddress:{
        height: 40,
        width: "100%",
        fontSize: 16,
        marginVertical: 10
      },
     
      inputError: {
        borderWidth: 2,
        borderColor: "#ff375b",
      },
      button: {
        backgroundColor: '#0e1014',
        width: '100%',
        height: 40,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    buttonTxt: {
        color: '#fff',
        fontSize: 18,
    },  

      labelError: {
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8,
      },
      checkboxLabel:{
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
      },

      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
      },

      addressButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 2,
        borderColor: "gray",
        backgroundColor: "#fff",
        marginTop: 15,
        marginBottom: 15,
      },
      selectedButton: {
        backgroundColor: "#0e1014",
        borderColor: "#0e1014",

      },

      buttonTextSelected: {
        color: "#fff"
      },
      buttonText: {
        fontSize: 16,
        color: "Montserrat_700Bold",
        fontWeight: "bold",
      },

      successMessage: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
      },
      

});