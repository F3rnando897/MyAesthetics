import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#0e1014',
    },

    containerLogo:{
        flex: 2,
        backgroundColor: '#0e1014',
        justifyContent: 'center',
        alignItems: 'center',
    },

    nomeLogo: {
        color: 'white',
        fontSize: 50,
        fontWeight: 'bold',
        marginTop: 6,
        marginBottom: 100,
    },

    titleForm:{
        left: 5,
    },

    Image: {
        shadowColor: "#000",
        shadowOffset: {
	    width: 5,
	    height: 5,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        flex: 1,
        width: 270,
        height: 270,
        resizeMode: 'contain',
        alignItems: 'center',
    },

    containerForm:{
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius:25,
        paddingVertical: '1%',
        paddingTop: 5,
        paddingStart: '20%',
        paddingEnd: '20%',
        
    },

    title:{
        position: 'relative',
        fontSize: 33,
        color: '#0e1014',
        fontWeight: 'bold',
        marginTop: 35,
        marginBottom: 0,
        lineHeight: 33,
        
    },
    
    animation:{
        position: 'relative',
        width: 250,
        fontSize: 33,
        marginTop: 2,
    },

    texto:{
        position: 'absolute',
        top: 100,
        color: '#a1a1a1',
        paddingVertical: '5%',
    },

    buttonTxt:{
        color: '#ffff',
        fontSize: 23,
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
        borderRadius: 50,
        width: '60%',
        paddingVertical: 15,
        alignSelf: 'center',
        bottom: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },

});