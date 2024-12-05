// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
// import { Icon, Header } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';

// const ManagmentEventCalendar = () => {
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
//   const [events, setEvents] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [eventTitle, setEventTitle] = useState('');
//   const [eventDate, setEventDate] = useState('');
//   const navigation = useNavigation();

//   useEffect(() => {
//     updateEventCalendar();
//   }, [currentYear, currentMonthIndex]);

//   const createCalendarDays = (year, monthIndex, daysInMonth, startDay) => {
//     const daysContainer = [];

//     for (let i = 0; i < startDay; i++) {
//       daysContainer.push(<View key={empty-`${i}`} style={styles.emptyDay} />);
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const today = new Date();
//       const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;
//       const event = events.find(e => new Date(e.date).getDate() === day);

//       daysContainer.push(
//         <TouchableOpacity
//           key={day}
//           style={[styles.day, event && styles.eventDay, isToday && styles.today]}
//           onPress={() => {
//             setEventDate(`${year}-${monthIndex + 1}-${day}`);
//             setModalVisible(true);
//           }}
//         >
//           <Text style={isToday ? styles.dayText : styles.dayText}>{day}</Text>
//         </TouchableOpacity>
//       );
//     }

//     return daysContainer;
//   };

//   const generateEventCalendar = (year, monthIndex) => {
//     const firstDayOfMonth = new Date(year, monthIndex, 1);
//     const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
//     const startDay = firstDayOfMonth.getDay();

//     return (
//       <View style={styles.month}>
//         <View style={styles.weekdays}>
//           {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
//             <Text key={index} style={styles.weekday}>{day}</Text>
//           ))}
//         </View>
//         <View style={styles.days}>
//           {createCalendarDays(year, monthIndex, daysInMonth, startDay)}
//         </View>
//       </View>
//     );
//   };

//   const fetchEventCalendarData = (year, monthIndex) => {
//     const demoEvents = [
//       { date: `${year}-${monthIndex + 1}-5`, title: 'Sports Day' },
//       { date: `${year}-${monthIndex + 1}-15`, title: 'Annual Day' },
//       { date: `${year}-${monthIndex + 1}-20`, title: 'Midterm Exams' },
//       { date: `${year}-${monthIndex + 1}-25`, title: 'Holiday' },
//     ];

//     setEvents(demoEvents);
//   };

//   const updateEventCalendar = () => {
//     fetchEventCalendarData(currentYear, currentMonthIndex);
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         containerStyle={styles.mainHeader}
//         leftComponent={
//           <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//             <Image
//               source={require('./assets/images/slides/logo226.png')}
//               style={styles.logo}
//             />
//           </TouchableOpacity>
//         }
//         centerComponent={{ text: '', style: { color: '#fff', fontSize: 20 } }}
//         rightComponent={
//           <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
//             <Icon
//               name="home"
//               type="font-awesome"
//               color="black"
//               iconStyle={styles.homeIcon}
//             />
//           </TouchableOpacity>
//         }
//       />

//       <View style={styles.emptyHeader} />

//       <Text style={styles.calendarTitle}>School Event Calendar for {currentYear}</Text>

//       <View style={styles.calendarContainer}>
//         <View style={styles.monthNavigation}>
//           <TouchableOpacity onPress={() => {
//             if (currentMonthIndex === 0) {
//               setCurrentMonthIndex(11);
//               setCurrentYear(currentYear - 1);
//             } else {
//               setCurrentMonthIndex(currentMonthIndex - 1);
//             }
//           }} style={styles.navigationButtonBox}>
//             <Text style={styles.navigationButton}>{'<'}</Text>
//           </TouchableOpacity>

//           <Text style={styles.monthTitle}>{new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })}</Text>

//           <TouchableOpacity onPress={() => {
//             if (currentMonthIndex === 11) {
//               setCurrentMonthIndex(0);
//               setCurrentYear(currentYear + 1);
//             } else {
//               setCurrentMonthIndex(currentMonthIndex + 1);
//             }
//           }} style={styles.navigationButtonBox}>
//             <Text style={styles.navigationButton}>{'>'}</Text>
//           </TouchableOpacity>
//         </View>

//         <View id="event-calendar-container">
//           {generateEventCalendar(currentYear, currentMonthIndex)}
//         </View>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text>Enter Event Title</Text>
//             <TextInput
//               style={styles.input}
//               value={eventTitle}
//               onChangeText={setEventTitle}
//               placeholder="Event Title"
//             />

