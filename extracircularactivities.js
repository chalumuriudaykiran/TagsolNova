// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Picker } from '@react-native-picker/picker';
// import DateTimePicker from '@react-native-community/datetimepicker'; // Updated import
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const MAX_PROGRAM_NAME_LENGTH = 50;

// const SportsYogaInfo = ({ navigation }) => {
//   const [studentName, setStudentName] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedProgram, setSelectedProgram] = useState('');
//   const [programName, setProgramName] = useState('');
//   const [winningEvent, setWinningEvent] = useState('');
//   const [winningRank, setWinningRank] = useState('');
//   const [winningDate, setWinningDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false); // To toggle the date picker visibility
//   const [classLevel, setClassLevel] = useState('');
//   const [section, setSection] = useState('');
//   const [students, setStudents] = useState([]);
//   const [showProgramButtons, setShowProgramButtons] = useState(false);
//   const [selectedColor, setSelectedColor] = useState('');

//   const loadStudents = async () => {
//     if (classLevel && section) {
//       try {
//         const response = await fetch('http://50.6.194.240:5000/api/students', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             className: classLevel,
//             section: section,
//           }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           if (data.length === 0) {
//             Alert.alert('Info', 'No students found in this class and section.');
//           } else {
//             setStudents(data.map((student) => ({ id: student.id.toString(), name: student.name })));
//           }
//         } else {
//           console.error('Error response from server:', data);
//           Alert.alert('Error', 'Failed to fetch students. Please try again later.');
//         }
//       } catch (error) {
//         console.error('Network error:', error);
//         Alert.alert('Error', 'Failed to fetch students. Please try again.');
//       }
//     } else {
//       Alert.alert('Error', 'Please select both class and section.');
//     }
//   };

//   const openProgramModal = (program) => {
//     setSelectedProgram(program);
//     setModalVisible(true);
//     setProgramName('');
//     setWinningEvent('');
//     setWinningRank('');
//     setWinningDate(new Date());
//   };

//   const openColorSelection = (studentName) => {
//     setStudentName(studentName);
//     setShowProgramButtons(true);
//   };

//   const handleColorSelect = (color) => {
//     setSelectedColor(color);
//     setShowProgramButtons(false);
//     openProgramModal(color);
//   };

//   const handleSubmitProgram = async () => {
//     if (
//       !studentName || !selectedProgram || !winningEvent ||
//       !winningRank || !winningDate || !classLevel || !section
//     ) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const requestData = {
//       student_name: studentName,
//       program_name: selectedProgram,
//       winning_event: winningEvent,
//       winning_rank: winningRank,
//       winning_date: winningDate.toISOString().split('T')[0], // Format the date
//       class_name: classLevel,
//       section: section,
//     };

//     try {
//       const response = await fetch('http://50.6.194.240:5000/api/submit-sports', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       const responseBody = await response.text();
//       if (response.ok) {
//         const data = JSON.parse(responseBody);
//         Alert.alert('Success', 'Details saved successfully!');
//         setModalVisible(false);
//         setProgramName('');
//         setWinningEvent('');
//         setWinningRank('');
//         setWinningDate(new Date());
//       } else {
//         Alert.alert('Error', 'Failed to save details. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       Alert.alert('Error', 'An error occurred while submitting the form.');
//     }
//   };

//   // Date change handler for DateTimePicker
//   const onDateChange = (event, selectedDate) => {
//     const currentDate = selectedDate || winningDate;
//     setShowDatePicker(false);
//     setWinningDate(currentDate);
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
//       {/* Main Header */}
//       <View style={styles.mainHeader}>
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//         </TouchableOpacity>
//         <View style={{ flex: 1 }} />
//         <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
//           <Icon name="home" size={wp('10%')} color="#000" />
//         </TouchableOpacity>
//       </View>

//       {/* Sub Header */}
//       <View style={styles.subHeader}>
//         <Text style={styles.subHeaderText}></Text>
//       </View>
//       <View style={styles.space}></View>
//       <Text  style={styles.title}>Sports and Yoga Information</Text>

//       {/* Class and Section Input */}
//       <Text style={styles.title}>Class & Section</Text>
//       <View style={styles.classSectionRow}>
//         <Text style={styles.rowTitle}>Class</Text>
//         <Picker
//           selectedValue={classLevel}
//           style={styles.picker}
//           onValueChange={(itemValue) => setClassLevel(itemValue)}
//         >
//           <Picker.Item label="Select Class" value="" />
//           {[...Array(10)].map((_, i) => (
//             <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
//           ))}
//         </Picker>
//       </View>
//       <View style={styles.classSectionRow}>
//         <Text style={styles.rowTitle}>Section</Text>
//         <Picker
//           selectedValue={section}
//           style={styles.picker}
//           onValueChange={(itemValue) => setSection(itemValue)}
//         >
//           <Picker.Item label="Select Section" value="" />
//           {['A', 'B', 'C', 'D', 'E'].map((sectionValue) => (
//             <Picker.Item key={sectionValue} label={sectionValue} value={sectionValue} />
//           ))}
//         </Picker>
//       </View>

