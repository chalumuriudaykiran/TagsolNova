import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentBehavioralReport = () => {
  const [reports, setReports] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params || {}; // Ensure username is safely accessed

  useEffect(() => {
    if (username) {
      fetchReports(username); // Pass username to fetchReports
    } else {
      console.error('Username is not provided');
    }
  }, [username]);

  const fetchReports = async (username) => {
    try {
      const response = await axios.get(`http://50.6.194.240:5000/report/${username}`);
      if (response.data.success) {
        setReports(response.data.reports); // Set reports state
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      console.error("Error fetching behavioral reports:", error);
      Alert.alert('Error', error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.reportContainer}>
      <Text style={styles.reportText}>
        <Text style={styles.boldText}>Student Name:</Text> {item.name || "N/A"}
      </Text>
      <Text style={styles.reportText}>
        <Text style={styles.boldText}>Class:</Text> {item.class_name || "N/A"}
      </Text>
      <Text style={styles.reportText}>
        <Text style={styles.boldText}>Section:</Text> {item.section || "N/A"}
      </Text>
      <Text style={styles.reportText}>
        <Text style={styles.boldText}>Behavior:</Text> {item.report || "N/A"}
      </Text>
    </View>
  );

  return (
    <View style={styles.mobileFrame}>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Icon name="home" type="material" size={60} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.emptyHeader} />

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Behavioral Report</Text>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>

      <View style={{ flex: 0.1 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  emptyHeader: {
    height: 30,
    backgroundColor: 'rgb(160, 180, 182)',
    marginTop: 2,
    elevation: 2,
  },
  mainHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 110,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  logo: {
    width: 80,
    height: 80,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  reportContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reportText: {
    fontSize: 16,
    marginVertical: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default ParentBehavioralReport;
