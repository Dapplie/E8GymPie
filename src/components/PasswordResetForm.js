import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PasswordResetForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const generatedCode = generateVerificationCode();
  const [newPassword, setNewPassword] = useState('');

  // Function to generate a random verification code
  function generateVerificationCode() {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return code;
  }

  // Function to handle verification code input
  const handleVerificationCodeChange = (code) => {
    setVerificationCode(code);
  };

  // Function to verify the entered code
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      Alert.alert('Code Verified', 'Verification code is correct. You can now change your password.');
    } else {
      Alert.alert('Invalid Code', 'The verification code is incorrect. Please try again.');
    }
  };

  // Function to handle password change
  const handleChangePassword = () => {
    if (!email || !verificationCode || !newPassword) {
      Alert.alert('Error', 'Please fill all the fields.');
    } else {
      Alert.alert('Password Changed', 'Your password has been changed successfully.');
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="white"
        color="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter verification code"
        value={verificationCode}
        onChangeText={handleVerificationCodeChange}
        placeholderTextColor="white"
        color="white"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="white"
        color="white"
      />
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default PasswordResetForm;
