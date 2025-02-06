import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IP_ADDRESS } from '../../../config';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const RequestToContactUs = () => {
  const [contacts, setContacts] = useState([]);
  const [ownNowRequests, setOwnNowRequests] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const contactResponse = await axios.get(`${IP_ADDRESS}/ContactUs`);
        setMessage(contactResponse.data.message);
        setContacts(contactResponse.data.contacts);

        const ownNowResponse = await axios.get(`${IP_ADDRESS}/OwnNow`);
        setOwnNowRequests(ownNowResponse.data);
      } catch (error) {
        //Alert.alert('Error', 'Failed to retrieve requests');
      }
    };

    fetchRequests();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/* Contact Us Requests */}
        <Text style={styles.sectionTitle}>Requests To Contact Us</Text>
        {contacts.length === 0 ? (
          <Text style={styles.noRequestsText}>There are no contact us requests</Text>
        ) : (
          contacts.map(contact => (
            <View key={contact._id} style={styles.requestContainer}>
              <Text style={styles.requestText}>Full Name: {contact.fullName}</Text>
              <Text style={styles.requestText}>Email: {contact.email}</Text>
              <Text style={styles.requestText}>Phone: {contact.phone}</Text>
            </View>
          ))
        )}

        {/* OwnNow Requests */}
        <Text style={styles.sectionTitle}>OwnNow Requests</Text>
        {ownNowRequests.length === 0 ? (
          <Text style={styles.noRequestsText}>There are no OwnNow requests</Text>
        ) : (
          ownNowRequests.map(request => (
            <View key={request._id} style={styles.requestContainer}>
              <Text style={styles.requestText}>Full Name: {request.fullName}</Text>
              <Text style={styles.requestText}>Email: {request.email}</Text>
              <Text style={styles.requestText}>Phone: {request.mobile}</Text>
              <Text style={styles.requestText}>Budget: {request.budget}</Text>
              <Text style={styles.requestText}>Space Available: {request.spaceAvailable}</Text>
              {request.spaceAvailable === 'yes' && (
                <Text style={styles.requestText}>Area Size: {request.areaSize}</Text>
              )}
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
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingBottom: 5,
  },
  requestContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
    backgroundColor: '#000',
  },
  requestText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  noRequestsText: {
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 40,
  },  
});

export default RequestToContactUs;
