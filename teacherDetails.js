import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const teachers = [
    {
        id: '1',
        name: 'Mrs. Johnson',
        subject: 'English',
        email: 'johnson@school.com',
        phone: '123-456-7890',
        image: 'https://example.com/johnson.jpg',
    },
    {
        id: '2',
        name: 'Mr. Smith',
        subject: 'Mathematics',
        email: 'smith@school.com',
        phone: '987-654-3210',
        image: 'https://example.com/smith.jpg',
    },

];

const TeacherCard = ({ teacher }) => (
    <View style={styles.card}>
        <Image source={{ uri: teacher.image }} style={styles.image} />
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{teacher.name}</Text>
            <Text style={styles.subject}>{teacher.subject}</Text>
            <Text style={styles.contact}>Email: {teacher.email}</Text>
            <Text style={styles.contact}>Phone: {teacher.phone}</Text>
        </View>
    </View>
);

const TeacherDetails = () => (
    <View style={styles.container}>
        <FlatList
            data={teachers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TeacherCard teacher={item} />}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 3,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    subject: {
        fontSize: 16,
        color: '#555',
        marginVertical: 4,
    },
    contact: {
        fontSize: 14,
        color: '#777',
    },
});

export default TeacherDetails;
