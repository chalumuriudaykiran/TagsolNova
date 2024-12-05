import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ManagementAcademicPerformance = ({ navigation }) => {
    const [classSelected, setClassSelected] = useState('');
    const [sectionSelected, setSectionSelected] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (classSelected && sectionSelected) {
            try {
                const subjectResponse = await fetch(`http://50.6.194.240:5000/fetch_subjects.php?class=${classSelected}&section=${sectionSelected}`);
                const subjectsData = await subjectResponse.json();
                setSubjects(subjectsData);

                const performanceResponse = await fetch(`http://50.6.194.240:5000/fetch_performance.php?class=${classSelected}&section=${sectionSelected}`);
                const performanceData = await performanceResponse.json();

                if (performanceData.error) {
                    console.error('Error:', performanceData.error);
                    return;
                }

                performanceData.sort((a, b) => b.total - a.total);
                setData(performanceData);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        } else {
            alert('Please select both class and section.');
        }
    };

    return (
        <View style={styles.container}>
              <View style={styles.mainHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Image
                            source={require('./assets/images/slides/logo226.png')} // Change the path to your logo
                            style={styles.logo}
                        />
                    </TouchableOpacity>
                
               
                    <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Icon name="home" type="material" size={wp('10%')} color="#000" />
                    </TouchableOpacity>
                    </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
          

            
            {/* Space between Sub Header and Title */}
            <View style={styles.space} />

            <Text style={styles.title}>Academic Performance</Text>

            <View style={styles.filters}>
                <Text style={styles.label}>Class:</Text>
                <Picker selectedValue={classSelected} onValueChange={(itemValue) => setClassSelected(itemValue)} style={styles.picker}>
                    <Picker.Item label="Select Class" value="" />
                    <Picker.Item label="1" value="1" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="5" value="5" />
                    {/* Add more classes as needed */}
                </Picker>

                <Text style={styles.label}>Section:</Text>
                <Picker selectedValue={sectionSelected} onValueChange={(itemValue) => setSectionSelected(itemValue)} style={styles.picker}>
                    <Picker.Item label="Select Section" value="" />
                    <Picker.Item label="A" value="A" />
                    <Picker.Item label="B" value="B" />
                    {/* Add more sections as needed */}
                </Picker>

                <Button title="Fetch Data" onPress={fetchData} color="rgb(160, 180, 182)" />
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.student_name}
                renderItem={({ item, index }) => (
                    <View style={[styles.performanceItem, { backgroundColor: index < 5 ? '#dff0d8' : 'white' }]} >
                        <Text style={styles.studentName}>{item.student_name}</Text>
                        {subjects.map(subject => (
                            <Text key={subject}>{item[subject]}</Text>
                        ))}
                        <Text>{item.total}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
        color: '#333',  // Dark text color
    },
    filters: {
        marginBottom: 10,
        backgroundColor: '#fff',  // White background for filters
        borderRadius: 8,
        padding: 10,
        elevation: 2,  // Shadow for elevation
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',  // Dark text color
    },
    picker: {
        height: 50,  // Increased height for better touchability
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',  // White background for pickers
        padding: 10,  // Added padding for better user experience
        elevation: 1,  // Shadow for a box effect
    },
    performanceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    studentName: {
        fontWeight: 'bold',
    },
});

export default ManagementAcademicPerformance;
