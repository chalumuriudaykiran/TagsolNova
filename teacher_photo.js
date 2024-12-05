import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as DocumentPicker from 'expo-document-picker';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TeacherEventMediaUpload = ({ navigation }) => {
    const [photoData, setPhotoData] = useState('');
    const [uploaderName, setUploaderName] = useState('');
    const [uploaderDesignation, setUploaderDesignation] = useState('');
    const [nameOfEvent, setNameOfEvent] = useState('');
    const [eventMedia, setEventMedia] = useState([]);
    const [selectedFilesText, setSelectedFilesText] = useState('No file chosen');
    const [isUploading, setIsUploading] = useState(false); // State for upload buffering
    const [isPicking, setIsPicking] = useState(false);

    const pickDocument = async () => {
        if (isPicking) return;
        setIsPicking(true);

        try {
            // Check for permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need permission to access your media library.');
                return;
            }

            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'video/*'], // All image and video types
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                Alert.alert('File selection canceled', 'Please select a valid file.');
                return;
            }

            const file = result.assets[0]; // Assuming DocumentPicker returns `assets` for file selection

            const isAlreadySelected = eventMedia.some(item => item.uri === file.uri);
            if (!isAlreadySelected) {
                setEventMedia(prevMedia => [...prevMedia, file]);
                const fileNames = file.name || file.uri.split('/').pop();
                setSelectedFilesText(prevText =>
                    prevText === 'No file chosen' ? fileNames : `${prevText}, ${fileNames}`
                );
            } else {
                Alert.alert('File already selected', 'This file has already been selected.');
            }
        } catch (err) {
            console.error('Error picking document:', err);
            Alert.alert('Error picking document', 'Please try again.');
        } finally {
            setIsPicking(false);
        }
    };

    const validateAndUpload = async () => {
        if (!photoData || !uploaderName || !uploaderDesignation || !nameOfEvent || eventMedia.length === 0) {
            Alert.alert('Validation Error', 'Please fill all fields and select media files.');
            return;
        }

        setIsUploading(true); // Start uploading, show the spinner
        const formData = new FormData();

        eventMedia.forEach(file => {
            formData.append('attached_file', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/octet-stream',
            });
        });

        formData.append('photo_data', photoData);
        formData.append('name_of_event', nameOfEvent);
        formData.append('uploader_name', uploaderName);
        formData.append('uploader_designation', uploaderDesignation);

        try {
            const response = await fetch('http://50.6.194.240:5000/api/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Check if the response is OK
            if (!response.ok) {
                const textResponse = await response.text(); // Read as text
                throw new Error(`Server error: ${textResponse}`);
            }

            const result = await response.json(); // Try parsing as JSON

            if (response.ok) {
                Alert.alert('Success', result.message || 'Files uploaded successfully!');
                resetForm();
            } else {
                Alert.alert('Error', result.message || 'Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            Alert.alert('Upload Error', error.message || 'There was an error uploading your files. Please try again.');
        } finally {
            setIsUploading(false); // End uploading, hide the spinner
        }
    };

    const resetForm = () => {
        setNameOfEvent('');
        setPhotoData('');
        setUploaderName('');
        setUploaderDesignation('');
        setEventMedia([]);
        setSelectedFilesText('No file chosen');
    };

    return (
        <View style={styles.mobileFrame}>
            <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
                    <Icon name="home" type="material" size={wp('10%')} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
            <View style={{ padding: 20 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Photo Data"
                    value={photoData}
                    onChangeText={setPhotoData}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Name of the Event"
                    value={nameOfEvent}
                    onChangeText={setNameOfEvent}
                />
                <TextInput
                    placeholder="Uploader Name"
                    value={uploaderName}
                    onChangeText={setUploaderName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Uploader Designation"
                    value={uploaderDesignation}
                    onChangeText={setUploaderDesignation}
                    style={styles.input}
                />
                <Button title="Select Media" onPress={pickDocument} color='rgb(160, 180,182)' />
                <Text style={{ marginVertical: 10 }}>{selectedFilesText}</Text>
                
                {/* Show loading spinner while uploading */}
                {isUploading && (
                    <ActivityIndicator size="large" color="rgb(160, 180,182)" style={styles.spinner} />
                )}

                <TouchableOpacity
                    style={[styles.uploadButton, { backgroundColor: 'rgb(160, 180, 182)' }]}
                    onPress={validateAndUpload}
                    disabled={isUploading} // Disable button while uploading
                >
                    <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mobileFrame: {
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
   
    uploadButton: {
        paddingVertical: hp('2%'),      // Responsive vertical padding
        borderRadius: 5,
        marginVertical: hp('1.5%'),     // Responsive vertical margin
        alignItems: 'center',
        backgroundColor: '#007aff',     // Assuming you want the button to have a background color
      },
      uploadButtonText: {
        fontSize: wp('4.5%'),           // Responsive font size
        color: '#fff',
        fontWeight: 'bold',
      },
      spinner: {
        marginVertical: hp('2.5%'),     // Responsive vertical margin
      },
});

export default TeacherEventMediaUpload;
