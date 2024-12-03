import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Alert, Button, Modal, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { IP_ADDRESS } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';




const ClassScheduleScreen = ({ route, navigation }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [ClassBooking, setClassBooking] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [needsRefresh, setNeedsRefresh] = useState(1);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [branchInUse, setBranchInUse] = useState({})
  const [groupedBranches, setGroupedBranches] = useState([])
  const [selectedTime, setSelectedTime] = useState(null); // Default to the first time in the array
  // const [userId,setUserId] = useState('') 
  const { branch } = route.params;
  console.log('ClassScheduleScreen');
  console.log(route.params);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        // tested
        fetch(`${IP_ADDRESS}/BranchSpecficScreen?id=${branch}`)
          .then(res => {
            if (res.status == 200) {
              return res.json()
            } else {
              return {
                'branch': {
                  'name': null
                }
              }
            }
          }).then(res => {
            console.log("Returned Branch for")
            console.log(res)
            setBranchInUse(res)
          })
        // tested
        const response = await fetch(`${IP_ADDRESS}/get_classes_for_branch?id=${branch}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const classesData = await response.json();
        console.log("Fetched Data Classes");
        console.log(classesData)
        setClasses(classesData.classes);
        console.log(classesData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchClasses();
  }, [branch, needsRefresh]);



  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${IP_ADDRESS}/fetchAllBranchesGroupedClasses`)
        if (!response.ok) {
          throw new Error('Failed to fetch data for Branches and Classes');
        }
        const classesData = await response.json();
        console.log("Fetched Grouped Classes");
        console.log(classesData)
        setGroupedBranches(classesData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchClasses();
  }, [branch, needsRefresh]);

  useEffect(() => {
    console.log("selectedTime updated to:", selectedTime);
  }, [selectedTime]);


  const handleBooking = async (cls, fullName, email, selectedTime) => {
    if (cls.participants >= cls.capacity) {
      // setBookingMessage('Cannot book class, it is full');
      Alert.alert('Cannot book class, it is full.');
      setIsModalVisible(true);
      return;
    }

    console.log("Selected time before saving:", selectedTime);
    console.error(`The CLass Holds ${cls}`)
    console.error(cls)
    setSelectedClass(cls);
    setIsModalVisible(true);
    setNeedsRefresh(false);


    try {
      const fullName = await AsyncStorage.getItem("fullName");
      const email = await AsyncStorage.getItem("email");
      const userId = await AsyncStorage.getItem("userId");
      console.log(`In Booking Class UserName:${fullName}  Email: ${email}  UserId: ${userId}`);
      console.log("Selected time before saving:", selectedTime);
      const response = await fetch(`${IP_ADDRESS}/ClassBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: fullName,
          email: email,
          className: cls.name,
          time: selectedTime,
          userid: userId,
          clsId: cls._id,
          branch: branch,
        }),
      });
      try {
        // Your existing code

        const responseData = await response.json();
        console.log('API Response:', responseData);
        // Save purchased classes to AsyncStorage
        console.log("Setting Classes To Storage ")
        console.log(classes)
        await AsyncStorage.setItem('ClassBooking', JSON.stringify(classes));
      } catch (error) {
        console.error('Error saving purchased classes to AsyncStorage:', error);
      }

      if (response.ok) {
        setClassBooking(classes);
        console.log('Checkout Successful', 'Your order has been placed successfully!');
        // Pass booked classes to PurchaseInfoScreen
        //navigation.navigate('ClassScheduleScreen', { branch });
        setNeedsRefresh(needsRefresh + 1)
        setIsModalVisible(false);
        setIsSuccessModalVisible(true);  // Show success modal
      } else {
        Alert.alert('Already Booked', ' Thank you for your trust in E8 GYM.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Checkout Error', 'An error occurred during checkout. Please try again later.');
    }
  };



  const handleCancelBooking = async () => {
    if (!selectedClass) {
      return;
    }

    try {
      const response = await fetch(`${IP_ADDRESS}/CancelBooking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: bookingId,
          className: selectedClass.name,
        }),
      });
      console.log("kakarot:" + bookingId)
      // console.log('Cancellation Response:', response);
      const responseData = await response.json();
      // console.log('Cancellation Response Data:', responseData);

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      fetchClasses();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error canceling booking:', error.message);
      setBookingMessage('Failed to cancel booking');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {/* <View style={{ marginTop: 50, borderWidth: 2, borderColor: 'white' }}>
            <Button
              title="My Booking"
              onPress={() => navigation.navigate('CancelBooking', { branch: branch })}
              color="black"
            />
          </View> */}
          <TouchableOpacity
            style={{
              marginTop: 50,
              marginBottom:20,
              borderWidth: 2,
              borderColor: 'black',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 20,
              backgroundColor: 'white',
              alignItems: 'center',
              flexDirection: 'row', // Arrange items horizontally
              justifyContent: 'center', // Center items horizontally
            }}
            onPress={() => navigation.navigate('CancelBooking', { branch: branch })}
          >
            <FontAwesomeIcon icon={faArrowRight} color="#000000" size={24} />
            <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold',marginLeft:10 }}>
            View Bookings
            </Text>

          </TouchableOpacity>


          <Text style={styles.header}>Available Classes for {branchInUse && branchInUse.branch && branchInUse.branch.name ? branchInUse.branch.name : ""}:</Text>
          {classes.length == 0 && (
            <Text style={styles.noClassText}>No Classes Available Yet</Text>
          )}
          <Modal
            visible={isSuccessModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsSuccessModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Booked successfully! Thanks for your trust in E8 GYM</Text>
                {/* <Text style={styles.modalText}>Thanks for your trust in E8 GYM</Text> */}
                <Button title="OK" color="black" onPress={() => setIsSuccessModalVisible(false)} />
              </View>
            </View>
          </Modal>

          {classes.map((cls) => (
            cls.branch === branch && (
              <View key={cls.id} style={styles.classContainer}>
                <Text style={styles.className}>Class Name: {cls.name}</Text>

                <Text style={styles.classDetail}>Description: {cls.description}</Text>
                
                {/* Display class schedule information */}
                <Text style={styles.classDetail}>Every: {cls.days}</Text>
                


                {/* Add Start and End Date */}
                <Text style={styles.classDetail}>
                  Start Date: {new Date(cls.startDate).toLocaleDateString()}
                </Text>
                <Text style={styles.classDetail}>
                  End Date: {new Date(cls.endDate).toLocaleDateString()}
                </Text>

                {/* Time Details */}
                <View style={styles.classTime}>
                  {/*<Text style={styles.classDetail}>Select Time:</Text> */}
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedTime}
                      onValueChange={(itemValue, idx) => {
                        setSelectedTime(itemValue); // Update the selectedTime state with the chosen value
                      }}
                      style={styles.timePicker}
                    >
                      <Picker.Item
                        label='Select Time'
                        value={null}
                        enabled={false}
                      />
                      {cls.the_date.map((time, index) => (
                        <Picker.Item
                          key={index}
                          label={new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                          value={time}
                          style={styles.timePickerDisplay}

                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Display Availability */}
                <Text style={{ color: cls.participants < cls.capacity ? 'green' : 'red', fontWeight: 'bold', textAlign: 'center' }}>
                  {cls.participants < cls.capacity ? 'Available' : 'Full'}
                </Text>


                <View style={{ marginTop: 20, borderWidth: 2, borderColor: 'white' }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'black',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      if (!selectedTime) {
                        Alert.alert("Please select a time before booking.");
                        return;
                      }
                      handleBooking(cls, null, null, selectedTime);
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold'
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 20,
  },
  noClassText: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'black',
    color: 'white',
    textAlign: 'center',
    padding: 5,
  },
  classContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'white',
  },
  className: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'white',
  },
  classDetail: {
    color: 'white',
  },
  bookButtonContainer: {
    marginTop: 15,
  },
  classTime: {
    flexDirection: '',
  },
  timeText: {
    marginLeft: 7,
    color: 'white',
  },
  timePicker: {
    backgroundColor: '#f0f0f0', // light background color
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc', // border color
    color: 'black', // text color

  },
  timePickerDisplay: {
    fontSize: 13,
    textAlign: 'center',
  },
  pickerContainer: {
    marginTop: 5,
    marginBottom:5,
    height: 45, // Set the desired height for the Picker container
    width: 166,
    borderWidth: 1, // Border width
    borderColor: 'gray', // Border color
    borderRadius: 15, // Optional: rounded corners
    overflow: 'hidden', // Ensures the Picker fits within the View borders
    justifyContent: 'center',
  },
});

export default ClassScheduleScreen;


