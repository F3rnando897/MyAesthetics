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
        
        backgroundColor: '#0e1014',
        height: 100,
        width:  100,
        borderRadius: 500,
        padding: 10,
        marginRight: 20,
        marginLeft: 2,
        MarginBottom: 5
    },

    cover: {
        marginTop: 8,
        width: 60,
        height: 60,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
     
    },

    title: {
        fontFamily: 'Montserrat_700Bold',
        fontSize: 14,
        color: 'black',
        marginTop: 15,
        alignSelf: 'center',
        width: 109.6,
        
    },
    
})