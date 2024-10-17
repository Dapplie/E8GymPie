import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../Screens/Header';
import ContactForm from '../components/ContactForm';

const ContactUs = () => {
  return (
    <View style={styles.container}>
      <Header />
      <ContactForm />
      {/* Additional content for the Contact screen */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ECF0F1',
  },
});

export default ContactUs;
