// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
// import axios from 'axios';
// import { Icon } from 'react-native-elements';

// const ParentTimetable = ({ route, navigation }) => {
//   const { class_id, section_id } = route.params || {}; // Destructure the class_id and section_id from route params

//   const [timetable, setTimetable] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;  // Track if the component is mounted

//     const fetchTimetable = async () => {
//       try {
//         const { username } = route.params;  // Extract the username from route params

//         if (!username) {
//           console.error('Username is required');
//           setError('Username is required');
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get('http://50.6.194.240:5000/api/getTimetable', {
//           params: { username },  // Send username as query parameter
//         });

//         if (isMounted) {
//           setTimetable(response.data);
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching timetable:', err);
//         if (isMounted) {
//           setError('Failed to fetch timetable data');
//           setLoading(false);
//         }
//       }
//     };

//     fetchTimetable();

//     return () => {
//       isMounted = false;  // Cleanup if the component unmounts
//     };
//   }, [route.params]);

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#2980b9" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   // Extract periods dynamically from the timetable
//   const periods = [];
//   for (let i = 1; i <= 10; i++) {
//     if (timetable[`period_${i}_subject`]) {
//       periods.push({
//         name: `Period ${i}`,
//         subject: timetable[`period_${i}_subject`],
//         time: `${timetable[`period_${i}_from_time`] || 'N/A'} - ${timetable[`period_${i}_to_time`] || 'N/A'}`,
//       });
//     }
//   }

//   // Define interval times based on the table fields
//   const intervals = [
//     { name: 'Morning Interval', time: timetable['morning_interval_time'] || '' },
//     { name: 'Lunch Interval', time: timetable['lunch_interval_time'] || '' },
//     { name: 'Afternoon Interval', time: timetable['afternoon_interval_time'] || '' },
//     { name: 'Evening Interval', time: timetable['evening_interval_time'] || '' },
//   ];

//   // Only include valid intervals (non-empty)
//   const validIntervals = intervals.filter((interval) => interval.time.trim() !== '');

//   const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//   // Helper function to insert intervals between periods
//   const getPeriodsWithIntervals = (periods, intervals) => {
//     const periodsWithIntervals = [];

//     periods.forEach((period, index) => {
//       periodsWithIntervals.push(period);

//       // Insert intervals between periods
//       if (index < intervals.length) {
//         periodsWithIntervals.push({ isInterval: true, interval: intervals[index] });
//       }
//     });

//     return periodsWithIntervals;
//   };

//   const periodsWithIntervals = getPeriodsWithIntervals(periods, validIntervals);

//   return (
//     <View style={styles.container}>
//       {/* Header Section */}
//       <View style={styles.mobileFrame}>
//         <View style={styles.mainHeader}>
//           <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
//             <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//           </TouchableOpacity>
//           <View style={{ flex: 1 }} />
//           <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
//             <Icon name="home" type="material" size={60} color="#000" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.emptyHeader} />
//       </View>

//       {/* Timetable Section */}
//       <ScrollView style={styles.timetableContainer}>
//         <Text style={styles.title}>StudentTimetable</Text>

//         {timetable ? (
//           <ScrollView horizontal>
//             <View style={styles.table}>
//               {/* Header Row for Days */}
//               <View style={styles.headerRow}>
//                 <View style={styles.tableHeader}>
//                   <Text style={styles.headerText}>Day</Text>
//                 </View>

//                 {/* Render Periods and Intervals in header */}
//                 {periodsWithIntervals.map((item, index) => {
//                   if (item.isInterval) {
//                     return (
//                       <View key={`interval-${index}`} style={styles.periodHeader}>
//                         <Text style={styles.headerText}>{item.interval.name}</Text>
//                         <Text style={styles.timeText}>{item.interval.time}</Text>
//                       </View>
//                     );
//                   } else {
//                     return (
//                       <View key={`period-${index}`} style={styles.periodHeader}>
//                         <Text style={styles.headerText}>{item.name}</Text>
//                         <Text style={styles.timeText}>{item.time}</Text>
//                       </View>
//                     );
//                   }
//                 })}
//               </View>

//               {/* Render Data Rows for Days */}
//               {days.map((day) => (
//                 <View key={day} style={styles.row}>
//                   <View style={styles.dayCell}>
//                     <Text style={styles.text}>{day}</Text>
//                   </View>

//                   {/* Render Periods and Intervals for Each Day */}
//                   {periodsWithIntervals.map((item, periodIndex) => {
//                     if (item.isInterval) {
//                       return (
//                         <View key={`${day}-interval-${periodIndex}`} style={styles.periodCell}>
//                           <Text style={styles.text}>{item.interval.time}</Text>
//                         </View>
//                       );
//                     } else {
//                       return (
//                         <View key={`${day}-period-${periodIndex}`} style={styles.periodCell}>
//                           <Text style={styles.text}>
//                             {timetable[`${day.toLowerCase()}_period${periodIndex + 1}_subject`] || item.subject}
//                           </Text>
//                         </View>
//                       );
//                     }
//                   })}
//                 </View>
//               ))}
//             </View>
//           </ScrollView>
//         ) : (
//           <Text style={styles.noTimetable}>No timetable available</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f4f7',
//     padding: 15,
//   },
//   mobileFrame: {
//     backgroundColor: '#fff',
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   mainHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#2980b9',
//   },
//   logo: {
//     width: 50,
//     height: 50,
//     resizeMode: 'contain',
//   },
//   emptyHeader: {
//     height: 20,
//     backgroundColor: '#f0f4f7',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#2980b9',
//     marginBottom: 20,
//   },
//   mobileFrame: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   headerRow: {
//     flexDirection: 'row',
//     backgroundColor: '#7f8c8d',
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   tableHeader: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 8,
//     width: 120,
//   },
//   periodHeader: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 8,
//     width: 120,
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   timeText: {
//     fontSize: 12,
//     color: 'white',
//   },
//   row: {
//     flexDirection: 'row',
//     backgroundColor: '#ecf0f1',
//     borderBottomWidth: 1,
//     borderColor: '#ddd',
//   },
//   dayCell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     width: 120,
//   },
//   periodCell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 10,
//     width: 120,
//   },
//   text: {
//     fontSize: 14,
//     color: '#34495e',
//   },
//   noTimetable: {
//     textAlign: 'center',
//     fontSize: 18,
//     marginTop: 20,
//     color: '#7f8c8d',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   mainHeader: {
//     backgroundColor: 'rgb(160, 180, 182)',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//     height: 110,
//     flexDirection: 'row',
//     paddingHorizontal: 15,
//   },
//   emptyHeader: {
//     height: 30,
//     backgroundColor: 'rgb(160, 180, 182)',
//     marginTop: 2,
//     elevation: 2,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     elevation: 2,
//   },
// });

// export default ParentTimetable;








import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import * as ScreenOrientation from 'expo-screen-orientation';  // Import ScreenOrientation from expo
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentTimetable = ({ route, navigation }) => {
  const { class_id, section_id } = route.params || {}; // Destructure the class_id and section_id from route params

  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true); // New state to track header visibility

  useEffect(() => {
    let isMounted = true;  // Track if the component is mounted

    const fetchTimetable = async () => {
      try {
        const { username } = route.params;  // Extract the username from route params

        if (!username) {
          console.error('Username is required');
          setError('Username is required');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://50.6.194.240:5000/api/getTimetable', {
          params: { username },  // Send username as query parameter
        });

        if (isMounted) {
          setTimetable(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching timetable:', err);
        if (isMounted) {
          setError('Failed to fetch timetable data');
          setLoading(false);
        }
      }
    };

    fetchTimetable();

    return () => {
      isMounted = false;  // Cleanup if the component unmounts
    };
  }, [route.params]);

  const toggleOrientation = async () => {
    // Get current orientation and toggle it
    const currentOrientation = await ScreenOrientation.getOrientationAsync();

    if (currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
      // Lock to landscape if currently portrait
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setHeaderVisible(false); // Hide the header in landscape mode
    } else {
      // Lock to portrait if currently landscape
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setHeaderVisible(true); // Show the header in portrait mode
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Extract periods dynamically from the timetable
  const periods = [];
  for (let i = 1; i <= 10; i++) {
    if (timetable[`period_${i}_subject`]) {
      periods.push({
        name: `Period ${i}`,
        subject: timetable[`period_${i}_subject`],
        time: `${timetable[`period_${i}_from_time`] || 'N/A'} - ${timetable[`period_${i}_to_time`] || 'N/A'}`,
      });
    }
  }

  // Define interval times based on the table fields
  const intervals = [
    { name: 'Morning Interval', time: timetable['morning_interval_time'] || '' },
    { name: 'Lunch Interval', time: timetable['lunch_interval_time'] || '' },
    { name: 'Afternoon Interval', time: timetable['afternoon_interval_time'] || '' },
    { name: 'Evening Interval', time: timetable['evening_interval_time'] || '' },
  ];

  // Only include valid intervals (non-empty)
  const validIntervals = intervals.filter((interval) => interval.time.trim() !== '');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Helper function to insert intervals between periods
  const getPeriodsWithIntervals = (periods, intervals) => {
    const periodsWithIntervals = [];

    periods.forEach((period, index) => {
      periodsWithIntervals.push(period);

      // Insert intervals between periods
      if (index < intervals.length) {
        periodsWithIntervals.push({ isInterval: true, interval: intervals[index] });
      }
    });

    return periodsWithIntervals;
  };

  const periodsWithIntervals = getPeriodsWithIntervals(periods, validIntervals);

  return (
    <View style={styles.container}>
      {/* Conditionally render the header part */}
      
          <View style={styles.mainHeader}>
            <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
              <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
              <Icon name="home" type="material" size={wp('10%')} color="#000" />
            </TouchableOpacity>
          </View>
        
          <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

      {/* Timetable Section */}
      <ScrollView style={styles.timetableContainer}>
        <Text style={styles.title}>StudentTimetable</Text>

        {timetable ? (
          <ScrollView horizontal>
            <View style={styles.table}>
              {/* Header Row for Days */}
              <View style={styles.headerRow}>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerText}>Day</Text>
                </View>

                {/* Render Periods and Intervals in header */}
                {periodsWithIntervals.map((item, index) => {
                  if (item.isInterval) {
                    return (
                      <View key={`interval-${index}`} style={styles.periodHeader}>
                        <Text style={styles.headerText}>{item.interval.name}</Text>
                        <Text style={styles.timeText}>{item.interval.time}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View key={`period-${index}`} style={styles.periodHeader}>
                        <Text style={styles.headerText}>{item.name}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                      </View>
                    );
                  }
                })}
              </View>

              {/* Render Data Rows for Days */}
              {days.map((day) => (
                <View key={day} style={styles.row}>
                  <View style={styles.dayCell}>
                    <Text style={styles.text}>{day}</Text>
                  </View>

                  {/* Render Periods and Intervals for Each Day */}
                  {periodsWithIntervals.map((item, periodIndex) => {
                    if (item.isInterval) {
                      return (
                        <View key={`${day}-interval-${periodIndex}`} style={styles.periodCell}>
                          <Text style={styles.text}>{item.interval.time}</Text>
                        </View>
                      );
                    } else {
                      return (
                        <View key={`${day}-period-${periodIndex}`} style={styles.periodCell}>
                          <Text style={styles.text}>
                            {timetable[`${day.toLowerCase()}_period${periodIndex + 1}_subject`] || item.subject}
                          </Text>
                        </View>
                      );
                    }
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          <Text style={styles.noTimetable}>No timetable available</Text>
        )}
      </ScrollView>

      {/* Rotate Orientation Icon */}
      <View style={styles.rotationContainer}>
        <TouchableOpacity onPress={toggleOrientation}>
          <Icon name="screen-rotation" type="material-community" size={40} color="#2980b9" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#7f8c8d',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 120,
  },
  periodHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 120,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  dayCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 120,
  },
  periodCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 120,
  },
  text: {
    fontSize: 14,
    color: '#34495e',
  },
  noTimetable: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#7f8c8d',
  },
  rotationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

export default ParentTimetable;