//       {/* Load Students Button */}
//       <TouchableOpacity style={styles.loadButton} onPress={loadStudents}>
//         <Text style={styles.loadButtonText}>Load Students</Text>
//       </TouchableOpacity>

//       {/* Display Students in 2x2 Grid when the button is clicked */}
//       {students.length > 0 && (
//         <View>
//           <Text style={styles.title}>Students List:</Text>
//           <View style={styles.gridContainer}>
//             {students.slice(0, 8).map((student) => (
//               <View key={student.id} style={styles.studentItem}>
//                 <TouchableOpacity onPress={() => openColorSelection(student.name)}>
//                   <Icon name="person-circle" size={40} color="#ccc" style={styles.studentIcon} />
//                 </TouchableOpacity>
//                 <Text style={styles.studentName}>{student.name}</Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       )}

//       {/* Modal for Color Selection */}
//       {showProgramButtons && (
//         <View style={styles.programButtonContainer}>
//           <TouchableOpacity
//             style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
//             onPress={() => handleColorSelect('Sports')}
//           >
//             <Text style={styles.programButtonText}>Sports</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
//             onPress={() => handleColorSelect('Yoga')}
//           >
//             <Text style={styles.programButtonText}>Yoga</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
//             onPress={() => handleColorSelect('Both')}
//           >
//             <Text style={styles.programButtonText}>Both</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Program Modal */}
//       <Modal visible={modalVisible} animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>{selectedProgram} Program</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Enter Program Name"
//               maxLength={MAX_PROGRAM_NAME_LENGTH}
//               value={programName}
//               onChangeText={setProgramName}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Enter Winning Rank"
//               value={winningRank}
//               onChangeText={setWinningRank}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Enter Winning Event"
//               value={winningEvent}
//               onChangeText={setWinningEvent}
//             />

//             {/* DatePicker component */}
//             <View style={styles.datePicker}>
//               <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//                 <Text>Select Winning Date: {winningDate.toLocaleDateString()}</Text>
//               </TouchableOpacity>
//               {showDatePicker && (
//                 <DateTimePicker
//                   value={winningDate}
//                   mode="date"
//                   display="default"
//                   onChange={onDateChange}
//                 />
//               )}
//             </View>

//             {/* Submit Button */}
//             <TouchableOpacity style={styles.submitButton} onPress={handleSubmitProgram}>
//               <Text style={styles.submitButtonText}>Submit</Text>
//             </TouchableOpacity>

