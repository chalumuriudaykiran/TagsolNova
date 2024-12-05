// import React, { useState } from 'react';
// import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Icon } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import * as DocumentPicker from 'expo-document-picker';  // Document picker to pick files
// import { ImageManipulator } from 'expo-image-manipulator';
// import FormData from 'form-data';
// import * as FileSystem from 'expo-file-system';  // To check file existence
// import * as ImagePicker from 'expo-image-picker';
// const TeacherInfo = () => {
//     const navigation = useNavigation();

//     const [name, setName] = useState('');
//     const [gender, setGender] = useState('');
//     const [designation, setDesignation] = useState('');
//     const [phone_no, setPhoneNo] = useState('');
//     const [aadhar_no, setAadharNo] = useState('');
//     const [address, setAddress] = useState('');
//     const [teachesToClasses, setTeachesToClasses] = useState(['', '', '', '', '']);
//     const [loading, setLoading] = useState(false);

//     // State for file (photo) selection
//     const [fileUri, setFileUri] = useState(null); // Store the selected file URI
//     const [fileName, setFileName] = useState('No file chosen'); // Store the file name

//     // Handle class input changes
//     const handleClassInputChange = (index, value) => {
//         const newClasses = [...teachesToClasses];
//         newClasses[index] = value;
//         setTeachesToClasses(newClasses);
//     };

//     // Validate phone number (only 10 digits allowed)
//     const handlePhoneNumberChange = (text) => {
//         if (text.length > 10) {
//             Alert.alert('Error', 'Phone number cannot exceed 10 digits.');
//             return;
//         }
//         if (/[^0-9]/.test(text)) {
//             Alert.alert('Error', 'Phone number can only contain digits.');
//             return;
//         }
//         setPhoneNo(text);
//     };

//     // Validate Aadhar number (only 12 digits allowed)
//     const handleAadharNumberChange = (text) => {
//         if (text.length > 12) {
//             Alert.alert('Error', 'Aadhar number cannot exceed 12 digits.');
//             return;
//         }
//         if (/[^0-9]/.test(text)) {
//             Alert.alert('Error', 'Aadhar number can only contain digits.');
//             return;
//         }
//         setAadharNo(text);
//     };

//     // Function to pick an image (photo) from the gallery
//     const pickFile = async () => {
//         try {
//             const result = await DocumentPicker.getDocumentAsync({
//                 type: 'image/*',  // Limit selection to image files
//             });

//             console.log('Document Picker Response:', result);

//             if (result.type === 'cancel') {
//                 console.log('File selection was canceled.');
//                 return;
//             }

//             // Use result.assets if the result is an object with assets
//             if (result.assets && result.assets[0]) {
//                 const asset = result.assets[0]; // First file picked
//                 if (asset.uri) {
//                     const fileName = asset.uri.split('/').pop();
//                     setFileUri(asset.uri);
//                     setFileName(fileName);
//                 } else {
//                     throw new Error('File URI is undefined');
//                 }
//             } else {
//                 throw new Error('No file selected');
//             }
//         } catch (err) {
//             console.error('Error picking file:', err);
//             Alert.alert('Error picking file', err.message || 'Please try again.');
//         }
//     };

//     const compressImage = async (uri) => {
//         try {
//             const manipResult = await ImageManipulator.manipulateAsync(
//                 uri,
//                 [{ resize: { width: 800 } }],  // Resize to 800px width
//                 { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }  // Compress to 10% quality
//             );

//             console.log('Compressed Image URI:', manipResult.uri);
//             console.log('Compressed Image Size:', manipResult.size);

//             return manipResult.uri;  // Return the compressed image URI
//         } catch (error) {
//             console.error('Error compressing image:', error);
//             Alert.alert('Error', 'Failed to compress the image.');
//             return null;
//         }
//     };

//     // Function to handle image upload
//     const uploadImage = async (uri) => {
//         const compressedUri = await compressImage(uri); // Compress the image
//         if (!compressedUri) return;

//         const formData = new FormData();
//         const uriParts = compressedUri.split('.');
//         const fileType = uriParts[uriParts.length - 1];

