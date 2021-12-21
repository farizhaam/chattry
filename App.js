import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Screen1 from './components/Screen1';
import Screen2 from './components/Screen2';

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Screen1"
        >
          <Stack.Screen
            name="Screen1"
            component={Screen1}
          />
          <Stack.Screen
            name="Screen2"
            component={Screen2}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}