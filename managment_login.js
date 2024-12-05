import React, { useState, useEffect } from 'react';
import { View, Image, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ManagmentLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([
    require('./assets/images/slides/acad1.jpg'),
    require('./assets/images/slides/att.jpg'),
    require('./assets/images/slides/bus.png'),
    require('./assets/images/slides/homework.jpg'),
  ]);

  const navigation = useNavigation(); // Use navigation for navigating between screens

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % images.length);
    }, 2000); // Change image every 2 seconds
    return () => clearInterval(intervalId);
  }, [currentIndex, images]);

  const handleLogin = () => {
    const validUsername = 'nova';
    const validPassword = 'nova123';

    if (username === validUsername && password === validPassword) {
      // Navigate to the Parent Dashboard when login is successful
      navigation.navigate('ManageDashboard');
    } else {
      Alert.alert('Invalid username or password. Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#000000', '#ffffff']} // Linear gradient from black to white
      style={styles.linearGradient}
    >
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={images[currentIndex]}
            style={styles.image}
          />
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
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.toggleButton}
            >
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="grey" />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Log In" onPress={handleLogin} color="#003153" />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    padding: wp('4%'),  // 4% of screen width for padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),  // 2% of screen height for margin-bottom
  },
  image: {
    width: wp('65%'),       // 65% of screen width for image width
    height: wp('65%'),      // 65% of screen width for image height
    borderRadius: wp('35%'), // Keep image circular
    borderWidth: 0,          // Remove border
    shadowColor: '#000',     // Black shadow color
    shadowOffset: { width: 5, height: 5 }, // Add shadow offset
    shadowOpacity: 0.9,      // Shadow opacity
    shadowRadius: 20,        // Shadow radius
    elevation: 10,           // Elevation for Android
    backgroundColor: 'rgba(169,169,169,0.6)', // Light grey shadow color
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: wp('3%'),       // Responsive padding
    margin: wp('2.5%'),      // Responsive margin
    width: wp('65%'),        // 65% of screen width for input width
    height: hp('6%'),        // 6% of screen height for input height
    borderColor: '#003153',
    borderRadius: wp('2%'),  // Responsive border radius
    backgroundColor: '#fff',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('65%'),        // Same as input width
    height: hp('6%'),        // Same as input height
    marginBottom: hp('1.5%'), // 1.5% of screen height for margin-bottom
    borderWidth: 1,
    borderColor: '#003153',
    borderRadius: wp('2%'),  // Responsive border radius
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: wp('2.5%'),     // Responsive padding for password input
    borderWidth: 0,
  },
  toggleButton: {
    padding: wp('2.5%'),     // Responsive padding for toggle button
  },
  buttonContainer: {
    width: wp('65%'),        // Same as input width
    height: hp('6%'),        // Same as input height
    marginTop: hp('1.5%'),   // 1.5% of screen height for margin-top
  },
});

export default ManagmentLogin;