//         formData.append('photo', {
//             uri: compressedUri,
//             type: `image/${fileType}`, // Fixed: Correct MIME type
//             name: `photo.${fileType}`,
//         });

//         try {
//             const response = await fetch('http://50.6.194.240:5000/submit-teacher-info', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 body: formData,
//             });

//             const data = await response.json();
//             if (data.success) {
//                 console.log('Image uploaded successfully');
//             } else {
//                 console.log('Failed to upload image');
//             }
//         } catch (error) {
//             console.error('Upload failed:', error);
//         }
//     };

//     // Function to handle form submission
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Validate required fields
//         if (!name.trim() || !gender.trim() || !designation.trim() || !phone_no.trim() || !aadhar_no.trim() || !address.trim()) {
//             Alert.alert('Error', 'All required fields are required.');
//             return;
//         }

//         // Log the data being sent to the server
//         console.log("Submitting Teacher Info: ", {
//             name, gender, designation, phone_no, aadhar_no, address,
//             teachesToClasses, // Log the class info as well
//             fileUri, fileName
//         });

//         // Prepare FormData for file upload
//         const formData = new FormData();
//         if (fileUri) {
//             const file = {
//                 uri: fileUri,
//                 name: fileName,
//                 type: 'image/jpeg',  // Ensure the MIME type matches
//             };

//             formData.append('photo', file);  // Use the field name 'photo'
//         } else {
//             Alert.alert('Error', 'No file selected.');
//             return;
//         }

//         // Append the rest of the form data
//         formData.append('name', name);
//         formData.append('gender', gender);
//         formData.append('designation', designation);
//         formData.append('phone_no', phone_no);
//         formData.append('aadhar_no', aadhar_no);
//         formData.append('address', address);
//         formData.append('teaches_to_1', teachesToClasses[0]);
//         formData.append('teaches_to_2', teachesToClasses[1]);
//         formData.append('teaches_to_3', teachesToClasses[2]);
//         formData.append('teaches_to_4', teachesToClasses[3]);
//         formData.append('teaches_to_5', teachesToClasses[4]);

//         try {
//             setLoading(true);
//             const response = await axios.post('http://50.6.194.240:5000/submit-teacher-info', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data', // Required for file uploads
//                 },
//             });

//             setLoading(false);

//             if (response.data.success) {
//                 Alert.alert('Success', 'Teacher details stored successfully!');
//                 setTimeout(() => {
//                     navigation.navigate('CreateAccount');
//                 }, 2000);
//             } else {
//                 Alert.alert('Error', response.data.message || 'Failed to store teacher information.');
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error('Error saving teacher info:', error.response ? error.response.data : error.message);
//             Alert.alert('Error', error.response?.data?.message || 'An error occurred while saving teacher info.');
//         }
//     };

//     return (
//         <View style={styles.mobileFrame}>
//             {/* First Header with Logo and Home Button */}
//             <View style={styles.mainHeader}>
//             <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                     <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                     <Icon name="home" type="material" size={45} color="#000" />
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.subHeader} />


//             {/* Scrollable Form Content */}
//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 <Text style={styles.title}>Teacher Information</Text>

//                 <Text style={styles.label}>Name:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={name}
//                     onChangeText={setName}
//                     placeholder="Enter teacher name"
//                 />

//                 {/* Gender Picker */}
//                 <View style={styles.pickerContainer}>
//                     <Text style={styles.label}>Gender:</Text>
//                     <Picker
//                         selectedValue={gender}
//                         onValueChange={(itemValue) => setGender(itemValue)}
//                         style={styles.picker}
//                     >
//                         <Picker.Item label="Select Gender" value="" enabled={false} />
//                         <Picker.Item label="Male" value="Male" />
//                         <Picker.Item label="Female" value="Female" />
//                         <Picker.Item label="Others" value="Others" />
//                     </Picker>
//                 </View>

//                 <Text style={styles.label}>Designation:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={designation}
//                     onChangeText={setDesignation}
//                     placeholder="Enter designation"
//                 />

