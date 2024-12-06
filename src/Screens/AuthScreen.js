import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { IP_ADDRESS } from '../../config';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';



const AuthScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branches, setBranches] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchBranches = async () => {
        try {
          const response = await fetch(`${IP_ADDRESS}/branches_for_super_admin`);
          if (response.status === 200) {
            const data = await response.json();
            console.log("We Have Branches");
            console.log(data);
            setBranches(data);
          } else {
            setBranches([]);
          }
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };

      fetchBranches();

      // Optionally, you can return a cleanup function if needed
      return () => {
        setBranches([]); // Clear branches if you want to reset on unmount
      };
    }, [])
  );

  const handleSubmitSignUp = async () => {
    try {
      if (!fullName || !email || !password || !phoneNumber || !dob || !selectedBranch) {
        console.error('All fields are required');
        console.error(`fullname ${fullName}\nemail ${email}\npassword\n ${password} phoneNumber ${phoneNumber}\n dob ${dob}\nSelectedBranch ${selectedBranch}`)
        return;
      }

      const response = await axios.post(`${IP_ADDRESS}/SignUpScreen`, {
        fullName: fullName,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        dob: dob,
        branch: selectedBranch, // Include selected branch in the request body
        verified: false
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 201 && response.data.message === 'User signed up successfully') {
        const userId = response.data.user.insertedId;
        await AsyncStorage.clear(); // Clears all keys
        await AsyncStorage.setItem('userId', userId);
        await AsyncStorage.setItem('fullName', fullName); // Store full name in AsyncStorage
        await AsyncStorage.setItem('email', email); // Store email in AsyncStorage
        console.error('User ID stored in AsyncStorage:', userId);

        // Reset form fields
        setFullName('');
        setEmail('');
        setPassword('');
        setPhoneNumber('');
        setDob('');
        setSelectedBranch(null);
        setCountry(null);
        setPhoneNumberInput('');

        navigation.navigate('EmailVerification', { fullName: fullName, email: email, branch: selectedBranch, _id: response.data.user.insertedId });
        // open DashBoard 
      }
    } catch (error) {
      console.error('Error signing up:', error);
      Alert.alert('Error', 'An error occurred while signing up');
    }
  };

  const handleSubmit = async () => {
    if (isSignIn) {
      try {
        const response = await axios.post(`${IP_ADDRESS}/SignInScreen`, {
          email: email,
          password: password,
        });

        if (response.status === 200 && response.data.message === 'User signed in successfully') {
          await AsyncStorage.clear(); // Clears all keys
          await AsyncStorage.setItem('userId', response.data.userId);
          await AsyncStorage.setItem("fullName", response.data.fullName);
          await AsyncStorage.setItem("email", response.data.email);
          console.log(`The User Signed In WIth `)
          console.log(response.data)
          const fullName = response.data.fullName;
          const email = response.data.email;
          const uid = response.data.userId;
          const branch = response.data.branch;
          console.log("hhhhhhhhhhiiiiiiiiiiiiaaaaaaaaaaaaaaaaaaaaaaaaaaaammmmmmmmmmmmmmmmmmmmmmmmmmmmm");

        
        setEmail('');
        setPassword('');
        
          navigation.navigate('Dashboard', { fullName: fullName, email: email, uid: uid, branch: branch });

        } else {
          Alert.alert('Error', 'Invalid email or password');
        }
      } catch (error) {
        console.error('Error signing in:', error);
        Alert.alert('Error', 'An error occurred while signing in');
      }
    } else {
      console.error('Should handle sign up here');
    }
  };

  const handleToggleMode = () => {
    setIsSignIn(!isSignIn);
  };

  const handleSuperAdminLoginPress = () => {
    navigation.navigate('SuperAdminLoginScreen');
  };

  const onSelectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  const handlePhoneNumberChange = (text) => {
    if (country && country.callingCode === '+961') {
      setPhoneNumberInput(text.slice(0, 8));
      setPhoneNumber(phoneNumberInput);
    } else {
      setPhoneNumberInput(text);
      setPhoneNumber(phoneNumberInput);
    }
  };

  const handlePhoneNumberBlur = () => {
    setPhoneNumber(phoneNumberInput);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={handleSuperAdminLoginPress} style={styles.superAdminIcon}>
        <FontAwesome name="user" size={30} color="white" />
      </TouchableOpacity>
      <Video
        source={require('../../assets/E8Gymvideo2.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.videoBackground} // This style should cover the entire screen
      />
      <View style={styles.overlay} />

      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/e8Logo.png')}
          style={{ width: 80, resizeMode: 'contain', margin: 'auto' }}
        />
        <Text style={styles.welcomeText}>WELCOME TO ENDURANCE EIGHT</Text>
        <View style={styles.brandDescriptionContainer}>
          <Text style={styles.brandText}>
            Explore our: {"\n"}
            E8 Gym - "Place For Athletes"{"\n"}
            E8 Products and services - "Made For Athletes"
          </Text>
          <Text style={styles.brandDescription}>
            Endurance Eight is a sports brand, dedicated to elevating the
            standards in the sports industry, through our E8 Gym and
            E8 online products and services
          </Text>

        </View>
        {isSignIn ? null : (
          <Text style={styles.createAccountText}>Create new account</Text>
        )}
        {!isSignIn && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={text => setFullName(text)}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.togglePasswordVisibility}>
            <FontAwesome name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        {!isSignIn && (
          <View style={styles.phoneInputContainer}>
            <ScrollView style={styles.countryPickerContainer}>
              <CountryPicker
                withFlag
                withFilter
                withCountryNameButton={false}
                withCallingCodeButton
                withAlphaFilter
                onSelect={(country) => onSelectCountry(country)}
              />
            </ScrollView>
            {country && (
              <TouchableOpacity onPress={() => console.log('Open country picker')} style={styles.countryInfo}>
                <Image
                  source={{ uri: `https://www.countryflags.io/${country.cca2}/flat/64.png` }}
                  style={styles.flagIcon}
                />
                <Text style={styles.countryCode}>+{country.callingCode}</Text>
              </TouchableOpacity>
            )}
            <TextInput
              style={styles.phoneInput}
              placeholder="Phone Number"
              value={phoneNumberInput}
              onChangeText={handlePhoneNumberChange}
              onBlur={handlePhoneNumberBlur}
              keyboardType="phone-pad"
            />
          </View>
        )}
        {!isSignIn && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
            <FontAwesome name="calendar" size={24} color="black" style={styles.icondate} />
            <Text style={styles.inputdate}>{dob ? dob.toLocaleDateString() : 'Select Date of Birth'}</Text>
          </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob ? new Date(dob) : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              const currentDate = selectedDate || dob;
              setDob(currentDate);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        )}
        {!isSignIn && (
          <View style={styles.branchDropdownContainer}>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={selectedBranch}
                onValueChange={(itemValue, itemIndex) => setSelectedBranch(itemValue)}
              >
                <Picker.Item label="Select Branch" value={null} />
                {branches.map(branch => (
                  <Picker.Item key={branch.branchID} label={branch.name} value={branch.branchID} />
                ))}
              </Picker>
            </View>
          </View>
        )}
        {!isSignIn && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSubmitSignUp}
              style={{
                backgroundColor: 'black',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

          </View>
        )}
        {isSignIn && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleSubmit}
              style={{
                backgroundColor: 'black',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                {isSignIn ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleToggleMode}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              backgroundColor: 'black',
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
              {isSignIn ? 'Create new account' : 'Switch to Sign In'}
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  superAdminIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    tintColor: 'white',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    width: Dimensions.get('window').width, // Use windowWidth to cover the entire width of the screen
    height: 2200, // Use windowHeight to cover the entire height of the screen
  },

  contentContainer: {
    marginTop: 80,
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  welcomeText: {
    marginTop: 40,
    marginBottom: 120,
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  brandDescriptionContainer: {
    marginBottom: 27,
  },
  brandText: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingLeft: 6,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  brandDescription: {
    marginBottom: 50,
    textAlign: 'left',
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    paddingLeft: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  createAccountText: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#707070',
  },
  buttonContainerr: {
    marginTop: 15,
    width: '40%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 15,

    width: '40%',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#707070',
  },
  passwordInput: {
    flex: 1,
    color: '#000000',
  },
  togglePasswordVisibility: {
    position: 'absolute',
    top: 0,
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#707070',
  },
  icondate: {
    marginRight: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#707070',
  },
  flagIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  countryPickerContainer: {
    flex: 1,
    maxHeight: 200,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    fontSize: 16,
    marginRight: 20,
    color: 'black',

  },
  phoneInput: {
    flex: 1,
    color: '#000000',
  },
  branchDropdownContainer: {
    width: '80%',
    height: 40,
    marginBottom: 10,
  },
  dropdownLabel: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
  dropdown: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#707070',
  },
});



export default AuthScreen;
