// SignInScreen.js
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SignInScreen = ({ handleSubmit, handleToggleMode, email, setEmail, password, setPassword }) => {
  return (
    <View>
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
      <View style={styles.buttonContainer}>
        <Button
          title="Sign In"
          onPress={handleSubmit}
          color="#fcb404"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Create Account"
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

export default SignInScreen;
