import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const FeesDetails = ({ route }) => {
    const [feesDetails, setFeesDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();
    const { username } = route.params || {};

    // Fetch fee details based on the username
    const fetchFeesDetails = async () => {
        if (username) {
            try {
                const response = await axios.get(`http://50.6.194.240:5000/api/fees/${username}`);
                if (response.status === 200 && response.data.data) {
                    setFeesDetails(response.data.data);
                } else {
                    setError('No fee details found.');
                }
            } catch (err) {
                setError('Failed to fetch fees details.');
                console.error('Error fetching fees details:', err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (username) {
            fetchFeesDetails();
        }
    }, [username]);

    return (
        <View style={styles.mobileFrame}>
            {/* Header Section */}
            <View style={styles.mainHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Icon name="home" type="material" size={40} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.emptyHeader} />

            {/* Content Section */}
            <View style={styles.content}>
                <Text style={styles.heading}>Fees Details</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <ScrollView>
                        {feesDetails ? (
                            <View style={styles.feeCard}>
                                <Text style={styles.feeText}>Class: {feesDetails.feeClass}</Text>
                                <Text style={styles.feeText}>Section: {feesDetails.feeSection}</Text>
                                <Text style={styles.feeText}>Complete Fee: {feesDetails.completeFee}</Text>
                                <Text style={styles.feeText}>Paid Amount: {feesDetails.paidAmount}</Text>
                                <Text style={styles.feeText}>Final Amount: {feesDetails.finalAmount}</Text>
                            </View>
                        ) : (
                            <Text>No fee details found</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mobileFrame: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgb(160, 180,182)',
        paddingVertical: 10,
        height: 90,
        paddingHorizontal: 15,
        marginTop: 5,
    },
    emptyHeader: {
        height: 30,
        backgroundColor: 'rgb(160, 180, 182)',
        marginTop: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    logo: {
        width: 120,
        height: 60,
        resizeMode: 'contain',
    },
    content: {
        paddingHorizontal: 15,
    },
    heading: {
        fontSize: 30,
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    feeCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    feeText: {
        fontSize: 16,
        color: '#333',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default FeesDetails;
