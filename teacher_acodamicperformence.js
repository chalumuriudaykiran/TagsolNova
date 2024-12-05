import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,Image
} from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TeacherAcademicPerformanceEntry = () => {
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [testTypeSelected, setTestTypeSelected] = useState('');
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [academicReport, setAcademicReport] = useState([]);
  const [submittedReports, setSubmittedReports] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(''); // State to store selected subject
  const [subjects, setSubjects] = useState([]); // State to store subjects dynamically fetched
  const navigation = useNavigation();

  // Fetch students for the selected class and section
  const fetchStudents = async () => {
    if (classSelected && sectionSelected) {
      try {
        const response = await fetch(`http://50.6.194.240:5000/api/get_students?class=${classSelected}&section=${sectionSelected}`);
        
        if (!response.ok) {
          const data = await response.json();
          Alert.alert('No students found', data.message || 'Failed to fetch students.');
          setStudents([]);
          return;
        }

        const data = await response.json();
        setStudents(data);
        setAllStudents(data);
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Failed to fetch students.');
      }
    } else {
      Alert.alert('Error', 'Please select both class and section.');
    }
  };

  const fetchSubjects = async () => {
    if (classSelected && sectionSelected) {
      try {
        const response = await fetch(`http://50.6.194.240:5000/api/get_subjects?class=${classSelected}&section=${sectionSelected}`);
        
        if (!response.ok) {
          // If the response isn't ok (non-2xx status), show an alert with the error message
          const errorText = await response.text(); // Get response text instead of JSON to avoid errors in case of non-JSON responses
          console.error('Failed to fetch subjects:', errorText);  // Log the response text for debugging
          Alert.alert('No subjects found', errorText || 'Failed to fetch subjects.');
          setSubjects([]); // Reset subjects
          return;
        }
  
        const data = await response.json();
        console.log('Fetched subjects:', data); // Log the subjects for debugging
        setSubjects(data);  // Update subjects state
  
      } catch (error) {
        console.error('Error fetching subjects:', error);  // Log any fetch errors
        Alert.alert('Error', 'Failed to fetch subjects.');
      }
    } else {
      Alert.alert('Error', 'Please select both class and section.');
    }
  };
  
  useEffect(() => {
    // Fetch subjects whenever class or section changes
    fetchSubjects();
  }, [classSelected, sectionSelected]);

  const openModal = (studentName) => {
    setSelectedStudent(studentName);
    setAcademicReport([]); 
    setModalVisible(true);
    setSelectedSubject('');  // Reset the selected subject
  };

  const submitReport = async () => {
    // Validate for missing fields
    if (academicReport.length === 0) {
        Alert.alert('Error', 'Please add at least one subject and marks.');
        return;
    }

    if (!testTypeSelected || testTypeSelected === 'Select Test Type') {
        Alert.alert('Error', 'Please select a test type.');
        return;
    }

    if (!classSelected || !sectionSelected) {
        Alert.alert('Error', 'Please select both class and section.');
        return;
    }

    const reportData = {
        name: selectedStudent,           // Name of the student
        academic_report: academicReport, // List of subjects and marks
        class_name: classSelected,       // Class name
        section: sectionSelected,       // Section
        test_type: testTypeSelected,    // Test Type
    };

    try {
        const response = await fetch('http://50.6.194.240:5000/api/save_academic_report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
        });

        const responseText = await response.text();
        if (response.ok) {
            Alert.alert('Success', 'Academic Report submitted successfully!');
        } else {
            const errorData = JSON.parse(responseText);
            Alert.alert('Error', errorData.message || 'Failed to submit report. Please try again later.');
        }
    } catch (error) {
        console.error("Error during submission:", error);
        Alert.alert('Error', 'Failed to submit report. Please try again later.');
    }
  };

  const addSubject = () => {
    if (selectedSubject) {
      setAcademicReport([...academicReport, { subject: selectedSubject, marks: '' }]);
      setSelectedSubject('');  // Reset the selected subject after adding
    } else {
      Alert.alert('Error', 'Please select a subject first.');
    }
  };

  const handleSubjectChange = (index, field, value) => {
    const newReport = [...academicReport];
    newReport[index][field] = value;
    setAcademicReport(newReport);
  };

  const renderStudent = ({ item }) => {
    const isSubmitted = submittedReports.includes(item.name);
    const isSearched = item.name.toLowerCase() === searchText.toLowerCase();

   

    return (
      <View style={{ flex: 1 }}>
        {/* Sub Header */}

      <TouchableOpacity style={styles.studentContainer} onPress={() => openModal(item.name)}>
        <View style={[styles.iconContainer, 
          isSubmitted && { backgroundColor: 'rgb(160, 180, 182)' },
          isSearched && { backgroundColor: 'rgba(255, 215, 0, 0.5)' },
        ]}>
          <Icon name="person" type="material" size={40} color={isSearched ? "#ff0000" : isSubmitted ? "#fff" : "#000"} />
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </TouchableOpacity>
      </View>
      
    );
  };


  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainHeader}>
          <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
            <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
            <Icon name="home" size={wp('10%')} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>Academic Performance Entry</Text>
      <Text style={styles.label}>Select Class and Section:</Text>
      
      <Text style={styles.label}>Class</Text>
      <PickerSelect
        style={pickerSelectStyles}
        onValueChange={(itemValue) => setClassSelected(itemValue)}
        items={[
          { label: 'Select Class', value: '' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
          { label: '10', value: '10' },
        ]}
      />

      <Text style={styles.label}>Section</Text>
      <PickerSelect
        style={pickerSelectStyles}
        onValueChange={(itemValue) => setSectionSelected(itemValue)}
        items={[
          { label: 'Select Section', value: '' },
          { label: 'A', value: 'A' },
          { label: 'B', value: 'B' },
          { label: 'C', value: 'C' },
          { label: 'D', value: 'D' },
          { label: 'E', value: 'E' },
        ]}
      />

      <Text style={styles.label}>Select Test Type:</Text>
      <PickerSelect
        style={pickerSelectStyles}
        onValueChange={(itemValue) => setTestTypeSelected(itemValue)}
        items={[
          { label: 'Select Test Type', value: '' },
          { label: 'Term 1', value: 'Term1' },
          { label: 'Term 2', value: 'Term2' },
          { label: 'Term 3', value: 'Term3' },
          { label: 'Term 4', value: 'Term4' },
          { label: 'Mid 1', value: 'Mid1' },
          { label: 'Mid 2', value: 'Mid2' },
          { label: 'Quarterly', value: 'Quarterly' },
          { label: 'Half Yearly', value: 'HalfYearly' },
          { label: 'Annual', value: 'Annual' },
        ]}
      />

      <Button title="Load Students" onPress={fetchStudents} disabled={!classSelected || !sectionSelected} color="rgb(160, 180, 182)" />
      
      <TextInput
        style={styles.input}
        placeholder="Search by student name"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.studentList}
      />

      {/* Modal */}
      <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeading}>Academic Report for {selectedStudent}</Text>

            <Text style={styles.label}>Select Subject</Text>
            <PickerSelect
              style={pickerSelectStyles}
              onValueChange={(value) => setSelectedSubject(value)}
              items={subjects.map(subject => ({ label: subject, value: subject }))}
              value={selectedSubject}
            />

            <TouchableOpacity style={styles.addSubjectButton} onPress={addSubject}>
              <Text style={styles.addSubjectText}>Add Subject</Text>
            </TouchableOpacity>

            {academicReport.map((item, index) => (
              <View key={index} style={styles.subjectContainer}>
                <TextInput
                  placeholder="Enter Subject"
                  value={item.subject}
                  onChangeText={(value) => handleSubjectChange(index, 'subject', value)}
                  style={styles.subjectInput}
                />
                <TextInput
                  placeholder="Enter Marks"
                  value={item.marks}
                  onChangeText={(value) => handleSubjectChange(index, 'marks', value)}
                  keyboardType="numeric"
                  style={styles.marksInput}
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => {
                    const updatedReport = academicReport.filter((_, idx) => idx !== index);
                    setAcademicReport(updatedReport);
                  }}
                >
                  <Icon name="delete" type="material" size={20} color="#000" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
                <Text style={styles.submitButtonText}>Submit Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
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

  mobileFrame: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    
},
label: {
  fontSize: wp(4),   // Responsive font size based on screen width
  marginVertical: hp(1.5), // Responsive margin based on screen height
},
input: {
  height: hp(5), // Responsive height based on screen height
  borderColor: 'gray',
  borderWidth: 1,
  paddingLeft: wp(2), // Responsive padding based on screen width
  marginBottom: hp(1.5),
},
studentContainer: {
  alignItems: 'center',
  margin: wp(2),
  flex: 1,
  justifyContent: 'center',
},

iconContainer: {
  backgroundColor: 'rgb(231, 231, 231)',
  padding: wp(4),
  borderRadius: hp(2), // Responsive border radius based on screen height
},
studentName: {
  fontSize: wp(3.5), // Responsive font size based on screen width
  marginTop: hp(1),
},
modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
},
modalContent: {
  width: wp(80), // Responsive width based on screen width
  backgroundColor: '#fff',
  borderRadius: hp(1), // Responsive border radius based on screen height
  padding: wp(5),
  alignItems: 'center',
  maxHeight: hp(80), // Prevent the modal from growing too large vertically
  justifyContent: 'flex-start',
},
closeButton: {
  alignItems: 'flex-end',
},
closeButtonText: {
  color: 'red',
  fontWeight: 'bold',
},
modalHeading: {
  fontSize: wp(5),  // Responsive font size based on screen width
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: hp(2),
},
subjectContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: hp(1),
},
subjectInput: {
  width: wp(45), // Responsive width based on screen width
  borderColor: '#ccc',
  borderWidth: 1,
  paddingLeft: wp(2),
  height: hp(5), // Responsive height based on screen height
},
marksInput: {
  width: wp(45), // Responsive width based on screen width
  borderColor: '#ccc',
  borderWidth: 1,
  paddingLeft: wp(2),
  height: hp(5), // Responsive height based on screen height
},
removeButton: {
  marginLeft: wp(2),
  justifyContent: 'center',
  alignItems: 'center',
},
buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: hp(2),
  width: '100%',
},
addSubjectButton: {
  backgroundColor: 'rgb(160, 180, 182)',
  padding: wp(3),
  borderRadius: hp(1),
  width: wp(60), // Responsive width based on screen width
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: hp(1),
},
submitButton: {
  backgroundColor: '#4CAF50',
  padding: wp(3),
  borderRadius: hp(1),
  width: wp(60), // Responsive width based on screen width
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: hp(1),
},
submitButtonText: {
  fontSize: wp(4), // Responsive font size based on screen width
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},
addSubjectText: {
  fontSize: wp(4), // Responsive font size based on screen width
  color: '#fff',
  fontWeight: 'bold',
  textAlign: 'center',
},
studentList: {
  paddingBottom: hp(3),
},
picker: {
  marginBottom: hp(1),
},
});

const pickerSelectStyles = {
inputAndroid: {
  color: 'black',
  padding: wp(3),
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: hp(1),
},
inputIOS: {
  color: 'black',
  padding: wp(3),
  borderWidth: 1,
  borderColor: '#ccc',
  marginBottom: hp(1),
},
};

export default TeacherAcademicPerformanceEntry;