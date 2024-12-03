import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { IP_ADDRESS } from '../../../config';

const EmailVerification = ({ navigation, route }) => {
  const { _id, fullName, email, branch } = route.params;
  const [verificationKey, setVerificationKey] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${IP_ADDRESS}/VerifyUser`, {
        _id,
        verificationKey: parseInt(verificationKey) // Convert to integer as per the API format
      });
      
      if (response.status === 200) {
        // Navigate to Dashboard upon successful verification
        navigation.navigate('Dashboard', { fullName: fullName, email: email, branch: branch });
      } else {
        Alert.alert('Error', 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Failed to verify. Please try again later.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
      <Text style={{ color: 'white', fontSize: 24, marginBottom: 20, fontWeight:'bold' }}>Verification Key:</Text>
      <TextInput
        value={verificationKey}
        onChangeText={setVerificationKey}
        placeholder="Enter verification key"
        keyboardType="numeric"
        style={{ color: 'white', borderWidth: 1, borderColor: 'white', padding: 10, marginBottom: 20, width: '100%', borderRadius: 5 }}
      />
      <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, width: '100%' }}>
        <Text style={{ color: 'black', textAlign: 'center', fontSize: 18, fontWeight:'bold' }}>Verify</Text>
      </TouchableOpacity>
      <Text style={{ color: 'white', marginTop: 20, fontSize: 16 }}>A verification key has been sent to your email.</Text>
    </View>
  );
};

export default EmailVerification;
