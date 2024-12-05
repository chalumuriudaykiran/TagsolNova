import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ManagmentEventMediaUpload = ({ navigation }) => {
    const [photoData, setPhotoData] = useState('');
    const [uploaderName, setUploaderName] = useState('');
    const [uploaderDesignation, setUploaderDesignation] = useState('');
    const [nameOfEvent, setNameOfEvent] = useState('');
    const [eventMedia, setEventMedia] = useState([]);
    const [selectedFilesText, setSelectedFilesText] = useState('No file chosen');
    const [isUploading, setIsUploading] = useState(false);
    const [isPicking, setIsPicking] = useState(false);

    const pickDocument = async () => {
        if (isPicking) return;

        setIsPicking(true);
        try {
            // Change type to only accept images
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*'], // Only accept image files
                copyToCacheDirectory: true,
            });

            if (result.canceled) {
                Alert.alert('File selection canceled', 'Please select a valid image file.');
                return;
            }

            const file = result.assets[0];

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

        setIsUploading(true);
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
            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', result.message || 'Files uploaded successfully!');
                // Reset the form
                resetForm();
            } else {
                Alert.alert('Error', result.message || 'Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            Alert.alert('Upload Error', 'There was an error uploading your files. Please try again.');
        } finally {
            setIsUploading(false);
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
                <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                    <Icon name="home" type="material" size={wp('10%')} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.emptyHeader} />
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
                <Button title="Select Media" onPress={pickDocument} color="#000" disabled={isPicking} />
                <Text style={{ marginVertical: 10 }}>{selectedFilesText}</Text>
                <Button title="Upload" onPress={validateAndUpload} disabled={isUploading} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mobileFrame: {
        flex: 1,
        backgroundColor: '#fff',
       
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
    emptyHeader: {
        height: hp('3%'),
        backgroundColor: 'rgb(160, 180,182)',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
    },
    logo: {
         width: wp('15%'),  // Responsive width
    height: wp('15%'), 
    },
});

export default ManagmentEventMediaUpload;