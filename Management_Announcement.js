// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Modal,

//   ActivityIndicator
// } from 'react-native';

// import { TextInput } from 'react-native';

// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { useNavigation } from '@react-navigation/native';


// const NotificationsScreens = () => {
//   const [notificationText, setNotificationText] = useState('');
//   const [title, setTitle] = useState('');
//   const [date, setDate] = useState(new Date()); // Default to today's date
//   const [recipient, setRecipient] = useState('');
//   const [priority, setPriority] = useState('');
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false); // Loading state
//   const maxChars = 200; // Character limit for notification text

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const savedNotifications = JSON.parse(await AsyncStorage.getItem('notifications')) || [];
//       setNotifications(savedNotifications);
//     };
//     fetchNotifications();
//   }, []);
//   const handleSubmit = async () => {
//     if (!title.trim() || !notificationText.trim() || !date || !recipient.trim() || !priority.trim()) {
//       Alert.alert('Input Required', 'Please fill in all fields before submitting.');
//       return;
//     }
  
//     // Format the date as 'YYYY-MM-DD'
//     const formattedDate = date.toISOString().split('T')[0]; // Ensure it's formatted as 'YYYY-MM-DD'
  
//     setLoading(true);
  
//     try {
//       const response = await fetch('http://50.6.194.240:5000/api/submit-notification', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           title,
//           notificationText,
//           date: formattedDate, // Ensure date format is consistent
//           recipient,
//           priority,
//         }),
//       });
  
//       if (!response.ok) {
//         const responseText = await response.text(); // Get response as text for debugging
//         console.error('Error response:', responseText);
//         throw new Error('Error: ' + responseText);
//       }
  
//       const result = await response.json(); // Parse JSON response
//       Alert.alert('Success', result.message);
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', error.message || 'There was an error submitting your notification.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigation = useNavigation();
  
  
//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.mainHeader}>
      
//       <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                         <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//                     </TouchableOpacity>
//                     <View style={{ flex: 1 }} />
//                     <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//                         <Icon name="home" type="material" size={60} color="#000" />
//                     </TouchableOpacity>
//                 </View>
//       {/* Sub-header */}
//       <View style={styles.subHeaderContainer}>
//         <Text style={styles.subHeaderText}></Text>
//       </View>

//       {/* Text under the sub-header */}
//       <View style={styles.alertNotificationContainer}>
//         <Text style={styles.alertNotificationText}>ALERT ANNOUNCEMENT</Text>
//       </View>

//       {/* Main Container */}
//       <View style={styles.mainContainer}>
//         {/* Inputs */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter title here..."
//             value={title}
//             onChangeText={setTitle}
//           />
//         </View>

//         {/* Recipient Dropdown */}
//         <View style={styles.inputContainer}>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={recipient}
//               onValueChange={(itemValue) => setRecipient(itemValue)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Notification For" value="" enabled={false} />
//               <Picker.Item label="Students" value="Students" />
//               <Picker.Item label="Staff" value="Staff" />
//               <Picker.Item label="Both (Students & Staff)" value="Both" />
//             </Picker>
//           </View>
//         </View>

//         {/* Priority Dropdown */}
//         <View style={styles.inputContainer}>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={priority}
//               onValueChange={(itemValue) => setPriority(itemValue)}
//               style={styles.picker}
//             >
//               <Picker.Item label="Priority Level" value="" enabled={false} />
//               <Picker.Item label="High" value="High" />
//               <Picker.Item label="Medium" value="Medium" />
//               <Picker.Item label="Low" value="Low" />
//             </Picker>
//           </View>
//         </View>

//         {/* Notification Text */}
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your notification here..."
//             value={notificationText}
//             onChangeText={setNotificationText}
//             maxLength={maxChars}
//           />
//           <Text style={styles.charCount}>{notificationText.length}/{maxChars} characters</Text>
//         </View>

//         {/* Date Picker Button */}
//         <View style={styles.datePickerContainer}>
//           <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
//             <Text style={styles.datePickerButtonText}>Select Date</Text>
//           </TouchableOpacity>
//           {/* Display the selected date */}
//           <Text style={styles.selectedDateText}>{date.toDateString()}</Text>
//         </View>

