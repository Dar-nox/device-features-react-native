import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Button, Image, StyleSheet, useColorScheme } from 'react-native';
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
      <Button
        title="Add Travel Entry"
        onPress={() => navigation.navigate('AddTravelEntry')}
        color={isDarkMode ? '#bb86fc' : '#6200ee'}
      />
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
              <Button
                title="Remove"
                color={isDarkMode ? '#cf6679' : '#d32f2f'}
                onPress={() => removeEntry(item.id)}
              />
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
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.2 : 0.1,
      shadowRadius: 4,
      elevation: 3,
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
  });
