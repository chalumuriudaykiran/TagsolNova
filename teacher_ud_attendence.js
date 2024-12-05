// import React, { useState, useContext,useEffect } from 'react';
// import { View, Text, Button, TouchableOpacity, StyleSheet, Image, ScrollView, Modal,Alert } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigation } from '@react-navigation/native';
// import { UserContext } from './UserContext';
// import * as Notifications from 'expo-notifications';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';




// const TeacherAttendance = () => {
//   const { username } = useContext(UserContext);
//   const [selectedClass, setSelectedClass] = useState('');
//   const [selectedSection, setSelectedSection] = useState('');
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState({});
//   const [studentsLoaded, setStudentsLoaded] = useState(false);
//   const [leaveModalVisible, setLeaveModalVisible] = useState(false);
//   const [classInfo, setClassInfo] = useState(null);
//   const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
//   const [leaveTypes, setLeaveTypes] = useState(students.map(() => null));
//   const [notifications, setNotifications] = useState([]);

  
//   const navigation = useNavigation();




//   useEffect(() => {
//     const subscription = Notifications.addNotificationReceivedListener(notification => {
//       setNotifications(prevNotifications => [...prevNotifications, notification]);
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   const requestPermissionAndGetToken = async () => {
//     const { status } = await Notifications.requestPermissionsAsync();
//     if (status === 'granted') {
//       const token = await Notifications.getExpoPushTokenAsync();
//       console.log("Generated Push Token:", token.data);  // Log the token value
//       return token.data;  // Return the actual token string
//     } else {
//       console.log("Permission denied");
//       return null;  // Return null if permission is denied
//     }
//   };
//   requestPermissionAndGetToken();





//   const loadStudents = async () => {
//     try {
//       const response = await fetch('http://50.6.194.240:5000/api/student', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ className: selectedClass, section: selectedSection }),
//       });

//       console.log('Response Status:', response.status);
//       if (response.status === 404) {
//         console.error('Route not found');
//       }

//       const data = await response.json();
//       if (data && data.length > 0) {
//         setStudents(data);
//         setAttendance({});
//         setStudentsLoaded(true);
//       } else {
//         console.error('Error: No students data received');
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error);
//     }
//   };

//   console.log(`Logged in as: ${username}`);


  


//   const fetchStudentData = async () => {
//     try {
//         const response = await fetch(`http://50.6.194.240:5000/studentname?username=${username}`);
//         const data = await response.json();
  
//         if (data.message === 'Student profile not found') {
//             setClassInfo(null);
//             console.error('No student profile found for this username');
//         } else if (data.data) {
//             setClassInfo(data.data); // Set class_name and section from response
//         }
//     } catch (error) {
//         console.error('Error fetching student data:', error);
//     }
// };


// useEffect(() => {
//   if (username) {
//       fetchStudentData();
//   } else {
//       console.error('Username is missing');
//   }
// }, [username]);
 

//   const updateClassSection = async (classValue, sectionValue) => {
//     try {
//       console.log('data sent to update class section',{username,
//         className:classValue,
//         section: sectionValue,
//       });
//       const response = await fetch('http://50.6.194.240:5000/update-class-section', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           username,
//           className: classValue,
//           section: sectionValue,
//         }),
//       });
  
//       if (response.ok) {
//         console.log('Class and Section updated successfully');
//       } else {
//         console.error('Error updating class and section');
//       }
//     } catch (error) {
//       console.error('Error updating class and section:', error);
//     }
//   };



//   const handleStudentIconClick = (index) => {
//     const currentStatus = attendance[index];
//     if (currentStatus === 'present') {
//       setAttendance({ ...attendance, [index]: 'absent' });
//       setSelectedStudentIndex(index);
//       setLeaveModalVisible(true);
//     } else if (currentStatus === 'absent') {
//       setAttendance({ ...attendance, [index]: null });
//       setLeaveTypes((prev) => {
//         const updatedLeaveTypes = [...prev];
//         updatedLeaveTypes[index] = null; // Clear leave type
//         return updatedLeaveTypes;
//       });
//     } else {
//       setAttendance({ ...attendance, [index]: 'present' });
//     }
//   };
  
