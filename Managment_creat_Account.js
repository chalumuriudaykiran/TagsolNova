// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Icon } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import CustomInput from './Custominput';

// const CreateAccount = () => {
//     const navigation = useNavigation();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [userType, setUserType] = useState('');

//     const validatePassword = (password) => {
//         // Password should be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character
//         const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/;
//         return passwordRegex.test(password);
//     };

//     const handlePasswordBlur = () => {
//         if (!validatePassword(password)) {
//             Alert.alert('Error', 'Password should be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
//         }
//     };

//     const handleSubmit = async () => {
//         // Check if fields are filled
//         if (!username || !password || !userType) {
//             Alert.alert('Error', 'Please fill all the fields');
//             return;
//         }

//         // Validate password
//         if (!validatePassword(password)) {
//             Alert.alert('Error', 'Password should be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.');
//             return;
//         }

//         try {
//             // Check if username exists
//             const checkResponse = await axios.get(http://192.168.0.110:5000/check-username/${username});
//             if (!checkResponse.data.success) {
//                 Alert.alert('Error', 'Username already exists');
//                 return;
//             }

//             const accountData = { username, password, userType };
//             const response = await axios.post('http://192.168.0.110:5000/create-account', accountData);
//             console.log(response.data); // Check response data in console

//             if (response.data.success) {
//                 Alert.alert('Success', 'Account created successfully!');
//                 setTimeout(() => {
//                     // Navigate based on userType
//                     if (userType === 'teacher') {
//                         console.log('Navigating to TeacherInfo');
//                         navigation.navigate('TeacherInfo');  // Navigate to TeacherInfo screen
//                     } else if (userType === 'student') {
//                         console.log('Navigating to StudentInfo');
//                         navigation.navigate('StudentInfo');  // Navigate to StudentInfo screen
//                     } else {
//                         Alert.alert('Error', 'Invalid user type.');
//                     }

//                     setPassword('');
//                     setUserType('');
//                     setUsername('');
//                 }, 2000); // Delay before navigating
//             } else {
//                 Alert.alert('Error', response.data.message || 'Account creation failed.');
//             }
//         } catch (error) {
//             console.error(error); // Log error details to debug
//             Alert.alert('Error', error.response?.data?.message || 'Failed to create account.');
//         }
//     };

//     return (
//         <View style={styles.mobileFrame}>
//             <View style={styles.mainHeader}>
//                 <TouchableOpacity onPress={() => navigation.navigate('ManagDashboard')}>
//                     <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate('ManagDashboard')}>
//                     <Icon name="home" type="material" size={35} color="#000" />
//                 </TouchableOpacity>
//             </View>
            
//             <View style={styles.subHeader}>
//                 <Text style={styles.subHeaderText}></Text>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Username:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={username}
//                     onChangeText={setUsername}
//                     placeholder="Enter your username"
//                 />

//                 <Text style={styles.label}>Password:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={password}
//                     onChangeText={setPassword}
//                     onBlur={handlePasswordBlur}
//                     secureTextEntry
//                     placeholder="Enter your password"
//                 />

//                 <Text style={styles.label}>User Type:</Text>
//                 <Picker
//                     selectedValue={userType}
//                     onValueChange={(itemValue) => setUserType(itemValue)}
//                     style={styles.input}
//                 >
//                     <Picker.Item label="Select User Type" value="" enabled={false} />
//                     <Picker.Item label="Student" value="student" />
//                     <Picker.Item label="Teacher" value="teacher" />
//                 </Picker>
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Create Account</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     mobileFrame: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
//         paddingTop: 0,
//         marginTop: 10,
//     },
//     mainHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: 'rgb(160, 180,182)',
//         paddingVertical: 10,
//         height: 95,
//         paddingHorizontal: 15,
//     },
//     subHeader: {
//         backgroundColor: 'rgb(160, 180,182)',
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         marginTop:10,
//         height: 10,
//     },
//     subHeaderText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#fff',
//         textAlign: 'center',
//     },
//     logo: {
//         width: 50,
//         height: 50,
//         marginTop: 10,
//     },
//     inputContainer: {
//         backgroundColor: '#fff',
//         borderRadius: 10,
//         padding: 20,
//         margin: 20,
//         elevation: 3, // Adds shadow for Android
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//         fontWeight: 'bold',
//     },
//     input: {
//         marginBottom: 15,
//         padding: 10,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 5,
//         fontSize: 16,
//         color: '#333',
//     },
//     button: {
//         backgroundColor: 'rgb(160, 180,182)',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: '#ffffff',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
// });

// export default CreateAccount;

