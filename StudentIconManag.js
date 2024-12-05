import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const StudenticonManage = () => {
    const navigation = useNavigation();
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherProfile = async () => {
            try {
                const response = await axios.get('http://50.6.194.240:5000/api/teacher/profile');
                if (response.data.success) {
                    setTeacherData(response.data.teacher);
                } else {
                    Alert.alert('Error', response.data.message || 'Failed to fetch profile.');
                }
            } catch (error) {
                console.error('Error fetching teacher profile:', error);
                Alert.alert('Error', 'An error occurred while fetching the teacher profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherProfile();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text>Loading Teacher Profile...</Text>
            </View>
        );
    }

    if (!teacherData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load teacher profile. Please try again later.</Text>
            </View>
        );
    }

    const { name, photoUrl, gender, designation, phone_no, aadhar_no, address, teaches_to_classes } = teacherData;

    return (
        <View style={styles.mobileFrame}>
            {/* Header Section */}
            <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
                    <Icon name="home" type="material" size={45} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.emptyHeader} />

            <View style={styles.profileContainer}>
                <Text style={styles.headerText}>Teacher Information</Text>

                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.profileImage} />
                ) : (
                    <Text style={{ textAlign: 'center', marginVertical: 10 }}>No Profile Picture</Text>
                )}

                <View style={styles.infoBox}>
                    <Text style={styles.field}><Text style={styles.bold}>Name:</Text> {name}</Text>
                    <Text style={styles.field}><Text style={styles.bold}>Gender:</Text> {gender}</Text>
                    <Text style={styles.field}><Text style={styles.bold}>Designation:</Text> {designation}</Text>
                    <Text style={styles.field}><Text style={styles.bold}>Phone Number:</Text> {phone_no}</Text>
                    <Text style={styles.field}><Text style={styles.bold}>Aadhar Number:</Text> {aadhar_no}</Text>
                    <Text style={styles.field}><Text style={styles.bold}>Address:</Text> {address}</Text>

                    {teaches_to_classes.length > 0 && (
                        <View>
                            <Text style={styles.bold}>Teaches to Classes:</Text>
                            {teaches_to_classes.map((className, index) => (
                                <Text key={index} style={styles.classItem}>{className}</Text>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => navigation.navigate('TeacherLogin')}
            >
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mobileFrame: { flex: 1, backgroundColor: '#fff' },
    emptyHeader: { height: 20, backgroundColor: 'rgb(160, 180, 182)', marginTop: 10 },
    mainHeader: { backgroundColor: 'rgb(160, 180, 182)', height: 105, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    logo: { width: 60, height: 60 },
    profileContainer: { padding: 20, backgroundColor: '#fff', borderRadius: 10, marginHorizontal: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    headerText: { fontSize: 28, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    bold: { fontWeight: 'bold', color: '#333' },
    profileImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 20, alignSelf: 'center', borderWidth: 2, borderColor: '#ccc' },
    infoBox: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 20, backgroundColor: '#f9f9f9' },
    field: { width: '100%', marginBottom: 10, fontSize: 16, color: '#555', lineHeight: 24 }, // Ensuring fields are same width
    classItem: { marginLeft: 10, color: '#555' },
    logoutButton: { backgroundColor: 'rgb(160, 180, 182)', padding: 12, borderRadius: 5, width: '30%', alignSelf: 'center', alignItems: 'center', marginTop: 20 },
    logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', fontSize: 16, fontWeight: 'bold' },
});

export default StudenticonManage;