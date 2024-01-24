import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
    container: {
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
        borderWidth: 0.5
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

    title: {
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

    heart: {
        height: 25,
        width: 25,
        marginRight: 20,
        marginLeft: 50
      },
    
      emptyStar: {
        color: '#d4d4d4',
      },
    
      fullStar: {
        fontFamily: 'Montserrat_700Bold',
      },
      ratingNumber: {
        fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#4f4a4a'
      }

})