import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';

const BookedClients = ({ route }) => {
  const { classId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://146.190.32.150:5000/getUserFromBooking', {
          _id: classId
        });
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {clients.map(client => (
          <TouchableOpacity key={client._id} style={styles.card}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.text}>{client.fullName}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{client.email}</Text>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.text}>{client.phoneNumber}</Text>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.text}>{formatDate(client.dob)}</Text>
            <Text style={styles.label}>Branch:</Text>
            <Text style={styles.text}>{client.branch}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: 50,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    padding: 20,
    margin: 10,
    width: '90%',
    alignItems: 'flex-start',
  },
  label: {
    color: 'white',
    marginBottom: 1,
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    marginBottom: 15,
    fontSize: 16,
  },
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

export default BookedClients;
