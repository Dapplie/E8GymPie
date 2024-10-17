import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';

const SuperAdminLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [branch, setBranch] = useState(); // Add branch state

  const handleLogin = async () => {
    try {
      // Make a GET request to the server to fetch Super Admin credentials
      const response = await fetch(`http://146.190.32.150:5000/SuperAdminLoginScreen?email=${email}&securityCode=${securityCode}`);

      // Check if authentication is successful based on the response
      if (response.ok) {
        navigation.navigate('SuperAdminDashboardScreen'); // Navigate to SuperAdminDashboardScreen if authentication is successful
      } else {
        alert('Invalid credentials'); // Show alert for invalid credentials using Alert.alert
      } console.log(email)
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to login. Please try again.'); // Show alert for login failure using Alert.alert
    }
  };
  const handleAdminLogin = async () => {
    try {
      const response = await fetch(`http://146.190.32.150:5000/AdminLoginScreen?email=${email}&password=${securityCode}`);

      if (response.ok) {
        returned = JSON.parse(await response.text())
        console.error(returned)
        setBranch(returned["admin"]);
        navigation.navigate('AdminDashboardScreen', { admin: returned["admin"] }); // Pass branch to AdminDashboardScreen
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <ImageBackground source={require('../../assets/adminpic1.jpg')} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Super Admin Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Security Code"
          value={securityCode}
          onChangeText={setSecurityCode}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => handleLogin()}
              style={{
                backgroundColor: 'black',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                Super Admin Login
              </Text>
            </TouchableOpacity>


          </View>
          <View style={{ marginVertical: 10 }} />
          <View style={styles.button}>
            <TouchableOpacity
              onPress={handleAdminLogin} // Simplified function call
              style={{
                backgroundColor: 'black',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,

              }} // Applying the same styles as before
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                Admin Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
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
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    borderColor: 'white',
    borderWidth: 1,
  },
});

export default SuperAdminLoginScreen;
