// AdminLoginScreen.js

import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, View } from 'react-native';

const AdminLoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState(''); // Add branch state

  const handleLogin = async () => {
    try {
      const response = await fetch(`http://146.190.32.150:5000/AdminLoginScreen?email=${email}&password=${password}`);
      console.log("hi ")
      
      if (response.ok) {
        returned=JSON.parse(await response.text())
        console.error(returned)
        setBranch(returned["branch"]);
        navigation.navigate('AdminDashboardScreen', { branch: returned["branch"]}); // Pass branch to AdminDashboardScreen
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    }
  };
  
  return (
      <ImageBackground source={require('../../assets/adminpic2.jpg')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.title}>Admin Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button
            title="Login"
            onPress={handleLogin}
            color="orange"
          />
        </View>
      </ImageBackground>
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
});

export default AdminLoginScreen;
