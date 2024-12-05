// import React, { useState,useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import Svg, { Circle, Path } from 'react-native-svg';

// const ActivitiesReport = ({username}) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [activitiesData,setActivitiesData] =useState([]);


//   // useEffect(() => {
//   //   const fetchActivities = async () => {
//   //     try {
//   //       const response = await axios.get('http://192.168.0.104:3000/activities', {
//   //         params: { studentName: username }, // Send as query parameter
//   //       });
  
//   //       setActivitiesData(response.data);
//   //     } catch (error) {
//   //       console.error('Error fetching activities:', error);
//   //       setActivitiesData([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
  
//   //   fetchActivities();
//   // }, [username]);


//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await axios.get('http://192.168.0.104:3000/activities', {
//           params: { studentName: username },
//         });

//         const formattedData = response.data.map((item) => ({
//           ...item,
//           value: Number(item.value),
//         }));

//         setActivitiesData(formattedData);
//       } catch (error) {
//         console.error('Error fetching activities:', error);
//         setActivitiesData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [username])

//   const totalValue = activitiesData.reduce((sum, activity) => sum + activity.value, 0); // Total of all activity values
  

//   // Function to calculate percentage dynamically
//   const calculatePercentage = (value) => (value / totalValue) * 100;

//   // Function to handle pie chart segment press
//   const handlePress = (activityName) => {
//     setSelectedActivity(activityName);
//     setModalVisible(true);
//   };

//   // Render modal content based on selected activity
//   const renderModalContent = () => {
//     if (selectedActivity) {
//       const activity = activitiesData.find((item) => item.name === selectedActivity);
//       return (
//         <View>
//           <Text>{activity.name} Percentage: {calculatePercentage(activity.value).toFixed(2)}%</Text>
//           <Text>Details:</Text>
//           {/* Add specific details about the activity */}
//         </View>
//       );
//     }
//   };

//   // Pie chart parameters
//   const circleRadius = 80;
//   const strokeWidth = 15;

//   // Calculate arc paths dynamically
//   const generateArcPath = (startAngle, arcLength) => {
//     const startX = circleRadius + Math.cos(startAngle) * circleRadius;
//     const startY = circleRadius + Math.sin(startAngle) * circleRadius;
//     const endX = circleRadius + Math.cos(startAngle + arcLength) * circleRadius;
//     const endY = circleRadius + Math.sin(startAngle + arcLength) * circleRadius;

//     return `
//       M ${circleRadius} ${circleRadius}
//       L ${startX} ${startY}
//       A ${circleRadius} ${circleRadius} 0 ${arcLength > Math.PI ? 1 : 0} 1 ${endX} ${endY}
//       Z
//     `;
//   };

//   let startAngle = 0;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Activities Report</Text>

//       {/* Legend */}
//       <View style={styles.legendContainer}>
//         {activitiesData.map((item, index) => (
//           <View key={index} style={styles.legendItem}>
//             <View style={[styles.colorBox, { backgroundColor: item.color }]} />
//             <Text style={styles.legendText}>{item.name}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Pie Chart */}
//       <Svg width={2 * circleRadius} height={2 * circleRadius}>
//         <Circle
//           cx={circleRadius}
//           cy={circleRadius}
//           r={circleRadius - strokeWidth / 2}
//           fill="white"
//           stroke="#e0e0e0"
//           strokeWidth={strokeWidth}
//         />
//         {activitiesData.map((item, index) => {
//           const arcLength = (item.value / totalValue) * 2 * Math.PI;
//           const path = generateArcPath(startAngle, arcLength);
//           startAngle += arcLength;

//           return (
//             <Path
//               key={index}
//               d={path}
//               fill={item.color}
//               onPress={() => handlePress(item.name)}
//             />
//           );
//         })}
//       </Svg>

//       {/* Modal for showing details */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeText}>X</Text>
//             </TouchableOpacity>
//             {renderModalContent()}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };





// import React, { useState, useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import Svg, { Path } from 'react-native-svg';
// import axios from 'axios';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const ActivitiesReport = ({ username }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedActivity, setSelectedActivity] = useState(null);
//   const [activitiesData, setActivitiesData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await axios.get('http://50.6.194.240:5000/activities', {
//           params: { studentName: username },
//         });

//         const formattedData = response.data.map((item) => ({
//           ...item,
//           value: Number(item.value),
//         }));

//         setActivitiesData(formattedData);
//       } catch (error) {
//         console.error('Error fetching activities:', error);
//         setActivitiesData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActivities();
//   }, [username]);

//   const totalValue = activitiesData.reduce((sum, activity) => sum + activity.value, 0);

//   const handlePress = (activityName) => {
//     setSelectedActivity(activityName);
//     setModalVisible(true);
//   };

//   const renderModalContent = () => {
//     if (selectedActivity) {
//       const activity = activitiesData.find((item) => item.name === selectedActivity);
//       return (
//         <View>
//           <Text>{activity.name}: {(activity.value / totalValue * 100).toFixed(2)}%</Text>
//         </View>
//       );
//     }
//   };

