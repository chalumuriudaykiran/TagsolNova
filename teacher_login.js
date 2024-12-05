// // // import React, { useState, useEffect, useContext,useRef} from 'react';
// // // import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// // // import { LinearGradient } from 'expo-linear-gradient';
// // // import { useNavigation } from '@react-navigation/native';
// // // import { Ionicons } from '@expo/vector-icons';
// // // import axios from 'axios';
// // // import { UserContext } from './UserContext'; 



// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { Ionicons } from '@expo/vector-icons'; 
// import { UserContext } from './UserContext'; 
// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';


// // Adjust the path if necessary

// const TeacherLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
// //  const [expoPushToken, setExpoPushToken] = useState('');  // Track the push token
// //   const [notification, setNotification] = useState(false); // Track the received notification

//  const notificationListener = useRef();
//   const responseListener = useRef();
//   const [images] = useState([
//     require('./assets/images/slides/acad1.jpg'),
//     require('./assets/images/slides/att.jpg'),
//     require('./assets/images/slides/bus.png'),
//     require('./assets/images/slides/homework.jpg'),
//   ]);

//   const navigation = useNavigation();
//   const userContext = useContext(UserContext);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 2000);
//     return () => clearInterval(intervalId);
//   }, [images]);


  
//   // const registerForPushNotificationsAsync = async () => {
//   //   let token;
  
//   //   if (Device.isDevice) {
//   //     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   //     let finalStatus = existingStatus;
  
//   //     if (existingStatus !== 'granted') {
//   //       const { status } = await Notifications.requestPermissionsAsync();
//   //       finalStatus = status;
//   //     }
  
//   //     if (finalStatus !== 'granted') {
//   //       Alert.alert('Failed to get push token for notifications!');
//   //       return null;
//   //     }
  
//   //     token = (await Notifications.getExpoPushTokenAsync()).data;
//   //     console.log('Push Token:', token);
//   //   } else {
//   //     Alert.alert('Must use physical device for Push Notifications');
//   //   }
  
//   //   if (Platform.OS === 'android') {
//   //     await Notifications.setNotificationChannelAsync('default', {
//   //       name: 'default',
//   //       importance: Notifications.AndroidImportance.MAX,
//   //       vibrationPattern: [0, 250, 250, 250],
//   //       lightColor: '#FF231F7C',
//   //     });
//   //   }
  
//   //   return token;
//   // };


  
//   const storePushToken = async (username) => {
//     try {
//       if (!Device.isDevice) {
//         Alert.alert('Error', 'Must use physical device for Push Notifications');
//         return;
//       }
  
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
  
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
  
//       if (finalStatus !== 'granted') {
//         Alert.alert('Failed to get push token for notifications!');
//         return;
//       }
  
//       const token = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log('Push Token:', token);
  
//       // Log username and token before making the API call
//       console.log('Storing push token with username:', username, 'and token:', token);
  
//       const response = await axios.post('http://50.6.194.240:5000/api/store-push-token', {
//         username,
//         pushToken: token,
//       });
  
//       if (response.data.message) {
//         console.log('Push token stored:', response.data.message);
//       } else {
//         console.error('Failed to store push token.');
//       }
//     } catch (error) {
//       console.error('Error storing push token:', error.response?.data?.message || error.message);
//     }
//   };
  


//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please enter your credentials');
//       return;
//     }

//     try {
//       const response = await axios.post('http://50.6.194.240:5000/api/login', {
//         username,
//         password,
//         userType: 'teacher',
//       });

//       if (response.data.success) {
//         if (userContext && userContext.setUsername) {
//           userContext.setUsername(username); 
//          // Store the push token after successful login
//          await storePushToken(username);// Safely set the username
//         } else {
//           console.warn('UserContext is not available.');
//         }
//         Alert.alert('Login Successful', `Welcome ${username}!`);
//         navigation.navigate('TeacherDashboard', { username });
//       } else {
//         Alert.alert('Invalid username or password. Please try again.');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#000000', '#ffffff']}
//       style={styles.linearGradient}
//     >
//       <View style={styles.container}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={images[currentIndex]}
//             style={styles.image}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <TextInput
//             placeholder="Username"
//             value={username}
//             onChangeText={setUsername}
//             style={styles.input}
//           />
//           <View style={styles.passwordWrapper}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               style={styles.passwordInput}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.toggleButton}
//             >
//               <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.buttonContainer}>
//             <Button title="Log In" onPress={handleLogin} color="#003153" />
//           </View>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   linearGradient: {
//     flex: 1,
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     alignItems: 'center',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     borderRadius: 140,
//     borderWidth: 0, // Remove border
//     shadowColor: '#000', // Black shadow color
//     shadowOffset: { width: 5, height: 5 }, // Add shadow offset
//     shadowOpacity: 0.9, // Add shadow opacity
//     shadowRadius: 20, // Add shadow radius
//     elevation: 10, // Add elevation for Android
//     backgroundColor: 'rgba(169,169,169,0.6)', // Light grey shadow color
//   },
//   inputContainer: {
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     margin: 10,
//     width: 250, // Updated width
//     height: 50, // Updated height
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 250, // Same width as input
//     height: 50, // Same height as input
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 0,
//   },
//   toggleButton: {
//     padding: 10,
//   },
//   buttonContainer: {
//     width: 250, // Updated width
//     height: 50, // Updated height to match input
//     marginTop: 10,
//   },
// });

