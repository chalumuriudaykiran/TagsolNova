// import React, { useState, useEffect } from 'react';
// import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faUser, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { useNavigation } from '@react-navigation/native';
// import { Shadow } from 'react-native-shadow-2';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


// const ManagDashboard = () => {
//   const [searchBarVisible, setSearchBarVisible] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const navigation = useNavigation();

//   const studentImages = [
//     require('./assets/images/slides/logo226.png'),
//     require('./assets/images/slides/homeworkapp.png'),
//     require('./assets/images/slides/bus.png'),
//     require('./assets/images/slides/timetable.png'),
//   ];

//   const itemImages = {
//     "Create-account": require('./assets/images/slides/acad1.jpg'),
//     "Time-table": require('./assets/images/slides/apptimetable.jpeg'),
//     "Attendence-records": require('./assets/images/slides/att.jpg'),
//     "Event-calendar": require('./assets/images/slides/eventCopy.jpg'),
//     "Photo-sharing": require('./assets/images/slides/share.jpg'),
//     "Fees-upload": require('./assets/images/slides/mfee.jpg'),
//     "Academic-performance": require('./assets/images/slides/acadapp.jpg'),
//     "Notification-Message": require('./assets/images/slides/image.png'),

    
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % studentImages.length);
//     }, 2000); // Change image every 2 seconds
//     return () => clearInterval(intervalId);
//   }, []);

//   const toggleSearch = () => {
//     setSearchBarVisible(!searchBarVisible);
//   };

//   const handleSearch = (query) => {
//     setSearchQuery(query);
//   };

//   // Filter items based on the search query
//   const filteredItems = Object.keys(itemImages).filter((item) =>
//     item.replace(/-/g, ' ').toUpperCase().includes(searchQuery.toUpperCase())
//   );

//   return (
//     <View style={styles.mobileFrame}>
//       {/* Main Header */}
//       <View style={styles.header}>
//         <TouchableOpacity>
//           <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//         </TouchableOpacity>
//         <View style={styles.headerRight}>
//           <TouchableOpacity onPress={toggleSearch}>
//             <FontAwesomeIcon icon={faSearch} size={20} color="#000" style={styles.icon} />
//           </TouchableOpacity>
//           {searchBarVisible && (
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search..."
//               value={searchQuery}
//               onChangeText={handleSearch}
//               onSubmitEditing={() => handleSearch(searchQuery)}
//             />
//           )}
//           <TouchableOpacity onPress={() => navigation.navigate('')}>
//             <FontAwesomeIcon icon={faUser} size={20} color="#000" style={styles.icon} />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <FontAwesomeIcon icon={faBell} size={20} color="#000" style={styles.icon} />
//           </TouchableOpacity>
//         </View>
//       </View>
      

//       {/* Sub-Header */}
//       <View style={styles.subHeader}>
//         <Text style={styles.subHeaderText}></Text>
//       </View>
//       <Text></Text>
//       <Text></Text>

//       {/* Profile Section */}
//       <View style={styles.profilePictureContainer}>
//         <Shadow startColor="rgba(0, 0, 0, 0.3)" offset={[5, 5]} radius={10} distance={10}>
//           <Image source={studentImages[currentIndex]} style={styles.profilePicture} />
//         </Shadow>
//         <Text></Text>
//         <Text></Text>
        
//         <Text style={styles.studentName}>Management Dashboard</Text>
//       </View>
//       <Text></Text>
//       <Text></Text>
//       <Text></Text>
//       <Text></Text>
      
     
      

//       {/* Scrollable Icons */}
//       <ScrollView horizontal style={styles.scrollingIconsContainer}>
//         {filteredItems.map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.scrollingLink}
//             onPress={() => {
//               switch (item) {
//                 case 'Time-table':
//                   navigation.navigate('ManageUploadTimetable');
//                   break;
//                 case 'Academic-performance':
//                   navigation.navigate('ManagementAcademicPerformance');
//                   break;
//                 case 'Create-account':
//                   navigation.navigate('CreateAccount');
//                   break;
//                 case 'Attendence-records':
//                   navigation.navigate('ManagmentAttendanceView');
//                   break;
//                 case 'Event-calendar':
//                   navigation.navigate('ManagmentEventCalendar');
//                   break;
//                 case 'Photo-sharing':
//                   navigation.navigate('ManagmentEventMediaUpload');
//                   break;
//                 case 'Fees-upload':
//                   navigation.navigate('ManagementFeeUpload');
//                   break;
//                   case 'Notification-Message':
//                     navigation.navigate('NotificationsScreens');
//                     break;
//                 default:
//                   navigation.navigate(item);
//               }
//             }}
//           >
//             <Shadow startColor="rgba(0, 0, 0, 0.5)" offset={[8, 4]} radius={10} distance={10}>
//               <View style={styles.scrollingItem}>
//                 <Image source={itemImages[item]} style={styles.scrollingItemImage} />
//                 <Text style={styles.imageText}>{item.replace(/-/g, ' ').toUpperCase()}</Text>
//               </View>
              
//             </Shadow>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
    
//   );
// };

