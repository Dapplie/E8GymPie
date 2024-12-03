import axios from 'axios';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { IP_ADDRESS } from '../../config';

const OwnNowForm = ({ onClose }) => {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [spaceAvailable, setSpaceAvailable] = useState('');
  const [areaSize, setAreaSize] = useState('');
  const [countryCode, setCountryCode] = useState('');

  const handleSubmit = async () => {
    try {
      if (!fullName || !mobile || !email || !budget || !spaceAvailable) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      if (!countryCode) {
        Alert.alert('Error', 'Please select a country code');
        return;
      }

      const formData = {
        fullName,
        mobile: `+${countryCode}${mobile}`,
        email,
        budget,
        spaceAvailable,
        areaSize: spaceAvailable === 'yes' ? areaSize : undefined,
      };

      const response = await axios.post(`${IP_ADDRESS}/OwnNow`, formData);

      if (response.status === 201) {
        Alert.alert('Success', 'Your form has been submitted successfully.');
        onClose();
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Error', 'Failed to submit form. Please try again later.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Order a Franchise</Text>

        {/* Form fields */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.label}>Mobile</Text>
        <View style={styles.mobileInputContainer}>
          <CountryPicker
            countryCode={countryCode}
            withFlagButton={false}
            withCallingCodeButton
            withCallingCode
            withFilter
            onSelect={(country) => setCountryCode(country.cca2)}
            containerButtonStyle={styles.countryPickerButton}
            theme={{
              
              backgroundColor: "black",
              onBackgroundTextColor: "#fff", // Ensure text (codes) appear white
              
            }}
          />
          <TextInput
            style={styles.mobileInput}
            placeholder="Mobile"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Budget</Text>
        <TextInput
          style={styles.input}
          placeholder="Budget"
          placeholderTextColor="#888"
          value={budget}
          onChangeText={setBudget}
        />
        <Text style={styles.label}>Space Available? (Yes/No)</Text>
        <TextInput
          style={styles.input}
          placeholder="Space Available? (Yes/No)"
          placeholderTextColor="#888"
          value={spaceAvailable}
          onChangeText={(value) => setSpaceAvailable(value.toLowerCase())}
        />

        {spaceAvailable.toLowerCase() === 'yes' && (
          <>
            <Text style={styles.label}>Area Size</Text>
            <TextInput
              style={styles.input}
              placeholder="Area Size"
              placeholderTextColor="#888"
              value={areaSize}
              onChangeText={setAreaSize}
            />
          </>
        )}

        {/* Submit button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#fff',
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryPickerButton: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  mobileInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default OwnNowForm;