//                 {/* Teaches to Classes Inputs */}
//                 <Text style={styles.label}>Teaches to Classes:</Text>
//                 {teachesToClasses.map((classInput, index) => (
//                     <View key={index} style={styles.classInputWrapper}>
//                       <Text style={styles.classLabel}>{`${index + 1} Teaches to Class:`}</Text>

//                         <Picker
//                             selectedValue={classInput}
//                             onValueChange={(value) => handleClassInputChange(index, value)}
//                             style={styles.input}
//                         >
//                             <Picker.Item label="Select Class" value="" enabled={false} />
//                             {[...Array(10).keys()].map((i) => (
//                                 <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
//                             ))}
//                         </Picker>
//                     </View>
//                 ))}

//                 <Text style={styles.label}>Phone Number:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={phone_no}
//                     onChangeText={handlePhoneNumberChange}
//                     placeholder="Enter phone number"
//                     keyboardType="phone-pad"
//                     maxLength={10} // Max length for phone number
//                 />

//                 <Text style={styles.label}>Aadhar Number:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={aadhar_no}
//                     onChangeText={handleAadharNumberChange}
//                     placeholder="Enter Aadhar number"
//                     keyboardType="numeric"
//                     maxLength={12} // Max length for Aadhar number
//                 />

//                 <Text style={styles.label}>Address:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={address}
//                     onChangeText={setAddress}
//                     placeholder="Enter address"
//                 />

//                 <View style={styles.filePickerWrapper}>
//                     <TouchableOpacity onPress={pickFile} style={styles.filePickerButton}>
//                         <Text style={styles.filePickerText}>Choose Photo</Text>
//                     </TouchableOpacity>
//                     {fileUri && (
//                         <Text style={styles.fileNameText}>{fileName}</Text>
//                     )}
//                 </View>

