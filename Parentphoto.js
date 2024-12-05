 import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Video } from 'expo-av';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ParentPhoto = () => {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('http://50.6.194.240:5000/api/media');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received from the server');
      }
      setMedia(data);
    } catch (err) {
      console.error('Error fetching media:', err.message);
      setError(`Error fetching media: ${err.message}`);
    }
  };


  const renderMedia = (item) => {
    if (!item.attachments || !item.mediaType) return null; // Ensure attachments and mediaType exist

    switch (item.mediaType) {
      case 'image/jpeg':
        return (
          <Image
            source={{ uri: item.attachments }}
            style={styles.media}
            resizeMode="cover"
            onError={() => Alert.alert('Error', 'Failed to load image')}
          />
        );
      case 'video/mp4':
        return (
          <Video
            source={{ uri: item.attachments }}
            style={styles.media}
            useNativeControls
            resizeMode="contain"
            isLooping
            onError={(e) => console.error('Video error:', e)}
          />
        );
      default:
        console.warn(`Unsupported media type: ${item.mediaType}`);
        return null;
    }
  };

  const displayMedia = () => {
    if (media.length === 0) {
      return <Text style={styles.noMediaText}>No media found.</Text>;
    }

    return media.map((item) => (
      <View key={item.id || item.attachments} style={styles.mediaContainer}>
        {renderMedia(item)}
        <Text style={styles.mediaTitle}>{item.eventName || 'Unnamed Event'}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.mobileFrame}>
      <View style={[styles.mainHeader, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Image source={require('./assets/images/slides/logo226.png')} style={styles.logo} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('ParentDashboard')}>
          <Icon name="home" type="material" size={wp('10%')} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}></Text>
            </View>
      <View style={styles.galleryContainer}>
        <Text style={styles.galleryTitle}>Photo Gallery:</Text>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <ScrollView>
            {displayMedia()}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileFrame: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1.5%'),  // Responsive padding
    paddingHorizontal: wp('4%'),  // Responsive padding
    height: hp('12%'),  // Responsive height
    marginBottom: wp('3%'),  // Responsive margin bottom
  },
  logo: {
    width: wp('15%'),  // Responsive width
    height: wp('15%'),  // Responsive height
  },
  subHeader: {
    backgroundColor: 'rgb(160, 180, 182)',
    paddingVertical: hp('1%'),  // Responsive padding
    alignItems: 'center',
    height: hp('3%'),  // Responsive height
  },
  subHeaderText: {
    fontSize: wp('5%'),  // Responsive font size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  galleryContainer: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 10,
  },
  mediaContainer: {
    marginBottom: 10,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  mediaTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 5,
  },
  noMediaText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default ParentPhoto;