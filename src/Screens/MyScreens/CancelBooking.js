import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { IP_ADDRESS } from '../../../config';

function CancelBooking({ route }) {
  const { branch } = route.params;
  const [userId, setUserId] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const value = await AsyncStorage.getItem('userId');
        if (value !== null) {
          setUserId(value);
          const response = await axios.post(`${IP_ADDRESS}/getBooking`, {
            branch,
            userId: value,
          });
          setBookingData(response.data);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to retrieve booking data!');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [branch]); // Remove userId from dependency array to prevent unnecessary re-renders

  const handleCancelBooking = async (bookingId) => {
    try {
      const reqAddress=`${IP_ADDRESS}/cancelBooking`;
      console.log(`Address Requested for Canceling \n${reqAddress}`)
      await axios.post(`${IP_ADDRESS}/cancelBooking`, {
        _id: bookingId,
      });
      Alert.alert('Success', 'Booking cancelled successfully!');
      // Refresh booking data
      const response = await axios.post(`${IP_ADDRESS}/getBooking`, {
        branch,
        userId,
      });
      setBookingData(response.data);
    } catch (error) {
      console.error(JSON.stringify(error,null,2));
      Alert.alert(JSON.stringify(error))
      Alert.alert('Error', 'Failed to cancel booking!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>My Bookings</Text>

      {bookingData && (
        <ScrollView>
          {bookingData.map((booking) => (
            <View key={booking._id} style={styles.bookingCard}>
              <Text style={styles.bookingText}>Username: {booking.username}</Text>
              <Text style={styles.bookingText}>Email: {booking.email}</Text>
              <Text style={styles.bookingText}>Class Name: {booking.className}</Text>
              {/* <Text style={styles.bookingText}>Class Time: {booking.classTime}</Text> */}
              <Text style={styles.bookingText}>
                Class Time: {booking.classTime}
              </Text>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelBooking(booking._id)}
              >
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Dark background
    padding: 16,
  },
  text: {
    color: '#FFFFFF', // White text
    fontSize: 18,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF', // White border for text separation
    paddingBottom: 8,
  },
  bookingCard: {
    backgroundColor: '#1c1c1c', // Slightly lighter dark background for contrast
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF', // White border around booking cards
  },
  bookingText: {
    color: '#FFFFFF', // White text
    fontSize: 16,
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: 'white', // Red background for cancel button
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'black', // White text for cancel button
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 16,
  },
});

export default CancelBooking;
