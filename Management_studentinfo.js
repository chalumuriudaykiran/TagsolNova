// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     Alert,
//     ScrollView,
//     TouchableOpacity,
//     StyleSheet,
//     ActivityIndicator,
//     Image,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Icon } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// import * as DocumentPicker from 'expo-document-picker';
// import { ImageManipulator } from 'expo-image-manipulator';
// import FormData from 'form-data';

// const StudentInfo = () => {
//     const navigation = useNavigation();

//     const [name, setName] = useState('');
//     const [gender, setGender] = useState('');
//     const [phone_no, setPhoneNo] = useState('');
//     const [designation, setDesignation] = useState('');
//     const [aadhar_no, setAadharNo] = useState('');
//     const [father_name, setFatherName] = useState('');
//     const [class_name, setClassName] = useState('');
//     const [section, setSection] = useState('');
//     const [class_teacher, setClassTeacher] = useState('');
//     const [school_name, setSchoolName] = useState('');
//     const [address, setAddress] = useState('');
    
//     const [loading, setLoading] = useState(false);

//     // Function to pick an image (photo) from the gallery
   
//     // State for file (photo) selection
//     const [fileUri, setFileUri] = useState(null); // Store the selected file URI
//     const [fileName, setFileName] = useState('No file chosen'); // Store the file name

//     // Handle class input changes
//     const handleClassInputChange = (index, value) => {
//         const newClasses = [...teachesToClasses];
//         newClasses[index] = value;
//         setTeachesToClasses(newClasses);
//     };

// // Validate phone number (only 10 digits allowed)
// const handlePhoneNumberChange = (text) => {
//     if (text.length > 10) {
//         Alert.alert('Error', 'Phone number cannot exceed 10 digits.');
//         return;
//     }
//     if (/[^0-9]/.test(text)) {
//         Alert.alert('Error', 'Phone number can only contain digits.');
//         return;
//     }
//     setPhoneNo(text);
// };

// // Validate Aadhar number (only 12 digits allowed)
// const handleAadharNumberChange = (text) => {
//     if (text.length > 12) {
//         Alert.alert('Error', 'Aadhar number cannot exceed 12 digits.');
//         return;
//     }
//     if (/[^0-9]/.test(text)) {
//         Alert.alert('Error', 'Aadhar number can only contain digits.');
//         return;
//     }
//     setAadharNo(text);
// };







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
//             const response = await fetch('http://50.6.194.240:5000/submit-student-info', {
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
//     // Function to handle form submission
// const handleSubmit = async () => {
//     if (
//         !name.trim() ||
//         !gender.trim() ||
//         !phone_no.trim() ||
//         !designation.trim() ||
//         !aadhar_no.trim() ||
//         !father_name.trim() ||
//         !class_name.trim() ||
//         !section.trim() ||
//         !class_teacher.trim() ||
//         !school_name.trim() ||
//         !address.trim()
//     ) {
//         Alert.alert('Error', 'Please fill all the fields');
//         return;
//     }

//     // Prepare FormData for file upload
//     const formData = new FormData();
//     if (fileUri) {
//         formData.append('photo', {
//             uri: fileUri,
//             name: fileName,
//             type: 'image/jpeg',
//         });
//     }
    
//     // Append other fields
//     formData.append('name', name);
//     formData.append('gender', gender);
//     formData.append('phone_no', phone_no);
//     formData.append('designation', designation);
//     formData.append('aadhar_no', aadhar_no);
//     formData.append('father_name', father_name);
//     formData.append('class_name', class_name);
//     formData.append('section', section);
//     formData.append('class_teacher', class_teacher);
//     formData.append('school_name', school_name);
//     formData.append('address', address);
    
    
//     try {
//         setLoading(true);
//         const response = await axios.post('http://50.6.194.240:5000/submit-student-info', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         setLoading(false);

//             if (response.data.success) {
//                 Alert.alert('Success', 'Student details stored successfully!');
//                 setTimeout(() => {
//                     navigation.navigate('CreateAccount');
//                 }, 2000);
//             } else {
//                 Alert.alert('Error', response.data.message || 'Failed to store student information.');
//             }
//         } catch (error) {
//             setLoading(false);
//             console.error('Error saving student info:', error.response ? error.response.data : error.message);
//             Alert.alert('Error', error.response?.data?.message || 'An error occurred while saving student info.');
//         }
//     };


