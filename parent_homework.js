import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system'; // Ensure this is used correctly
import * as Sharing from 'expo-sharing'; // Ensure sharing functionality is available
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentHomeworkScreen = ({ route }) => {
    const [homeworkItems, setHomeworkItems] = useState([]);
    const [filteredHomeworkItems, setFilteredHomeworkItems] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [classInfo, setClassInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Added loading state for fetching homework list

    const navigation = useNavigation();
    const { username } = route.params || {};

    useEffect(() => {
        if (username) {
            fetchStudentData();
        } else {
            console.error('Username is missing');
        }
    }, [username]);

    // Fetch student data (class_name, section) based on username
    const fetchStudentData = async () => {
        try {
            const response = await fetch(`http://50.6.194.240:5000/student?username=${username}`);
            const data = await response.json();

            if (data.message === 'Student profile not found') {
                setClassInfo(null);
                console.error('No student profile found for this username');
            } else if (data.data) {
                setClassInfo(data.data); // Set class_name and section from response
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    };

    // Fetch homework list based on class_name and section
    useEffect(() => {
        if (classInfo) {
            fetchHomeworkList();
        }
    }, [classInfo]);

    const fetchHomeworkList = async () => {
        if (!classInfo) return;
        setIsLoading(true);
        const { class_name, section } = classInfo;
        try {
            const response = await fetch(
                `http://50.6.194.240:5000/homework-list?class_name=${class_name}&section=${section}`
            );
            const result = await response.json();
            if (response.ok) {
                setHomeworkItems(result);
                setFilteredHomeworkItems(result); // Initialize filtered list with all homework items
            } else {
                Alert.alert('Error fetching homework list', result.message || 'Please try again.');
            }
        } catch (error) {
            console.error('Error fetching homework list:', error);
            Alert.alert('Error fetching homework', 'There was an error fetching the homework list. Please try again.');
        }
        setIsLoading(false);
    };

    // Filter homework items based on search input
    useEffect(() => {
        if (searchInput === '') {
            setFilteredHomeworkItems(homeworkItems);
        } else {
            const filtered = homeworkItems.filter(item =>
                item.subject.toLowerCase().includes(searchInput.toLowerCase()) ||
                item.description.toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredHomeworkItems(filtered);
        }
    }, [searchInput, homeworkItems]);

    const viewDocument = async (base64Data, mimeType) => {
        try {
            const detectedMimeType = mimeType || getMimeType(base64Data);
            const fileExtension = detectedMimeType.split('/')[1];
            const fileUri = FileSystem.documentDirectory + `tempDocument.${fileExtension}`;

            await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
            await Sharing.shareAsync(fileUri);
        } catch (error) {
            console.error('Error opening document:', error);
            Alert.alert('Error', 'There was a problem opening the document.');
        }
    };

    // Helper function to get MIME type from base64 data (if not provided)
    const getMimeType = (fileData) => {
        if (fileData.startsWith('/9j')) return 'image/jpeg'; // Common base64 header for JPEG images
        if (fileData.startsWith('JVBER')) return 'application/pdf'; // Common header for PDF files
        return 'application/octet-stream'; // Default binary type if unknown
    };

    return (
        <View style={styles.container}>
          
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

            {/* Search Bar */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search by subject or description"
                value={searchInput}
                onChangeText={setSearchInput}
            />

            {/* Homework List */}
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={filteredHomeworkItems}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.homeworkItem}>
                            <Text style={styles.subject}>Subject: {item.subject}</Text>
                            <Text>Description: {item.description}</Text>
                            <Text>Due Date: {new Date(item.due_date).toLocaleDateString()}</Text>

                            {/* Show document if available */}
                            {item.homework_file && (
                                <TouchableOpacity onPress={() => viewDocument(item.homework_file, item.mimeType)}>
                                    <Text style={styles.documentText}>View Homework</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#f0f0f0',
    },

    mainHeader: {
        flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1.5%'),  // Responsive padding
    paddingHorizontal: wp('4%'),  // Responsive padding
    height: hp('12%'),  // Responsive height
    marginBottom: wp('3%'),  
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
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    homeworkItem: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    subject: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    documentText: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
});

export default ParentHomeworkScreen;