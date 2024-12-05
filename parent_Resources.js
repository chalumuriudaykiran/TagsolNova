import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentResources = () => {
    const [resources, setResources] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [filteredResources, setFilteredResources] = useState([]);
    const [reports, setReports] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const dummyResources = [
            { id: 1, title: 'Math Workbook', link: 'https://example.com/math-workbook' },
            { id: 2, title: 'Science Textbook', link: 'https://example.com/science-textbook' },
            { id: 3, title: 'History Notes', link: 'https://example.com/history-notes' }
        ];
        setResources(dummyResources);
        setFilteredResources(dummyResources);

        fetchReports(); // Fetch behavior reports when the component mounts
    }, []);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://50.6.194.240:5000/parent-reports'); // Adjust the endpoint as needed
            if (response.data.success) {
                setReports(response.data.reports);
            } else {
                Alert.alert('Error', 'No reports found.');
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
            Alert.alert('Error', 'Failed to fetch reports.');
        }
    };

    const handleSearch = () => {
        const filtered = resources.filter(resource =>
            resource.title.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredResources(filtered);
    };

    const openResourceLink = (link) => {
        console.log('Opening link:', link);
        // Implement linking logic here, e.g., using Linking API
    };

    return (
        <View style={styles.mobileFrame}>
            {/* Header Section */}
            <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
                    <Icon name="home" type="material" size={60} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.emptyHeader} />

            <View style={styles.content}>
                <Text style={styles.title}>Resource Center</Text>
                <Input
                    placeholder='Search Resources'
                    value={searchInput}
                    onChangeText={setSearchInput}
                    rightIcon={<Icon name='search' type='font-awesome' onPress={handleSearch} />}
                />
            </View>

            {/* Resource List */}
            {filteredResources.map(resource => (
                <View key={resource.id} style={styles.resourceCard}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Button
                        title="View Resource"
                        buttonStyle={styles.buttonStyle}
                        onPress={() => openResourceLink(resource.link)}
                    />
                </View>
            ))}

            {/* Reports Section */}
            <View style={styles.reportSection}>
                <Text style={styles.title}>Behavior Reports</Text>
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <View key={index} style={styles.reportCard}>
                            <Text>{report.details}</Text>
                            <Text>Date: {new Date(report.date).toLocaleDateString()}</Text>
                        </View>
                    ))
                ) : (
                    <Text>No reports found.</Text>
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
        width: 80,
        height: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    resourceCard: {
        backgroundColor: '#d1dde6',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#d1dde6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    resourceTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    buttonStyle: {
        backgroundColor: '#AABEC3',
        borderRadius: 5,
    },
    reportSection: {
        padding: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        marginTop: 20,
    },
    reportCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default ParentResources;
