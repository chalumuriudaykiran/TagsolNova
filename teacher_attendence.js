// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
// import { Icon } from 'react-native-elements';
// import { Picker } from '@react-native-picker/picker';


// const MobileLogin = () => {
//     const [selectedClass, setSelectedClass] = useState('');
//     const [selectedSection, setSelectedSection] = useState('');
//     const [students, setStudents] = useState([]);
//     const [attendance, setAttendance] = useState({});

//     const loadStudents = () => {
//         // Example data - you can fetch this from a database instead
//         const studentsData = {
//             class1: {
//                 sectionA: ['John Doe', 'Jane Smith', 'Mark Taylor'],
//                 sectionB: ['Alice Brown', 'David Johnson']
//             },
//             class2: {
//                 sectionA: ['Chris Evans', 'Natalie Adams'],
//                 sectionB: ['Emma Watson', 'Tom Hanks']
//             }
//         };

//         if (selectedClass && selectedSection) {
//             const students = studentsData[selectedClass]?.[selectedSection] || [];
//             setStudents(students);
//         } else {
//             alert('Please select both class and section');
//         }
//     };

//     const submitAttendance = () => {
//         // Prepare the data for submission
//         const data = {};
//         students.forEach((student, index) => {
//             data[`attendence_${index}`] = attendence[student];
//             data[`student_name_${index}`] = student;
//           });
    
//         // Send the data to the server (use fetch or AJAX)
//         fetch('/submitAttendance', {
//             method: 'POST',
//             body: JSON.stringify(data),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => response.json())
//         .then(result => {
//             // Show success or failure message
//             if (result.success) {
//                 alert("Attendance submitted successfully!");
//             } else {
//                 alert("Failed to submit attendance. Please try again.");
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert("An error occurred. Please try again.");
//         });
//     };

//     const handleAttendanceChange = (student, attendanceStatus) => {
//         setAttendance(prevAttendance => ({ ...prevAttendance, [student]: attendanceStatus }));
//     };

//     return (
//       <View style={styles.mobileFrame}>
//       <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between' }]}>
//         <TouchableOpacity>
//           <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         <TouchableOpacity>
//           <Icon name="home" type="material" size={60} color="#000" />
//         </TouchableOpacity>
//       </View>
//       <View style={styles.emptyHeader} />
//             <ScrollView style={styles.container}>
//                 <Text style={styles.title}>Select Class and Section</Text>
//                 <Text>Class:</Text>
//                 <Picker style= {styles.picker}selectedValue={selectedClass}
//                     onValueChange={(itemValue) => setSelectedClass(itemValue)}
//                 >
//                     <Picker.Item label="Select Class" value="" />
//                     <Picker.Item label="Class 1" value="class1" />
//                     <Picker.Item label="Class 2" value="class2" />
//                 </Picker>

//                 <Text>Section:</Text>
//                 <Picker  style={styles.picker}   selectedValue={selectedSection}

//                     onValueChange={(itemValue) => setSelectedSection(itemValue)}
//                 >
//                     <Picker.Item label="Select Section" value="" />
//                     <Picker.Item label="Section A" value="sectionA" />
//                     <Picker.Item label="Section B" value="sectionB" />
//                 </Picker>

//                 <Button title="Load Students" onPress={loadStudents} />
//                 <View style={styles.attendanceMessage}>
//                     <Text style={styles.studentListTitle}>Student List</Text>
//                     <View style={styles.studentListWrapper}>
//                         <ScrollView>
//                             {students.map((student, index) => (
//                                 <View key={index} style={styles.studentItem}>
//                                     <Text style={styles.studentName}>{student}</Text>
//                                     <View style={styles.attendanceStatus}>
//                                         <Text>Present:</Text>
//                                         <TouchableOpacity onPress={() => handleAttendanceChange(student, 'present')}>
//                                             <View style={[styles.attendanceButton, attendance[student] === 'present' ? styles.attendanceButtonActive : null]}>
//                                                 <Text>Yes</Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                         <Text>Absent:</Text>
//                                         <TouchableOpacity onPress={() => handleAttendanceChange(student, 'absent')}>
//                                             <View style={[styles.attendanceButton, attendance[student] === 'absent' ? styles.attendanceButtonActive : null]}>
//                                                 <Text>Yes</Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                             ))}
//                         </ScrollView>
//                     </View>
//                     <Button title="Submot Attendence" onPress={submitAttendance}/>
//             </View>
//         </ScrollView>
//     </View>
// );
// }
// const styles = StyleSheet.create({
//     mobileFrame: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 20,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     logo: {
//         width: 100,
//         height: 30,
//         resizeMode: 'contain',
//     },
//     container: {
//         padding: 20,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     attendanceMessage: {
//         marginTop: 20,
//     },
//     studentListTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     studentListWrapper: {
//         padding: 10,
//         backgroundColor: '#f9f9f9',
//         borderRadius: 10,
//     },
//     studentItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ddd',
//     },
//     studentName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     attendanceStatus: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     },
//     attendanceButton: {
//         backgroundColor: '#fff',
//         padding: 10,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: '#ddd',
//     },
//     attendanceButtonActive: {
//         backgroundColor: '#007bff',
//         borderColor: '#007bff',
//     },
//     header: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: '#d1dde6',
//       paddingVertical: 10,
//       height: 120,
//       paddingHorizontal: 15,
//       marginTop: 80,
//       backgroundColor: 'rgb(160, 180,182)'
      
//     },
//     logo: {
//       width: 100,
//       height: 50,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 5,
//       elevation: 2,
//     },
//     mobileFrame: {
//       flex: 1,
//       backgroundColor: '#f0f0f0',
//       paddingTop: 0, // set paddingTop to 0
//       marginTop: -40, // set marginTop to -40 (or the height of your header)
//     },
//     emptyHeader: {
//       height: 30,
//       backgroundColor: '#d1dde6',
//       marginTop: 2,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 5,
//       elevation: 2,
//     },
//     picker: {
//       marginVertical: 10,
//       paddingVertical: 5,
//       paddingHorizontal: 10,
//       borderBottomWidth: 1,
//       borderColor: '#ccc',
//       borderRadius: 8,
//       backgroundColor: '#fff',
//       fontSize: 16,
//       color: '#333',
  
//   },
//   logo:{
//     width:80,
//     height:80,
//     marginRight:100,
//     alignItems:'center',
//     shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.2,
//       shadowRadius: 5,
//       elevation: 2,
//   }
//   });


// export default MobileLogin; 