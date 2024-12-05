// import React, { useState, useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
// import Svg, { Circle, Path } from 'react-native-svg';
// import axios from 'axios';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const AcademicReport = ({ username }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedField, setSelectedField] = useState(null);
//   const [academicData, setAcademicData] = useState([]);
//   const [totalMarks, setTotalMarks] = useState(0);

//   // const { username } = route.params || {};

//   console.log(username);

//   useEffect(() => {
//     const fetchAcademicData = async () => {
//       try {
//         const response = await axios.get('http://50.6.194.240:5000/student-performance', {
//           params: { name: username },
//         });

//         const data = response.data;
//         setAcademicData(data);

//         // Calculate total marks for all subjects
//         let total = 0;
//         data.forEach((item) => {
//           total += parseFloat(item.total_marks);
//         });

//         setTotalMarks(total);
//       } catch (error) {
//         console.error('Error fetching academic data:', error);
//       }
//     };

//     fetchAcademicData();
//   }, [username]);

//   const calculatePercentage = (subjectMarks) => {
//     return (subjectMarks / totalMarks) * 100;
//   };

//   const handlePress = (subject) => {
//     setSelectedField(subject);
//     setModalVisible(true);
//   };

//   const renderModalContent = () => {
//     if (selectedField) {
//       const subjectData = academicData.find((item) => item.subject === selectedField);
//       return (
//         <View>
//           <Text>{selectedField} - Total Marks: {subjectData.total_marks}</Text>
//           <Text>Percentage: {calculatePercentage(subjectData.total_marks).toFixed(2)}%</Text>
//         </View>
//       );
//     }
//   };

//   const circleRadius = 80;
//   const strokeWidth = 15;
//   const total = totalMarks;

//   const calculateArcLength = (percentage) => (percentage / 100) * 2 * Math.PI;

//   const subjectColors = ['#81c7e2', '#81c784', '#f4cccc', '#fff176', '#d1a7f7']; // Add more colors as needed

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Academic Report</Text>

//       {/* <View style={styles.subjectsContainer}>
//         {academicData.map((item, index) => {
//           const percentage = calculatePercentage(parseFloat(item.total_marks));
//           return (
//             <TouchableOpacity key={index} onPress={() => handlePress(item.subject)}>
//               <Text>{item.subject} - {percentage.toFixed(2)}%</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View> */}

//       <Svg width={2 * circleRadius} height={2 * circleRadius}>
//         <Circle cx={circleRadius} cy={circleRadius} r={circleRadius - strokeWidth / 2} fill="white" stroke="#e0e0e0" strokeWidth={strokeWidth} />

//         {academicData.map((item, index) => {
//           const percentage = calculatePercentage(parseFloat(item.total_marks));
//           const arcLength = calculateArcLength(percentage);

//           const startAngle = index === 0
//             ? 0
//             : calculateArcLength(
//                 academicData
//                   .slice(0, index)
//                   .reduce((sum, curr) => sum + parseFloat(curr.total_marks), 0) / totalMarks * 100
//               );

//           const arcPath = `
//             M ${circleRadius} ${circleRadius}
//             L ${circleRadius + Math.cos(startAngle) * circleRadius} ${circleRadius + Math.sin(startAngle) * circleRadius}
//             A ${circleRadius} ${circleRadius} 0 ${percentage > 50 ? 1 : 0} 1 ${circleRadius + Math.cos(startAngle + arcLength) * circleRadius} ${circleRadius + Math.sin(startAngle + arcLength) * circleRadius}
//             Z
//           `;

//           const color = subjectColors[index % subjectColors.length];

//           return <Path key={index} d={arcPath} fill={color} onPress={() => handlePress(item.subject)} />;
//         })}
//       </Svg>