// export default TeacherLogin;



// import React, { useState, useEffect, useContext } from 'react';
// import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { UserContext } from './UserContext'; // Adjust the path if necessary

// const TeacherLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [images] = useState([
//     require('./assets/images/slides/acad1.jpg'),
//     require('./assets/images/slides/att.jpg'),
//     require('./assets/images/slides/bus.png'),
//     require('./assets/images/slides/homework.jpg'),
//   ]);

//   const navigation = useNavigation();
//   const userContext = useContext(UserContext);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 2000);
//     return () => clearInterval(intervalId);
//   }, [images]);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please enter your credentials');
//       return;
//     }

//     try {
//       const response = await axios.post('http://192.168.0.119:5000/api/login', {
//         username,
//         password,
//         userType: 'teacher',
//       });

//       if (response.data.success) {
//         if (userContext && userContext.setUsername) {
//           userContext.setUsername(username); // Safely set the username
//         } else {
//           console.warn('UserContext is not available.');
//         }
//         Alert.alert('Login Successful', `Welcome ${username}!`);
//         navigation.navigate('TeacherDashboard', { username });
//       } else {
//         Alert.alert('Invalid username or password. Please try again.');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#000000', '#ffffff']}
//       style={styles.linearGradient}
//     >
//       <View style={styles.container}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={images[currentIndex]}
//             style={styles.image}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <TextInput
//             placeholder="Username"
//             value={username}
//             onChangeText={setUsername}
//             style={styles.input}
//           />
//           <View style={styles.passwordWrapper}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               style={styles.passwordInput}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.toggleButton}
//             >
//               <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.buttonContainer}>
//             <Button title="Log In" onPress={handleLogin} color="#003153" />
//           </View>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   linearGradient: {
//     flex: 1,
//     padding: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     alignItems: 'center',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     borderRadius: 140,
//     borderWidth: 0, // Remove border
//     shadowColor: '#000', // Black shadow color
//     shadowOffset: { width: 5, height: 5 }, // Add shadow offset
//     shadowOpacity: 0.9, // Add shadow opacity
//     shadowRadius: 20, // Add shadow radius
//     elevation: 10, // Add elevation for Android
//     backgroundColor: 'rgba(169,169,169,0.6)', // Light grey shadow color
//   },
//   inputContainer: {
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     margin: 10,
//     width: 250, // Updated width
//     height: 50, // Updated height
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 250, // Same width as input
//     height: 50, // Same height as input
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 0,
//   },
//   toggleButton: {
//     padding: 10,
//   },
//   buttonContainer: {
//     width: 250, // Updated width
//     height: 50, // Updated height to match input
//     marginTop: 10,
//   },
// });

// export default TeacherLogin;



// import React, { useState, useEffect, useContext } from 'react';
// import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useNavigation } from '@react-navigation/native';
// import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
// import { UserContext } from './UserContext'; // Adjust the path if necessary

// const TeacherLogin = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [images] = useState([
//     require('./assets/images/slides/acad1.jpg'),
//     require('./assets/images/slides/att.jpg'),
//     require('./assets/images/slides/bus.png'),
//     require('./assets/images/slides/homework.jpg'),
//   ]);

//   const navigation = useNavigation();
//   const userContext = useContext(UserContext);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 2000);
//     return () => clearInterval(intervalId);
//   }, [images]);

//   const handleLogin = async () => {
//     if (!username || !password) {
//       Alert.alert('Error', 'Please enter your credentials');
//       return;
//     }

//     try {
//       const response = await axios.post('http://50.6.194.240:5000/api/login', {
//         username,
//         password,
//         userType: 'teacher',
//       });

//       if (response.data.success) {
//         if (userContext && userContext.setUsername) {
//           userContext.setUsername(username); // Safely set the username
//         } else {
//           console.warn('UserContext is not available.');
//         }
//         Alert.alert('Login Successful',`Welcome ${username}!`);
//         navigation.navigate('TeacherDashboard', { username });
//       } else {
//         Alert.alert('Invalid username or password. Please try again.');
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
//     }
//   };