//   const handleLeaveOption = (leaveType) => {
//     // Update leave type for the selected student
//     const updatedLeaveTypes = [...leaveTypes];
//     updatedLeaveTypes[selectedStudentIndex] = leaveType; // Store the selected leave type
//     setLeaveTypes(updatedLeaveTypes);
//     setLeaveModalVisible(false);
//   };







  

// const submitAttendance = async () => {
//   // Check for incomplete attendance (null values)
//   const incompleteStudents = students.filter((_, index) => attendance[index] === null);
//   if (incompleteStudents.length > 0) {
//     alert('Please mark attendance for all students.');
//     return;
//   }

//   // Filter out students who have attendance marked
//   const selectedStudents = students.filter((_, index) => attendance[index] !== null);

//   // Prepare the students' data to be submitted
//   const studentsData = await Promise.all(
//     selectedStudents.map(async (student, index) => {
//       const pushToken = await  requestPermissionAndGetToken();;
//       const validPushToken = pushToken || "mock_token"; // Use mock_token for testing on emulator
//       return {
//         name: student.name,
//         section: selectedSection,
//         className: selectedClass,
//         leaves: attendance[index] === 'present'
//           ? 'Present'
//           : leaveTypes[index] || 'Absent', // Default to 'Absent' if leave type is not provided
//         push_token: validPushToken // Include the valid or fallback push token
//       };
//     })
//   )

//   console.log('Students data for attendance:', studentsData);

//   // Prepare the data to send to the backend
//   const data = {
//     className: selectedClass,
//     section: selectedSection,
//     students: studentsData,
//     username: classInfo.name,  // Teacher's username
//   };

//   try {
//     // Send attendance data to the server
//     const response = await fetch('http://50.6.194.240:5000/api/submit_attendance', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       alert('Attendance submitted successfully');

//       // Filter out students marked as 'Absent' or on leave for notifications
//       const studentsOnLeave = studentsData.filter(student => student.leaves !== 'Present');

//       if (studentsOnLeave.length > 0) {
//         // Send notification only for students who are marked as 'Absent' or on leave
//         for (let student of studentsOnLeave) {
//           const message = `${student.name}, you have been marked as ${student.leaves} today.`;
//           await sendPushNotification(student.push_token, message);
//         }
//         alert('Notifications sent successfully');
//       } else {
//         console.log('No students on leave, no notifications sent.');
//       }

//     } else {
//       console.error('Error submitting attendance:', response.status);
//       alert('Failed to submit attendance!');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     alert('Failed to submit attendance!');
//   }
// };

// // Send push notification to a student
// const sendPushNotification = async (pushToken, message) => {
//   const messageBody = {
//     to: pushToken, 
//     sound: 'default',
//     title: 'Attendance Notification',
//     body: message,
//   };

//   try {
//     const response = await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(messageBody),
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to send notification');
//     }

//     const data = await response.json();
//     console.log('Notification sent successfully:', data);
//   } catch (error) {
//     console.error('Error sending notification:', error);
//   }
// };
// const renderNotifications = () => {
//   return (
//     <View style={styles.notificationContainer}>
//       {notifications.map((notification, index) => (
//         <View key={index} style={styles.notificationItem}>
//           <Text>{notification.request.content.title}</Text>
//           <Text>{notification.request.content.body}</Text>
//         </View>
//       ))}
//     </View>
//   );
// };

//   const renderStudentGrid = () => {
//     return (
//       <View style={styles.gridContainer}>
//         {students.map((student, index) => (
//           <View key={index} style={styles.studentContainer}>
//             <TouchableOpacity
//               onPress={() => handleStudentIconClick(index)}
//               style={[
//                 styles.studentIcon,
//                 attendance[index] === 'present'
//                   ? styles.presentIcon
//                   : attendance[index] === 'absent'
//                   ? styles.absentIcon
//                   : styles.defaultIcon,
//               ]}
//             >
//               <Icon name="person" size={30} color={attendance[index] ? "#fff" : "gray"} />
//             </TouchableOpacity>
//             <Text style={styles.studentName}>{student.name}</Text>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.mobileFrame}>
//       <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Icon name="home" size={wp('10%')} color="#000" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.subHeader}>
//                 <Text style={styles.subHeaderText}></Text>
//             </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={{ padding: 20 }}>
//           <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Select Class and Section</Text>

