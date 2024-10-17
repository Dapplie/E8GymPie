// Branch3DashboardScreen.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Branch3DashboardScreen = () => {
  const navigation = useNavigation();

  const goToBranch3SpecificScreen = () => {
    // Navigate to the Branch3 specific screen
    navigation.navigate('Branch3SpecificScreen');
  };

  const handleLockClass = () => {
    // Add logic to lock a class
    console.log('Class locked in Branch 3');
    // Implement the locking functionality here
    Alert.alert('Class Locked', 'The class has been locked successfully.');
  };

  return (
    <ImageBackground source={require('../../assets/adminpic1.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Hazmieh Dashboard</Text>
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.option} onPress={goToBranch3SpecificScreen}>
            <Text style={styles.optionText}>Go to Specific</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleLockClass}>
            <Text style={styles.optionText}>Lock Class</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  optionsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  option: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default Branch3DashboardScreen;
