import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Shadow } from 'react-native-shadow-2';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { username = 'Student Name' } = route.params || {};
  const [student, setStudent] = useState(null);
  const [searchBarVisible, setSearchBarVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studentImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");


  useEffect(() => {
    axios
      .get('http://150.6.194.240:5000/api/student/profile', { withCredentials: true })
      .then((response) => {
        setStudent(response.data.student);
      })
      .catch((error) => {
        console.error('Error fetching student profile:', error);
      });
  }, []);




  useEffect(() => {
    if (username) {
      axios
        .get(`http://50.6.194.240:5000/LiveChat/studentname?username=${username}`)
        .then((response) => {
          const { class_name, name, section } = response.data;
          setStudentName(name); // Store name
          setClassName(class_name); // Store class name
          setSection(section); // Store section
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            console.error("Student profile not found.");
          } else {
            console.error("Error fetching student details:", error);
          }
        });
    }
  }, [username]);

  console.log({ studentName, className, section });

  const itemImages = {
    "Overall-Report": require('./assets/images/slides/bhv.jpg'),
    "ParentHomeworkScreen": require('./assets/images/slides/homework.jpg'),
    "ParentTimetable": require('./assets/images/slides/apptimetable.jpeg'),
    "Parent-teacher-messaging": require('./assets/images/slides/chat.jpg'),
    "ParentEventCalendar": require('./assets/images/slides/eventCopy.jpg'),
    "FeesDetails": require('./assets/images/slides/bhv.jpg'),

    "ParentPhoto": require('./assets/images/slides/acad1.jpg'),
    //"Resources": require('./assets/images/slides/rsr.jpg'),
  };





  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Log Out',
          'Are you willing to Log Out?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => navigation.navigate('ParentLogin'),
            },
          ],
          { cancelable: false }
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [navigation])
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % studentImages.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [studentImages]);

  const toggleSearch = () => {
    setSearchBarVisible(!searchBarVisible);
  };
  const filteredItems = Object.keys(itemImages).filter((item) =>
    item.replace(/-/g, ' ').toUpperCase().includes(searchQuery.toUpperCase())
  );
  const handleSearch = (query) => {
    setSearchQuery(query);
  };


  return (
    <View style={styles.mobileFrame}>
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
          <TouchableOpacity onPress={() => navigation.navigate('ParentStudentIconManagement')}>
            <FontAwesomeIcon icon={faUser} size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faBell} size={20} color="#000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.subHeader} />
      <Text>

      </Text>
      <Text>

      </Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profilePictureContainer}>
          <Shadow
            startColor="rgba(0, 0, 0, 0.3)"
            offset={[3, 3]}
            radius={110}
            distance={5}
            viewStyle={styles.shadowCircle}
          >
            {student?.photoUrl ? (
              <Image source={{ uri: student.photoUrl }} style={styles.profileImage} />
            ) : (
              <Image
                source={{ uri: 'https://via.placeholder.com/240.png?text=No+Photo' }}
                style={styles.profileImage}
              />
            )}

          </Shadow>
          <Text>

          </Text>
          <Text>

          </Text>
          <Text style={styles.studentName}>{username}</Text>
        </View>
        <Text>

        </Text>
        <Text>

        </Text>

        <ScrollView horizontal style={styles.scrollingIconsContainer}>
          {filteredItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.scrollingLink}
              onPress={() => {
                if (item === 'ParentHomeworkScreen') navigation.navigate('ParentHomeworkScreen', { username });
                else if (item === 'ParentTimetable') navigation.navigate('ParentTimetable', { username });
                else if (item === 'Parent-teacher-messaging') navigation.navigate('ParentMessage', {
                  username,
                  className,
                  studentName
                });
                else if (item === 'ParentEventCalendar') navigation.navigate('ParentEventCalendar');
                else if (item === 'ParentPhoto') navigation.navigate('ParentPhoto');
                else if (item === 'ParentBehavioralReport') navigation.navigate('ParentBehavioralReport', { username });
                else if (item === 'FeesDetails') navigation.navigate('FeesDetails',{username});
                else if (item === 'Overall-Report') navigation.navigate('PieChart', { username });
              }}
            >
              <Shadow
                startColor="rgba(0, 0, 0, 0.2)"
                offset={[3, 3]}
                radius={5}
                distance={8}
                viewStyle={{ marginHorizontal: 5, borderRadius: 10 }}
              >
                <View style={styles.scrollingItem}>
                  <Image source={itemImages[item]} style={styles.scrollingItemImage} />
                  <Text style={styles.imageText}>{item.replace(/-/g, ' ').toUpperCase()}</Text>
                </View>
              </Shadow>
            </TouchableOpacity>
          ))}
        </ScrollView>

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
  profileImage: {
    width: wp('60%'),
    height: wp('60%'),
    borderRadius: wp('30%'),
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
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
  scrollingItemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ParentDashboard;
