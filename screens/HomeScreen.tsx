import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
}

interface HomeScreenProps {
  navigation: any;
  isDarkMode: boolean;
}

export default function HomeScreen({ navigation, isDarkMode }: HomeScreenProps) {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const styles = getStyles(isDarkMode);

  const loadEntries = async () => {
    const storedEntries = await AsyncStorage.getItem('travelEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const removeEntry = async (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
    await AsyncStorage.setItem('travelEntries', JSON.stringify(updatedEntries));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTravelEntry')}>
        <Text style={styles.addButtonText}>Add Travel Entry</Text>
      </TouchableOpacity>
      {entries.length === 0 ? (
        <Text style={styles.noEntries}>No Entries Yet</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <Text style={styles.address}>{item.address}</Text>
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  { backgroundColor: isDarkMode ? '#cf6679' : '#d32f2f' },
                ]}
                onPress={() => removeEntry(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const getStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    noEntries: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 18,
      color: isDarkMode ? '#e0e0e0' : '#757575',
    },
    entry: {
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: 16,
      padding: 15,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 6,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
    },
    address: {
      fontSize: 16,
      color: isDarkMode ? '#e0e0e0' : '#424242',
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: isDarkMode ? '#bb86fc' : '#6200ee',
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
      marginBottom: 20,
    },
    addButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
    removeButton: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    removeButtonText: {
      color: '#ffffff',
      fontSize: 16,
    },
  });