//   return (
//     <LinearGradient
//       colors={['#000000', '#ffffff']}
//       style={styles.linearGradient}
//     >
//       <View style={styles.container}>
//         <View style={styles.imageContainer}>
//           <Image
//             source={images[currentIndex]}
//             style={styles.image}
//           />
//         </View>
//         <View style={styles.inputContainer}>
//           <TextInput
//             placeholder="Username"
//             value={username}
//             onChangeText={setUsername}
//             style={styles.input}
//           />
//           <View style={styles.passwordWrapper}>
//             <TextInput
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               style={styles.passwordInput}
//             />
//             <TouchableOpacity
//               onPress={() => setShowPassword(!showPassword)}
//               style={styles.toggleButton}
//             >
//               <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
//             </TouchableOpacity>
//           </View>
//           <View style={styles.buttonContainer}>
//             <Button title="Log In" onPress={handleLogin} color="#003153" />
//           </View>
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   linearGradient: {
//     flex: 1,
    
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   container: {
//     alignItems: 'center',
//   },
//   imageContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     borderRadius: 140,
//     borderWidth: 0, // Remove border
//     shadowColor: '#000', // Black shadow color
//     shadowOffset: { width: 5, height: 5 }, // Add shadow offset
//     shadowOpacity: 0.9, // Add shadow opacity
//     shadowRadius: 20, // Add shadow radius
//     elevation: 10, // Add elevation for Android
//     backgroundColor: 'rgba(169,169,169,0.6)', // Light grey shadow color
//   },
//   inputContainer: {
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     padding: 10,
//     margin: 10,
//     width: 250, // Updated width
//     height: 50, // Updated height
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: 250, // Same width as input
//     height: 50, // Same height as input
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: '#003153',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   passwordInput: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 0,
//   },
//   toggleButton: {
//     padding: 10,
//   },
//   buttonContainer: {
//     width: 250, // Updated width
//     height: 50, // Updated height to match input
//     marginTop: 10,
//   },
// });

// export default TeacherLogin;


import React, { useState, useEffect, useContext } from 'react';
import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { UserContext } from './UserContext';

const TeacherLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images] = useState([
    require('./assets/images/slides/acad1.jpg'),
    require('./assets/images/slides/att.jpg'),
    require('./assets/images/slides/bus.png'),
    require('./assets/images/slides/homework.jpg'),
  ]);

  const navigation = useNavigation();
  const userContext = useContext(UserContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [images]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter your credentials');
      return;
    }

    try {
      const response = await axios.post('http://50.6.194.240:5000/api/login', {
        username,
        password,
        userType: 'teacher',
      });

      if (response.data.success) {
        if (userContext && userContext.setUsername) {
          userContext.setUsername(username); // Safely set the username
        } else {
          console.warn('UserContext is not available.');
        }
        Alert.alert('Login Successful', `Welcome ${username}!`);
        navigation.navigate('TeacherDashboard', { username });
      } else {
        Alert.alert('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    if (!username || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://50.6.194.240:5000/api/reset-password', {
        username,
        newPassword,
      });

      if (response.data.success) {
        Alert.alert('Success', response.data.message);
        setModalVisible(false);
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#000000', '#ffffff']} style={styles.linearGradient}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={images[currentIndex]} style={styles.image} />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Log In" onPress={handleLogin} color="#003153" />
          </View>
          <TouchableOpacity style={styles.forgotPasswordButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <LinearGradient colors={['#003153', '#0066CC']} style={styles.gradientBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
              />
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  style={styles.passwordInput}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.toggleButton}>
                  <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordWrapper}>
                <TextInput
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  style={styles.passwordInput}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.toggleButton}>
                  <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleResetPassword}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 140,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 10,
    backgroundColor: 'rgba(169,169,169,0.6)',
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    padding:10,
    marginBottom:10,
    width: 250,
    height: 50,
    borderColor: '#003153',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 250,
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#003153',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    padding: 0,
    borderWidth: 0,
    fontSize: 16,
  },
  toggleButton: {
    padding: 10,
  },
  buttonContainer: {
    width: 280,
    height: 50,
    marginTop: 10,
  },
  forgotPasswordButton: {
   
marginLeft:130
  },
  forgotPasswordText: {
    color: '#003153',
    fontWeight: 'bold',
    fontSize: 16,
  
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradientBackground: {
    width: '90%',
    borderRadius: 10,
    overflow: 'hidden',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003153',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#003153',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#003153',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherLogin;