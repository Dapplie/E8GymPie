import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

const SignUpScreen = ({ handleToggleMode}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');

  const handleSubmitSignUp = async () => {
    try {
      {/*const response = await axios.post('http://146.190.32.150:5000/SignUpScreen', {
        fullName: fullName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        dob: dob,
      });*/}
      console.error('User signed up:', response.data);
      // Optionally, navigate to another screen or show a success message
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={text => setFullName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth"
        value={dob}
        onChangeText={text => setDob(text)}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Sign Up1"
          onPress={handleSubmitSignUp}
          color="#ffff04"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={handleToggleMode}
          color="#fcb404"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 10,
    width: '40%',
  },
});

export default SignUpScreen;
