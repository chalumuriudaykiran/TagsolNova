import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Teachertimetable = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [timetable, setTimetable] = useState([]);
  const [headerTimes, setHeaderTimes] = useState({
    intervals: [],
    periods: [],
  });
  const [loading, setLoading] = useState(false);

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://50.6.194.240:5000/api/timetable?class_id=${selectedClass}&section_id=${selectedSection}`
      );
      const data = await response.json();
      console.log(data); // Debugging line to check response structure

      if (data.timetable && Array.isArray(data.timetable)) {
        setTimetable(data.timetable);

        if (data.timetable.length > 0) {
          const firstRow = data.timetable[0];

          const flattenedPeriods = [
            ...(firstRow.periods?.morning || []),
            ...(firstRow.periods?.afternoon || []),
            ...(firstRow.periods?.evening || []),
            ...(firstRow.periods?.night || []),
          ].map((period, index) => ({
            name: `Period ${index + 1}`,
            subject: period.subject || 'No subject',
            time: `${period.fromTime} - ${period.toTime}`,
          }));

          const intervals = [
            { name: 'MI', time: firstRow.morningInterval || 'N/A' },
            { name: 'LI', time: firstRow.lunchInterval || 'N/A' },
            { name: 'AI', time: firstRow.afternoonInterval || 'N/A' },
            { name: 'EI', time: firstRow.eveningInterval || 'N/A' },
          ];

          // Merge periods and intervals
          const mergedHeaderTimes = [];
          flattenedPeriods.forEach((period, index) => {
            mergedHeaderTimes.push(period);
            if (intervals[index]) mergedHeaderTimes.push(intervals[index]);
          });

          setHeaderTimes({ intervals, periods: mergedHeaderTimes });
        }
      } else {
        setTimetable([]);
        alert(data.message || 'No timetable available.');
      }
    } catch (error) {
      console.error('Error fetching timetable:', error);
      alert('Failed to load timetable. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('TeacherProfile')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
      

      <View style={styles.selectionContainer}>
        <Text style={styles.label}>Select Class:</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedClass}
          onValueChange={(itemValue) => setSelectedClass(itemValue)}
        >
          {[...Array(6)].map((_, i) => (
            <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
          ))}
        </Picker>

        <Text style={styles.label}>Select Section:</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedSection}
          onValueChange={(itemValue) => setSelectedSection(itemValue)}
        >
          {['A', 'B', 'C'].map((section) => (
            <Picker.Item key={section} label={section} value={section} />
          ))}
        </Picker>

        <Button title="Load Timetable" onPress={loadTimetable} color="rgb(160, 180, 182)" />
      </View>

      {/* Conditionally render timetable */}
      {selectedClass && selectedSection ? (
        loading ? (
          <Text style={styles.noTimetable}>Loading timetable...</Text>
        ) : (
          <ScrollView style={styles.scrollView} horizontal>
            <ScrollView style={styles.scrollViewVertical}>
              <DataTable>
                <DataTable.Header style={styles.headerRow}>
                  <DataTable.Title style={styles.tableHeader}>
                    <Text style={styles.headerText}>Day</Text>
                  </DataTable.Title>
                  {headerTimes.periods.map((period, index) => (
                    <DataTable.Title key={`header-${index}`} style={styles.tableHeader}>
                      <Text style={styles.headerText}>{period.name}</Text>
                      <Text style={styles.timeText}>{period.time}</Text>
                    </DataTable.Title>
                  ))}
                </DataTable.Header>

                {timetable.map((dayData, index) => (
                  <DataTable.Row key={`row-${index}`} style={styles.row}>
                    <DataTable.Cell style={styles.cell}>
                      <Text style={styles.text}>{dayData.day}</Text>
                    </DataTable.Cell>
                    {headerTimes.periods.map((period, idx) => (
                      <DataTable.Cell key={`period-${idx}`} style={styles.cell}>
                        <Text style={styles.subjectText}>
                          {period.subject && period.subject !== 'No subject' ? period.subject : ''}
                        </Text>
                      </DataTable.Cell>
                    ))}
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </ScrollView>
        )
      ) : (
        <Text style={styles.noTimetable}>Please select a class and section to view the timetable.</Text>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.infoText}>
          MI:MorningInterval, LI:LunchInterval, AI:Afternoon Interval, EI:Evening Interval
        </Text>
      </View>
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
  },  selectionContainer: { marginBottom: hp('2%') },  // Responsive margin
  label: { 
    fontSize: wp('4%'),  // Responsive font size
    marginBottom: hp('1%'), 
    color: '#2c3e50', 
    fontWeight: 'bold' 
  },
  noTimetable: { 
    textAlign: 'center', 
    fontSize: wp('4.5%'),  // Responsive font size
    marginTop: hp('3%'), 
    color: '#7f8c8d' 
  },

  // Header Row Styles
  headerRow: {
    backgroundColor: 'rgb(160, 180,182)', 
    borderBottomWidth: 2,
    borderBottomColor: '#16a085' 
  },
  tableHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('3%'),  // Responsive padding
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    width: wp('50%'),  // Responsive width
    height: hp('10%'),  // Responsive height
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wp('4%')  // Responsive font size
  },
  timeText: {
    color: '#fff',
    fontSize: wp('3.5%'),  // Responsive font size
    textAlign: 'center'
  },

  // Row Styles
  scrollView: { flex: 1 },
  scrollViewVertical: { flex: 1, marginTop: hp('1%') },  // Responsive margin-top
  row: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9', 
  },
  cell: {
    backgroundColor: '#f8f9fa', 
    padding: wp('3%'),  // Responsive padding
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    width: wp('30%'),  // Responsive width
    height: hp('8%'),  // Responsive height
  },
  subjectText: {
    fontWeight: 'bold',
    color: '#2c3e50' 
  },
  text: {
    fontSize: wp('3.5%'),  // Responsive font size
    color: '#7f8c8d',
    textAlign: 'center'
  },

  // Footer Styles
  textContainer: { paddingTop: hp('2%') },  // Responsive padding-top
  infoText: {
    fontSize: wp('3.5%'),  // Responsive font size
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  });
export default Teachertimetable;