//       {/* Legend */}
//       <View style={styles.legendContainer}>
//         {academicData.map((item, index) => {
//           const color = subjectColors[index % subjectColors.length];
//           return (
//             <View key={index} style={styles.legendItem}>
//               <View style={[styles.colorBox, { backgroundColor: color }]} />
//               <Text style={styles.legendText}>{item.subject}</Text>
//             </View>
//           );
//         })}
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
//     marginBottom: 40,
//   },
//   subjectsContainer: {
//     marginBottom: 30,
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

// export default AcademicReport;






import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import axios from 'axios';
import { BoxShadow } from 'react-native-shadow';

const AcademicReport = ({ username }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [academicData, setAcademicData] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const response = await axios.get('http://50.6.194.240:5000/student-performance', {
          params: { name: username },
        });

        const data = response.data;
        setAcademicData(data);

        // Calculate total marks for all subjects
        let total = 0;
        data.forEach((item) => {
          total += parseFloat(item.total_marks);
        });

        setTotalMarks(total);
      } catch (error) {
        console.error('Error fetching academic data:', error);
      }
    };

    fetchAcademicData();
  }, [username]);

  const calculatePercentage = (subjectMarks) => {
    return (subjectMarks / totalMarks) * 100;
  };

  const handlePress = (subject) => {
    setSelectedField(subject);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    if (selectedField) {
      const subjectData = academicData.find((item) => item.subject === selectedField);
      return (
        <View>
          <Text>{selectedField} - Total Marks: {subjectData.total_marks}</Text>
          <Text>Percentage: {calculatePercentage(subjectData.total_marks).toFixed(2)}%</Text>
        </View>
      );
    }
  };

  const circleRadius = 80;
  const strokeWidth = 15;
  const total = totalMarks;

  const calculateArcLength = (percentage) => (percentage / 100) * 2 * Math.PI;

  const subjectColors = ['#81c7e2', '#81c784', '#f4cccc', '#fff176', '#d1a7f7']; // Add more colors as needed

  const shadowOpt = {
    width: 2 * circleRadius,
    height: 2 * circleRadius,
    color: '#000000',
    border: 10,
    radius: 80,
    opacity: 0.5,
    x: 5,
    y: 2,
    style: { marginBottom: 20},
  };

 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Academic Report</Text>

      <BoxShadow setting={shadowOpt}>
        <Svg width={2 * circleRadius} height={2 * circleRadius}>
          <Circle cx={circleRadius} cy={circleRadius} r={circleRadius - strokeWidth / 2} fill="white" stroke="#e0e0e0" strokeWidth={strokeWidth} />

          {academicData.map((item, index) => {
            const percentage = calculatePercentage(parseFloat(item.total_marks));
            const arcLength = calculateArcLength(percentage);

            const startAngle = index === 0
              ? 0
              : calculateArcLength(
                  academicData
                    .slice(0, index)
                    .reduce((sum, curr) => sum + parseFloat(curr.total_marks), 0) / totalMarks * 100
                );

            const arcPath = `
              M ${circleRadius} ${circleRadius}
              L ${circleRadius + Math.cos(startAngle) * circleRadius} ${circleRadius + Math.sin(startAngle) * circleRadius}
              A ${circleRadius} ${circleRadius} 0 ${percentage > 50 ? 1 : 0} 1 ${circleRadius + Math.cos(startAngle + arcLength) * circleRadius} ${circleRadius + Math.sin(startAngle + arcLength) * circleRadius}
              Z
            `;

            const color = subjectColors[index % subjectColors.length];

            return <Path key={index} d={arcPath} fill={color} onPress={() => handlePress(item.subject)} />;
          })}
        </Svg>
      </BoxShadow>

      {/* Legend */}
      <View style={[styles.legendContainer]}>
        {academicData.map((item, index) => {
          const color = subjectColors[index % subjectColors.length];
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: color }]} />
              <Text style={{color:'white'}}>{item.subject}</Text>
            </View>
          );
        })}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent]}>
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
  
  },
  header: {
    fontSize: 20,
    marginBottom: 40,
    color: 'white',
    
  },
  legendContainer: {
    marginTop: 30,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10, // Added padding to make shadow visible
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

export default AcademicReport;