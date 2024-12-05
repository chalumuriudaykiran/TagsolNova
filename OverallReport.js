// import React, { useState, useEffect } from "react";
// import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
// import Svg, { Path, Circle, G } from "react-native-svg";
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// const OverallReport = ({ username }) => {
//   const circleRadius = 120; // Radius of the doughnut chart
//   const strokeWidth = 50; // Thickness of the doughnut chart
//   const borderWidth = 2; // Width of the segment borders

//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);
//   const [data, setData] = useState([]);

//   const staticColors = ["#FF6347", "#FFD700", "#90EE90", "#FFD700"]; // Chart colors
//   const staticLabels = ["Activities", "Academic", "Attendance", "Behavior"]; // Chart labels

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setData([
//           { label: "Activities", value: 20 },
//           { label: "Academic", value: 50 },
//           { label: "Attendance", value: 30 },
//           { label: "Behavior", value: 40 },
//         ]);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [username]);

//   const totalSegments = data.length;
//   const equalArcLength = (2 * Math.PI) / totalSegments;

//   const createSegment = (startAngle, endAngle, color, index) => {
//     const innerRadius = circleRadius - strokeWidth;
//     const x1 = circleRadius + Math.cos(startAngle) * circleRadius;
//     const y1 = circleRadius + Math.sin(startAngle) * circleRadius;
//     const x2 = circleRadius + Math.cos(endAngle) * circleRadius;
//     const y2 = circleRadius + Math.sin(endAngle) * circleRadius;

//     const x3 = circleRadius + Math.cos(endAngle) * innerRadius;
//     const y3 = circleRadius + Math.sin(endAngle) * innerRadius;
//     const x4 = circleRadius + Math.cos(startAngle) * innerRadius;
//     const y4 = circleRadius + Math.sin(startAngle) * innerRadius;

//     const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

//     return (
//       <G key={index}>
//         <Path
//           d={`M${x1},${y1} A${circleRadius},${circleRadius} 0 ${largeArcFlag} 1 ${x2},${y2} L${x3},${y3} A${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${x4},${y4} Z`}
//           fill={color}
//           stroke="#fff"
//           strokeWidth={borderWidth}
//           onPress={() => handleSegmentPress(index)}
//         />
//       </G>
//     );
//   };

//   const renderChart = () => {
//     let startAngle = -Math.PI / 2;
//     return data.map((item, index) => {
//       const endAngle = startAngle + equalArcLength;
//       const segment = createSegment(startAngle, endAngle, staticColors[index], index);
//       startAngle = endAngle;
//       return segment;
//     });
//   };

//   const handleSegmentPress = (index) => {
//     setSelectedData(data[index]);
//     setModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Overall Report</Text>
//       <View style={styles.chartWrapper}>
//         <Svg width={circleRadius * 2} height={circleRadius * 2}>
//           <Circle
//             cx={circleRadius}
//             cy={circleRadius}
//             r={circleRadius - strokeWidth / 2}
//             fill="white"
//           />
//           {renderChart()}
//         </Svg>
//         <View style={styles.legendContainer}>
//   {staticLabels.map((label, index) => {
//     const isReversed = label === "Attendance" || label === "Academic";
//     const angle = equalArcLength * index + equalArcLength / 2;
//     const xPosition = circleRadius + Math.cos(angle) * (circleRadius + strokeWidth / 2);
//     const yPosition = circleRadius + Math.sin(angle) * (circleRadius + strokeWidth / 2);

//     return (
//       <View
//         key={index}
//         style={[
//           styles.legendItem,
//           isReversed && styles.reversedLegend,
//           { top: yPosition - 16, left: xPosition - 54 },
//         ]}
//       >
//         {/* Arrow */}
//         <View style={styles.legendArrow}>
//           <View style={[styles.arrowHead, { borderTopColor: staticColors[index] }]} />
//         </View>
//         {/* Legend Label */}
//         <Text style={styles.legendText}>{label}</Text>
//       </View>
//     );
//   })}
// </View>

//       </View>

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity onPress={() => setModalVisible(false)}>
//               <Text style={styles.closeButton}>X</Text>
//             </TouchableOpacity>
//             {selectedData && (
//               <Text style={styles.modalText}>
//                 {selectedData.label}: {selectedData.value}
//               </Text>
//             )}
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#F5F1E7",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginVertical: 20,
//   },
//   chartWrapper: {
//     position: "relative",
//   },
//   legendContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   legendItem: {
//     position: "absolute",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   reversedLegend: {
//     flexDirection: "row-reverse", // For Attendance and Academic
//   },
//   legendArrow: {
//     width: 30,
//     height: 3,
//     backgroundColor: "black",
//     marginRight: 10,
//     position: "relative",
//   },
//   arrowHead: {
//     position: "absolute",
//     right: -5,
//     top: -2,
//     width: 10,
//     height: 0,
//     borderLeftWidth: 5,
//     borderTopWidth: 5,
//     borderLeftColor: "transparent",
//     borderRightWidth: 5,
//     borderBottomWidth: 5,
//   },
//   legendText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#333",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   closeButton: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "red",
//     alignSelf: "flex-end",
//   },
//   modalText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default OverallReport;



import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, Circle, Defs, Filter, FeDropShadow, G, FeGaussianBlur, FeOffset } from "react-native-svg";
// import WeatherReport from "./Wheather_report";

const OverallReport = ({ username }) => {
  const circleRadius = 120; // Radius of the doughnut chart
  const strokeWidth = 65; // Thickness of the doughnut chart
  const borderWidth = 4; // Width of the segment borders
  const doughnutBorderColor = "#333"; // Border color for the doughnut chart

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [data, setData] = useState([]);

  const staticColors = ["#820D23", "#CC8600", "#A8E6A3", "#4CB7B7"]; // Chart colors
  const staticLabels = ["Activities", "Academic", "Attendance", "Behavior"]; // Chart labels

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData([
          { label: "Activities", value: 20 },
          { label: "Academic", value: 50 },
          { label: "Attendance", value: 30 },
          { label: "Behavior", value: 40 },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [username]);

  const totalSegments = data.length;
  const equalArcLength = (2 * Math.PI) / totalSegments;

  const createSegment = (startAngle, endAngle, color, index) => {
    const innerRadius = circleRadius - strokeWidth;
    const x1 = circleRadius + Math.cos(startAngle) * circleRadius;
    const y1 = circleRadius + Math.sin(startAngle) * circleRadius;
    const x2 = circleRadius + Math.cos(endAngle) * circleRadius;
    const y2 = circleRadius + Math.sin(endAngle) * circleRadius;

    const x3 = circleRadius + Math.cos(endAngle) * innerRadius;
    const y3 = circleRadius + Math.sin(endAngle) * innerRadius;
    const x4 = circleRadius + Math.cos(startAngle) * innerRadius;
    const y4 = circleRadius + Math.sin(startAngle) * innerRadius;

    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

    return (
      <G key={index}>
        <Path
          d={`M${x1},${y1} A${circleRadius},${circleRadius} 0 ${largeArcFlag} 1 ${x2},${y2} L${x3},${y3} A${innerRadius},${innerRadius} 0 ${largeArcFlag} 0 ${x4},${y4} Z`}
          fill={color}
          stroke={doughnutBorderColor} // Add border color
          strokeWidth={borderWidth}
          onPress={() => handleSegmentPress(index)}
        />
      </G>
    );
  };

  const renderChart = () => {
    let startAngle = -Math.PI / 2;
    return data.map((item, index) => {
      const endAngle = startAngle + equalArcLength;
      const segment = createSegment(startAngle, endAngle, staticColors[index], index);
      startAngle = endAngle;
      return segment;
    });
  };

  const handleSegmentPress = (index) => {
    setSelectedData(data[index]);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>

      {/* <View style={styles.weather}> */}
        {/* <WeatherReport location='Hyderabad'/> */}
      {/* </View> */}
      <Text style={[styles.title, { color: 'white' }]}>Overall Report</Text>
      <View style={styles.chartWrapper}>
        <Svg width={circleRadius * 2} height={circleRadius * 2}>
          <Defs>
            {/* Outer Shadow Filter */}
            <Filter id="outerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur in="SourceAlpha" stdDeviation="10" />
              <FeOffset dx="8" dy="8" result="offsetblur" />
              <FeDropShadow dx="8" dy="8" stdDeviation="10" floodColor="black" floodOpacity="0.9" />
            </Filter>

            {/* Inner Shadow Filter */}
            <Filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur in="SourceAlpha" stdDeviation="10" />
              <FeOffset dx="-8" dy="-8" result="offsetblur" />
              <FeDropShadow dx="-8" dy="-8" stdDeviation="10" floodColor="black" floodOpacity="0.9" />
            </Filter>
          </Defs>

          {/* Outer Circle for Doughnut with Shadow */}
          <Circle
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - strokeWidth / 2}
            fill="transparent"
            stroke={doughnutBorderColor} // Doughnut border color
            strokeWidth={borderWidth} // Border width
            filter="url(#outerShadow)" // Apply outer shadow filter
          />

          {/* Inner Circle to create hole with Shadow */}
          <Circle
            cx={circleRadius}
            cy={circleRadius}
            r={circleRadius - strokeWidth / 2}
            fill="transparent"
            stroke="#222222" // Darker color for inner shadow effect
            strokeWidth={20} // Larger stroke to simulate the shadow effect inside
            filter="url(#innerShadow)" // Apply inner shadow filter
          />

          {/* Rendering Doughnut Segments */}
          {renderChart()}
        </Svg>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {staticLabels.map((label, index) => {
            const isReversed = label === "Attendance" || label === "Academic";
            const angle = equalArcLength * index + equalArcLength / 2;
            const xPosition = circleRadius + Math.cos(angle) * (circleRadius + strokeWidth / 2);
            const yPosition = circleRadius + Math.sin(angle) * (circleRadius + strokeWidth / 2);

            return (
              <View
                key={index}
                style={[styles.legendItem, isReversed && styles.reversedLegend, { top: yPosition - 16, left: xPosition - 54 }]}>
                <View style={styles.legendArrow}>
                  <View style={[styles.arrowHead, { borderTopColor: staticColors[index] }]} />
                </View>
                <Text style={[styles.legendText, { color: 'white' }]}>{label}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            {selectedData && (
              <Text style={styles.modalText}>
                {selectedData.label}: {selectedData.value}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 20,
    color: "#A0A0A0", // Color of the title
    shadowColor: "#ffffff",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  weather: {
    alignSelf: "flex-end", // Align to the right
    marginBottom: 10, // Add spacing below weather report
    zIndex: 1,
    backgroundColor: "black", // Optional background
    borderRadius: 10,
    paddingLeft:60 ,
    elevation: 5, // Shadow for Android
  },
  chartWrapper: {
    position: "relative",
  },
  legendContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  legendItem: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  reversedLegend: {
    flexDirection: "row-reverse",
  },
  legendArrow: {
    width: 30,
    height: 3,
    backgroundColor: '#A0A0A0',
    marginRight: 10,
    position: "relative",
  },
  legendText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A0A0A0", // Added the color for text
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    alignSelf: "flex-end",
  },
  modalText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OverallReport;