//     return (
//         <View style={styles.mobileFrame}>
//             <View style={styles.mainHeader}>
//             <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                     <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                     <Icon name="home" type="material" size={35} color="#000" />
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.subHeader} />

//             <ScrollView contentContainerStyle={styles.scrollContent}>
//                 <Text style={styles.title}>Student Information</Text>

//                 <Text style={styles.label}>Name:</Text>
//                 <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter student name" />

//                 <Text style={styles.label}>Gender:</Text>
//                 <Picker
//                     selectedValue={gender}
//                     onValueChange={(itemValue) => setGender(itemValue)}
//                     style={styles.input}
//                 >
//                     <Picker.Item label="Select Gender" value="" enabled={false} />
//                     <Picker.Item label="Male" value="Male" />
//                     <Picker.Item label="Female" value="Female" />
//                     <Picker.Item label="Others" value="Others" />
//                 </Picker>

//                 <Text style={styles.label}>Phone Number:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={phone_no}
//                     onChangeText={handlePhoneNumberChange}
//                     placeholder="Enter phone number"
//                     keyboardType="phone-pad"
//                     maxLength={10} // Max length for phone number
//                 />


//                 <Text style={styles.label}>Designation:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={designation}
//                     onChangeText={setDesignation}
//                     placeholder="Enter designation"
//                 />

// <Text style={styles.label}>Aadhar Number:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={aadhar_no}
//                     onChangeText={handleAadharNumberChange}
//                     placeholder="Enter Aadhar number"
//                     keyboardType="numeric"
//                     maxLength={12} // Max length for Aadhar number
//                 />


//                 <Text style={styles.label}>Father's Name:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={father_name}
//                     onChangeText={setFatherName}
//                     placeholder="Enter father's name"
//                 />

//                 <Text style={styles.label}>Class:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={class_name}
//                     onChangeText={setClassName}
//                     placeholder="Enter class"
//                 />

//                 <Text style={styles.label}>Section:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={section}
//                     onChangeText={setSection}
//                     placeholder="Enter section"
//                 />

//                 <Text style={styles.label}>Class Teacher:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={class_teacher}
//                     onChangeText={setClassTeacher}
//                     placeholder="Enter class teacher"
//                 />

//                 <Text style={styles.label}>School:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={school_name}
//                     onChangeText={setSchoolName}
//                     placeholder="Enter school name"
//                 />

//                 <Text style={styles.label}>Address:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={address}
//                     onChangeText={setAddress}
//                     placeholder="Enter address"
//                 />