//           <Text style={{ fontWeight: 'bold' }}>Class:</Text>
//           <Picker
//            style={styles.picker}
//            selectedValue={selectedClass}
//            onValueChange={(classValue) => {
//              setSelectedClass(classValue);
//              setStudentsLoaded(false);
//              setAttendance({});
//              // Call updateClassSection only if both class and section are selected
//              if (classValue && selectedSection) {
//                updateClassSection( classValue, selectedSection);
//              }
//            }}
//           >
//             <Picker.Item label="Select Class" value="" />
//             {Array.from({ length: 10 }, (_, i) => (
//               <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
//             ))}
//           </Picker>

//           <Text style={{ fontWeight: 'bold' }}>Section:</Text>
//           <Picker
//              style={styles.picker}
//              selectedValue={selectedSection}
//              onValueChange={(sectionValue) => {
//                setSelectedSection(sectionValue);
//                setStudentsLoaded(false);
//                setAttendance({});
//                // Call updateClassSection only if both class and section are selected
//                if (selectedClass && sectionValue) {
//                  updateClassSection(selectedClass, sectionValue);
//                }
//              }}
//           >
//             <Picker.Item label="Select Section" value="" />
//             {['A', 'B', 'C', 'D', 'E'].map((section) => (
//               <Picker.Item key={section} label={section} value={section} />
//             ))}
//           </Picker>
//         </View>

//         <Button title="Load Students" onPress={loadStudents} disabled={!selectedClass || !selectedSection} color="rgb(160, 180,182)" />

//         {studentsLoaded && (
//           <View style={{ marginTop: 20 }}>
//             <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Student List</Text>
//             {renderStudentGrid()}
//             {renderNotifications()}
//             <Button title="Submit Attendance" onPress={submitAttendance} color="rgb(160, 180,182)" />
//           </View>
//         )}
//       </ScrollView>

//       <Modal visible={leaveModalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Leave Type</Text>
//             <TouchableOpacity onPress={() => handleLeaveOption('Informed')}>
//               <Text style={styles.leaveOption}>Informed Leave</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleLeaveOption('UnInformed')}>
//               <Text style={styles.leaveOption}>UnInformed Leave</Text>
//             </TouchableOpacity>
//             <Button title="Cancel" onPress={() => setLeaveModalVisible(false)} color="rgb(160, 180,182)" />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   mainHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1.5%'),  // Responsive padding
//     paddingHorizontal: wp('4%'),  // Responsive padding
//     height: hp('12%'),  // Responsive height
//     marginBottom: wp('3%'),  //
//   },
//   logo: {
//     width: wp('15%'),  // Responsive width
//     height: wp('15%'), 
//   },subHeader: {
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1%'),  // Responsive padding
//     alignItems: 'center',
//     height: hp('3%'),  // Responsive height
//   },
//   subHeaderText: {
//     fontSize: wp('5%'),  // Responsive font size
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },

