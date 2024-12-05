// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import axios from 'axios';

// const WeatherReport = () => {
//   const [weatherData, setWeatherData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentTime, setCurrentTime] = useState('');
//   const [currentDay, setCurrentDay] = useState('');

//   useEffect(() => {
//     const fetchWeatherData = async () => {
//       try {
//         const apiKey = '147d13c7ea16c5b3d8827693ffe47786'; // Your actual API key
//         const city = 'Hyderabad,IN'; // Replace with the city you want the weather for
//         const response = await axios.get(`http://50.6.194.240:5000/weather?q=${city}&appid=${apiKey}&units=metric`);
//         setWeatherData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching weather data:', error);
//         setLoading(false);
//       }
//     };

//     fetchWeatherData();

//     const updateTimeAndDay = () => {
//       const now = new Date();
//       setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
//       setCurrentDay(now.toLocaleDateString([], { weekday: 'long' })); // Get day of the week
//     };

//     updateTimeAndDay();
//     const interval = setInterval(updateTimeAndDay, 60000); // Update every minute

//     return () => clearInterval(interval); // Clean up interval on unmount
//   }, []);

//   if (loading) {
//     return <ActivityIndicator size="large" color="#4CAF50" style={styles.loadingIndicator} />;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Weather</Text>
//       <Text style={styles.timeText}>{currentDay}, {currentTime}</Text>
//       {weatherData ? (
//         <View style={styles.dataContainer}>
//           <Text style={styles.temperatureText}>{Math.round(weatherData.main.temp)}°C</Text>
//           <Text style={styles.conditionText}>
//             {weatherData.weather[0].description.charAt(0).toUpperCase() +
//               weatherData.weather[0].description.slice(1)}
//           </Text>
//         </View>
//       ) : (
//         <Text style={styles.noDataText}>No weather data available</Text>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     alignItems: 'center',
//     backgroundColor: '#000',
//     borderRadius: 15,
//     elevation: 5,
//     marginVertical: 20,
//     width: '300',
    
//     alignSelf: 'center',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#4CAF50',
//     marginBottom: 5,
//   },
//   timeText: {
//     fontSize: 16,
//     color: 'white',
//     marginBottom: 10,
//   },
//   dataContainer: {
//     alignItems: 'center',
//   },
//   temperatureText: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#F44336',
//     marginBottom: 10,
//   },
//   conditionText: {
//     fontSize: 18,
//     color: '#1E88E5',
//     textTransform: 'capitalize',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#F44336',
//     fontWeight: 'bold',
//   },
//   loadingIndicator: {
//     marginTop: 20,
//   },
// });

// export default WeatherReport;