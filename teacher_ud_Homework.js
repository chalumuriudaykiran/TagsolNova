// import React, { useState } from 'react';
// import { Icon } from 'react-native-elements';

// import {
//   View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Image,
// } from 'react-native';
// import * as DocumentPicker from 'expo-document-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import { useNavigation } from '@react-navigation/native'; // Remove the duplicate useNavigation import

// const TeacherHomeworkUpload = () => {
//   const [classInput, setClassInput] = useState('');
//   const [sectionInput, setSectionInput] = useState('');
//   const [subjectInput, setSubjectInput] = useState('');
//   const [descriptionInput, setDescriptionInput] = useState('');
//   const [homeworkMedia, setHomeworkMedia] = useState([]);
//   const [selectedFilesText, setSelectedFilesText] = useState('No file chosen');
//   const [isUploading, setIsUploading] = useState(false);
//   const [homeworkList, setHomeworkList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [imageModalVisible, setImageModalVisible] = useState(false);
//   const [selectedImageUri, setSelectedImageUri] = useState(null);
//   const navigation = useNavigation(); // Corrected this to only use one useNavigation


//   const pickDocument = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: '*/*', // Accept any file type
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled) {
//         Alert.alert('File selection canceled', 'Please select a valid file.');
//         return;
//       }

//       if (result.assets && result.assets.length > 0) {
//         const file = result.assets[0];
//         setHomeworkMedia(prevMedia => [...prevMedia, file]);
//         const fileNames = file.name || file.uri.split('/').pop();
//         setSelectedFilesText(prevText => (prevText === 'No file chosen' ? fileNames : `${prevText}, ${fileNames}`));
//       } else {
//         Alert.alert('File selection error', 'No valid file was selected.');
//       }
//     } catch (err) {
//       console.error('Error picking document:', err);
//       Alert.alert('Error picking document', 'Please try again.');
//     }
//   };

//   const validateAndUpload = async () => {
//     if (!classInput || !sectionInput || !subjectInput || !descriptionInput || homeworkMedia.length === 0) {
//       Alert.alert('Please fill all fields and select media files.');
//       return;
//     }

//     setIsUploading(true);
//     const formData = new FormData();
//     homeworkMedia.forEach(file => {
//       formData.append('homework_file', {
//         uri: file.uri,
//         name: file.name,
//         type: file.mimeType || 'application/octet-stream',
//       });
//     });

//     formData.append('class_name', classInput);
//     formData.append('section', sectionInput);
//     formData.append('subject', subjectInput);
//     formData.append('description', descriptionInput);
//     formData.append('date', date.toISOString().split('T')[0]);

//     try {
//       const response = await fetch('http://192.168.0.104:5000/api/upload-homework', {
//         method: 'POST',
//         body: formData,
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         Alert.alert('Success', result.message || 'Files uploaded successfully!');
//         setClassInput('');
//         setSectionInput('');
//         setSubjectInput('');
//         setDescriptionInput('');
//         setHomeworkMedia([]);
//         setSelectedFilesText('No file chosen');
//       } else {
//         Alert.alert('Error', result.message || 'Upload failed. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       Alert.alert('Upload Error', 'There was an error uploading your files. Please try again.');
//     }

//     setIsUploading(false);
//   };

//   const fetchHomeworkList = async () => {
//     setIsLoading(true);
//     try {
//       const formattedDate = date.toISOString().split('T')[0];
//       const response = await fetch(`http://192.168.0.104:5000/api/homework-list?date=${formattedDate}`);
//       const result = await response.json();
//       if (response.ok) {
//         setHomeworkList(result);
//       } else {
//         Alert.alert('Error fetching homework list', result.message || 'Please try again.');
//       }
//     } catch (error) {
//       console.error('Error fetching homework list:', error);
//       Alert.alert('Error fetching homework', 'There was an error fetching the homework list. Please try again.');
//     }
//     setIsLoading(false);
//   };

//   // Function to determine MIME type if missing
//   const getMimeType = (fileData) => {
//     // Check the file data format to identify the type
//     if (fileData.startsWith('/9j')) return 'image/jpeg'; // Common base64 header for JPEG images
//     if (fileData.startsWith('JVBER')) return 'application/pdf'; // Common header for PDF files
//     return 'application/octet-stream'; // Default binary type if unknown
//   };

//   const viewDocument = async (base64Data, mimeType) => {
//     try {
//       const detectedMimeType = mimeType || getMimeType(base64Data);
//       const fileExtension = detectedMimeType.split('/')[1];
//       const fileUri = FileSystem.documentDirectory + `tempDocument.${fileExtension}`;

//       await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
//       await Sharing.shareAsync(fileUri);
//     } catch (error) {
//       console.error('Error opening document:', error);
//       Alert.alert('Error', 'There was a problem opening the document.');
//     }
//   };

//   return (
//     <View style={styles.mobileFrame}>
//       {/* Header Section */}
//       <View style={[styles.Header, { flexDirection: 'row', justifyContent: 'space-between' }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Icon name="home" type="material" size={60} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.emptyHeader} />
//       <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
//         <Text style={styles.mainHeading}>Teacher Homework Upload</Text>
//       </View>

//       <TextInput style={styles.textInput} placeholder="Class" value={classInput} onChangeText={setClassInput} />
//       <TextInput style={styles.textInput} placeholder="Section" value={sectionInput} onChangeText={setSectionInput} />
//       <TextInput style={styles.textInput} placeholder="Subject" value={subjectInput} onChangeText={setSubjectInput} />
//       <TextInput style={styles.textInput} placeholder="Description" value={descriptionInput} onChangeText={setDescriptionInput} />
//       <TouchableOpacity onPress={pickDocument} style={styles.filePickerButton}>
//         <Text style={styles.filePickerText}>{selectedFilesText}</Text>
//       </TouchableOpacity>
//       <Button title={isUploading ? 'Uploading...' : 'Upload Homework'} onPress={validateAndUpload} disabled={isUploading} />

//       <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
//         <Text style={styles.datePickerText}>Select Date: {date.toDateString()}</Text>
//       </TouchableOpacity>

//       {showDatePicker && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) => {
//             const currentDate = selectedDate || date;
//             setShowDatePicker(false);
//             setDate(currentDate);
//           }}
//         />
//       )}

//       <Button title="Fetch Homework List" onPress={fetchHomeworkList} disabled={isLoading} />

//       <FlatList
//         data={homeworkList}
//         renderItem={({ item }) => (
//           <View style={styles.listItem}>
//             <Text>Class: {item.class_name}</Text>
//             <Text>Section: {item.section}</Text>
//             <Text>Subject: {item.subject}</Text>
//             <Text>Description: {item.description}</Text>
//             <Text>Upload Date: {new Date(item.date).toLocaleDateString()}</Text>

//             {item.homework_file && (
//               <TouchableOpacity onPress={() => viewDocument(item.homework_file, item.mimeType)}>
//                 <Text style={styles.documentText}>View Document</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//       />

//       <Modal visible={imageModalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <Image source={{ uri: selectedImageUri }} style={styles.fullImage} />
//           <Button title="Close" onPress={() => setImageModalVisible(false)} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   Header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180,182)',
//     paddingVertical: 10,
//     height: 90,
//     paddingHorizontal: 15,
//     marginTop: 45,
//   },


//   logo: {
//     width: 100,
//     height: 50,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   mobileFrame: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     paddingTop: 0, // set paddingTop to 0
//     marginTop: -40, // set marginTop to -40 (or the height of your header)
//   },
//   emptyHeader: {
//     height: 30,
//     backgroundColor: 'rgb(160, 180, 182)',
//     marginTop: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 2,
//   },

//   mainHeader: {
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   mainHeading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//   },
//   filePickerButton: {
//     backgroundColor: '#007BFF',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   filePickerText: {
//     color: '#FFF',
//   },
//   datePickerButton: {
//     backgroundColor: '#28A745',
//     padding: 10,
//     borderRadius: 5,
//     marginVertical: 5,
//   },
//   datePickerText: {
//     color: '#FFF',
//   },
//   listItem: {
//     padding: 10,
//     marginVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   documentText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//   },
//   fullImage: {
//     width: '90%',
//     height: '80%',
//     resizeMode: 'contain',
//   },
// });

// export default TeacherHomeworkUpload;



import React, { useState, useEffect } from 'react';
import { Icon } from 'react-native-elements';
import {
  View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity, Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//  import DocumentPicker from 'react-native-document-picker';


const TeacherHomeworkUpload = () => {
  const [classInput, setClassInput] = useState('');
  const [sectionInput, setSectionInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [homeworkMedia, setHomeworkMedia] = useState([]);
  const [selectedFilesText, setSelectedFilesText] = useState('No file chosen');
  const [isUploading, setIsUploading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const navigation = useNavigation();


  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your gallery to pick an image.');
    }
  };
  
  useEffect(() => {
    requestPermission();
  }, []);



  
  const pickDocument = async () => {
    try {
      // Log to confirm the picker is triggered
      console.log('Document picker triggered');
      
      // Launch the document picker
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });
      // Log the result to debug
      console.log('Document Picker Result:', result);
  
      // If the user canceled the picker, show an alert
      if (result.type === 'cancel') {
        Alert.alert('No document selected', 'You have not selected any document.');
        return;
      }
  
      // Access the document file from result
      const file = result.assets[0];  // Accessing the first asset (file)
  
      if (file && file.uri) {
        const fileName = file.name || file.uri.split('/').pop();  // Extract filename
        const fileType = file.mimeType || 'application/octet-stream';  // Use mimeType or fallback
  
        // Log file details for debugging
        console.log('Selected file details:', { uri: file.uri, fileName, fileType });
  
        // Update state with the selected document
        setHomeworkMedia(prevMedia => [
          ...prevMedia,
          { uri: file.uri, name: fileName, type: fileType }
        ]);
  
        // Update the file name display text
        setSelectedFilesText(fileName); // Update the text input with the file name
      }
    } catch (error) {
      // Log any errors and show an alert
      console.error('Error picking document:', error);
      Alert.alert('Error', 'There was an issue selecting a document. Please try again.');
    }
  };

  

  
  // Pick an image
 // Function to pick an image from the gallery
 const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Use MediaTypeOptions.Images for picking images
      allowsEditing: true, // Optional: allows the user to crop/adjust the image
      quality: 1, // High-quality image
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri; // Access the first asset (modern API)
      const fileName = fileUri.split('/').pop();

      setHomeworkMedia(prevMedia => [
        ...prevMedia,
        { uri: fileUri, name: fileName, type: 'image/jpeg' }
      ]);
      setSelectedFilesText(fileName);
    } else {
      Alert.alert('No image selected', 'Please select an image from the gallery.');
    }
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'There was an issue picking an image. Please try again.');
  }
};


