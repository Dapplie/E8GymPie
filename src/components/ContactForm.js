import axios from 'axios'; // Import Axios
import React, { useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text, TextInput, TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

const ContactForm = () => {
  const [isInstagramHovered, setIsInstagramHovered] = useState(false);
  const [isWebsiteHovered, setIsWebsiteHovered] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handleInstagramHover = (hoverState) => {
    setIsInstagramHovered(hoverState);
  };

  const handleWebsiteHover = (hoverState) => {
    setIsWebsiteHovered(hoverState);
  };

  const handleSubmitContact = async () => {
    try {
      if (!fullName || !phone || !email) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      const response = await axios.post('http://146.190.32.150:5000/ContactUs', {
        fullName: fullName,
        email: email,
        phone: phone,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('User contacted us:', response.data);
      Alert.alert('Success', 'Your message has been sent successfully.');
      
      // Clear form fields after successful submission
      setFullName('');
      setPhone('');
      setEmail('');
    } catch (error) {
      console.error('Error contacting us:', error);
      Alert.alert('Error', 'Failed to send message. Please try again later.');
    }
  };
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Leave Us Your Info</Text>
        {/* Your form fields */}
        {/* Example fields */}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={text => setFullName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={text => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={text => setEmail(text)}
        />        
        {/*<TextInput style={[styles.input, styles.messageInput]} multiline placeholder="Message" />*/}

       {/* Submit button */}
       <TouchableOpacity style={styles.button} onPress={handleSubmitContact}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>

        {/* Get in Touch section */}
        <View style={styles.getInTouchContainer}>
  <Text style={styles.getInTouchTitle}>Get in Touch with Endurance Eight</Text>
  <Text style={styles.getInTouchText}>
    Feel free to visit during normal business hours.
    Or contact us via E8 gym and E8 online
  </Text>
  <View style={styles.contactAndOpeningHoursContainer}>
    {/* Contact container */}
    <View style={styles.contactContainer}>
      <Text style={styles.contactTitle}>Information</Text>
      <Text style={styles.contactText}>+96171570251</Text>
      <Text style={styles.contactText}>Info@e8gym.com</Text>
    </View>
    {/* Separator line */}
    <View style={styles.separator}></View>
    {/* Opening hours container */}
    <View style={styles.openingHoursContainer}>
      <Text style={styles.openingHoursTitle}>Opening Hours</Text>
      <Text style={styles.openingHoursText}>Mon to Fri: 7:30 am — 1:00 am</Text>
      <Text style={styles.openingHoursText}>Sat & Sun: 7:30 am — 6:00 pm</Text>
    </View>
  </View>
  {/* Location container */}
  <View style={styles.locationAndFollowContainer}>
    <View style={styles.locationContainer}>
      <Text style={styles.locationTitle}>Location</Text>
      <Text style={styles.locationText}>Lebanon, Dubai</Text>
      <Text style={styles.locationText}>Whatsapp: +971 50 719 3100</Text>
    </View>
    {/* Separator line */}
    <View style={styles.secondSeparator}></View>
    {/* Follow Us  section */}
    <View style={styles.followUsContainer}>
      <Text style={styles.followUsTitle}>Follow Us On</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableWithoutFeedback
          onPressIn={() => handleInstagramHover(true)}
          onPressOut={() => handleInstagramHover(false)} 
          onPress={() => {Linking.openURL('https://www.instagram.com/e8gymlb/');}}
        >
          <Image
            source={require('../../assets/instaicon.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: isInstagramHovered ? '#FFA500' : 'black',
              marginLeft: 10, // Adjust the margin for spacing
            }}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPressIn={() => handleWebsiteHover(true)}
          onPressOut={() => handleWebsiteHover(false)}
          onPress={() => {Linking.openURL('https://e8gym.com/');}}
        >
          <Image
            source={require('../../assets/webicon.png')}
            style={{
              width: 25,
              height: 25,
              tintColor: isWebsiteHovered ? '#ffb600' : 'black',
              marginLeft: 10, // Adjust the margin for spacing
            }}
          />
        </TouchableWithoutFeedback>
</View>
</View>
</View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  getInTouchContainer: {
    marginTop: 40,
  },
  getInTouchTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  getInTouchText: {
    color: 'white',
    marginBottom: 20,
  },
  contactContainer: {
    marginBottom: 20,
  },
  contactTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contactText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  separator: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  openingHoursTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  openingHoursText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  locationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  secondSeparator: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  followUsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ContactForm;