//         {/* DateTimePicker */}
//         {showDatePicker && (
//           <DateTimePicker
//             value={date}
//             mode="date"
//             display="default"
//             onChange={(event, selectedDate) => {
//               setShowDatePicker(false);
//               if (selectedDate) {
//                 setDate(selectedDate);
//               }
//             }}
//           />
//         )}
//       </View>

//       {/* Buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.previewButton} onPress={() => setPreviewVisible(true)}>
//           <Text style={styles.previewButtonText}>Preview</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Submit</Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Preview Modal */}
//       {previewVisible && (
//         <Modal visible={previewVisible} animationType="slide" transparent>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalBox}>
//               <Text style={styles.modalTitle}>Notification Preview</Text>
//               <Text style={styles.modalText}>Title: {title}</Text>
//               <Text style={styles.modalText}>Message: {notificationText}</Text>
//               <Text style={styles.modalText}>Date: {date?.toDateString()}</Text>
//               <Text style={styles.modalText}>Recipient: {recipient}</Text>
//               <Text style={styles.modalText}>Priority: {priority}</Text>
//               <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.closeModalButton}>
//                 <Text style={styles.closeModalButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f9f9f9', padding: 16 },
//   mainHeader: { backgroundColor: '#AABEC3', justifyContent: 'space-between', alignItems: 'center', height: 110 },
//   logo: { width: 60, height: 60, resizeMode: 'contain' },
//   subHeaderContainer: {
//     marginTop: 10, // Add some space between the header and the sub-header
//     marginBottom: 10, // Add space between the sub-header and the alert text
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#ddd',
//     backgroundColor: '#AABEC3',
//     height: 20,
//   },
//   alertNotificationContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   mainHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1.5%'),  // Responsive padding
//     paddingHorizontal: wp('4%'),  // Responsive padding
//     height: hp('12%'),  // Responsive height
//     marginBottom: wp('3%'),  // Responsive margin bottom
//   },
//   alertNotificationText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   mainContainer: {
//     marginBottom: 20,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   input: {
//     width: '100%',
//     borderWidth: 2,
//     borderColor: '#AABEC3',
//     borderRadius: 10,
//     padding: 10,
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   pickerContainer: {
//     width: '100%',
//     borderWidth: 2,
//     borderColor: '#AABEC3',
//     borderRadius: 10,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//   },
//   charCount: {
//     alignSelf: 'flex-end',
//     marginRight: 15,
//     color: '#555',
//   },
//   datePickerContainer: {
//     marginBottom: 15,
//   },
//   datePickerButton: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#D3D3D3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   datePickerButtonText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   selectedDateText: {
//     marginTop: 5,
//     color: '#333',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 20,
//   },
//   previewButton: {
//     width: 100,
//     height: 40,
//     backgroundColor: '#AABEC3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   previewButtonText: {
//     color: '#fff',
//   },
//   submitButton: {
//     width: 100,
//     height: 40,
//     backgroundColor: '#AABEC3',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   submitButtonText: {
//     color: 'black',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalBox: {
//     width: 300,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 10,
//   },
//   closeModalButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#AABEC3',
//     borderRadius: 10,
//   },
//   closeModalButtonText: {
//     color: '#fff',
//     textAlign: 'center',
//   },
// });



// export default NotificationsScreens;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Header } from 'react-native-elements';
import { TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NotificationsScreen = () => {
  const [notificationText, setNotificationText] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date()); // Default to today's date
  const [recipient, setRecipient] = useState('');
  const [priority, setPriority] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const maxChars = 200; // Character limit for notification text

  useEffect(() => {
    const fetchNotifications = async () => {
      const savedNotifications = JSON.parse(await AsyncStorage.getItem('notifications')) || [];
      setNotifications(savedNotifications);
    };
    fetchNotifications();
  }, []);
  const handleSubmit = async () => {
    if (!title.trim() || !notificationText.trim() || !date || !recipient.trim() || !priority.trim()) {
      Alert.alert('Input Required', 'Please fill in all fields before submitting.');
      return;
    }
  
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = date.toISOString().split('T')[0]; // Ensure it's formatted as 'YYYY-MM-DD'
  
    setLoading(true);
  
    try {
      const response = await fetch('http://50.6.194.240:5000/submit-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          notificationText,
          date: formattedDate, // Ensure date format is consistent
          recipient,
          priority,
        }),
      });
  
      if (!response.ok) {
        const responseText = await response.text(); // Get response as text for debugging
        console.error('Error response:', responseText);
        throw new Error('Error: ' + responseText);
      }
  
      const result = await response.json(); // Parse JSON response
      Alert.alert('Success', result.message);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.message || 'There was an error submitting your notification.');
    } finally {
      setLoading(false);
    }
  };
   const navigation=useNavigation();
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.mainHeader}>
      
            <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
            <Image
                source={require('./assets/images/slides/logo226.png')}
                style={styles.logo}
            />
        </TouchableOpacity>
      
          <TouchableOpacity onPress={() =>  navigation.navigate('ManageDashboard')}>
            <Ionicons name="home" size={wp('10%')} color="#000" />
          </TouchableOpacity>
        
      </View>

      {/* Sub-header */}
      <View style={styles.subHeaderContainer}>
        <Text style={styles.subHeaderText}></Text>
      </View>

      {/* Text under the sub-header */}
      <View style={styles.alertNotificationContainer}>
        <Text style={styles.alertNotificationText}>ALERT ANNOUNCEMENT</Text>
      </View>

      {/* Main Container */}
      <View style={styles.mainContainer}>
        {/* Inputs */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter title here..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Recipient Dropdown */}
        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={recipient}
              onValueChange={(itemValue) => setRecipient(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Notification For" value="" enabled={false} />
              <Picker.Item label="Students" value="Students" />
              <Picker.Item label="Staff" value="Staff" />
              <Picker.Item label="Both (Students & Staff)" value="Both" />
            </Picker>
          </View>
        </View>

        {/* Priority Dropdown */}
        <View style={styles.inputContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={priority}
              onValueChange={(itemValue) => setPriority(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Priority Level" value="" enabled={false} />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="Low" value="Low" />
            </Picker>
          </View>
        </View>

        {/* Notification Text */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your notification here..."
            value={notificationText}
            onChangeText={setNotificationText}
            maxLength={maxChars}
          />
          <Text style={styles.charCount}>{notificationText.length}/{maxChars} characters</Text>
        </View>

        {/* Date Picker Button */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.datePickerButtonText}>Select Date</Text>
          </TouchableOpacity>
          {/* Display the selected date */}
          <Text style={styles.selectedDateText}>{date.toDateString()}</Text>
        </View>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.previewButton} onPress={() => setPreviewVisible(true)}>
          <Text style={styles.previewButtonText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Preview Modal */}
      {previewVisible && (
        <Modal visible={previewVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Notification Preview</Text>
              <Text style={styles.modalText}>Title: {title}</Text>
              <Text style={styles.modalText}>Message: {notificationText}</Text>
              <Text style={styles.modalText}>Date: {date?.toDateString()}</Text>
              <Text style={styles.modalText}>Recipient: {recipient}</Text>
              <Text style={styles.modalText}>Priority: {priority}</Text>
              <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.closeModalButton}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9'},
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1.5%'),  // Responsive padding
    paddingHorizontal: wp('4%'),  // Responsive padding
    height: hp('12%'),  // Responsive height
    marginBottom: wp('3%'),  // Responsive margin bottom/ Responsive margin
  },
  logo: {
    width: wp('15%'),  // Responsive width
    height: wp('15%'),  // Responsive height
  },
  subHeaderContainer: {
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1%'),  // Responsive padding
    alignItems: 'center',
    height: hp('3%'), 
  },
  alertNotificationContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  alertNotificationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mainContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#AABEC3',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#AABEC3',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  charCount: {
    alignSelf: 'flex-end',
    marginRight: 15,
    color: '#555',
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePickerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  datePickerButtonText: {
    color: '#000',
    fontSize: 16,
  },
  selectedDateText: {
    marginTop: 5,
    color: '#333',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  previewButton: {
    width: 100,
    height: 40,
    backgroundColor: '#AABEC3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  previewButtonText: {
    color: '#fff',
  },
  submitButton: {
    width: 100,
    height: 40,
    backgroundColor: '#AABEC3',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#AABEC3',
    borderRadius: 10,
  },
  closeModalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default NotificationsScreen;