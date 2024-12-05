import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentEventCalendar = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigation = useNavigation();

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
            const event = events.find(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === monthIndex);

            daysContainer.push(
                <TouchableOpacity
                    key={day}
                    style={[
                        styles.day,
                        event && styles.eventDay,
                        isToday && styles.today
                    ]}
                    onPress={() => {
                        if (event) {
                            setSelectedEvent(event);
                            setModalVisible(true);
                        }
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

    const fetchEventCalendarData = async (year, monthIndex) => {
        try {
            const response = await fetch(`http://50.6.194.240:5000/api/events?year=${year}&month=${monthIndex + 1}`);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const updateEventCalendar = () => {
        fetchEventCalendarData(currentYear, currentMonthIndex);
    };

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.mainHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Icon name="home" type="material" size={wp('10%')} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

            <Text style={styles.calendarTitle}>School Event Calendar for {currentYear}</Text>

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
                    <Text style={styles.monthTitle}>{new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })}</Text>
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

            {/* Modal to show the event title */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {selectedEvent ? (
                            <>
                                <Text style={styles.modalText}>{selectedEvent.title}</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                    <Text>Close</Text>
                                </TouchableOpacity>
                            </>
                        ) : null}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
       
    },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgb(160, 180, 182)',
        paddingVertical: hp('1.5%'),  // Responsive padding
        paddingHorizontal: wp('4%'),  // Responsive padding
        height: hp('12%'),  // Responsive height
        marginBottom: wp('3%'),  // Responsive margin bottom
      },
      logo: {
        width: wp('15%'),  // Responsive width
        height: wp('15%'),  // Responsive height
      },
      subHeader: {
        backgroundColor: 'rgb(160, 180, 182)',
        paddingVertical: hp('1%'),  // Responsive padding
        alignItems: 'center',
        height: hp('3%'),  // Responsive height
      },
      subHeaderText: {
        fontSize: wp('5%'),  // Responsive font size
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
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
        borderWidth: 1,
    },
    todayText: {
        fontWeight: 'bold',
    },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
    modalText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    button: { backgroundColor: '#003153', padding: 10, alignItems: 'center', borderRadius: 5, marginBottom: 10 },
});

export default ParentEventCalendar;
