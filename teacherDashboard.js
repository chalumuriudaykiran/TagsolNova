import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { Shadow } from 'react-native-shadow-2';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TeacherProfile = () => {
    const [teacher, setTeacher] = useState(null);
    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigation = useNavigation();
    


    useEffect(() => {
        axios
            .get('http://50.6.194.240:5000/api/teacher/profile', { withCredentials: true })
            .then((response) => {
                setTeacher(response.data.teacher);
            })
            .catch((error) => {
                console.error('Error fetching teacher profile:', error);
            });
    }, []);



    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {
        // Fetch notifications from API and set the count
        axios
            .get('http://50.6.194.240:5000/get-notifications')
            .then((response) => {
                setNotificationCount(response.data.notifications.length);
            })
            .catch((error) => {
                console.error('Error fetching notifications:', error);
            });
    }, []);

    const itemImages = {
        "Homework-Tracker": require('./assets/images/slides/homework.jpg'),
        "Timetable": require('./assets/images/slides/apptimetable.jpeg'),
        "Attendance-records": require('./assets/images/slides/att.jpg'),
        "Parent-teacher-messaging": require('./assets/images/slides/chat.jpg'),
        "Event-calendar": require('./assets/images/slides/eventCopy.jpg'),
        "Teacher-Photo": require('./assets/images/slides/acad1.jpg'),
        // "Resources": require('./assets/images/slides/rsr.jpg'),
        "Behavior-reports": require('./assets/images/slides/bhv.jpg'),
        "TeacherAcademicPerformanceEntry": require('./assets/images/slides/acadapp.jpg'),
        "ExtraCircular-activities": require('./assets/images/slides/culture.png')
    };

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
            {/* Main Header */}
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <View style={styles.headerRight}>
                        <TouchableOpacity onPress={toggleSearch}>
                            <FontAwesomeIcon icon={faSearch} size={25} color="#000" style={styles.icon} />
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
                        <TouchableOpacity onPress={() => navigation.navigate('StudenticonManage')}>
                            <FontAwesomeIcon icon={faUser} size={wp('8%')} color="#000" style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.notificationIconContainer}  onPress={() => navigation.navigate('TeacherNotification')}>
                <FontAwesomeIcon icon={faBell} size={wp('10%')} color="#333" />
                {notificationCount > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>{notificationCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
                    </View>
                </View>
            </View>
              {/* Empty Small Header with Space */}
      <View style={styles.emptyHeader} />
      <Text></Text>
      

            <ScrollView contentContainerStyle={styles.content}>
                {/* Teacher Profile Picture with Circular Shadow */}
                <View style={styles.profilePictureContainer}>
                    <View style={styles.profileInfo}>
                        <Shadow
                            startColor="rgba(0, 0, 0, 0.3)"
                            offset={[3, 3]}
                            radius={110} // Circle shadow by matching the radius
                            distance={5}
                            viewStyle={styles.shadowCircle}
                        >
                            {/* Profile Image */}
                            {teacher && teacher.photoUrl ? (
                                <Image source={{ uri: teacher.photoUrl }} style={styles.profileImage} />
                            ) : (
                                <Image
                                    source={{ uri: 'https://via.placeholder.com/240.png?text=No+Photo' }} // Using a placeholder image
                                    style={styles.profileImage}
                                />
                            )}
                        </Shadow>
                        <Text></Text>
                        <Text></Text>
                        {/* Teacher's Name */}
                        <Text style={styles.teacherName}>{teacher ? teacher.name : 'Loading...'}</Text>
                    </View>
                   
                       
                </View>

                {/* Scrolling Image Tabs */}
                <ScrollView horizontal style={styles.scrollingTabs}>
                {filteredItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.scrollingLink}
                            onPress={() => {
                                // Define navigation actions for each tab
                                if (item === 'Homework-Tracker') navigation.navigate('Teacher_HomeworkTrackerScreen');
                                else if (item === 'Timetable') navigation.navigate('Teachertimetable');
                                else if (item === 'Attendance-records') navigation.navigate('TeacherAttendance');
                                else if (item === 'Parent-teacher-messaging') navigation.navigate('teachermessge');
                                else if (item === 'Event-calendar') navigation.navigate('TeacherEventCalendar');
                                else if (item === 'Teacher-Photo') navigation.navigate('TeacherEventMediaUpload');
                                //else if (item === 'Resources') navigation.navigate('TeacherResorces');
                                else if (item === 'Behavior-reports') navigation.navigate('TeacherBehaviour');
                                else if (item === 'Academic-performance') navigation.navigate('TeacherAcademicPerformanceEntry');
                                else if (item === 'ExtraCircular-activities') navigation.navigate('SportsYogaInfo');
                                else navigation.navigate(item); // Default navigation
                            }}
                        >
                            <Shadow
                                startColor="rgba(0, 0, 0, 0.5)" offset={[8, 4]} radius={10} distance={10}
                                
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
        marginBottom:wp('3%'),
         
    },
    logo: {
        width: wp('15%'),
    height: wp('15%'),
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationIconContainer: {
        position: 'relative',
    },
    notificationBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#FF6B6B',
        borderRadius: 12,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    profilePictureContainer: {
        marginTop: hp('3%'),
        marginBottom: hp('3%'),
        alignItems: 'center',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 19,
    },
    teacherName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    profileImage: {
        width: wp('60%'),
        height: wp('60%'),
        borderRadius: wp('30%'),
    },
    emptyHeader: {
        height: 20,
        backgroundColor: 'rgb(160, 180, 182)',
        marginTop: 9,
      },
    shadowCircle: {
        borderRadius: 110, // Match radius of the profile image
    },
    scrollingTabs: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 30,
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
    searchInput: {
        height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 15,
    width: 150,
    },
    content: {
        alignItems: 'center',
        paddingBottom: 20,
    },
});

export default TeacherProfile;

