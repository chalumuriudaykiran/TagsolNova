// import React, { useState, useEffect } from 'react';
// import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
// import Svg, { Circle, Path } from 'react-native-svg';

// const BehaviorReport = ({ username }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedField, setSelectedField] = useState(null);
//   const [behaviorData, setBehaviorData] = useState([]);
//   const [percentages, setPercentages] = useState({
//     positive: 0,
//     needsImprovement: 0,
//     negative: 0,
//   });

//   // Fetch behavior data
//   useEffect(() => {
//     const fetchBehaviorData = async () => {
//       if (!username) return;

//       try {
//         const response = await fetch(`http://50.6.194.240:5000/report/${username}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch behavior data');
//         }
//         const data = await response.json();
//         setPercentages({
//           positive: data.positivePercentage || 0,
//           needsImprovement: data.needsImprovementPercentage || 0,
//           negative: data.negativePercentage || 0,
//         });
//         setBehaviorData(data);
//       } catch (error) {
//         Alert.alert('Error', error.message);
//       }
//     };

//     fetchBehaviorData();
//   }, [username]);

//   // Normalize data to make sure total equals 100%
//   const total = percentages.positive + percentages.needsImprovement + percentages.negative;
//   const totalPercent = total > 0 ? total : 100; // Prevent division by zero

//   const positivePercent = (percentages.positive / totalPercent) * 100;
//   const needsImprovementPercent = (percentages.needsImprovement / totalPercent) * 100;
//   const negativePercent = (percentages.negative / totalPercent) * 100;

//   const circleRadius = 50;
//   const strokeWidth = 15;

//   // Function to handle the pie chart press
//   const handlePress = (field) => {
//     setSelectedField(field);
//     setModalVisible(true);
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text style={{ fontSize: 20, marginBottom: 20 }}>Behavior Report</Text>
//       <Svg width={2 * circleRadius} height={2 * circleRadius}>
//         {/* Background circle */}
//         <Circle
//           cx={circleRadius}
//           cy={circleRadius}
//           r={circleRadius - strokeWidth / 2}
//           fill="white"
//           stroke="#e0e0e0"
//           strokeWidth={strokeWidth}
//         />

//         {/* Positive section */}
//         {positivePercent > 0 && (
//           <Path
//             key="positive"
//             d={`M ${circleRadius} ${circleRadius} L ${circleRadius} 0 A ${circleRadius} ${circleRadius} 0 ${
//               positivePercent > 50 ? 1 : 0
//             } 1 ${circleRadius} ${circleRadius}`}
//             fill="#81c784"
//             onPress={() => handlePress({ field: 'Positive', percentage: positivePercent })}
//           />
//         )}

//         {/* Needs Improvement section */}
//         {needsImprovementPercent > 0 && (
//           <Path
//             key="needsImprovement"
//             d={`M ${circleRadius} ${circleRadius} L ${circleRadius} 0 A ${circleRadius} ${circleRadius} 0 ${
//               needsImprovementPercent > 50 ? 1 : 0
//             } 1 ${circleRadius} ${circleRadius}`}
//             fill="#fff176"
//             onPress={() =>
//               setSelectedField({
//                 Fields++

//         {/* Needs Improvement section */}
//         {needsImprovementPercent > 0 && (
//           <Path
//             key="needsImprovement"
//             d={`M ${circleRadius + Math.cos(positivePercent / 100) * circleRadius} ${
//               circleRadius + Math.sin(positivePercent / 100) * circleRadius
//             } A ${circleRadius} ${circleRadius} 0 ${
//               needsImprovementPercent > 50 ? 1 : 0
//             } 1 ${circleRadius + Math.cos((positivePercent + needsImprovementPercent) / 100) * circleRadius} ${
//               circleRadius + Math.sin((positivePercent + needsImprovementPercent) / 100) * circleRadius
//             }`}
//             fill="#fff176"
//             onPress={() =>
//               handlePress({ field: 'Needs Improvement', percentage: needsImprovementPercent })
//             }
//           />
//         )}

//         {/* Negative section */}
//         {negativePercent > 0 && (
//           <Path
//             key="negative"
//             d={`M ${circleRadius + Math.cos((positivePercent + needsImprovementPercent) / 100) * circleRadius} ${
//               circleRadius + Math.sin((positivePercent + needsImprovementPercent) / 100) * circleRadius
//             } A ${circleRadius} ${circleRadius} 0 ${
//               negativePercent > 50 ? 1 : 0
//             } 1 ${circleRadius} ${circleRadius}`}
//             fill="#e57373"
//             onPress={() => handlePress({ field: 'Negative', percentage: negativePercent })}
//           />
//         )}
//       </Svg>  

