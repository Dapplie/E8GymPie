import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import icons from Expo

import Header from './Header';
import PasswordResetForm from '../components/PasswordResetForm'; // Import the PasswordResetForm component

const SettingsScreen = () => {
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [passwordResetVisible, setPasswordResetVisible] = useState(false);

  const toggleNotification = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleForgotPassword = () => {
    setPasswordResetVisible(!passwordResetVisible); // Toggle the visibility of the password reset form
  };

  const handleClosePasswordResetForm = () => {
    setPasswordResetVisible(false);
  };

  const handleSendEmail = () => {
    Alert.alert('Email Sent', 'A password reset email has been sent to your email address.');
  };

  const handleChangeTheme = () => {
    Alert.alert('Change Theme', 'Theme change functionality will be implemented.');
  };

  const handleChangeLanguage = () => {
    Alert.alert('Change Language', 'Language change functionality will be implemented.');
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.settingItem} onPress={toggleNotification}>
        <MaterialIcons name="notifications" size={24} color="black" />
        <Text style={styles.settingLabel}>Notification Settings</Text>
        <Switch
          trackColor={{ false: '#767577', true: 'white' }}
          thumbColor={notificationEnabled ? 'white' : 'white'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleNotification}
          value={notificationEnabled}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={handleForgotPassword}>
        <MaterialIcons name="lock" size={24} color="white" />
        <Text style={styles.settingLabel}>Forgot Password</Text>
      </TouchableOpacity>
      {passwordResetVisible && <PasswordResetForm onClose={handleClosePasswordResetForm} handleSendEmail={handleSendEmail} />}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    color: 'black',
    fontSize: 18,
  },
});

export default SettingsScreen;
