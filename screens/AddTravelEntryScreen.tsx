import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert, useColorScheme, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

interface AddTravelEntryScreenProps {
  navigation: any;
  isDarkMode: boolean;
}

export default function AddTravelEntryScreen({ navigation, isDarkMode }: AddTravelEntryScreenProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const styles = getStyles(isDarkMode);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log('ImagePicker result:', result); // Log the result for debugging
      if (result.assets && result.assets[0] && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
        getAddress(result.assets[0].uri);
      } else {
        alert('Failed to retrieve image URI.');
      }
    }
  };

  const getAddress = async (uri: string) => {
    setLoadingAddress(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission is required.');
      setLoadingAddress(false);
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location result:', location); // Log the location for debugging

      const addressData = await Location.reverseGeocodeAsync(location.coords);
      console.log('Reverse geocode result:', addressData); // Log the address data for debugging

      if (addressData && addressData.length > 0) {
        const formattedAddress = `${addressData[0].name || 'Unknown'}, ${addressData[0].city || 'Unknown'}, ${addressData[0].region || 'Unknown'}`;
        setAddress(formattedAddress);
      } else {
        alert('Unable to retrieve address. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      alert('An error occurred while retrieving the address.');
    }
    setLoadingAddress(false);
  };

  const saveEntry = async () => {
    if (!imageUri || !address) {
      Alert.alert('Error', 'Please take a picture and get the address first.');
      return;
    }

    const newEntry = {
      id: Date.now().toString(),
      imageUri,
      address,
    };

    const storedEntries = await AsyncStorage.getItem('travelEntries');
    const entries = storedEntries ? JSON.parse(storedEntries) : [];
    entries.push(newEntry);

    await AsyncStorage.setItem('travelEntries', JSON.stringify(entries));

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Travel Entry Saved!',
        body: 'Your travel entry has been successfully saved.',
      },
      trigger: null,
    });

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.takePictureButton, { backgroundColor: isDarkMode ? '#bb86fc' : '#6200ee' }]}
        onPress={takePicture}
      >
        <Text style={styles.takePictureButtonText}>Take Picture</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loadingAddress ? (
        <View style={[styles.saveButton, { backgroundColor: isDarkMode ? '#03dac6' : '#018786' }]}>
          <ActivityIndicator color="#ffffff" />
        </View>
      ) : (
        address && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: isDarkMode ? '#03dac6' : '#018786' }]}
            onPress={saveEntry}
          >
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'flex-start', // Align items at the top
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    image: {
      width: '100%',
      height: 200,
      marginTop: 20,
      marginBottom: 20, // Add spacing below the image
      borderRadius: 10,
    },
    takePictureButton: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 20,
    },
    takePictureButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
    saveButton: {
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    saveButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
    buttonSpacing: {
      marginBottom: 20, // Add spacing between buttons
    },
  });
