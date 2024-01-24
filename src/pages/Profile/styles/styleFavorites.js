import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 16,
  },
  favoriteItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    bordercolor: 'black',
    borderRadius: 10
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
  },
  favoriteAddress: {
    fontSize: 16,
    color: '#888',
  },
  successMessage: {
    backgroundColor: '#ff0000ad', // Cor de fundo da mensagem
    padding: 10,
    alignItems: 'center',
    borderRadius: 10
  },
  successMessageText: {
    color: 'white', // Cor do texto da mensagem
    fontSize: 16,
    fontWeight: 'bold',
  },
});
