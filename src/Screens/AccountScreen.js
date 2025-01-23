import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Button, Platform, Alert, ActivityIndicator } from 'react-native';
import Header from './Header';
import { IP_ADDRESS } from '../../config';
import { useFocusEffect } from '@react-navigation/native';
// User, Account Page
const AccountScreen = ({ navigation }) => {
  const [UserName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [rank2, setRank2] = useState('');
  const [branch, setBranch] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [userClasses, setUserClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [boxesTicked, setBoxesTicked] = useState(0);
  const [image, setImage] = useState(null);
  const [singleImage, setSingleImage] = useState(null);
  const [UserId, setUserId] = useState(null);
  const [isImagePicked, setIsImagePicked] = useState(false); // State to track if an image is picked
  const [classesAttended, setClassesAttended] = useState('');
  const [score, setScore] = useState('');


  // Call fetchData when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData(); // Fetch data immediately on screen focus

      const intervalId = setInterval(() => {
        fetchData(); // Fetch data every 10 seconds
      }, 10000); // 10 seconds

      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }, [])
  );


  // useEffect(() => {
  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`${IP_ADDRESS}/AccountScreen?insertedId=` + userId);
      const userData = response.data;

      console.log("FetchData AccountScreen.js")
      console.log(userData)
      setUserName(userData.fullName);
      setEmail(userData.email);
      setBranch(userData.branch);
      setUserId(userData._id);
      setScore(userData.attended);
      //setSingleImage(userData.image);


      const attendedCount = userData.attended || 0; // Get attended count from user data

      let newRank = 'Benchwarmer'; // Default rank
       if (attendedCount >= 425) {
           newRank = 'Hall of Famer';
       } else if (attendedCount >= 235) {
           newRank = 'MVP';
       } else if (attendedCount >= 140) {
           newRank = 'Pro Athlete';
       } else if (attendedCount >= 70) {
           newRank = 'Semi-pro';
       } else if (attendedCount >= 36) {
           newRank = 'Amateur';
       }
       setRank2(newRank);
      // New: Fetch the user's image
      const imageResponse = await axios.post(`${IP_ADDRESS}/get-image`, { UserId: userData._id });
      if (imageResponse.data.status === "ok") {
        setSingleImage(imageResponse.data.imageUrl); // Set the image URL from the response
      } else {
        console.error("Image not found:", imageResponse.data.message);
      }


      console.log("this is the user id ", UserId);



      

      const classesResponse = await axios.get(`${IP_ADDRESS}/userClasses/?userId=` + userId);
      setUserClasses(classesResponse.data);
    } catch (error) {
      console.error('Error fetching user Classes :', error);
    }
  };



           // Call fetchData when the screen is focused
            useFocusEffect(
              React.useCallback(() => {
               // fetchUserRank(); // Fetch rank when the screen is focused
                fetchData(); // Fetch user data immediately on screen focus
      
                const intervalId = setInterval(() => {
                  fetchData(); // Fetch data every 10 seconds
                }, 10000); // 10 seconds
      
                // Clear interval on component unmount
                return () => clearInterval(intervalId);
              }, [])
            );


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



  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need camera roll permissions to make this work!');
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Use assets[0].uri for newer versions of Expo
      setIsImagePicked(true); // Set the state to true when an image is picked
    }
  };

  const submitImage = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("image", {
      uri: Platform.OS === "android" ? image : image.replace("file://", ""),
      name: "photo.jpg",
      type: "image/jpeg",
    });

    // Adding UserId to formData
    formData.append("UserId", UserId);

    try {
      const result = await axios.post(`${IP_ADDRESS}/upload-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const message = typeof result.data.message === "string"
        ? result.data.message
        : JSON.stringify(result.data.message);

      Alert.alert("Upload Success", message);
    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Failed", "There was an error uploading the image.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Header />
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <Image source={{ uri: singleImage }} style={styles.avatar} />
              )}
            </TouchableOpacity>

            <View style={styles.rankContainer}>
              {/* <View style={styles.rankIconContainer}>
                <Ionicons name={getRankIcon(rank)} size={24} color="orange" />
              </View> */}
              <Text style={styles.rankText}>{rank2}</Text>
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

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {/* <Button title="Choose Image" onPress={pickImage} /> */}
          {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginVertical: 10 }} />} */}
          {isImagePicked && ( // Show the button only if an image is picked
            <TouchableOpacity
              onPress={submitImage}
              style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 5, paddingLeft: 15, paddingRight: 15, marginBottom: 10 }}
            >
              <Text style={{ color: '#000000', textAlign: 'center' }}>Update User Image</Text>
            </TouchableOpacity>
          )}
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
              source={require('../../assets/book2.jpeg')}
              style={styles.sectionImage}
              resizeMode="contain"
            />
          </View>
        </View>
        
      </View>
    </ScrollView>
  );
};

// const getRankIcon = (rank) => {
//   switch (rank) {
//     case 'Amateur':
//       return 'star';
//     case 'Semi-pro':
//       return 'star-half';
//     case 'Pro Athlete':
//       return 'stats-chart';
//     case 'MVP':
//       return 'medal';
//     case 'Hall of Famer':
//       return 'trophy';
//     default:
//       return 'star-outline';
//   }
// };  

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