const takePhoto = async () => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your camera to take a photo.');
      return;
    }

    // Launch the camera
    const result = await ImagePicker.launchCameraAsync({
      quality: 1, // Full quality image
      allowsEditing: true, // Enable editing if required
      base64: false, // Set to true if you need the base64 string of the image
    });

    // Handle the result
    if (!result.canceled) {
      const fileUri = result.assets[0].uri; // Get the URI of the captured image
      const fileName = fileUri.split('/').pop(); // Extract the file name

      setHomeworkMedia(prevMedia => [
        ...prevMedia,
        { uri: fileUri, name: fileName, type: 'image/jpeg' } // Add captured image to state
      ]);

      setSelectedFilesText(fileName); // Update the UI with the file name
    } else {
      Alert.alert('No photo taken', 'Please take a photo to proceed.');
    }
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'There was an issue taking the photo. Please try again.');
  }
};


  // Validate and upload the homework
  const uploadHomework = async () => {
    if (!classInput || !sectionInput || !subjectInput || !descriptionInput || homeworkMedia.length === 0) {
      Alert.alert('Please fill all fields and select media files.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();

    // Append all selected files
    homeworkMedia.forEach(file => {
      formData.append('homework_file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
    });

    formData.append('class_name', classInput);
    formData.append('section', sectionInput);
    formData.append('subject', subjectInput);
    formData.append('description', descriptionInput);
    formData.append('date', date.toISOString().split('T')[0]);

    try {
      const response = await fetch('http://50.6.194.240:5000/api/upload-homework', {
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
        setClassInput('');
        setSectionInput('');
        setSubjectInput('');
        setDescriptionInput('');
        setHomeworkMedia([]);
        setSelectedFilesText('No file chosen');
      } else {
        Alert.alert('Error', result.message || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      Alert.alert('Upload Error', 'There was an error uploading your files. Please try again.');
    }

    setIsUploading(false);
  };

  // Show Date Picker+
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.mobileFrame}>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

      <View style={styles.space}></View>
     <View >
        <Text >Teacher Homework Upload</Text>
      </View>

      <TextInput style={styles.textInput} placeholder="Class" value={classInput} onChangeText={setClassInput} />
      <TextInput style={styles.textInput} placeholder="Section" value={sectionInput} onChangeText={setSectionInput} />
      <TextInput style={styles.textInput} placeholder="Subject" value={subjectInput} onChangeText={setSubjectInput} />
      <TextInput style={styles.textInput} placeholder="Description" value={descriptionInput} onChangeText={setDescriptionInput} />

      {/* File Input with Icons */}
      <View style={styles.fileInputWrapper}>
        <TextInput
          style={styles.fileInput}
          placeholder="Attach files (Document, Image, Camera)"
          editable={false} // Makes the input non-editable
          value={selectedFilesText}
        />
        <View style={styles.iconsContainer}>
          <TouchableOpacity onPress={pickDocument} style={styles.iconButton}>
            <Icon name="insert-drive-file" type="material" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
            <Icon name="camera-alt" type="material" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
            <Icon name="image" type="material" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
  onPress={uploadHomework} 
  style={[styles.uploadButton, { backgroundColor: 'rgb(160, 180, 182)' }]} 
  disabled={isUploading} // Disable when uploading
>
  <Text style={styles.uploadButtonText}>
    {isUploading ? 'Uploading...' : 'Upload Homework'}
  </Text>
</TouchableOpacity>

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
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
  space:{
    height:hp('5%')

  },

  textInput: {
    marginBottom: hp('1%'), // Responsive margin
    padding: wp('3%'),      // Responsive padding
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: wp('4%'),     // Responsive font size
  },
  fileInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  fileInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: wp('3%'),
    width: wp('65%'),  // Responsive width
    fontSize: wp('4%'), // Responsive font size
  },
  iconsContainer: {
    position: 'absolute',
    top: hp('1%'),
    right: wp('2%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('25%'),  // Responsive width for icon container
  },
  iconButton: {
    padding: wp('2%'),
  },
  datePickerButton: {
    padding: wp('3%'),
    backgroundColor: 'rgb(160, 180, 182)', // Same background color
    borderRadius: 5,
    marginVertical: hp('1.5%'),
  },
  datePickerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp('4%'),  // Responsive font size
  },
  uploadButton: {
    paddingVertical: hp('1.5%'),  // Responsive padding
    borderRadius: 5,
    marginVertical: hp('1.5%'),   // Responsive margin
    backgroundColor: 'rgb(160, 180, 182)', // Consistent color
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp('4.5%'),  // Responsive font size
    fontWeight: 'bold',
  },
});

export default TeacherHomeworkUpload;