// const styles = StyleSheet.create({
//   mobileFrame: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
  
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     height: 90,
//     marginTop: 0,
//   },
//   subHeader: {
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: 10,
//     alignItems: 'center',
//     height:20,
//     marginTop:10,
//   },
//   subHeaderText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   logo: {
//     width: 60,
//     height: 60,
//   },
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   icon: {
//     marginLeft: 15,
//   },
//   searchInput: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginLeft: 15,
//     width: 150,
//   },
//   profilePictureContainer: {
//     marginTop: 0,
//     marginBottom: 0,
//     alignItems: 'center',
//   },
//   profilePicture: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//   },
//   studentName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   scrollingIconsContainer: {
//     width: '100%',
//     height: 200,
//   },
//   scrollingLink: {
//     marginRight: 20,
//   },
        
//   scrollingItem: {
//     width: 130,
//     height: 220,
//         borderRadius: 10,
//     marginHorizontal: 5,
//     backgroundColor: '#fff',
//   },
//   scrollingItemImage: {
//     width: '100%',
//         height: '100%',
//         borderRadius: 10,
//   },
//   imageText: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: 'bold',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     padding: 2,
//     borderRadius: 5,
//   },
// });

// export default ManagDashboard;

import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ManagDashboard = () => {
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigation = useNavigation();

  const studentImages = [
    require('./assets/images/slides/logo226.png'),
    require('./assets/images/slides/homeworkapp.png'),
    require('./assets/images/slides/bus.png'),
    require('./assets/images/slides/timetable.png'),
  ];

  const itemImages = {
    "Create-account": require('./assets/images/slides/acad1.jpg'),
    "Time-table": require('./assets/images/slides/apptimetable.jpeg'),
    "Attendence-records": require('./assets/images/slides/att.jpg'),
    "Event-calendar": require('./assets/images/slides/eventCopy.jpg'),
    "Photo-sharing": require('./assets/images/slides/share.jpg'),
    "Fees-upload": require('./assets/images/slides/mfee.jpg'),
    "Academic-performance": require('./assets/images/slides/acadapp.jpg'),
    "Notification-Message": require('./assets/images/slides/image.png'),
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % studentImages.length);
    }, 2000); // Change image every 2 seconds
    return () => clearInterval(intervalId);
  }, []);

  const toggleSearch = () => {
    setSearchBarVisible(!searchBarVisible);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter items based on the search query
  const filteredItems = Object.keys(itemImages).filter((item) =>
    item.replace(/-/g, ' ').toUpperCase().includes(searchQuery.toUpperCase())
  );

  return (
    <View style={styles.mobileFrame}>
      {/* Main Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={toggleSearch}>
            <FontAwesomeIcon icon={faSearch} size={wp('5%')} color="#000" style={styles.icon} />
          </TouchableOpacity>
          {searchBarVisible && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={() => handleSearch(searchQuery)}
            />
          )}
          <TouchableOpacity onPress={() => navigation.navigate('')}>
            <FontAwesomeIcon icon={faUser} size={wp('5%')} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faBell} size={wp('5%')} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-Header */}
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}></Text>
      </View>
      <Text></Text>
      

      {/* Profile Section */}
      <View style={styles.profilePictureContainer}>
        <Shadow startColor="rgba(0, 0, 0, 0.3)" offset={[5, 5]} radius={10} distance={10}>
          <Image source={studentImages[currentIndex]} style={styles.profilePicture} />
        </Shadow>
        <Text></Text>
        <Text></Text>

        <Text style={styles.studentName}>Management Dashboard</Text>
      </View>
      <Text></Text>
      <Text></Text>
      

      {/* Scrollable Icons */}
      <ScrollView horizontal style={styles.scrollingIconsContainer}>
        {filteredItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.scrollingLink}
            onPress={() => {
              switch (item) {
                case 'Time-table':
                  navigation.navigate('ManageUploadTimetable');
                  break;
                case 'Academic-performance':
                  navigation.navigate('ManagementAcademicPerformance');
                  break;
                case 'Create-account':
                  navigation.navigate('CreateAccount');
                  break;
                case 'Attendence-records':
                  navigation.navigate('ManagmentAttendanceView');
                  break;
                case 'Event-calendar':
                  navigation.navigate('ManagmentEventCalendar');
                  break;
                case 'Photo-sharing':
                  navigation.navigate('ManagmentEventMediaUpload');
                  break;
                case 'Fees-upload':
                  navigation.navigate('ManagementFeeUpload');
                  break;
                case 'Notification-Message':
                  navigation.navigate('NotificationsScreens');
                  break;
                default:
                  navigation.navigate(item);
              }
            }}
          >
            <Shadow startColor="rgba(0, 0, 0, 0.5)" offset={[8, 4]} radius={10} distance={10}>
              <View style={styles.scrollingItem}>
                <Image source={itemImages[item]} style={styles.scrollingItemImage} />
                <Text style={styles.imageText}>{item.replace(/-/g, ' ').toUpperCase()}</Text>
              </View>
            </Shadow>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    height: hp('12%'),
    marginBottom:wp('4%'),
  },
  subHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1%'),
    alignItems: 'center',
    height: hp('3%'),
  },
  logo: {
    width: wp('15%'),
    height: wp('15%'),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: wp('3%'),
  },
  searchInput: {
    height: hp('5%'),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wp('3%'),
    marginLeft: wp('3%'),
    width: wp('40%'),
  },
  profilePictureContainer: {
    marginTop: hp('3%'),
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  profilePicture: {
    width: wp('60%'),
    height: wp('60%'),
    borderRadius: wp('30%'),
  },
  studentName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginTop: hp('2%'),
  },
  scrollingIconsContainer: {
    width: '100%',
    height: hp('30%'),
  },
  scrollingLink: {
    marginRight: wp('5%'),
  },
  scrollingItem: {
    width: wp('35%'),
    height: hp('30%'),
    borderRadius: 10,
    marginHorizontal: wp('2%'),
    backgroundColor: '#fff',
  },
  scrollingItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageText: {
    position: 'absolute',
    bottom: hp('2%'),
    left: wp('2%'),
    fontSize: wp('3%'),
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: wp('1%'),
    borderRadius: 5,
  },
});

export default ManagDashboard;