//   const circleRadius = 81;
//   const generateArcPath = (startAngle, arcLength) => {
//     const startX = circleRadius + Math.cos(startAngle) * circleRadius;
//     const startY = circleRadius + Math.sin(startAngle) * circleRadius;
//     const endX = circleRadius + Math.cos(startAngle + arcLength) * circleRadius;
//     const endY = circleRadius + Math.sin(startAngle + arcLength) * circleRadius;

//     return `
//       M ${circleRadius} ${circleRadius}
//       L ${startX} ${startY}
//       A ${circleRadius} ${circleRadius} 0 ${arcLength > Math.PI ? 1 : 0} 1 ${endX} ${endY}
//       Z
//     `;
//   };

//   let startAngle = 0;

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   if (activitiesData.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text>No activities data available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Activities Report</Text>

//       <Svg width={2 * circleRadius} height={2 * circleRadius}>
//         {activitiesData.map((item, index) => {
//           const arcLength = (item.value / totalValue) * 2 * Math.PI;
//           const path = generateArcPath(startAngle, arcLength);
//           startAngle += arcLength;

//           return (
//             <Path
//               key={index}
//               d={path}
//               fill={item.color}
//               onPress={() => handlePress(item.name)}
//             />
//           );
//         })}
//       </Svg>

//       <View style={styles.legendContainer}>
//         {activitiesData.map((item, index) => (
//           <View key={index} style={styles.legendItem}>
//             <View style={[styles.colorBox, { backgroundColor: item.color }]} />
//             <Text style={styles.legendText}>{item.name}</Text>
//           </View>
//         ))}
//       </View>

//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeText}>X</Text>
//             </TouchableOpacity>
//             {renderModalContent()}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 20,
//     marginBottom: 50,
//   },
//   legendContainer: {
//     marginTop: 30,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//   },
//   legendItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 10,
//     marginBottom: 5,
//   },
//   colorBox: {
//     width: 20,
//     height: 20,
//     marginRight: 5,
//     borderRadius: 5,
//   },
//   legendText: {
//     fontSize: 14,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: 300,
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   closeText: {
//     alignSelf: 'flex-end',
//   },
// });

// export default ActivitiesReport;




import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { BoxShadow } from 'react-native-shadow';

const ActivitiesReport = ({ username }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activitiesData, setActivitiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://50.6.194.240:5000/activities', {
          params: { studentName: username },
        });

        const formattedData = response.data.map((item) => ({
          ...item,
          value: Number(item.value),
        }));

        setActivitiesData(formattedData);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setActivitiesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [username]);

  const totalValue = activitiesData.reduce((sum, activity) => sum + activity.value, 0);

  const handlePress = (activityName) => {
    setSelectedActivity(activityName);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (selectedActivity) {
      const activity = activitiesData.find((item) => item.name === selectedActivity);
      return (
        <View>
          <Text>{activity.name}: {(activity.value / totalValue * 100).toFixed(2)}%</Text>
        </View>
      );z
    }
  };

  const circleRadius = 80;
  const generateArcPath = (startAngle, arcLength) => {
    const startX = circleRadius + Math.cos(startAngle) * circleRadius;
    const startY = circleRadius + Math.sin(startAngle) * circleRadius;
    const endX = circleRadius + Math.cos(startAngle + arcLength) * circleRadius;
    const endY = circleRadius + Math.sin(startAngle + arcLength) * circleRadius;

    return `
      M ${circleRadius} ${circleRadius}
      L ${startX} ${startY}
      A ${circleRadius} ${circleRadius} 0 ${arcLength > Math.PI ? 1 : 0} 1 ${endX} ${endY}
      Z
    `;
  };

  let startAngle = 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (activitiesData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{color:'white'}}>No activities data available</Text>
      </View>
    );
  }

  const shadowOpt = {
    width: 2 * circleRadius,
    height: 2 * circleRadius,
    color: '#000000',
    border: 10,
    radius: 80,
    opacity: 0.5,
    x: 7,
    y: 0,
    style: { marginBottom: 20 },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activities Report</Text>
      <BoxShadow setting={shadowOpt}>
      <Svg width={2 * circleRadius} height={2 * circleRadius}>
        {activitiesData.map((item, index) => {
          const arcLength = (item.value / totalValue) * 2 * Math.PI;
          const path = generateArcPath(startAngle, arcLength);
          startAngle += arcLength;

          return (
            <Path
              key={index}
              d={path}
              fill={item.color}
              onPress={() => handlePress(item.name)}
            />
          );
        })}
      </Svg>
      </BoxShadow>

      <View style={styles.legendContainer}>
        {activitiesData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.colorBox, { backgroundColor: item.color }]} />
            <Text style={{color:'white'}}>{item.name}</Text>
          </View>
        ))}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
   
  },
  header: {
    fontSize: 20,
    marginBottom: 50,
    color: '#A0A0A0',
  },
  legendContainer: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 16,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  closeText: {
    alignSelf: 'flex-end',
  },
});

export default ActivitiesReport;