//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => {
//                 fetch('http://192.168.0.114:3000/add-event', {
//                   method: 'POST',
//                   headers: {
//                     'Content-Type': 'application/json',
//                   },
//                   body: JSON.stringify({
//                     title: eventTitle,
//                     date: eventDate,
//                   }),
//                 })
//                   .then(response => response.json())
//                   .then(data => {
//                     if (data.message === 'Event added successfully') {
//                       setEvents([...events, { date: eventDate, title: eventTitle }]);
//                       setModalVisible(false);
//                       setEventTitle('');
//                       setEventDate('');
//                     } else {
//                       console.log('Error adding event:', data.error);
//                     }
//                   })
//                   .catch(error => console.error('Error:', error));
//               }}
//             >
//               <Text>Save Event</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
//               <Text>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   mainHeader: {
//     backgroundColor: '#AABEC3',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 100,
//     flexDirection: 'row',
//     paddingHorizontal: 10,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     resizeMode: 'contain',
//   },
//   emptyHeader: {
//     padding: 3,
//     backgroundColor: '#AABEC3',
//     alignItems: 'center',
//     paddingVertical: 5,
//     paddingHorizontal: 1,
//     marginTop: 5,
//     height: 15,
//   },
//   calendarTitle: {
//     textAlign: 'center',
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   calendarContainer: { marginTop: 20 },
//   monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   monthTitle: { fontSize: 18, fontWeight: 'bold' },
//   navigationButtonBox: {
//     borderColor: '#AABEC3',
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 5,
//   },
//   navigationButton: {
//     fontSize: 18,
//     color: '#AABEC3',
//   },
//   month: { marginVertical: 10 },
//   weekdays: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F0F0F0', padding: 5 },
//   weekday: { width: '14%', textAlign: 'center', fontWeight: 'bold', color: '#444' },
//   days: { flexDirection: 'row', flexWrap: 'wrap' },
//   day: {
//     width: '14%',
//     padding: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderColor: '#DDD',
//     borderWidth: 1,
//   },
//   dayText: { color: '#000' },
//   today: { backgroundColor: '#FFDDC1' },
//   eventDay: { backgroundColor: '#C1FFD7' },
//   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' },
//   input: { height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 10, paddingLeft: 8 },
//   button: { backgroundColor: '#4CAF50', padding: 10, marginTop: 10, alignItems: 'center', borderRadius: 5 },
//   homeIcon: { fontSize: 24, color: '#000' },
// });

// export default ManagmentEventCalendar;




import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const ManagmentEventCalendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    updateEventCalendar();
  }, [currentYear, currentMonthIndex]);

  const createCalendarDays = (year, monthIndex, daysInMonth, startDay) => {
    const daysContainer = [];

    // Add empty spaces for days of the previous month
    for (let i = 0; i < startDay; i++) {
      daysContainer.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }

    // Generate the days in the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = today.getFullYear() === year && today.getMonth() === monthIndex && today.getDate() === day;
      const event = events.find(e => new Date(e.date).getDate() === day);

      daysContainer.push(
        <TouchableOpacity
          key={day}
          style={[styles.day, event && styles.eventDay, isToday && styles.today]}
          onPress={() => {
            setEventDate(`${year}-${monthIndex + 1}-${day}`);
            setModalVisible(true);
          }}
        >
          <Text style={isToday ? styles.todayText : styles.dayText}>{day}</Text>
        </TouchableOpacity>
      );
    }

    return daysContainer;
  };

  const generateEventCalendar = (year, monthIndex) => {
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const startDay = firstDayOfMonth.getDay();

    return (
      <View style={styles.month}>
        <View style={styles.weekdays}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <Text key={index} style={styles.weekday}>{day}</Text>
          ))}
        </View>
        <View style={styles.days}>
          {createCalendarDays(year, monthIndex, daysInMonth, startDay)}
        </View>
      </View>
    );
  };

  const fetchEventCalendarData = (year, monthIndex) => {
    // Replace with actual API fetching logic
    const demoEvents = [
      { date: `${year}-${monthIndex + 1}-5`, title: 'Sports Day' },
      { date: `${year}-${monthIndex + 1}-15`, title: 'Annual Day' },
      { date: `${year}-${monthIndex + 1}-20`, title: 'Midterm Exams' },
      { date: `${year}-${monthIndex + 1}-25`, title: 'Holiday' },
    ];

    setEvents(demoEvents);
  };

  const updateEventCalendar = () => {
    fetchEventCalendarData(currentYear, currentMonthIndex);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainHeader}>
       
          <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
            <Image
              source={require('./assets/images/slides/logo226.png')}
              style={styles.logo}
            />
          </TouchableOpacity>
        
       
          <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
      </TouchableOpacity>
        
      </View>

      <View style={styles.subHeader} />

      <Text style={styles.calendarTitle}>School Event Calendar for {currentYear}</Text>

      <View style={styles.calendarContainer}>
        <View style={styles.monthNavigation}>
          <Button title="<" onPress={() => {
            if (currentMonthIndex === 0) {
              setCurrentMonthIndex(11);
              setCurrentYear(currentYear - 1);
            } else {
              setCurrentMonthIndex(currentMonthIndex - 1);
            }
          }} />
          <Text style={styles.monthTitle}>{new Date(currentYear, currentMonthIndex).toLocaleString('default', { month: 'long' })}</Text>
          <Button title=">" onPress={() => {
            if (currentMonthIndex === 11) {
              setCurrentMonthIndex(0);
              setCurrentYear(currentYear + 1);
            } else {
              setCurrentMonthIndex(currentMonthIndex + 1);
            }
          }} />
        </View>

        <View id="event-calendar-container">
          {generateEventCalendar(currentYear, currentMonthIndex)}
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Enter Event Title</Text>
            <TextInput
              style={styles.input}
              value={eventTitle}
              onChangeText={setEventTitle}
              placeholder="Event Title"
            />



