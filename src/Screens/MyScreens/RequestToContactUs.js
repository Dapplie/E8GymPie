import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IP_ADDRESS } from '../../../config';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const RequestToContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`${IP_ADDRESS}/ContactUs`)
      .then(response => {
        setMessage(response.data.message);
        setContacts(response.data.contacts);
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to retrieve contacts');
      });
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.messageText}>Requests To Contact Us</Text>
      {contacts.length === 0 ? (
        <Text style={styles.noRequestsText}>There are no contact us requests</Text>
      ) : (
        contacts.map(contact => (
          <View key={contact._id} style={styles.contactContainer}>
            <Text style={styles.contactText}>Full Name: {contact.fullName}</Text>
            <Text style={styles.contactText}>Email: {contact.email}</Text>
            <Text style={styles.contactText}>Phone: {contact.phone}</Text>
          </View>
        ))
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    padding: 20,
  },
  messageText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    borderColor: '#fff',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  contactContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor: '#000',
  },
  contactText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  noRequestsText: {
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },  
});

export default RequestToContactUs;