//             {/* Close Modal Button */}
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Icon name="close-circle" size={30} color="gray" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   mainHeader: {
//     flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'rgb(160, 180, 182)',
//         paddingVertical: hp('1.5%'),  // Responsive padding
//         paddingHorizontal: wp('4%'),  // Responsive padding
//         height: hp('12%'),  // Responsive height
//         marginBottom: wp('3%'), 
//   },
//   logo: {
//     width: wp('15%'),  // Responsive width
//     height: wp('15%'),  // Responsive height
//   },
//   subHeader: {
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1%'),  // Responsive padding
//     alignItems: 'center',
//     height: hp('4%'),  // Responsive height
//   },
//   subHeaderText: {
//     fontSize: wp('5%'),  // Responsive font size
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   space:{
//     height:wp('5%')
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//   },
//   classSectionRow: {
//     marginTop: 10,
//   },
//   rowTitle: {
//     fontSize: 16,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginTop: 10,
//   },
//   loadButton: {
//     backgroundColor: 'rgb(160, 180, 182)',
//     padding: 10,
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   loadButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   gridContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 10,
//   },
//   studentItem: {
//     width: '45%',
//     alignItems: 'center',
//     margin: 10,
//   },
//   studentIcon: {
//     marginBottom: 5,
//   },
//   studentName: {
//     fontSize: 16,
//   },
//   programButtonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   programButton: {
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     width: 80,
//   },
//   programButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 10,
//     width: '80%',
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     height: 40,
//     width: '100%',
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     paddingLeft: 10,
//   },
//   datePicker: {
//     width: '100%',
//     marginBottom: 10,
//   },
//   submitButton: {
//     backgroundColor: '#28a745',
//     padding: 10,
//     width: '100%',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
// });

// export default SportsYogaInfo;




import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Updated import
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const MAX_PROGRAM_NAME_LENGTH = 50;

const SportsYogaInfo = ({ navigation }) => {
  const [studentName, setStudentName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [programName, setProgramName] = useState('');
  const [winningEvent, setWinningEvent] = useState('');
  const [winningRank, setWinningRank] = useState('');
  const [winningDate, setWinningDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // To toggle the date picker visibility
  const [classLevel, setClassLevel] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);
  const [showProgramButtons, setShowProgramButtons] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');

  const loadStudents = async () => {
    if (classLevel && section) {
      try {
        const response = await fetch('http://50.6.194.240:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: classLevel,
            section: section,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            Alert.alert('Info', 'No students found in this class and section.');
          } else {
            setStudents(data.map((student) => ({ id: student.id.toString(), name: student.name })));
          }
        } else {
          console.error('Error response from server:', data);
          Alert.alert('Error', 'Failed to fetch students. Please try again later.');
        }
      } catch (error) {
        console.error('Network error:', error);
        Alert.alert('Error', 'Failed to fetch students. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select both class and section.');
    }
  };

  const openProgramModal = (program) => {
    setSelectedProgram(program);
    setModalVisible(true);
    setProgramName('');
    setWinningEvent('');
    setWinningRank('');
    setWinningDate(new Date());
  };

  const openColorSelection = (studentName) => {
    setStudentName(studentName);
    setShowProgramButtons(true);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowProgramButtons(false);
    openProgramModal(color);
  };

  const handleSubmitProgram = async () => {
    if (
      !studentName || !selectedProgram || !winningEvent ||
      !winningRank || !winningDate || !classLevel || !section
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const requestData = {
      student_name: studentName,
      program_name: selectedProgram,
      winning_event: winningEvent,
      winning_rank: winningRank,
      winning_date: winningDate.toISOString().split('T')[0], // Format the date
      class_name: classLevel,
      section: section,
    };

    try {
      const response = await fetch('http://50.6.194.240:5000/submit-sports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const responseBody = await response.text();
      if (response.ok) {
        const data = JSON.parse(responseBody);
        Alert.alert('Success', 'Details saved successfully!');
        setModalVisible(false);
        setProgramName('');
        setWinningEvent('');
        setWinningRank('');
        setWinningDate(new Date());
      } else {
        Alert.alert('Error', 'Failed to save details. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'An error occurred while submitting the form.');
    }
  };

  // Date change handler for DateTimePicker
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || winningDate;
    setShowDatePicker(false);
    setWinningDate(currentDate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Main Header */}
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('TeacherDashboard')}>
          <Icon name="home" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}></Text>
      </View>
      <Text>SPORTS AND YOGA INFORMATION</Text>

      {/* Class and Section Input */}
      <Text style={styles.title}>Class & Section</Text>
      <View style={styles.classSectionRow}>
        <Text style={styles.rowTitle}>Class</Text>
        <Picker
          selectedValue={classLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setClassLevel(itemValue)}
        >
          <Picker.Item label="Select Class" value="" />
          {[...Array(10)].map((_, i) => (
            <Picker.Item key={i} label={`${i + 1}`} value={i + 1} />
          ))}
        </Picker>
      </View>
      <View style={styles.classSectionRow}>
        <Text style={styles.rowTitle}>Section</Text>
        <Picker
          selectedValue={section}
          style={styles.picker}
          onValueChange={(itemValue) => setSection(itemValue)}
        >
          <Picker.Item label="Select Section" value="" />
          {['A', 'B', 'C', 'D', 'E'].map((sectionValue) => (
            <Picker.Item key={sectionValue} label={sectionValue} value={sectionValue} />
          ))}
        </Picker>
      </View>

      {/* Load Students Button */}
      <TouchableOpacity style={styles.loadButton} onPress={loadStudents}>
        <Text style={styles.loadButtonText}>Load Students</Text>
      </TouchableOpacity>

      {/* Display Students in 2x2 Grid when the button is clicked */}
      {students.length > 0 && (
        <View>
          <Text style={styles.title}>Students List:</Text>
          <View style={styles.gridContainer}>
            {students.slice(0, 8).map((student) => (
              <View key={student.id} style={styles.studentItem}>
                <TouchableOpacity onPress={() => openColorSelection(student.name)}>
                  <Icon name="person-circle" size={40} color="#ccc" style={styles.studentIcon} />
                </TouchableOpacity>
                <Text style={styles.studentName}>{student.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Modal for Color Selection */}
      {showProgramButtons && (
        <View style={styles.programButtonContainer}>
          <TouchableOpacity
            style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
            onPress={() => handleColorSelect('Sports')}
          >
            <Text style={styles.programButtonText}>Sports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
            onPress={() => handleColorSelect('Yoga')}
          >
            <Text style={styles.programButtonText}>Yoga</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.programButton, { backgroundColor: 'rgb(160, 180,182)' }]}
            onPress={() => handleColorSelect('Both')}
          >
            <Text style={styles.programButtonText}>Both</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Program Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedProgram} Program</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Program Name"
              maxLength={MAX_PROGRAM_NAME_LENGTH}
              value={programName}
              onChangeText={setProgramName}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Winning Rank"
              value={winningRank}
              onChangeText={setWinningRank}
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Winning Event"
              value={winningEvent}
              onChangeText={setWinningEvent}
            />

            {/* DatePicker component */}
            <View style={styles.datePicker}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text>Select Winning Date: {winningDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={winningDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitProgram}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close-circle" size={30} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContent: {
    paddingBottom: 20,
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
    height: wp('15%'), 
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  classSectionRow: {
    marginTop: 10,
  },
  rowTitle: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
  },
  loadButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  loadButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  studentItem: {
    width: '45%',
    alignItems: 'center',
    margin: 10,
  },
  studentIcon: {
    marginBottom: 5,
  },
  studentName: {
    fontSize: 16,
  },
  programButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  programButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: 80,
  },
  programButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  datePicker: {
    width: '100%',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default SportsYogaInfo;