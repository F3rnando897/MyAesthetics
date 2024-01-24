import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Parse from 'parse/react-native.js';

function Schedules() {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const currentUser = Parse.User.current();
            const Agenda = Parse.Object.extend('Agenda');
            const query = new Parse.Query(Agenda);
            query.equalTo('userId', currentUser);
            query.include('serviceId'); // Include the 'serviceId' pointer field

            const result = await query.find();
            setSchedules(result);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    return (
        <ScrollView style={{backgroundColor: '#fff'}}>
        <View style={styles.container}>
            <Text style={styles.title}>Meus Agendamentos</Text>
            <FlatList
                data={schedules}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.scheduleItem}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 2}}>Agendamento</Text>
                        <Text style={styles.scheduleItemText}>Data: {item.get('dateService').toLocaleDateString()}</Text>
                        <Text style={styles.scheduleItemText}>Horario: {item.get('hourService')}</Text>
                        <Text style={styles.scheduleItemText}>Empreendimento: {item.get('empreendimentoId').get('name')}</Text>
                        
                        {/* Exibir informações do serviço */}
                        <Text style={styles.serviceTitle}>Serviço:</Text>
                        <Text style={styles.serviceInfo}>{item.get('serviceId').get('nameService')}</Text>
                        <Text style={styles.serviceInfo}>{item.get('serviceId').get('description')}</Text>
                        <Text style={styles.serviceInfo}>Preço: ${item.get('serviceId').get('price')}</Text>
                        
                        {/* Adicione mais informações conforme necessário */}
                    </TouchableOpacity>
                )}
            />
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    scheduleItem: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        borderColor: 'gray',
        borderWidth: 1
    },
    scheduleItemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    serviceInfo: {
        fontSize: 16,
        marginBottom: 5,
    },
});

export default Schedules;