// import React, { useState } from 'react';
// import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Icon } from 'react-native-elements';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const CreateAccount = () => {
//     const navigation = useNavigation();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [userType, setUserType] = useState('');
//     const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

//     const handleSubmit = async () => {
//         // Check if fields are filled
//         if (!username || !password || !userType) {
//             Alert.alert('Error', 'Please fill all the fields');
//             return;
//         }

//         // Validate password to include at least one special character
//         const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
//         if (!specialCharacterRegex.test(password)) {
//             Alert.alert('Error', 'Password must include at least one special character.');
//             return;
//         }

//         try {
//             // Check if username exists
//             const checkResponse = await axios.get(`http://50.6.194.240:5000/check-username/${username}`);
//             if (!checkResponse.data.success) {
//                 Alert.alert('Error', 'Username already exists');
//                 return;
//             }

//             const accountData = { username, password, userType };
//             const response = await axios.post('http://50.6.194.240:5000/submit-complete-info', accountData);
//             console.log(response.data); // Check response data in console

//             if (response.data.success) {
//                 Alert.alert('Success', 'Account created successfully!');
//                 setTimeout(() => {
//                     // Navigate based on userType
//                     if (userType === 'teacher') {
//                         console.log('Navigating to TeacherInfo');
//                         navigation.navigate('TeacherInfo'); // Navigate to TeacherInfo screen
//                     } else if (userType === 'student') {
//                         console.log('Navigating to StudentInfo');
//                         navigation.navigate('StudentInfo'); // Navigate to StudentInfo screen
//                     } else {
//                         Alert.alert('Error', 'Invalid user type.');
//                     }

//                     setPassword('');
//                     setUserType('');
//                     setUsername('');
//                 }, 2000); // Delay before navigatings
//             } else {
//                 Alert.alert('Error', response.data.message || 'Account creation failed.');
//             }
//         } catch (error) {
//             console.error(error); // Log error details to debug
//             Alert.alert('Error', error.response?.data?.message || 'Failed to create account.');
//         }
//     };

//     return (
//         <View style={styles.mobileFrame}>
//             <View style={styles.mainHeader}>
//                 <TouchableOpacity onPress={() => navigation.navigate('ManagDashboard')}>
//                     <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => navigation.navigate('ManagDashboard')}>
//                     <Icon name="home" type="material" size={wp('10%')} color="#000" />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.subHeader}>
//                 <Text style={styles.subHeaderText}></Text>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Text style={styles.label}>Username:</Text>
//                 <TextInput
//                     style={styles.input}
//                     value={username}
//                     onChangeText={setUsername}
//                     placeholder="Enter your username"
//                 />

//                 <Text style={styles.label}>Password:</Text>
//                 <View style={styles.passwordInputContainer}>
//                     <TextInput
//                         style={styles.passwordInput}
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry={!passwordVisible} // Toggle password visibility
//                         placeholder="Enter your password"
//                     />
//                     <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
//                         <Icon
//                             name={passwordVisible ? 'visibility-off' : 'visibility'}
//                             type="material"
//                             size={24}
//                             color="#000"
//                         />
//                     </TouchableOpacity>
//                 </View>

//                 <Text style={styles.label}>User Type:</Text>
//                 <Picker
//                     selectedValue={userType}
//                     onValueChange={(itemValue) => setUserType(itemValue)}
//                     style={styles.input}
//                 >
//                     <Picker.Item label="Select User Type" value="" enabled={false} />
//                     <Picker.Item label="Student" value="student" />
//                     <Picker.Item label="Teacher" value="teacher" />
//                 </Picker>
//             </View>

//             <TouchableOpacity style={styles.button} onPress={handleSubmit}>
//                 <Text style={styles.buttonText}>Create Account</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     mobileFrame: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
       
