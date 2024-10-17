import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from './Header';
// User, Account Page
const AccountScreen = ({ navigation }) => {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [rank, setRank] = useState('');
  const [branch,setBranch]= useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userClasses, setUserClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [boxesTicked, setBoxesTicked] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get('http://146.190.32.150:5000/AccountScreen?insertedId=' + userId);
      const userData = response.data;

      console.log("FetchData AccountScreen.js")
      console.log(userData)
      setUserName(userData.fullName);
      setEmail(userData.email);
      setBranch(userData.branch);

      const classesAttended = userData.classesAttended || 0;
      const photosAttached = userData.photosAttached || 0;
      const bookingsMade = userData.bookingsMade || 0;

      let newRank = 'Benchwarmer';
      if (classesAttended >= 36 || photosAttached >= 5 || bookingsMade >= 10) newRank = 'Amateur';
      if (classesAttended >= 70 || photosAttached >= 10 || bookingsMade >= 20) newRank = 'Semi-pro';
      if (classesAttended >= 140 || photosAttached >= 20 || bookingsMade >= 40) newRank = 'Pro Athlete';
      if (classesAttended >= 235 || photosAttached >= 30 || bookingsMade >= 60) newRank = 'MVP';
      if (classesAttended >= 425 || photosAttached >= 50 || bookingsMade >= 100) newRank = 'Hall of Famer';

      // Update the user's rank on the server
      await updateServerRank(userId, newRank);

      // Save the new rank to AsyncStorage
      await AsyncStorage.setItem('userRank', newRank);

      setRank(newRank);

      const classesResponse = await axios.get('http://146.190.32.150:5000/userClasses/?userId=' +userId);
      setUserClasses(classesResponse.data);
    } catch (error) {
      console.error('Error fetching user Classes :', error);
    }
  };

  const updateServerRank = async (userId, newRank) => {
    try {
      await axios.post('http://146.190.32.150:5000/updateUserRank', { userId, newRank });
    } catch (error) {
      console.error('Error updating user rank on the server:', error);
    }
  };

  // Retrieve the user's rank when the component mounts
  const fetchUserRank = async () => {
    try {
      const userRank = await AsyncStorage.getItem('userRank');
      if (userRank) {
        setRank(userRank);
      }
    } catch (error) {
      console.error('Error fetching user rank:', error);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setProfilePicture(pickerResult.uri);
    }
  };

  const handleAttachment = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      console.log(pickerResult.uri);
    }
  };

  const handleBranchSelect = (branch) => {
    navigation.navigate('ClassScheduleScreen', { branch });
  };

  const handleBookNowPress = () => {
    navigation.navigate('ClassScheduleScreen', { branch });
    // navigation.navigate('BranchSelectionScreen');
    console.log("Book Now button pressed");
  };

  const handleClassSelect = (classId) => {
    const updatedSelectedClasses = selectedClasses.includes(classId)
      ? selectedClasses.filter((id) => id !== classId)
      : [...selectedClasses, classId];

    setSelectedClasses(updatedSelectedClasses);
  };

  const renderCheckboxes = () => {
    const checkboxes = [];
    let totalCheckboxes = 0;
    let cols = 10; // Default to 5 columns
    const checkboxMargin = 10; // Adjust as needed
  
    // Determine the total number of checkboxes and adjust rows and columns accordingly based on the user's rank
    switch (rank) {
      case 'Benchwarmer':
        totalCheckboxes = 10;
        break;
      case 'Amateur':
        totalCheckboxes = 36;
        break;
      case 'Semi-pro':
        totalCheckboxes = 70;
        break;
      case 'Pro Athlete':
        totalCheckboxes = 140;
        break;
      case 'MVP':
        totalCheckboxes = 235;
        break;
      case 'Hall of Famer':
        totalCheckboxes = 425;
        break;
      default:
        totalCheckboxes = 10; // Default to Benchwarmer if rank is not recognized
    }
  
    // Calculate the number of rows based on the totalCheckboxes
    const rows = Math.ceil(totalCheckboxes / cols);
  
    for (let row = 0; row < rows; row++) {
      const rowCheckboxes = [];
      for (let col = 0; col < cols; col++) {
        const checkboxIndex = row * cols + col;
        if (checkboxIndex < totalCheckboxes) {
          rowCheckboxes.push(
            <TouchableOpacity key={checkboxIndex} onPress={() => handleCheckboxClick(checkboxIndex)}>
              <View style={[styles.classCheckbox, selectedClasses.includes(checkboxIndex) && styles.classSelected]}>
                {selectedClasses.includes(checkboxIndex) && <Ionicons name="checkmark-circle" size={24} color="orange" />}
              </View>
            </TouchableOpacity>
          );
        }
      }
      checkboxes.push(
        <View key={row} style={[styles.checkboxRow, { marginTop: checkboxMargin }]}>
          {rowCheckboxes}
        </View>
      );
    }
    return checkboxes;
  };
      
  const handleCheckboxClick = (index) => {
    if (selectedClasses.includes(index)) {
      setSelectedClasses(selectedClasses.filter((item) => item !== index));
      setBoxesTicked(boxesTicked - 1);
    } else {
      setSelectedClasses([...selectedClasses, index]);
      setBoxesTicked(boxesTicked + 1);
    }
  
    // Check if the user is a Benchwarmer and has completed 10 actions
    if (rank === 'Benchwarmer' && boxesTicked + 1 >= 10) { // Adjusted to 10 since it's 0-indexed
      updateUserRank('Amateur');
    }
  
    // Check if the user is an Amateur and has completed 36 actions
    if (rank === 'Amateur' && boxesTicked + 1 >= 36) { // Adjusted to 36 since it's 0-indexed
      updateUserRank('Semi-pro');
    }

    // Check if the user is a Semi-pro and has completed 70 actions
    if (rank === 'Semi-pro' && boxesTicked + 1 >= 70) { // Adjusted to 70 since it's 0-indexed
      updateUserRank('Pro Athlete');
    }

    // Check if the user is a Pro Athlete and has completed 140 actions
    if (rank === 'Pro Athlete' && boxesTicked + 1 >= 140) { // Adjusted to 140 since it's 0-indexed
      updateUserRank('MVP');
    }

    // Check if the user is an MVP and has completed 235 actions
    if (rank === 'MVP' && boxesTicked + 1 >= 235) { // Adjusted to 235 since it's 0-indexed
      updateUserRank('Hall of Famer');
    }
  };

  // Function to update user rank
  const updateUserRank = async (newRank) => {
    try {
      setRank(newRank); // Update state
      await AsyncStorage.setItem('userRank', newRank); // Update AsyncStorage
    } catch (error) {
      console.error('Error updating user rank:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header />
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleImagePicker}>
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.avatar} />
              ) : (
                <Image source={require('../../assets/user.png')} style={styles.avatar} />
              )}
            </TouchableOpacity>
            <View style={styles.rankContainer}>
              {/* <View style={styles.rankIconContainer}>
                <Ionicons name={getRankIcon(rank)} size={24} color="orange" />
              </View> */}
              <Text style={styles.rankText}>{rank}</Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            <View style={styles.userInfoText}>
              <Text style={styles.userInfoLabel}>User Name:</Text>
              <Text style={styles.userInfoValue}>{UserName}</Text>
            </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userInfoLabel}>Email Address:</Text>
              <Text style={styles.userInfoValue}>{email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section2}>
          <View style={[styles.sectionContent, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            <View>
              <Text style={styles.sectionTitle}>Book</Text>
              <Text style={styles.sectionSubtitle}>Your class</Text>
              <TouchableOpacity onPress={handleBookNowPress} style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>Book Now</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../assets/book.jpg')}
              style={styles.sectionImage}
              resizeMode="contain"
            />
          </View>
        </View>
{/* 
        <View style={styles.attachmentContainer}>
          <Text style={styles.attachmentTitle}>Attach</Text>
          <TouchableOpacity onPress={handleAttachment}>
            <View style={styles.attachmentButton}>
              <Ionicons name="add" size={24} color="black" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.classesSection}>
          <View style={styles.classesContainer}>
            <Text style={styles.sectionTitle}>Your Classes</Text>
            {userClasses.map((classItem) => (
              <View key={classItem.clsId} style={styles.classContainer}>
                <Text style={styles.className}>{classItem.className}</Text>
                <TouchableOpacity
                  style={[styles.classCheckbox, selectedClasses.includes(classItem.clsId) && styles.classSelected]}
                  onPress={() => handleClassSelect(classItem.clsId)}
                >
                  {selectedClasses.includes(classItem.clsId) && <Ionicons name="checkmark-circle" size={24} color="white" />}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.checkboxesContainer}>
          {renderCheckboxes()}
        </View> */}
      </View>
    </ScrollView>
  );
};

