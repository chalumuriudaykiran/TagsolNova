 import React, { useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'; // Time Picker Library
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ManageUploadTimetable = ({ navigation }) => {
  const [daySelected, setDaySelected] = useState('Monday');
  const [classSelected, setClassSelected] = useState('1');
  const [sectionSelected, setSectionSelected] = useState('A');
  const [timetable, setTimetable] = useState([]); // Store timetable with periods
  const [intervals, setIntervals] = useState([]); // Store intervals
  const [currentPeriod, setCurrentPeriod] = useState(1); // Track current period to be added
  const [subject, setSubject] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [intervalFromTime, setIntervalFromTime] = useState('');
  const [intervalToTime, setIntervalToTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isFromTime, setIsFromTime] = useState(true); // Flag to determine whether From or To time is selected
  const [intervalType, setIntervalType] = useState(''); // Interval type for adding intervals
  const [activeButton, setActiveButton] = useState(''); // Track which button is active (period or interval)
  const [selectedTimeFor, setSelectedTimeFor] = useState(''); // Flag to track whether the time being selected is for period or interval

  // Time Picker Helper Functions
  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      const formattedTime = formatTime(selectedDate);  // Format the selected time
      if (selectedTimeFor === 'fromTime') {
        if (activeButton === 'period') {
          setFromTime(formattedTime);  // Set to fromTime state for period
        } else {
          setIntervalFromTime(formattedTime); // Set intervalFromTime for interval
        }
      } else {
        if (activeButton === 'period') {
          setToTime(formattedTime);  // Set to toTime state for period
        } else {
          setIntervalToTime(formattedTime); // Set intervalToTime for interval
        }
      }
    }
    setShowTimePicker(false);  // Close the picker after selecting time
  };

  // Add Period function
  const addPeriod = () => {
    if (currentPeriod > 10) {
      Alert.alert('Limit Reached', 'You can only add up to 10 periods.');
      return;
    }

    if (!subject || !fromTime || !toTime) {
      Alert.alert('Missing Information', 'Please fill all fields for period.');
      return;
    }

    const newPeriod = {
      period: currentPeriod,
      subject: subject,
      fromTime: fromTime,
      toTime: toTime,
    };

    setTimetable([...timetable, newPeriod]);
    setCurrentPeriod(currentPeriod + 1); // Increment the current period number
    setSubject(''); // Reset subject field
    setFromTime(''); // Reset fromTime field
    setToTime(''); // Reset toTime field
    setActiveButton(''); // Reset active button to none
  };

  // Add Interval function (for adding time intervals)
  const addInterval = () => {
    if (!intervalType || !intervalFromTime || !intervalToTime) {
      Alert.alert('Missing Information', 'Please provide all fields for interval.');
      return;
    }

    const newInterval = {
      intervalType,
      fromTime: intervalFromTime,
      toTime: intervalToTime,
    };

    setIntervals([...intervals, newInterval]);
    setIntervalType(''); // Reset interval type
    setIntervalFromTime(''); // Reset interval from time
    setIntervalToTime(''); // Reset interval to time
    setActiveButton(''); // Reset active button to none
  };

  // Remove a period
  const removePeriod = (index) => {
    const updatedTimetable = timetable.filter((_, i) => i !== index);
    setTimetable(updatedTimetable);
    setCurrentPeriod(currentPeriod - 1); // Decrease currentPeriod count
  };

  // Submit Timetable function
  const submitTimetable = async () => {
    console.log('Submitting timetable:', {
      class_id: classSelected,
      section_id: sectionSelected,
      day: daySelected,
      timetable: timetable,
      intervals: intervals,
    });

    try {
      const response = await fetch('http://50.6.194.240:5000/api/add-timetable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          class_id: classSelected,
          section_id: sectionSelected,
          day: daySelected,
          timetable: timetable.map(period => ({
            ...period,
            fromTime: period.fromTime,
            toTime: period.toTime,
          })),
          intervals: intervals.map(interval => ({
            ...interval,
            fromTime: interval.fromTime,
            toTime: interval.toTime,
          })),
        }),
      });

      const result = await response.json();
      console.log('Response:', result);
      if (response.ok) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting timetable:', error);
      Alert.alert('Error', 'Failed to submit timetable');
    }
  };

  return (
    <View style={styles.mobileFrame}>
      <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
      <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                        <Icon name="home" type="material" size={wp('10%')} color="#000" />
                    </TouchableOpacity>
                
      </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
      <ScrollView>
        {/* Day, Class, Section */}
        <View style={styles.pickerContainer}>
          <Text style={{ fontWeight: 'bold' }}>    Day:</Text>
          <Picker selectedValue={daySelected} onValueChange={(itemValue) => setDaySelected(itemValue)}>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <Picker.Item key={day} label={day} value={day} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={{ fontWeight: 'bold' }}>    Class:</Text>
          <Picker selectedValue={classSelected} onValueChange={(itemValue) => setClassSelected(itemValue)}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((classNum) => (
              <Picker.Item key={classNum} label={classNum} value={classNum} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text style={{ fontWeight: 'bold' }}>     Section:</Text>
          <Picker selectedValue={sectionSelected} onValueChange={(itemValue) => setSectionSelected(itemValue)}>
            {['A', 'B', 'C', 'D', 'E'].map((section) => (
              <Picker.Item key={section} label={section} value={section} />
            ))}
          </Picker>
        </View>

        {/* Select Period or Interval */}
        <View style={styles.pickerContainer}>
          <TouchableOpacity
            style={[styles.button, activeButton === 'period' && styles.activeButton]}
            onPress={() => setActiveButton('period')}
          >
            <Text style={styles.buttonText}>Add Period</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, activeButton === 'interval' && styles.activeButton]}
            onPress={() => setActiveButton('interval')}
          >
            <Text style={styles.buttonText}>Add Interval</Text>
          </TouchableOpacity>
        </View>

        {/* Subject and Time Inputs for Period */}
        {activeButton === 'period' && (
          <>
            <View style={styles.pickerContainer}>
              <Text style={{ fontWeight: 'bold' }}>   Period {currentPeriod}:</Text>
              <TextInput
                style={styles.input}
                value={subject}
                onChangeText={(text) => setSubject(text)}
                placeholder="Enter subject for period"
              />
            </View>

            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => {
                  setShowTimePicker(true);
                  setSelectedTimeFor(fromTime ? 'toTime' : 'fromTime');
                }}
              >
                <Text style={styles.timeText}>
                {fromTime && toTime ? `From: ${fromTime} To: ${toTime}` : 'Select From and To Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(e, selectedDate) => handleTimeChange(e, selectedDate)}
              />
            )}

            {/* Add Period Button */}
            <View style={styles.pickerContainer}>
              <TouchableOpacity style={styles.button} onPress={addPeriod}>
                <Text style={styles.buttonText}>Add Period {currentPeriod}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Interval Type and Time Inputs for Interval */}
        {activeButton === 'interval' && (
          <>
            <View style={styles.pickerContainer}>
              <Text>Interval Type:</Text>
              <Picker
                selectedValue={intervalType}
                onValueChange={(itemValue) => setIntervalType(itemValue)}
              >
                <Picker.Item label="Morning Interval" value="morning" />
                <Picker.Item label="Lunch Interval" value="lunch" />
                <Picker.Item label="Afternoon Interval" value="afternoon" />
                <Picker.Item label="Evening Interval" value="evening" />
              </Picker>
            </View>

            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => {
                  setShowTimePicker(true);
                  setSelectedTimeFor(intervalFromTime ? 'toTime' : 'fromTime');
                }}
              >
                <Text style={styles.timeText}>
                {intervalFromTime && intervalToTime ? `From: ${intervalFromTime} To: ${intervalToTime}` : 'Select From and To Time'}
                </Text>
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(e, selectedDate) => handleTimeChange(e, selectedDate)}
              />
            )}

            {/* Add Interval Button */}
            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'rgb(160, 180,182)' }]} // Apply the color directly to the button style
                onPress={addInterval}
              >
                <Text style={styles.buttonText}>Add Interval</Text>
              </TouchableOpacity>
            </View>

          </>
        )}

        {/* Render Periods */}
        {timetable.length > 0 && (
          <View style={styles.tableContainer}>
            {timetable.map((item, index) => (
              <View key={index} style={styles.row}>
<Text style={styles.column}>{`Period ${item.period}: ${item.subject}`}</Text>
<Text style={styles.column}>{item.fromTime} - {item.toTime}</Text>
                <Button title="Remove" onPress={() => removePeriod(index)} color="#FF0000" />
              </View>
            ))}
          </View>
        )}

        {/* Render Intervals */}
        {intervals.length > 0 && (
          <View style={styles.tableContainer}>
            {intervals.map((item, index) => (
              <View key={index} style={styles.row}>
<Text style={styles.column}>{`Interval (${item.intervalType}):`}</Text>
<Text style={styles.column}>{item.fromTime} - {item.toTime}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={submitTimetable}>
          <Text style={styles.buttonText}>Submit Timetable</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor:'#fff', // Responsive padding
  },
  title: { 
    fontSize: wp('6%'),  // Responsive font size
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginVertical: hp('2.5%'),  // Responsive vertical margin
  },
  input: {
    height: hp('5%'),  // Responsive height
    borderColor: 'gray', 
    borderWidth: 1, 
    paddingLeft: wp('2%'),  // Responsive padding
    borderRadius: wp('1.5%'),  // Responsive border radius
  },
  timePickerButton: { 
    backgroundColor: 'rgb(160, 180,182)', 
    padding: wp('3%'),  // Responsive padding
    marginVertical: hp('1.5%'),  // Responsive vertical margin
    borderRadius: wp('1.5%'),  // Responsive border radius
  },
  timeText: { 
    color: '#fff', 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: 'rgb(160, 180,182)', 
    padding: wp('3%'),  // Responsive padding
    marginTop: hp('1.5%'),  // Responsive margin top
    borderRadius: wp('1.5%'),  // Responsive border radius
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center' 
  },
  activeButton: { 
    backgroundColor: 'rgb(160, 180,182)' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: hp('2%'),  // Responsive margin bottom
  },
  column: { 
    fontSize: wp('4%'),  // Responsive font size
    flex: 1 
  },
  submitButton: { 
    backgroundColor: 'rgb(160, 180,182)', 
    padding: wp('3.5%'),  // Responsive padding
    borderRadius: wp('1.5%'),  // Responsive border radius
    alignItems: 'center', 
    marginTop: hp('2.5%'),  // Responsive margin top
  },
  mainHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgb(160, 180, 182)', 
    paddingVertical: hp('1.5%'),  // Responsive vertical padding
    paddingHorizontal: wp('4%'),  // Responsive horizontal padding
    height: hp('12%'),  // Responsive height
    marginBottom: wp('3%'),  // Responsive bottom margin
  },
  logo: {
    width: wp('15%'),  // Responsive width
    height: wp('15%'),  // Responsive height to match width
  },
  subHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
paddingVertical: hp('1%'),
alignItems: 'center',
height: hp('3%'),
},
subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
},
  mobileFrame: {
    flex: 1, 
    backgroundColor: '#f0f0f0' 
  },
  
  pickerContainer: {
    marginTop: hp('7%'),  // Responsive margin top
  }
});
export default ManageUploadTimetable;