//                 <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                     {loading ? (
//                         <ActivityIndicator size="large" color="#fff" />
//                     ) : (
//                         <Text style={styles.submitButtonText}>Submit</Text>
//                     )}
//                 </TouchableOpacity>
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     mobileFrame: {
//         flex: 1,
//         backgroundColor: '#f4f4f4',
//         padding: 10,
//         marginTop:-25,
//     },
//     mainHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'rgb(160, 180, 182)',
//         paddingVertical: 10,
//         height: 90,
//         paddingHorizontal: 15,
//         marginTop: 9,
//     },
//     subHeader: {
//        height:20,
//         backgroundColor: '#AABEC3',
//         alignItems: 'center',
//         paddingVertical: 5,
//         paddingHorizontal: 1,
//         marginTop: 10,
//     },

//     logo: {
//         width: 60,
//         height: 60,
//     },
//     scrollContent: {
//         flexGrow: 1,
//         justifyContent: 'flex-start',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 10,
//     },
//     input: {
//         backgroundColor: '#fff',
//         padding: 10,
//         borderRadius: 5,
//         marginBottom: 15,
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     pickerContainer: {
//         marginBottom: 15,
//     },
//     picker: {
//         height: 50,
//         width: '100%',
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     classInputWrapper: {
//         marginBottom: 15,
//     },
//     classLabel: {
//         fontSize: 14,
//         marginBottom: 5,
//     },
//     filePickerWrapper: {
//         marginBottom: 15,
//         alignItems: 'center',
//     },
//     filePickerButton: {
//         backgroundColor: 'rgb(160, 180, 182)',
//         padding: 10,
//         borderRadius: 5,
        
//     },
//     filePickerText: {
//         color: '#fff',
//         fontSize: 16,
//     },
//     fileNameText: {
//         marginTop: 5,
//         fontSize: 14,
//         color: '#555',
//     },
//     submitButton: {
//         backgroundColor: 'rgb(160, 180, 182)',
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: 'black',
//         fontSize: 18,
//     },
// });

// export default TeacherInfo;




import React, { useState } from 'react';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import FormData from 'form-data';

const TeacherInfo = ({route}) => {
    const navigation = useNavigation();
    const { userType } = route.params || {};
    const [teacherName, setTeacherName] = useState('');

    const [fatherName, setFatherName] = useState('');
    const [gender, setGender] = useState('');
    const [designation, setDesignation] = useState('');
    const [phone_no, setPhoneNo] = useState('');
    const [aadhar_no, setAadharNo] = useState('');
    const [address, setAddress] = useState('');
    const [teachesToClasses, setTeachesToClasses] = useState(['', '', '', '', '']);
    const [loading, setLoading] = useState(false);

    // State for file (photo) selection
    const [fileUri, setFileUri] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');

    // Function to pick an image (photo) from the gallery
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });

            if (result.type === 'cancel') {
                return;
            }

            if (result.assets && result.assets[0]) {
                const asset = result.assets[0];
                if (asset.uri) {
                    const fileName = asset.uri.split('/').pop();
                    setFileUri(asset.uri);
                    setFileName(fileName);
                } else {
                    throw new Error('File URI is undefined');
                }
            } else {
                throw new Error('No file selected');
            }
        } catch (err) {
            console.error('Error picking file:', err);
            Alert.alert('Error picking file', err.message || 'Please try again.');
        }
    };

    const handlePhoneNumberChange = (text) => {
        if (text.length > 10) {
            Alert.alert('Error', 'Phone number cannot exceed 10 digits.');
            return;
        }
        setPhoneNo(text.replace(/[^0-9]/g, ''));
    };

    const handleAadharNumberChange = (text) => {
        if (text.length > 12) {
            Alert.alert('Error', 'Aadhar number cannot exceed 12 digits.');
            return;
        }
        setAadharNo(text.replace(/[^0-9]/g, ''));
    };

    const handleClassInputChange = (index, value) => {
        const newTeachesToClasses = [...teachesToClasses];
        newTeachesToClasses[index] = value;
        setTeachesToClasses(newTeachesToClasses);
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation checks
        if (!fatherName.trim() || !gender.trim() || !designation.trim() || !phone_no.trim() || !aadhar_no.trim() || !address.trim()) {
            Alert.alert('Error', 'All required fields are required.');
            return;
        }

        if (phone_no.length !== 10) {
            Alert.alert('Error', 'Phone number must be exactly 10 digits.');
            return;
        }

        if (aadhar_no.length !== 12) {
            Alert.alert('Error', 'Aadhar number must be exactly 12 digits.');
            return;
        }
// Generate username: First 3 letters of teacherName + Last 3 letters of fatherName + Last 4 digits of phone_no
const username = `${teacherName.substring(0, 3).toLowerCase()}${fatherName.slice(-3).toLowerCase()}${phone_no.slice(-4)}`;

// Generate password: First letter of teacherName capitalized + Next 3 letters of teacherName lowercase + Special character + Last 4 digits of phone_no
const password = `${teacherName.charAt(0).toUpperCase()}${teacherName.substring(1, 4).toLowerCase()}@${phone_no.slice(-4)}`;

console.log("Generated Username:", username);
console.log("Generated Password:", password);


        // Prepare FormData for file upload
        const formData = new FormData();
        if (fileUri) {
            const file = {
                uri: fileUri,
                name: fileName,
                type: 'image/jpeg',
            };
            formData.append('photo', file);
        } else {
            Alert.alert('Error', 'No file selected.');
            return;
        }

        formData.append('username', username);
        formData.append('teacher_name', teacherName);
        formData.append('password', password);
        formData.append('father_name', fatherName);
        formData.append('gender', gender);
        formData.append('designation', designation);
        formData.append('phone_no', phone_no);
        formData.append('aadhar_no', aadhar_no);
        formData.append('address', address);
        formData.append('teaches_to_1', teachesToClasses[0]);
        formData.append('teaches_to_2', teachesToClasses[1]);
        formData.append('teaches_to_3', teachesToClasses[2]);
        formData.append('teaches_to_4', teachesToClasses[3]);
        formData.append('teaches_to_5', teachesToClasses[4]);
        formData.append('user_type', userType);

        try {
            setLoading(true);
            const response = await axios.post('http://50.6.194.240:5000/submit-teacher-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setLoading(false);

            if (response.data.success) {
                // Display success alert with username and password
                Alert.alert(
                    'Success',
                    `Teacher details submitted successfully!\n\nGenerated Username: ${username}\nGenerated Password: ${password}`
                );
                setTimeout(() => {
                    navigation.navigate('CreateAccount');
                }, 2000);
            } else {
                Alert.alert('Error', response.data.message || 'Failed to store teacher information.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error saving teacher info:', error.response ? error.response.data : error.message);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while saving teacher info.');
        }
    };

    return (
        <View style={styles.mobileFrame}>
            <View style={styles.mainHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Icon name="home" type="material" size={60} color="#000" />
                    </TouchableOpacity>
                
            </View>

            <Text style={styles.subHeader}></Text>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                <Text style={styles.title}>Teacher Information</Text>
                <Text style={styles.label}>Teacher's Name:</Text>
    <TextInput
        style={styles.input}
        value={teacherName}
        onChangeText={setTeacherName}
        placeholder="Enter teacher's name"
    />



                <Text style={styles.label}>Father's Name:</Text>
                <TextInput
                    style={styles.input}
                    value={fatherName}
                    onChangeText={setFatherName}
                    placeholder="Enter father's name"
                />

                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>Gender:</Text>
                    <Picker
                        selectedValue={gender}
                        onValueChange={(itemValue) => setGender(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Gender" value="" enabled={false} />
                        <Picker.Item label="Male" value="Male" />
                        <Picker.Item label="Female" value="Female" />
                        <Picker.Item label="Others" value="Others" />
                    </Picker>
                </View>

                <Text style={styles.label}>Designation:</Text>
                <TextInput
                    style={styles.input}
                    value={designation}
                    onChangeText={setDesignation}
                    placeholder="Enter designation"
                />

                <Text style={styles.label}>Teaches to Classes:</Text>
                {teachesToClasses.map((classInput, index) => (
                    <View key={index} style={styles.classInputWrapper}>
                        <Text style={styles.classLabel}>{`${index + 1} Teaches to Class:`}</Text>
                        <Picker
                            selectedValue={classInput}
                            onValueChange={(value) => handleClassInputChange(index, value)}
                            style={styles.input}
                        >
                            <Picker.Item label="Select Class" value="" enabled={false} />
                            {[...Array(10).keys()].map((i) => (
                                <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
                            ))}
                        </Picker>
                    </View>
                ))}

                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                    style={styles.input}
                    value={phone_no}
                    onChangeText={handlePhoneNumberChange}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>Aadhar Number:</Text>
                <TextInput
                    style={styles.input}
                    value={aadhar_no}
                    onChangeText={handleAadharNumberChange}
                    placeholder="Enter Aadhar number"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Address:</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                />

                <View style={styles.filePickerWrapper}>
                    <TouchableOpacity onPress={pickFile} style={styles.filePickerButton}>
                        <Text style={styles.filePickerText}>Choose Photo</Text>
                    </TouchableOpacity>
                    {fileUri && (
                        <Text style={styles.fileNameText}>{fileName}</Text>
                    )}
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : (
                        <Text style={styles.submitButtonText}>Submit</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

// Styles definition
const styles = StyleSheet.create({
    mobileFrame: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    mainHeader: {
        backgroundColor: 'rgb(160, 180, 182)',
        justifyContent: 'space-between', // Align logo to the left, icon to the right
        alignItems: 'center',            // Vertically center the elements
        width: '100%',  // Set to full width
        height: 80,     // Adjusted height
        flexDirection: 'row',
        paddingHorizontal: 15,
    
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
        marginTop:10,
        height:20,
        backgroundColor: 'rgb(160, 180,182)',

    },
    scrollContent: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    pickerContainer: {
        marginBottom: 15,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    classInputWrapper: {
        marginBottom: 15,
    },
    classLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    filePickerWrapper: {
        marginBottom: 20,
        alignItems: 'center',
    },
    filePickerButton: {
        backgroundColor: 'rgb(160, 180, 182)',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    filePickerText: {
        color: '#fff',
        fontSize: 16,
    },
    fileNameText: {
        fontSize: 14,
        color: '#333',
    },
    submitButton: {
        backgroundColor: 'rgb(160, 180, 182)',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TeacherInfo;