'
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                fetch('http://50.6.194.240:5000/api/add-event', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    title: eventTitle,
                    date: eventDate,
                  }),
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.message === 'Event added successfully') {
                      setEvents(prevEvents => [...prevEvents, { date: eventDate, title: eventTitle }]);
                      setModalVisible(false);
                      setEventTitle('');
                      setEventDate('');
                    } else {
                      console.log('Error adding event:', data.error);
                    }
                  })
                  .catch(error => console.error('Error:', error));
              }}
            >
              <Text>Save Event</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendarTitle: {
    textAlign: 'center',
    fontSize: wp('4.5%'),  // Responsive font size
    fontWeight: 'bold',
    marginBottom: hp('1%'),  // Responsive margin
    marginTop: hp('2%'),  // Responsive margin
  },
  calendarContainer: {
    marginTop: hp('6%'),  // Responsive margin top
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),  // Responsive margin bottom
  },
  monthTitle: {
    fontSize: wp('4.5%'),  // Responsive font size
  },
  month: {
    marginVertical: hp('1.2%'),  // Responsive margin
  },
  weekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    padding: wp('1.2%'),  // Responsive padding
  },
  weekday: {
    width: '14%',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14%',
    padding: hp('1.3%'),  // Responsive padding
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#DDD',
    borderWidth: 1,
  },
  emptyDay: {
    width: '14%',
    height: hp('6%'),  // Responsive height
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayText: {
    fontSize: wp('3.5%'),  // Responsive font size
  },
  eventDay: {
    backgroundColor: '#d0e7f3',
  },
  today: {
    backgroundColor: '#FFF9C4',
    borderColor: '#000',
    borderWidth: 1,
  },
  todayText: {
    color: '#000',
    fontWeight: 'bold',
  },
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
  homeIcon: {
    paddingRight: wp('5%'),  // Responsive padding
    fontSize: wp('5%'),  // Responsive font size
  },
  subHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1%'),  // Responsive padding
    alignItems: 'center',
    height: hp('3%'),  // Responsive margin
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: wp('5%'),  // Responsive padding
    borderRadius: wp('3%'),  // Responsive border radius
    width: '80%',
  },
  input: {
    height: hp('6%'),  // Responsive height
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: hp('2%'),  // Responsive margin bottom
    paddingLeft: wp('2%'),  // Responsive padding
    borderRadius: wp('2%'),  // Responsive border radius
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: wp('3%'),  // Responsive padding
    alignItems: 'center',
    borderRadius: wp('2%'),  // Responsive border radius
    marginTop: hp('1.5%'),  // Responsive margin top
  },
});

export default ManagmentEventCalendar;
