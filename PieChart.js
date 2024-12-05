// import React from 'react';
// import {
//   View,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import { Icon } from 'react-native-elements'; // Importing Icon from react-native-elements
// import { useNavigation } from '@react-navigation/native';

// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import OverallReport from './OverallReport';
// import AcademicAttendance from './AcademicAttendance';
// import AcademicReport from './AcademicReport';
// import BehaviorReport from './BehaviorReport';
// import ActivitiesReport from './ActivitiesReport';
// const PieChart = ({ route }) => {
//   const navigation = useNavigation(); // Hook for navigation
//   const { username } = route.params || {};
//   console.log(username + "hsfgsdfg");

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Main Header with Logo */}
//       <View style={styles.mainHeader}>
//         {/* Logo with Navigation */}
//         <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
//           <Image
//             source={require('./assets/images/slides/logo226.png')} // Replace with your logo path
//             style={styles.logo}
//           />
//         </TouchableOpacity>

//         {/* 
//         <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
//           <Icon name="home" type="material" size={wp('10%')} color="#000" />
//         </TouchableOpacity> */}
//       </View>

//       {/* Subheader */}
//       <View style={styles.subHeader}>
//         <Text style={styles.subHeaderText}></Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         {/* Welcome Text */}
//         <Text style={styles.usernameText}>Welcome, {username}</Text>

//         {/* Display the OverallReport at the top */}
//         <OverallReport style={styles.overallReportContainer} username={username} />

//         {/* Row 1: AcademicAttendance and AcademicReport */}
//         <View style={styles.row}>
//           <AcademicAttendance username={username} />
//           <AcademicReport username={username} />
//         </View>

//         {/* Row 2: BehaviorReport and ActivitiesReport */}
//         <View style={styles.row}>
//           <BehaviorReport username={username} />
//           <ActivitiesReport username={username} />
//         </View>

//         {/* Adding extra content to emphasize scrolling */}
//         <View style={styles.extraContent}>
        
//           <Text style={styles.extraText}>
//             GO TO STUDENT DASHBOARD.
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   mainHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1.5%'),  // Responsive padding
//     paddingHorizontal: wp('4%'),  // Responsive padding
//     height: hp('12%'),  // Responsive height
//     marginBottom: wp('3%'),  // Responsive margin bottom
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
//   scrollContainer: {
//     padding: wp(4), // Responsive padding based on screen width
//     flexGrow: 1,    // Ensures the ScrollView expands with content
//   },
//   usernameText: {
//     fontSize: wp(6),  // Responsive font size based on screen width
//     fontWeight: 'bold',
//     marginBottom: hp(2.5), // Responsive margin based on screen height
//     textAlign: 'center',
//     color: '#333',
//   },
//   overallReportContainer: {
//     alignItems: 'center',
//     marginBottom: hp(3.75), // Responsive spacing between OverallReport and rows
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     marginBottom: hp(3.75), // Responsive margin between rows
//   },
//   extraContent: {
//     marginTop: hp(3.75),      // Responsive margin based on screen height
//     padding: wp(4),           // Responsive padding based on screen width
//     backgroundColor: '#e6f7ff',
//     borderRadius: wp(2.5),    // Responsive border radius based on screen width
//   },
//   extraText: {
//     fontSize: wp(4),          // Responsive font size based on screen width
//     color: '#555',
//     textAlign: 'center',
//   },
// });

// export default PieChart;


import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,  // Import BackHandler
} from 'react-native';
import { Icon } from 'react-native-elements'; // Importing Icon from react-native-elements
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect for back button handling
import AcademicAttendance from './AcademicAttendance';
import AcademicReport from './AcademicReport';
import BehaviorReport from './BehaviorReport';
import ActivitiesReport from './ActivitiesReport';
import OverallReport from './OverallReport';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PieChart = ({ route }) => {
  const navigation = useNavigation(); // Hook for navigation
  const { username } = route.params || {};
  
  console.log(username + "hsfgsdfg");

  // Handle back button press and navigate to ParentDashboard
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('ParentDashboard');  // Navigate to ParentDashboard on back press
        return true;  // Prevent default back button behavior
      };

      // Add event listener for back button press
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup the event listener when the component is unfocused
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Header with Logo */}
      <View style={styles.mainHeader}>
        {/* Logo with Navigation */}
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Image
            source={require('./assets/images/slides/logo226.png')} // Replace with your logo path
            style={styles.logo}
          />
        </TouchableOpacity>

        {/* Home Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Subheader */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}></Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Welcome Text */}
        <Text style={styles.usernameText}>Welcome, {username}</Text>

        {/* Display the OverallReport at the top */}
        <OverallReport style={styles.overallReportContainer} username={username} />

        {/* Row 1: AcademicAttendance and AcademicReport */}
        <View style={styles.row}>
          <AcademicAttendance username={username} />
          <AcademicReport  username={username}/>
        </View>

        {/* Row 2: BehaviorReport and ActivitiesReport */}
        <View style={styles.row}>
          <BehaviorReport username={username}/>
          <ActivitiesReport username={username} />
        </View>

        {/* Adding extra content to emphasize scrolling */}
        <View style={styles.extraContent}>
          <Text style={styles.extraText}>
            GO TO STUDENT DASHBOARD.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    height: hp('4%'),  // Responsive height
  },
  subHeaderText: {
    fontSize: wp('5%'),  // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: wp(4), // Responsive padding based on screen width
    flexGrow: 1,    // Ensures the ScrollView expands with content
  },
  usernameText: {
    fontSize: wp(6),  // Responsive font size based on screen width
    fontWeight: 'bold',
    marginBottom: hp(2.5), // Responsive margin based on screen height
    textAlign: 'center',
    color: '#333',
  },
  overallReportContainer: {
    alignItems: 'center',
    marginBottom: hp(3.75), // Responsive spacing between OverallReport and rows
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: hp(3.75), // Responsive margin between rows
  },
  extraContent: {
    marginTop: hp(3.75),      // Responsive margin based on screen height
    padding: wp(4),           // Responsive padding based on screen width
    backgroundColor: '#e6f7ff',
    borderRadius: wp(2.5),    // Responsive border radius based on screen width
  },
  extraText: {
    fontSize: wp(4),          // Responsive font size based on screen width
    color: '#555',
    textAlign: 'center',
  },
});

export default PieChart;