const getRankIcon = (rank) => {
  switch (rank) {
    case 'Amateur':
      return 'star';
    case 'Semi-pro':
      return 'star-half';
    case 'Pro Athlete':
      return 'stats-chart';
    case 'MVP':
      return 'medal';
    case 'Hall of Famer':
      return 'trophy';
    default:
      return 'star-outline'; 
  }
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   backgroundColor: '#FFF', // Add background color here
  // },
  // userInfoContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginTop: 20,
  //   paddingHorizontal: 20,
  // },
  // avatarContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // userInfoLabel: {
  //   fontWeight: 'bold',
  // },
  // avatar: {
  //   width: 62,
  //   height: 62,
  //   borderRadius: 25,
  // },
  // rankContainer: {
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   marginLeft: 10,
  // },
  // rankIconContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // rankText: {
  //   fontSize: 14,
  //   color: 'orange',
  //   marginTop: 5,
  // },
  // userInfo: {
  //   marginLeft: 20,
  // },
  // section2: {
  //   width: '90%',
  //   backgroundColor: '#FFF',
  //   borderRadius: 10,
  //   padding: 15,
  //   elevation: 3,
  //   marginBottom: 32,
  //   marginTop: 30,
  // },
  // sectionContent: {
  //   paddingHorizontal: 20,
  // },
  // sectionTitle: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  //   color: 'black',
  // },
  // bookNowButton: {
  //   backgroundColor: 'orange',
  //   paddingHorizontal: 15,
  //   paddingVertical: 8,
  //   borderRadius: 5,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginTop: 20,
  //   left: 0,
  // },
  // bookNowText: {
  //   color: '#FFF',
  //   fontSize: 14,
  //   fontWeight: 'bold',
  // },
  // sectionImage: {
  //   width: 150,
  //   height: 150,
  //   borderRadius: 10,
  // },
  // classesSection: {
  //   width: '90%',
  //   marginTop: 20,
  // },
  // classContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 10,
  //   backgroundColor: '#FFF',

  // },
  // className: {
  //   fontSize: 16,
  //   marginRight: 10,
  // },
  // classCheckbox: {
  //   width: 30,
  //   height: 30,
  //   borderWidth: 2,
  //   borderColor: 'orange',
  //   borderRadius: 5,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginBottom: 5,
  //   marginRight: 5, // Add some space between checkboxes
  // },
  // classSelected: {
  //   backgroundColor: 'white',
  // },
  // attachmentContainer: {
  //   width: '90%',
  //   marginTop: 20,
  //   marginBottom: 20,
  //   alignItems: 'center',
  // },
  // attachmentTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  // attachmentButton: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  //   backgroundColor: 'lightgray',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // rankProgressionContainer: {
  //   marginTop: 20,
  //   alignItems: 'center',
  //   color: 'black',
  // },
  // rankProgressionText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  // },
  // scrollContainer: {
  //   flexGrow: 1,
  //   paddingBottom: 20,
  // },
  // checkboxRow: {
  //   flexDirection: 'row', // Change to 'column'
  //   alignItems: 'flex-start', // Change to 'flex-start'
  // },
  // checkboxesContainer: {
  //   width: '90%',
  //   marginTop: 20,
  // },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#000000',
  },
  container: {
    padding: 20,
    backgroundColor: '#000000',
  },
  userInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  rankContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  rankIconContainer: {
    marginBottom: 5,
  },
  rankText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfoText: {
    marginBottom: 10,
  },
  userInfoLabel: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  userInfoValue: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  section2: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  sectionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 5,
  },
  sectionSubtitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 10,
  },
  bookNowButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  bookNowText: {
    color: '#000000',
    fontSize: 16,
  },
  sectionImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  attachmentContainer: {
    marginBottom: 20,
  },
  attachmentTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },
  attachmentButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classesSection: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  classesContainer: {
    marginBottom: 20,
  },
  classContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  className: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  classCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classSelected: {
    backgroundColor: 'white',
    color: 'white', 
  },
  checkboxesContainer: {
    backgroundColor: '#000000',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});

export default AccountScreen;