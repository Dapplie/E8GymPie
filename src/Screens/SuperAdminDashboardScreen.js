import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, StatusBar, ScrollView } from 'react-native';

const SuperAdminDashboardScreen = ({ navigation }) => {
  const [orderPageVisible, setOrderPageVisible] = useState(false);

  const goToManageBranches = () => {
    navigation.navigate('ManageBranchesScreen', { refresh: true });
  };

  const goToAnalyticsDashboard = () => {
    navigation.navigate('AnalyticsDashboardScreen');
  };

  const gotoManageAdmins = () => {
    navigation.navigate('ManageAdminsScreen', { refresh: true });
  };

  // Function to navigate to the Order Page screen
  // me

  const gototrytocontactus = () => {
    navigation.navigate('RequestToContactUs');
  };
  const gotoOrderPageScreen = () => {
    navigation.navigate('OrderPageScreen');
  };

  const goToManageUsers = () => {
    navigation.navigate('ManageUsersScreen', { refresh: true });
  };

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ImageBackground source={require('../../assets/superadmin.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Super Admin Dashboard</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={goToManageBranches}>
              <Text style={styles.optionText}>Manage Branches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={gotoManageAdmins}>
              <Text style={styles.optionText}>Manage Admins</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={goToManageUsers}>
              <Text style={styles.optionText}>Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={gotoOrderPageScreen}>
              <Text style={styles.optionText}>View Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={gototrytocontactus}>
              <Text style={styles.optionText}>Contact Us Request</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#D3D3D3', // Very light gray color
    marginTop: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  option: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(35, 35, 35, 0.9)',
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionText: {
    fontSize: 22,
    color: '#D3D3D3', // Very light gray color
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});

export default SuperAdminDashboardScreen;
