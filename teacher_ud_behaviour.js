import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert, Image
} from 'react-native';
import PickerSelect from 'react-native-picker-select';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const TeacherBehaviour = () => {
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Keep original student list for searching
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [behaviorComment, setBehaviorComment] = useState('');
  const [submittedReports, setSubmittedReports] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();


  const loadStudents = async () => {
    if (classSelected && sectionSelected) {
      try {
        const response = await fetch('http://50.6.194.240:5000/api/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: classSelected,
            section: sectionSelected,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.length === 0) {
            Alert.alert('Info', 'No students found in this class and section.');
          } else {
            setStudents(data.map((student) => ({ id: student.id.toString(), name: student.name })));
            setAllStudents(data.map((student) => ({ id: student.id.toString(), name: student.name }))); // Store all students for searching
          }
        } else {
          Alert.alert('Error', 'Failed to fetch students. Please try again later.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch students. Please try again.');
      }
    } else {
      Alert.alert('Error', 'Please select both class and section.');
    }
  };

  const openModal = (studentName) => {
    setSelectedStudent(studentName);
    setBehaviorComment('');
    setModalVisible(true);
  };

  const submitReport = async () => {
    if (!behaviorComment) {
      Alert.alert('Error', 'Please enter a behavior comment.');
      return;
    }

    try {
      const response = await fetch('http://50.6.194.240:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_name: classSelected,  // Changed from className to class_name
          section: sectionSelected,
          name: selectedStudent,
          report: behaviorComment,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Report submitted successfully!');
        setSubmittedReports([...submittedReports, selectedStudent]);
        setModalVisible(false);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to submit report. Please try again later.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit report. Please try again later.');
    }
  };

  const searchStudents = (text) => {
    setSearchText(text);
    const filteredStudents = allStudents.filter((student) =>
      student.name.toLowerCase().includes(text.toLowerCase())
    );
    setStudents(filteredStudents);
  };

  const renderStudent = ({ item }) => {
    const isSubmitted = submittedReports.includes(item.name);
    const isSearched = item.name.toLowerCase() === searchText.toLowerCase();

    return (
      <TouchableOpacity style={styles.studentContainer} onPress={() => openModal(item.name)}>
        <View style={[
          styles.iconContainer,
          isSubmitted && { backgroundColor: 'rgb(160, 180, 182)' },
          isSearched && { backgroundColor: 'rgba(255, 215, 0, 0.5)' },
        ]}>
          <Icon name="person" type="material" size={40} color={isSearched ? "#ff0000" : isSubmitted ? "#fff" : "#000"} />
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (

    <View style={styles.mobileFrame}>
      {/* Header Section */}
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'left', padding: 10, textAlign: 'center' }}>
          Select Class and Section :
        </Text>
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

        <Button title="Load Students" onPress={loadStudents} disabled={!classSelected || !sectionSelected} color="rgb(160, 180,182)" />

        <TextInput
          style={styles.input}
          placeholder="Search student by name..."
          onChangeText={searchStudents}
          value={searchText}
        />

        <FlatList
          data={students}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.studentList}
        />

<Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
      <Text>Behavior Report for {selectedStudent}</Text>

      {/* Dropdown for behavior comment */}
      <PickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setBehaviorComment(value)}
        value={behaviorComment}
        placeholder={{ label: 'Select behavior comment', value: '' }}
        items={[
          { label: 'Positive', value: 'Positive' },
          { label: 'Negative', value: 'Negative' },
          { label: 'Needs to Improvement', value: 'Needs to Improvement' },
        ]}
      />

      <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
  studentContainer: {
    alignItems: 'center',
    padding: 10,
    margin: 5,
    width: '30%', // Ensure 3 students per row
  },
  iconContainer: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 5,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  behaviorInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginVertical: 10,
  },
  studentList: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#333',
  },
  closeButton: {
    backgroundColor: 'rgb(160, 180, 182)',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: 'rgb(160, 180, 182)',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
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
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginVertical: 10,
  },

  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    marginVertical: 10,
  },

};

export default TeacherBehaviour;