//   notificationContainer: {
//     padding: 10,
//     marginTop: 20,
//   },
//   notificationItem: {
//     padding: 10,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 5,
//     marginBottom: 10,
//   },
//   mobileFrame: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
    
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   picker: {
//     marginVertical: 10,
//     padding: 10,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     backgroundColor: '#fff',
//     fontSize: 16,
//     color: '#333',
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   studentContainer: {
//     alignItems: 'center',
//     padding: 10,
//     margin: 5,
//     width: '30%',
//   },
//   studentIcon: {
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//     borderRadius: 50,
//     marginBottom: 5,
//   },
//   defaultIcon: {
//     backgroundColor: '#f0f0f0',
//   },
//   presentIcon: {
//     backgroundColor: 'green',
//   },
//   absentIcon: {
//     backgroundColor: 'red',
//   },
//   studentName: {
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   emptyHeader: {
//     height: 20,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContent: {
//     width: 300,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   leaveOption: {
//     fontSize: 16,
//     color: '#007bff',
//     marginBottom: 10,
//   },
// });

// export default TeacherAttendance;



import React, { useState, useContext } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Image, ScrollView, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from './UserContext';

const TeacherAttendance = () => {
  const { username } = useContext(UserContext);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
  const [leaveTypes, setLeaveTypes] = useState(students.map(() => null));

  
  const navigation = useNavigation();


  const loadStudents = async () => {
    try {
      const response = await fetch('http://50.6.194.240:5000/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className: selectedClass, section: selectedSection }),
      });

      console.log('Response Status:', response.status);
      if (response.status === 404) {
        console.error('Route not found');
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setStudents(data);
        setAttendance({});
        setStudentsLoaded(true);
      } else {
        console.error('Error: No students data received');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  console.log(`Logged in as: ${username}`);

 

  const updateClassSection = async (classValue, sectionValue) => {
    try {
      console.log('data sent to update class section',{username,
        className:classValue,
        section: sectionValue,
      });
      const response = await fetch('http://50.6.194.240:5000/update-class-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          className: classValue,
          section: sectionValue,
        }),
      });
  
      if (response.ok) {
        console.log('Class and Section updated successfully');
      } else {
        console.error('Error updating class and section');
      }
    } catch (error) {
      console.error('Error updating class and section:', error);
    }
  };



  const handleStudentIconClick = (index) => {
    const currentStatus = attendance[index];
    if (currentStatus === 'present') {
      setAttendance({ ...attendance, [index]: 'absent' });
      setSelectedStudentIndex(index);
      setLeaveModalVisible(true);
    } else if (currentStatus === 'absent') {
      setAttendance({ ...attendance, [index]: null });
      setLeaveTypes((prev) => {
        const updatedLeaveTypes = [...prev];
        updatedLeaveTypes[index] = null; // Clear leave type
        return updatedLeaveTypes;
      });
    } else {
      setAttendance({ ...attendance, [index]: 'present' });
    }
  };
  
  const handleLeaveOption = (leaveType) => {
    // Update leave type for the selected student
    const updatedLeaveTypes = [...leaveTypes];
    updatedLeaveTypes[selectedStudentIndex] = leaveType; // Store the selected leave type
    setLeaveTypes(updatedLeaveTypes);
    setLeaveModalVisible(false);
  };
  
  // const submitAttendance = async () => {
  //   const incompleteStudents = students.filter((_, index) => attendance[index] === null);
  //   if (incompleteStudents.length > 0) {
  //     alert('Please mark attendance for all students.');
  //     return;
  //   }
  
  //   const selectedStudents = students.filter((_, index) => attendance[index] !== null);
  //   const studentsData = selectedStudents.map((student, index) => ({
 
  //     name: student.name,
  //     section: selectedSection,
  //     className: selectedClass,
  //     leaves: attendance[index] === 'present'
  //       ? 'Present'
  //       : leaveTypes[index] || 'Absent', // Use 'Informed' or 'UnInformed' instead of 'leave'
  //   }));
  //   console.log('Students data for attendance:', studentsData);
  
  //   const data = {
  //     className: selectedClass,
  //     section: selectedSection,
  //     students: studentsData,
  //     username:${username},
  //   };
  
  //   try {
  //     const response = await fetch('http://50.6.194.240:5000/api/submit-attendance', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });
  
  //     if (response.ok) {
  //       const result = await response.json();
  //       alert(result.message); // Show success message from the backend
  //   } else {
  //       const errorResult = await response.json();
  //       console.error('Error:', errorResult.message);
  //       alert(errorResult.message || 'Failed to submit attendance!');
  //   }
    
  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert('Failed to submit attendance!');
  //   }
  // };
  
  const submitAttendance = async () => {
    const incompleteStudents = students.filter((_, index) => attendance[index] === null);
    if (incompleteStudents.length > 0) {
      alert('Please mark attendance for all students.');
      return;
    }
  
    const selectedStudents = students.filter((_, index) => attendance[index] !== null);
    const studentsData = selectedStudents.map((student, index) => ({
      name: student.name,
      section: selectedSection,
      className: selectedClass,
      leaves: attendance[index] === 'present'
        ? 'Present'
        : leaveTypes[index] || 'Absent', // Use 'Informed' or 'UnInformed' instead of 'leave'
    }));
    console.log('Students data for attendance:', studentsData);
  
    const data = {
      className: selectedClass,
      section: selectedSection,
      students: studentsData,
    };
  
    try {
      const response = await fetch('http://50.6.194.240:5000/api/submit-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message from the backend
      } else {
        const errorResult = await response.json();
        console.error('Error:', errorResult.message);
        alert(errorResult.message || 'Failed to submit attendance!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit attendance!');
    }
  };
  

  const renderStudentGrid = () => {
    return (
      <View style={styles.gridContainer}>
        {students.map((student, index) => (
          <View key={index} style={styles.studentContainer}>
            <TouchableOpacity
              onPress={() => handleStudentIconClick(index)}
              style={[
                styles.studentIcon,
                attendance[index] === 'present'
                  ? styles.presentIcon
                  : attendance[index] === 'absent'
                  ? styles.absentIcon
                  : styles.defaultIcon,
              ]}
            >
              <Icon name="person" size={30} color={attendance[index] ? "#fff" : "gray"} />
            </TouchableOpacity>
            <Text style={styles.studentName}>{student.name}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.mobileFrame}>
      <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Icon name="home" size={60} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.emptyHeader} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Select Class and Section</Text>

          <Text style={{ fontWeight: 'bold' }}>Class:</Text>
          <Picker
           style={styles.picker}
           selectedValue={selectedClass}
           onValueChange={(classValue) => {
             setSelectedClass(classValue);
             setStudentsLoaded(false);
             setAttendance({});
             // Call updateClassSection only if both class and section are selected
             if (classValue && selectedSection) {
               updateClassSection( classValue, selectedSection);
             }
           }}
          >
            <Picker.Item label="Select Class" value="" />
            {Array.from({ length: 10 }, (_, i) => (
              <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
            ))}
          </Picker>

          <Text style={{ fontWeight: 'bold' }}>Section:</Text>
          <Picker
             style={styles.picker}
             selectedValue={selectedSection}
             onValueChange={(sectionValue) => {
               setSelectedSection(sectionValue);
               setStudentsLoaded(false);
               setAttendance({});
               // Call updateClassSection only if both class and section are selected
               if (selectedClass && sectionValue) {
                 updateClassSection(selectedClass, sectionValue);
               }
             }}
          >
            <Picker.Item label="Select Section" value="" />
            {['A', 'B', 'C', 'D', 'E'].map((section) => (
              <Picker.Item key={section} label={section} value={section} />
            ))}
          </Picker>
        </View>

        <Button title="Load Students" onPress={loadStudents} disabled={!selectedClass || !selectedSection} color="rgb(160, 180,182)" />

        {studentsLoaded && (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Student List</Text>
            {renderStudentGrid()}
            <Button title="Submit Attendance" onPress={submitAttendance} color="rgb(160, 180,182)" />
          </View>
        )}
      </ScrollView>

      <Modal visible={leaveModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Leave Type</Text>
            <TouchableOpacity onPress={() => handleLeaveOption('Informed')}>
              <Text style={styles.leaveOption}>Informed Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLeaveOption('UnInformed')}>
              <Text style={styles.leaveOption}>UnInformed Leave</Text>
            </TouchableOpacity>
            <Button title="Cancel" onPress={() => setLeaveModalVisible(false)} color="rgb(160, 180,182)" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainHeader: {
    backgroundColor: 'rgb(160, 180,182)',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 90,
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 70,
  },
  logo: {
    width: 60,
    height: 70,
  },
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 0,
    marginTop: -40,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  picker: {
    marginVertical: 10,
    padding: 10,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  studentContainer: {
    alignItems: 'center',
    padding: 10,
    margin: 5,
    width: '30%',
  },
  studentIcon: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 50,
    marginBottom: 5,
  },
  defaultIcon: {
    backgroundColor: '#f0f0f0',
  },
  presentIcon: {
    backgroundColor: 'green',
  },
  absentIcon: {
    backgroundColor: 'red',
  },
  studentName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyHeader: {
    height: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  leaveOption: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 10,
  },
});

export default TeacherAttendance;