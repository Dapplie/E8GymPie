import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { IP_ADDRESS } from '../../config';

const OrderPageScreen = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchCheckouts();
    fetchBookings();
  }, []);

  const fetchCheckouts = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/checkout`);
      if (!response.ok) {
        throw new Error('Failed to fetch checkouts');
      }
      const data = await response.json();
      setCheckouts(data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/ClassBooking`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const generatePdf = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              background-color: #f9f9f9;
              margin: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            th, td {
              padding: 15px;
              border-bottom: 1px solid #ddd;
              text-align: start !important;
              width: 50%; /* Set TH and TD width to 50% */
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
              color: #333;
            }
            td {
              color: #666;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
              color: #333;
            }
          </style>
        </head>
        <body>
          <h1>Recent Bookings</h1>
          ${bookings.map((booking, index) => (`
            <h2>Booking ${index + 1}</h2>
            <table>
              <tr><th>Username</th><td>${booking.username}</td></tr>
              <tr><th>Class Name</th><td>${booking.className}</td></tr>
              <tr><th>Class Time</th><td>${new Date(booking.classTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td></tr>
            </table>`
    )).join('')}
          <h1>Recent Checkouts</h1>
          ${checkouts.map((checkout, index) => (`
            <h2>Checkout ${index + 1}</h2>
            <table>
              <tr><th>First Name</th><td>${checkout.firstName}</td></tr>
              <tr><th>Last Name</th><td>${checkout.lastName}</td></tr>
              <tr><th>Total Cost</th><td>$${checkout.totalCost}</td></tr>
            </table>`
    )).join('')}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log('PDF generated:', uri);

    const downloadPath = `${FileSystem.documentDirectory}Order_Page_Report.pdf`;
    await FileSystem.moveAsync({ from: uri, to: downloadPath });

    // Open the downloaded PDF
    FileSystem.getContentUriAsync(downloadPath).then(contentUri => {
      IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1,
      });
    });

    console.log('PDF downloaded to:', downloadPath);
  };

  return (
    <LinearGradient colors={['#000', '#000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{ ...styles.formContainer, marginTop: 100 }}>
          <TouchableOpacity onPress={generatePdf}>
            <Text style={{ color: 'red' }}>Download PDF</Text>
          </TouchableOpacity>
          <View style={{ ...styles.section, padding: 10 }}>
            <Text style={styles.title}>Recent Bookings</Text>
            <ScrollView style={styles.scrollContainer}>
              {bookings.map((booking) => (
                <View key={booking._id} style={styles.booking}>
                  <Text style={styles.bookingText}>{`${booking.username} - Class: ${booking.className}, Time: ${new Date(booking.classTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ ...styles.section, padding: 10 }}>
            <Text style={styles.title}>Recent Checkouts</Text>
            <ScrollView style={styles.scrollContainer}>
              {checkouts.map((checkout) => (
                <View key={checkout._id} style={styles.checkout}>
                  <Text style={styles.checkoutText}>{`${checkout.firstName} ${checkout.lastName} - Total Cost: $${checkout.totalCost}`}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  content: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  scrollContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  booking: {
    padding: 10,
    backgroundColor: '#333',
    marginBottom: 10,
    borderRadius: 10,
  },
  bookingText: {
    fontSize: 16,
    color: '#fff',
  },
  checkout: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#333',
  },
  checkoutText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default OrderPageScreen;
