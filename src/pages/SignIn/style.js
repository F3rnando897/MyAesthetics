import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0e1014',
    },
    
    containerHeader: {
        marginTop: '14%',
        marginBottom: '8%',
        paddingStart: '5%'
    },

    text: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff'
    },

    containerForm: {
        flex: 1,
        backgroundColor: '#ffff',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        paddingStart: '5%',
        paddingEnd: '5%'
    },

    title:{
        fontSize: 20,
        marginTop: 28
    },  

    input: {
        height: 40,
        marginBottom: 12,
        paddingLeft: 5,
        fontSize: 16,
        borderRadius: 4,
        borderBottomWidth: 1
    },

    button: {
        backgroundColor: '#0e1014',
        width: '100%',
        height: 40,
        borderRadius: 25,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonTxt: {
        color: '#fff',
        fontSize: 18,
    },  

    buttonCad: {
        marginTop: 14,
        alignSelf: 'center',
    },

    cadTxt: {
        color: '#a1a1a1'
    },

    labelError:{
        alignSelf: 'flex-start',
        color: '#ff375b',
        marginBottom: 8,
    }

});