// <View style={styles.filePickerWrapper}>
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
//     container: {
//         flex: 1,
//         padding: 16,
//         height: 200,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     fileName: {
//         marginTop: 10,
//         fontStyle: 'italic',
//         color: '#666',
//     },
//     reportCard: {
//         padding: 10,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         marginBottom: 10,
//     },
//     mobileFrame: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
//         paddingTop: 0,
//         marginTop: -40,
//     },
//     subHeader: {
//         height:20,
//          backgroundColor: '#AABEC3',
//          alignItems: 'center',
//          paddingVertical: 5,
//          paddingHorizontal: 1,
//          marginTop: 10,
//      },
//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//         marginLeft: 10,
//         fontWeight: 'bold',
//         marginTop: 10,
//     },
//     input: {
//         marginVertical: 10,
//         borderBottomWidth: -10,
//         padding: 10,
//         borderColor: '#ccc',
//         borderRadius: 5,
//         backgroundColor: '#fff',
//         fontSize: 16,
//         color: '#333',
//     },
//     button: {
//         backgroundColor: 'rgb(160, 180, 182)',
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     // Choose Photo Button Styles
//     filePickerButton: {
//         backgroundColor: 'rgb(160, 180, 182)', // Blue color for the "Choose Photo" button
//         paddingVertical: 10,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginBottom: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     filePickerText: {
//         color: '#fff',
//         fontSize: 18,
//         fontWeight: 'bold',
//     },
//     // Submit Button Styles
//     submitButton: {
//         backgroundColor: 'rgb(160, 180, 182)', // Green color for the "Submit" button
//         paddingVertical: 14,
//         paddingHorizontal: 30,
//         borderRadius: 8,
//         alignItems: 'center',
//         marginTop: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     submitButtonText: {
//         color: '#fff',
//         fontSize: 20,
//         fontWeight: 'bold',
//     },
//     mainHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'rgb(160, 180,182)',
//         paddingVertical: 10,
//         height: 95,
//         paddingHorizontal: 15,
//         marginTop: 40,
//     },
//     logo: {
//         width: 60,
//         height: 60,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 2,
//         marginTop: 10,
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     success: {
//         color: 'green',
//         marginTop: 10,
//         textAlign: 'center',
//     },
//     emptyHeader: {
//         height: 30,
//         backgroundColor: 'rgb(160, 180, 182)',
//         marginTop: 2,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 5,
//         elevation: 2,
//     },
// });

// export default StudentInfo;


import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import { ImageManipulator } from 'expo-image-manipulator';
import FormData from 'form-data';

const StudentInfo = ({ route }) => {
    const navigation = useNavigation();
    const { userType } = route.params || {};

    const [student_name, setStudentName] = useState('');
    const [gender, setGender] = useState('');
    const [phone_no, setPhoneNo] = useState('');
    const [aadhar_no, setAadharNo] = useState('');
    const [father_name, setFatherName] = useState('');
    const [class_name, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [class_teacher, setClassTeacher] = useState('');
    const [school_name, setSchoolName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [fileUri, setFileUri] = useState(null);
    const [fileName, setFileName] = useState('No file chosen');

    // Function to pick an image (photo) from the gallery
    const pickFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });

            console.log('Document Picker Response:', result);

            if (result.type === 'cancel') {
                console.log('File selection was canceled.');
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

    // Validation for phone number
    const handlePhoneNumberChange = (text) => {
        if (text.length > 10) {
            Alert.alert('Error', 'Phone number cannot exceed 10 digits.');
            return;
        }
        setPhoneNo(text.replace(/[^0-9]/g, ''));
    };

    // Validation for Aadhar number
    const handleAadharNumberChange = (text) => {
        if (text.length > 12) {
            Alert.alert('Error', 'Aadhar number cannot exceed 12 digits.');
            return;
        }
        setAadharNo(text.replace(/[^0-9]/g, ''));
    };

 // Generate username
const username = `${student_name.substring(0, 3).toLowerCase()}${father_name.slice(-3).toLowerCase()}${phone_no.slice(-4)}`;

// Generate password
const specialCharacter = '@';  // You can change this to any special character you prefer
const firstCapitalLetter = student_name.charAt(0).toUpperCase();  // First letter of the student's name in uppercase
const password = `${firstCapitalLetter}${student_name.substring(1, 4).toLowerCase()}${specialCharacter}${phone_no.slice(-4)}`;

console.log('Generated Username:', username);
console.log('Generated Password:', password);



    const compressImage = async (uri) => {
        try {
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 800 } }],
                { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
            );

            console.log('Compressed Image URI:', manipResult.uri);
            console.log('Compressed Image Size:', manipResult.size);

            return manipResult.uri;
        } catch (error) {
            console.error('Error compressing image:', error);
            Alert.alert('Error', 'Failed to compress the image.');
            return null;
        }
    };

    // Function to handle image upload
    const uploadImage = async (uri) => {
        const compressedUri = await compressImage(uri);
        if (!compressedUri) return;

        const formData = new FormData();
        const uriParts = compressedUri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        formData.append('photo', {
            uri: compressedUri,
            type: `image/${fileType}`,
            name: `photo.${fileType}`,
        });

        try {
            const response = await fetch('http://50.6.194.240:5000/submit-student-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                console.log('Image uploaded successfully');
            } else {
                console.log('Failed to upload image');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (
            !student_name.trim() ||
            !gender.trim() ||
            !phone_no.trim() ||
            !aadhar_no.trim() ||
            !father_name.trim() ||
            !class_name.trim() ||
            !section.trim() ||
            !class_teacher.trim() ||
            !school_name.trim() ||
            !address.trim()
        ) {
            Alert.alert('Error', 'Please fill all the fields');
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

        // Prepare FormData for file upload
        const formData = new FormData();
        if (fileUri) {
            formData.append('photo', {
                uri: fileUri,
                name: fileName,
                type: 'image/jpeg',
            });
        }

        // Append other fields
        formData.append('username', username);
        formData.append('password', password);
        formData.append('name', student_name);
        formData.append('gender', gender);
        formData.append('phone_no', phone_no);
        formData.append('aadhar_no', aadhar_no);
        formData.append('father_name', father_name);
        formData.append('class_name', class_name);
        formData.append('section', section);
        formData.append('class_teacher', class_teacher);
        formData.append('school_name', school_name);
        formData.append('address', address);
        formData.append('user_type', userType);

        try {
            setLoading(true);
            const response = await axios.post('http://50.6.194.240:5000/submit-student-info', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setLoading(false);

            if (response.data.success) {
                Alert.alert(
                    'Success',
                   ` Student details stored successfully!\n\nGenerated Username: ${username}\nGenerated Password: ${password}`
                );
                setTimeout(() => {
                    navigation.navigate('CreateAccount');
                }, 2000);
            } else {
                Alert.alert('Error', response.data.message || 'Failed to store student information.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Error saving student info:', error.response ? error.response.data : error.message);
            Alert.alert('Error', error.response?.data?.message || 'An error occurred while saving student info.');
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
            <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Student Information</Text>
    
    {/* Add student name input */}
    <View style={styles.inputContainer}>
        <Text style={styles.label}>Student Name:</Text>
        <TextInput
            style={styles.input}
            value={student_name}
            onChangeText={setStudentName}
            placeholder="Enter Student Name"
        />
    
    </View>
               
                <Text style={styles.label}>Gender:</Text>
                <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => setGender(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Select Gender" value="" enabled={false} />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="Others" value="Others" />
                </Picker>

                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                    style={styles.input}
                    value={phone_no}
                    onChangeText={setPhoneNo}
                    placeholder="Enter phone number"
                    keyboardType="numeric"
                />

              

                <Text style={styles.label}>Aadhar Number:</Text>
                <TextInput
                    style={styles.input}
                    value={aadhar_no}
                    onChangeText={setAadharNo}
                    placeholder="Enter Student aadhar number"
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Father's Name:</Text>
                <TextInput
                    style={styles.input}
                    value={father_name}
                    onChangeText={setFatherName}
                    placeholder="Enter father's name"
                />

                <Text style={styles.label}>Class:</Text>
                <TextInput
                    style={styles.input}
                    value={class_name}
                    onChangeText={setClassName}
                    placeholder="Enter class"
                />

                <Text style={styles.label}>Section:</Text>
                <TextInput
                    style={styles.input}
                    value={section}
                    onChangeText={setSection}
                    placeholder="Enter section"
                />

                <Text style={styles.label}>Class Teacher:</Text>
                <TextInput
                    style={styles.input}
                    value={class_teacher}
                    onChangeText={setClassTeacher}
                    placeholder="Enter class teacher"
                />

                <Text style={styles.label}>School:</Text>
                <TextInput
                    style={styles.input}
                    value={school_name}
                    onChangeText={setSchoolName}
                    placeholder="Enter school name"
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        height: 200,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    fileName: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#666',
    },
    reportCard: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    mobileFrame: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 0,
        marginTop: -40,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginLeft: 10,
        fontWeight: 'bold',
        marginTop: 10,
    },
    input: {
        marginVertical: 10,
        borderBottomWidth: -10,
        padding: 10,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: 'rgb(160, 180, 182)',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    // Choose Photo Button Styles
    filePickerButton: {
        backgroundColor: 'rgb(160, 180, 182)', // Blue color for the "Choose Photo" button
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    filePickerText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Submit Button Styles
    submitButton: {
        backgroundColor: 'rgb(160, 180, 182)', // Green color for the "Submit" button
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    mainHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgb(160, 180,182)',
        paddingVertical: 10,
        height: 95,
        paddingHorizontal: 15,
        marginTop: 70,
    },
    logo: {
        width: 70,
        height: 70,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
        marginTop: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    success: {
        color: 'green',
        marginTop: 10,
        textAlign: 'center',
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
});

export default StudentInfo;