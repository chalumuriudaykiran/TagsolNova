import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentAttendence = () => {
    const navigation = useNavigation(); // Make sure navigation is defined

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');

    useEffect(() => {
        updateEventCalendar();
    }, [currentYear, currentMonthIndex]);

    const createCalendarDays = (year, monthIndex, daysInMonth, startDay) => {
        const daysContainer = [];

        // Create empty days
        for (let i = 0; i < startDay; i++) {
            daysContainer.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }

        // Create actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const today = new Date();
            const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;
            const event = events.find(e => new Date(e.date).getDate() === day);

            daysContainer.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.day, 
                        event && styles.eventDay, 
                        isToday && styles.today
                    ]}
                    onPress={() => {
                        setEventDate(`${year}-${monthIndex + 1}-${day}`);
                        setModalVisible(true);
                    }}
                >
                    <Text style={isToday ? styles.todayText : styles.dayText}>{day}</Text>
                </TouchableOpacity>
            );
        }

        return daysContainer;
    };

    const generateEventCalendar = (year, monthIndex) => {
        const firstDayOfMonth = new Date(year, monthIndex, 1);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const startDay = firstDayOfMonth.getDay();

        return (
            <View style={styles.month}>
                <View style={styles.weekdays}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <Text key={index} style={styles.weekday}>{day}</Text>
                    ))}
                </View>
                <View style={styles.days}>
                    {createCalendarDays(year, monthIndex, daysInMonth, startDay)}
                </View>
            </View>
        );
    };

    const fetchEventCalendarData = (year, monthIndex) => {
        const demoEvents = [
            { date: `${year}-${monthIndex + 1}-5`, title: 'Sports Day' },
            { date: `${year}-${monthIndex + 1}-15`, title: 'Annual Day' },
            { date: `${year}-${monthIndex + 1}-20`, title: 'Midterm Exams' },
            { date: `${year}-${monthIndex + 1}-25`, title: 'Holiday' },
        ];

        setEvents(demoEvents);
    };

    const updateEventCalendar = () => {
        fetchEventCalendarData(currentYear, currentMonthIndex);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.mobileFrame}>
                <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                        <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                        <Icon name="home" type="material" size={60} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.subHeader} />

            <Text style={styles.calendarTitle}>Attendance Record for {currentYear}</Text>

            <View style={styles.calendarContainer}>
                <View style={styles.monthNavigation}>
                    <Button title="<" onPress={() => {
                        if (currentMonthIndex === 0) {
                            setCurrentMonthIndex(11);
                            setCurrentYear(currentYear - 1);
                        } else {
                            setCurrentMonthIndex(currentMonthIndex - 1);
                        }
                    }} />
                    <Text style={styles.monthTitle}>{new Date(currentYear, currentMonthIndex).toLocaleString('default',{ month: 'long' })}</Text>
                    <Button title=">" onPress={() => {
                        if (currentMonthIndex === 11) {
                            setCurrentMonthIndex(0);
                            setCurrentYear(currentYear + 1);
                        } else {
                            setCurrentMonthIndex(currentMonthIndex + 1);
                        }
                    }} />
                </View>

                <View id="event-calendar-container">
                    {generateEventCalendar(currentYear, currentMonthIndex)}
                </View>
            </View>

            
                </View>
       
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        paddingTop: 1,
    },
    mainHeader: {
        backgroundColor: 'rgb(160, 180, 182)',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 90,
        flexDirection: 'row',
        paddingHorizontal: 15,
        width: '100%',
    },
    logo: {
        width: 60,
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
        alignItems:'center',
        marginTop:5,
      },    homeIcon: { fontSize: 24 },

    subHeader: {
         
            height: 30,
            backgroundColor: 'rgb(160, 180, 182)',
            marginTop: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
            elevation: 2,
          
    },
    calendarTitle: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    calendarContainer: { marginTop: 20 },
    monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    monthTitle: { fontSize: 18 },

    month: { marginVertical: 10 },
    weekdays: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F0F0F0', padding: 5 },
    weekday: { width: '14%', textAlign: 'center', fontWeight: 'bold', color: '#444' },

    days: { flexDirection: 'row', flexWrap: 'wrap' },
    day: { 
        width: '14%', 
        padding: 10, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderColor: '#DDD', 
        borderWidth: 1,
    },
    emptyDay: { 
        width: '14%', 
        height: 50,
        borderWidth: 1, 
        borderColor: 'transparent',
    },
    dayText: { 
        fontSize: 14,
    },
    eventDay: { 
        backgroundColor: '#d0e7f3', 
    },
    today: { 
        backgroundColor: '#FFF9C4',
        borderColor: '#000',
        borderWidth: 1
    },
    todayText: {
        fontWeight: 'bold'
    },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 },
    input: { marginVertical: 10, borderWidth: 1, borderColor: '#ccc', padding: 5 },
    button: { backgroundColor: '#007bff', padding: 10, alignItems: 'center', borderRadius: 5, marginBottom: 10 },
});

export default ParentAttendence;