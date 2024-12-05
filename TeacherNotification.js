import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
 
const TeacherNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationCount, setNotificationCount] = useState(0); // State for the notification count
    const navigation = useNavigation();

    useEffect(() => {
        axios
            .get('http://50.6.194.240:5000/get-notifications')
            .then((response) => {
                setNotifications(response.data.notifications);
                setNotificationCount(response.data.notifications.length); // Set the count
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
                setLoading(false);
            });
    }, []);
    const renderNotification = ({ item }) => {
        let priorityColor = '#FF6B6B'; // Default color for 'High'
        let borderColor = '#FF6B6B'; // Default border color for 'High'
        let backgroundColor = '#FFFFFF'; // Default background color
    
        // Set colors based on the priority level
        if (item.priority === 'Medium') {
            priorityColor = '#FFA500'; // Orange for 'Medium'
            borderColor = '#FFA500';   // Border color for 'Medium'
        } else if (item.priority === 'Low') {
            priorityColor = '#32CD32'; // Green for 'Low'
            borderColor = '#32CD32';   // Border color for 'Low'
        }
    
        return (
            <View style={[styles.card, { borderLeftColor: borderColor, backgroundColor }]}>
                <View style={styles.cardHeader}>
                    <Text style={styles.title}>{item.title}</Text>
                    {item.priority && (
                        <Text style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>{item.priority}</Text>
                    )}
                </View>
                <Text style={styles.text}>{item.notificationText}</Text>
                <Text style={styles.date}>
                    {new Date(item.date).toLocaleDateString()} | {new Date(item.date).toLocaleTimeString()}
                </Text>
            </View>
        );
    };
    

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {/* Notification Icon with count */}
                <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')} style={styles.notificationIconContainer}>
                    <FontAwesomeIcon icon={faBell} size={30} color="#333" />
                    {notificationCount > 0 && (
                        <View style={styles.notificationBadge}>
                            <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Loading Spinner */}
            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Notifications List */}
                    {notifications.length > 0 ? (
                        <FlatList
                            data={notifications}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderNotification}
                            contentContainerStyle={styles.list}
                            scrollEnabled={true}
                        />
                    ) : (
                        <Text style={styles.emptyMessage}>No notifications to display.</Text>
                    )}

                    {/* Close Button */}
                    <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')} style={styles.closeButton}>
                        <FontAwesomeIcon icon={faTimes} size={20} color="#fff" />
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6FA',
    },
    backButton: {
        marginTop: 30,
        marginBottom: 5,
        position: 'absolute',
        top: 20,
        left: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40, // Adjusted to make room for the header
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    notificationIconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF6B6B', // Red color for the badge
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 20,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    list: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 5, // Side width for priority color
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    priorityBadge: {
        color: '#fff', // Text color for the badge
        paddingVertical: 2,
        paddingHorizontal: 8, // Adjusted padding to make it smaller
        borderRadius: 15,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    text: {
        fontSize: 14,
        color: '#000',
        marginBottom: 10,
    },
    date: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
    },
    emptyMessage: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#888',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#28a745', // Green color for the button
        borderRadius: 10, // Reduced border radius
        paddingVertical: 8, // Reduced vertical padding
        paddingHorizontal: 12, // Reduced horizontal padding
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Optional: adds shadow for better visibility
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14, // Smaller font size for text
        marginTop: 5, // Space between icon and text
    },
});

export default TeacherNotification;