//     },
//     mainHeader: {
//         flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1.5%'),
//     paddingHorizontal: wp('4%'),
//     height: hp('12%'),
//     marginBottom:wp('3%'),
//     },
//     subHeader: {
//         backgroundColor: 'rgb(160, 180, 182)',
//     paddingVertical: hp('1%'),
//     alignItems: 'center',
//     height: hp('4%'),
//     },
//     subHeaderText: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#fff',
//         textAlign: 'center',
//     },
//     logo: {
//         width: wp('15%'),
//         height: wp('15%'),
//     },
//     inputContainer: {
//         backgroundColor: '#fff',
//         borderRadius: wp('2.5%'),   // Responsive border radius
//         padding: wp('5%'),         // Responsive padding
//         margin: wp('5%'),          // Responsive margin
//         elevation: 3,              // Android shadow
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: hp('0.25%') }, // Shadow offset responsive to screen height
//         shadowOpacity: 0.25,
//         shadowRadius: wp('3%'),     // Responsive shadow radius
//       },
//       label: {
//         fontSize: wp('4%'),         // Responsive font size
//         marginBottom: hp('1%'),     // Responsive margin
//         fontWeight: 'bold',
//       },
//       input: {
//         marginBottom: hp('2%'),     // Responsive margin-bottom
//         padding: wp('3%'),          // Responsive padding
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: wp('2%'),     // Responsive border radius
//         fontSize: wp('4%'),         // Responsive font size
//         color: '#333',
//       },
//       passwordInputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: wp('2%'),     // Responsive border radius
//         marginBottom: hp('2%'),     // Responsive margin-bottom
//         paddingRight: wp('3%'),     // Responsive padding-right for the icon
//       },
//       passwordInput: {
//         flex: 1,
//         padding: wp('3%'),          // Responsive padding
//         borderWidth: 0,
//         fontSize: wp('4%'),         // Responsive font size
//         color: '#333',
//       },
//       toggleButton: {
//         paddingLeft: wp('2%'),      // Responsive padding-left
//         paddingRight: wp('3%'),     // Responsive padding-right
//       },
//       button: {
//         backgroundColor: 'rgb(160, 180,182)',
//         padding: wp('3%'),          // Responsive padding
//         borderRadius: wp('2%'),     // Responsive border radius
//         alignItems: 'center',
//       },
//       buttonText: {
//         color: '#ffffff',
//         fontSize: wp('4%'),         // Responsive font size
//         fontWeight: 'bold',
//       },
//     });
    

// export default CreateAccount;




import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


const CreateAccount = () => {
    const navigation = useNavigation();
    const [userType, setUserType] = useState('');

        const handleSubmit = async () => {
            // Make sure the fields are filled
            if (!userType) {
                Alert.alert('Error', 'Please select a user type');
                return;
            }
        
            // Ensure you collect username and password from the UI (add TextInput for them)
            const username = 'autoGeneratedUsername'; // Replace with actual value from your form
            const password = 'autoGeneratedPassword'; // Replace with actual value from your form
        
            if (!username || !password) {
                Alert.alert('Error', 'Username and password are required');
                return;
            }
        
            try {
                const accountData = { userType, username, password };
                const response = await axios.post('http://50.6.194.240:5000/submit-complete-info', accountData);
                console.log(response.data); // Check response data in console
        
                if (response.data.success) {
                    Alert.alert('Success', 'Going to the next page for creating the account!');
                    setTimeout(() => {
                        if (userType === 'teacher') {
                            navigation.navigate('TeacherInfo',{userType});
                        } else if (userType === 'student') {
                            navigation.navigate('StudentInfo',{userType});
                        } else if (userType === 'Management') {
                            navigation.navigate('ManagementInfo');
                        } else {
                            Alert.alert('Error', 'Invalid user type.');
                        }
                        setUserType('');
                    }, 2000); // Delay before navigating
                } else {
                    Alert.alert('Error', response.data.message || 'Account creation failed.');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', error.response?.data?.message || 'Failed to create account.');
            }
        };
        

    return (
        <View style={styles.mobileFrame}>
            <View style={styles.mainHeader}>
                <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                    <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ManageDashboard')}>
                    <Icon name="home" type="material" size={35} color="#000" />
                </TouchableOpacity>
            </View>

            <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>User Type:</Text>
                <Picker
                    selectedValue={userType}
                    onValueChange={(itemValue) => setUserType(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Select User Type" value="" enabled={false} />
                    <Picker.Item label="Student" value="student" />
                    <Picker.Item label="Teacher" value="teacher" />
                    <Picker.Item label="Management" value="Management" />
                </Picker>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
        </View>
    );
};





const styles = StyleSheet.create({
    mobileFrame: {
        flex: 1,
        backgroundColor: '#fff    ',
       
    },
    mainHeader: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: 'rgb(160, 180, 182)', 
        paddingVertical: hp('1.5%'),  // Responsive vertical padding
        paddingHorizontal: wp('4%'),  // Responsive horizontal padding
        height: hp('12%'),  // Responsive height
        marginBottom: wp('3%'), 
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
    logo: {
        width: wp('15%'),  // Responsive width
        height: wp('15%'), 
    },
    inputContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        margin: 20,
        elevation: 3, // Adds shadow for Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        padding: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        color: '#333',
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingRight: 10, // Add padding to the right to accommodate the icon
    },
    passwordInput: {
        flex: 1,
        padding: 10,
        borderWidth: 0,
        fontSize: 16,
        color: '#333',
    },
    toggleButton: {
        paddingLeft: 5,
        paddingRight: 10,
    },
    button: {
        backgroundColor: 'rgb(160, 180,182)',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateAccount;