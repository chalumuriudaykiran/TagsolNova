import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AcademicAttendance = ({ route }) => {
  // Extract the username from route params
  const { username } = route.params || {};

  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedField, setSelectedField] = useState(null);

  // Fetch attendance data
  useEffect(() => {
    if (username) {
      const fetchAttendance = async () => {
        try {
          const response = await axios.get(`http://50.6.194.240:5000/attendance/${username}`);
          setAttendanceData(response.data);
        } catch (error) {
          console.error('Error fetching attendance:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAttendance();
    }
  }, [username]);

  if (!username) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Username not provided</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!attendanceData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No attendance data available</Text>
      </View>
    );
  }

  // Calculate percentages for each type of attendance
  const totalAttendance =
    attendanceData.present +
    attendanceData.informed +
    attendanceData.uninformed;
  const presentPercentage = (attendanceData.present / totalAttendance) * 100;
  const informedPercentage = (attendanceData.informed / totalAttendance) * 100;
  const uninformedPercentage = (attendanceData.uninformed / totalAttendance) * 100;

  // Generate pie chart paths
  const radius = 80;
  const centerX = 80;
  const centerY = 80;
  const startAngle = -90; // Start angle for the first slice

  const getArcPath = (start, end) => {
    const startAngleRad = (Math.PI / 180) * start; // Convert to radians
    const endAngleRad = (Math.PI / 180) * end; // Convert to radians

    const startX = centerX + radius * Math.cos(startAngleRad);
    const startY = centerY + radius * Math.sin(startAngleRad);
    const endX = centerX + radius * Math.cos(endAngleRad);
    const endY = centerY + radius * Math.sin(endAngleRad);
    const largeArcFlag = end - start <= 180 ? 0 : 1;

    return `M${centerX} ${centerY} L${startX} ${startY} A${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  };

  // Pie chart slice angles for present, informed, and uninformed attendance
  const presentAngle = (presentPercentage / 100) * 360;
  const informedAngle = (informedPercentage / 100) * 360;
  const uninformedAngle = (uninformedPercentage / 100) * 360;

  const presentArc = getArcPath(startAngle, startAngle + presentAngle);
  const informedArc = getArcPath(startAngle + presentAngle, startAngle + presentAngle + informedAngle);
  const uninformedArc = getArcPath(startAngle + presentAngle + informedAngle, startAngle + 360);

  // Modal content
  const renderModalContent = () => {
    if (selectedField === 'Present') {
      return <Text>Present: {presentPercentage.toFixed(2)}%</Text>;
    }
    if (selectedField === 'Informed') {
      return (
        <View>
          <Text>Informed Leave: {informedPercentage.toFixed(2)}%</Text>
          {attendanceData.informedDetails.length > 0 ? (
            attendanceData.informedDetails.map((detail, index) => (
              <Text key={index}>Date: {String(detail.date)}</Text>
            ))
          ) : (
            <Text>No informed leave details available.</Text>
          )}
        </View>
      );
    }
    if (selectedField === 'Uninformed') {
      return (
        <View>
          <Text>Uninformed Leave: {uninformedPercentage.toFixed(2)}%</Text>
          {attendanceData.uninformedDetails.length > 0 ? (
            attendanceData.uninformedDetails.map((detail, index) => (
              <Text key={index}>Date: {String(detail.date)}</Text>
            ))
          ) : (
            <Text>No uninformed leave details available.</Text>
          )}
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 80 }}>Academic Attendance</Text>

      {/* Color Legend */}
      <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 ,marginRight:45}}>
          <View
            style={{
              width: 40,
              height: 20,
              backgroundColor: '#4caf50', // Color for Present
              marginRight: 10,
            }}
          />
          <Text>Present</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <View
            style={{
              width: 40,
              height: 20,
              backgroundColor: '#ffa500', // Color for Informed Leave
              marginRight: 8,
            }}
          />
          <Text>Informed Leave</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 ,marginRight:5,marginLeft:20 }}>
          <View
            style={{
              width: 40,
              height: 20,
              backgroundColor: '#f44336', // Color for Uninformed Leave
              marginRight: 8,
            }}
          />
          <Text>Uninformed Leave</Text>
        </View>
      </View>

      {/* Pie Chart */}
      <Svg width={180} height={200}>
        <Path
          d={presentArc}
          fill="#4caf50"
          onPress={() => {
            setSelectedField('Present');
            setModalVisible(true);
          }}
        />
        <Path
          d={informedArc}
          fill="#ffa500"
          onPress={() => {
            setSelectedField('Informed');
            setModalVisible(true);
          }}
        />
        <Path
          d={uninformedArc}
          fill="#f44336"
          onPress={() => {
            setSelectedField('Uninformed');
            setModalVisible(true);
          }}
        />
      </Svg>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                padding: 10,
                alignSelf: 'flex-end',
              }}
            >
              <Text style={{ fontSize: 18 }}>X</Text>
            </TouchableOpacity>
            {renderModalContent()}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AcademicAttendance;