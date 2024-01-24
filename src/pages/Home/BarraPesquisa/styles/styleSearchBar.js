import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
    },
    inputContainer: {
      flexDirection: "row",
      marginBottom: 10,
    },
    input: {
      flex: 1,
      height: 40,
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginRight: 10,
      fontFamily: 'Montserrat_700Bold', 
    },
    button: {
      backgroundColor: "#ffff",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 15,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
    },
    empreendimentoContainer: {
      flexDirection: "row",
      backgroundColor: "#fff",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    empreendimentoImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    empreendimentoInfo: {
      flex: 1,
      justifyContent: "center",
    },
    empreendimentoName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    empreendimentoDescription: {
      fontSize: 14,
      color: "#666",
    },
    filterMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 300, // Adjust width as needed
      height: 1000,
      backgroundColor: "#666",
      zIndex: 2,
      // Other styles...
  },
  closeButton: {
    justifyContent: 'flex-end',
    marginRight: 20,
    alignItems: "center",
    fontFamily: 'Montserrat_700Bold'
},
filterButton:{
  backgroundColor: "#ffff",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
},
filterTitle:{
  flex: 1,
  fontSize: 20,
  marginLeft: 20,
  marginTop: 20,
  marginBottom: 20,
  fontFamily: 'Montserrat_700Bold',
},
checkboxLabel:{
  fontSize: 15,
  fontFamily: 'Montserrat_700Bold',
},
checkboxContainer:{
  flex: 1,
  flexDirection: 'row',
  marginLeft: 20,
  marginTop: 5,
},

backButton: {
  position: "relative",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 2,
  backgroundColor: "transparent",
},

userProfileImage: {
  width: 50, // Defina o tamanho apropriado para a imagem de perfil
  height: 50, // Defina o tamanho apropriado para a imagem de perfil
  borderRadius: 25, // Isso arredondará a imagem em um círculo se o tamanho for igual
},
  });