//       {/* Modal to display details */}
//       <Modal
//         visible={modalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
//           <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={{ alignSelf: 'flex-end', fontSize: 18 }}>X</Text>
//             </TouchableOpacity>
//             {selectedField && (
//               <Text style={{ fontSize: 18 }}>
//                 {selectedField.field}: {selectedField.percentage.toFixed(2)}%
//               </Text>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// export default BehaviorReport;







import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const BehaviorReport = ({ username }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [percentages, setPercentages] = useState({
    positive: 0,
    needsImprovement: 0,
    negative: 0,
  });

  // Fetch behavior data
  useEffect(() => {
    const fetchBehaviorData = async () => {
      if (!username) return;

      try {
        const response = await fetch(`http://50.6.194.240:5000/report/${username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch behavior data');
        }
        const data = await response.json();
        setPercentages({
          positive: data.positivePercentage || 0,
          needsImprovement: data.needsImprovementPercentage || 0,
          negative: data.negativePercentage || 0,
        });
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    fetchBehaviorData();
  }, [username]);

  // Normalize data to ensure total equals 100%
  const total = percentages.positive + percentages.needsImprovement + percentages.negative;
  const positivePercent = total > 0 ? (percentages.positive / total) * 100 : 0;
  const needsImprovementPercent = total > 0 ? (percentages.needsImprovement / total) * 100 : 0;
  const negativePercent = total > 0 ? (percentages.negative / total) * 100 : 0;

  const circleRadius = 80;
  const strokeWidth = 10;

  const calculatePath = (startAngle, endAngle) => {
    const startX = circleRadius + circleRadius * Math.cos(startAngle);
    const startY = circleRadius + circleRadius * Math.sin(startAngle);
    const endX = circleRadius + circleRadius * Math.cos(endAngle);
    const endY = circleRadius + circleRadius * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${circleRadius} ${circleRadius} L ${startX} ${startY} A ${circleRadius} ${circleRadius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  };

  const positiveEndAngle = (positivePercent / 100) * 2 * Math.PI;
  const needsImprovementEndAngle = positiveEndAngle + (needsImprovementPercent / 100) * 2 * Math.PI;
  const negativeEndAngle = needsImprovementEndAngle + (negativePercent / 100) * 2 * Math.PI;

  const handlePress = (field, percentage) => {
    setSelectedField({ field, percentage });
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 40 }}>Behavior Report</Text>
      <Svg width={circleRadius * 2} height={circleRadius * 2}>
        {/* Background circle */}
        <Circle
          cx={circleRadius}
          cy={circleRadius}
          r={circleRadius - strokeWidth}
          fill="white"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />

        {/* Positive section */}
        {positivePercent > 0 && (
          <Path
            d={calculatePath(0, positiveEndAngle)}
            fill="#81c784"
            onPress={() => handlePress('Positive', positivePercent)}
          />
        )}

        {/* Needs Improvement section */}
        {needsImprovementPercent > 0 && (
          <Path
            d={calculatePath(positiveEndAngle, needsImprovementEndAngle)}
            fill="#fff176"
            onPress={() => handlePress('Needs Improvement', needsImprovementPercent)}
          />
        )}

        {/* Negative section */}
        {negativePercent > 0 && (
          <Path
            d={calculatePath(needsImprovementEndAngle, negativeEndAngle)}
            fill="#e57373"
            onPress={() => handlePress('Negative', negativePercent)}
          />
        )}
      </Svg>


       {/* Legend Section */}
       <View style={{ marginTop: 20, width: '80%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#81c784', marginRight: 8 }} />
          <Text>Positive</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#fff176', marginRight: 8 }} />
          <Text>Needs Improvement</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 20, height: 20, backgroundColor: '#e57373', marginRight: 8 }} />
          <Text>Negative</Text>
        </View>
      </View>

      {/* Modal for displaying details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ alignSelf: 'flex-end', fontSize: 18 }}>X</Text>
            </TouchableOpacity>
            {selectedField && (
              <Text style={{ fontSize: 18, textAlign: 'center' }}>
                {selectedField.field}: {selectedField.percentage.toFixed(2)}%
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BehaviorReport;

