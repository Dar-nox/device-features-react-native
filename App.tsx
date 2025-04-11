import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, StatusBar, Switch } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import AddTravelEntryScreen from './screens/AddTravelEntryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const styles = StyleSheet.create({
    appContainer: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
      paddingTop: StatusBar.currentHeight,
    },
  });

  return (
    <View style={styles.appContainer}>
      <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            options={{
              headerShown: true,
              title: 'Travel Journal',
              headerStyle: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#6200ee',
                elevation: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <View style={{ marginRight: 10 }}>
                  <Switch
                    value={isDarkMode}
                    onValueChange={() => setIsDarkMode(!isDarkMode)}
                    thumbColor={isDarkMode ? '#bb86fc' : '#ffffff'}
                  />
                </View>
              ),
            }}
          >
            {(props) => <HomeScreen {...props} isDarkMode={isDarkMode} />}
          </Stack.Screen>
          <Stack.Screen
            name="AddTravelEntry"
            options={{
              title: 'Add Travel Entry',
              headerStyle: {
                backgroundColor: isDarkMode ? '#1e1e1e' : '#6200ee',
                elevation: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              headerTintColor: '#ffffff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            {(props) => <AddTravelEntryScreen {...props} isDarkMode={isDarkMode} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
