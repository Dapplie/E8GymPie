import { faEdit, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

// Faysal Create Class Form

const CreateClassForm = ({ navigation, onSubmit, branch, setCreateClassModalVisible }) => {
  const [className, setClassName] = useState('');
  const [instructor, setInstructor] = useState('');
  // const [schedule, setSchedule] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date())
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(10)
  const [capacityText, setCapacityText] = useState('10')
  const [the_date, setTheDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showNewTimePicker, setShowNewTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [days, setDays] = useState('Monday')
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  const formatTime = (time) => {
    return `@${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
  };

  // Faysal
  // this code is to make theDate as array of dateTimes
  const [theDates, setTheDates] = useState([])
  const [newTime, setNewTime] = useState(new Date());
  const addTime = () => {
    setTheDates([newTime]);
    setNewTime(new Date());
  }
  const removeTime = (index) => {
    const updatedTimes = theDates.filter((_, i) => i !== index);
    setTheDates(updatedTimes);
  }

  const intParser = (text) => {
    const parsedInt = parseInt(text, 10);
    if (isNaN(parsedInt)) {
      setCapacityText('');
      setCapacity(parsedInt)
      return '';
    }
    setCapacity(parsedInt);
    setCapacityText(String(parsedInt));
    return String(parsedInt);
  };

  const handleSubmit = () => {
    // Check if any field is empty
    if (!className || !instructor || !startDate || !theDates || theDates.length == 0 || isNaN(capacity) || !endDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log(startDate)
    console.log(the_date);
    the_startdate = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), the_date.getUTCHours(), the_date.getUTCMinutes()));
    the_startdate = the_startdate.toISOString()
    console.log(the_startdate);
    // return;
    console.log("Submitting ")
    console.log(branch)
    // Call onSubmit with the class details
    console.log(`Sending Create Classes OF \n\n\t${JSON.stringify({
      'className': className,
      'instructor': instructor,
      'startDate': startDate,
      'endDate': endDate,
      'the_date': theDates,
      'days': days,
      'name': className,
      'description': description,
      'capacity': capacity,
      'branch': branch
    })}`)
    const bodyToSend = JSON.stringify({
      'className': className,
      'instructor': instructor,
      'startDate': startDate.toISOString(),
      'endDate': endDate.toISOString(),
      'the_date': theDates,
      'days': days,
      'name': className,
      'description': description,
      'capacity': capacity,
      'branch': branch
    });
    try {
      fetch('http://146.190.32.150:5000/createClassNew', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyToSend,
      })
        .then(res => {
          console.log(res.status)
          if (res.status == 200) {
            setClassName('');
            setInstructor('');
            setSchedule('');
            Alert.alert('Success', 'Class created successfully');
            setShowDatePicker(false);
            setShowTimePicker(false);
            navigation.navigate('BranchSpecificScreen', { branch, refresh: Math.random() });
          }
        })
    } catch (error) {
      Alert.alert("Failure", "Couldn't Create Classes for all Branches");
    }
    // onSubmit({ className, instructor, schedule:the_date, branch});

    // Show success message
    Alert.alert('Success', 'Class created successfully');

    // Clear form fields
    setCreateClassModalVisible(false);


  };
  const deleteClass = async (id) => {
    try {
      await axios.delete('http://146.190.32.150:5000/delete_class', {
        data: { _id: id }
      });
      // setClasses(classes.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <LinearGradient colors={["#0000", "black"]} style={{ height: '100%', width: '100%', paddingTop: '10%' }}>
      <View style={{ alignItems: 'center' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: 'black',
        }}>Create New Class</Text>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: 'black',
        }}>{className}</Text>
        {/* hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh */}
        <ScrollView style={{ minWidth: '96%', marginHorizontal: 'auto' }}>
          <View style={{ padding: 10, backgroundColor: '#121212', marginBottom: 150, borderRadius: 15, maxWidth: '100%', marginHorizontal: 1 }}>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Class Name:</Text>
              <TextInput
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  textAlign: 'center',
                  backgroundColor: '#1E1E1E',
                  color: '#E0E0E0',
                  padding: 15,
                  fontSize: 16,
                }}
                placeholder="Class Name"
                placeholderTextColor="#757575"
                value={className}
                onChangeText={(text) => setClassName(text)}
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Instructors:</Text>
              <TextInput
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  textAlign: 'center',
                  backgroundColor: '#1E1E1E',
                  color: '#E0E0E0',
                  padding: 15,
                  fontSize: 16,
                }}
                placeholder="Instructor"
                placeholderTextColor="#757575"
                value={instructor}
                onChangeText={(text) => setInstructor(text)}
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Description:</Text>
              <TextInput
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  textAlign: 'center',
                  backgroundColor: '#1E1E1E',
                  color: '#E0E0E0',
                  padding: 15,
                  fontSize: 16,
                }}
                placeholder="Description"
                placeholderTextColor="#757575"
                value={description || ''}
                multiline={true}
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Capacity:</Text>
              <TextInput
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  textAlign: 'center',
                  backgroundColor: '#1E1E1E',
                  color: '#E0E0E0',
                  padding: 15,
                  fontSize: 16,
                }}
                placeholder="Capacity"
                placeholderTextColor="#757575"
                value={capacityText}
                inputMode='numeric'
                onChangeText={(text) => {
                  intParser(text);
                  console.log(capacity);
                }}
                keyboardType='numeric'
              />
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Date:</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 15,
                  backgroundColor: '#1E1E1E',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FontAwesome name="calendar" size={24} color="white" />
                <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                  {startDate ? `${String(startDate.getDate())}-${String(startDate.getMonth() + 1)}-${String(startDate.getFullYear())}` : "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>To Date:</Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={{
                  borderColor: '#303030',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 15,
                  backgroundColor: '#1E1E1E',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FontAwesome name="calendar" size={24} color="white" />
                <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                  {endDate ? `${String(endDate.getDate())}-${String(endDate.getMonth() + 1)}-${String(endDate.getFullYear())}` : "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{
              color: 'white',
              fontSize: 16,
              marginBottom: 10,
            }}>Every:</Text>
            <View style={{
              borderColor: '#303030',
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 15, padding: 0
            }}>
              <Picker
                style={{
                  height: 50,
                  color: 'white',

                  padding: 15,
                  backgroundColor: '#1E1E1E',

                }}
                selectedValue={days}
                onValueChange={(itemValue) => setDays(itemValue)}
              >
                <Picker.Item label="Select Day" value={null} enabled={false} />
                {daysOfWeek.map((value, index) => (
                  <Picker.Item key={index} value={value} label={value} />
                ))}
              </Picker>
            </View>
            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Times:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {/* the_date in batabase */}
                {theDates.map((time, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                    <Text style={{ color: '#E0E0E0', marginRight: 5 }}>
                      {`${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`}
                    </Text>
                    <TouchableOpacity onPress={() => removeTime(index)}>
                      <FontAwesome name="trash" size={16} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, marginBottom: 10, backgroundColor: '#1E1E1E', borderRadius: 5, padding: 5 }}>
                <TouchableOpacity
                  onPress={() => setShowNewTimePicker(true)}
                  style={{
                    flex: 1,
                    borderColor: '#303030',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 15,
                    backgroundColor: '#1E1E1E',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginRight: 10,
                  }}
                ><FontAwesome name="hourglass" size={20} color="white" />
                  <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                    {`${String(newTime.getHours()).padStart(2, '0')}:${String(newTime.getMinutes()).padStart(2, '0')}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={addTime}
                  style={{
                    flex: 1,
                    borderColor: '#303030',
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 15,
                    backgroundColor: '#1E1E1E',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text style={{ flex: 1, color: '#E0E0E0', fontSize: 16, textAlign: 'center' }}>Add Time</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="timeStartDatePicker"
                value={startDate ? startDate : new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    //setDateChanged(true);
                    console.log(selectedDate);
                    // const currentDate = selectedDate;
                    setStartDate(selectedDate);
                  } else {
                    console.log('Date not selected');
                  }


                }}
                onCancel={() => setShowDatePicker(false)}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                testID="timeEndPicker"
                value={endDate ? endDate : new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  // setEndDateChanged(true);
                  // console.log(selectedDate);
                  // const currentDate = selectedDate || endDate;
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                  // setStartDate(currentDate);
                }}
                onCancel={() => setShowEndDatePicker(false)}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                testID="TimePicker"
                value={the_date}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {

                  setShowTimePicker(false);
                  if (selectedDate) {
                    setTheDate(selectedDate);
                  }
                }}
                onCancel={() => setShowTimePicker(false)}
              />
            )}
            {showNewTimePicker && (
              <DateTimePicker
                testID="newTimePicker"
                value={newTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowNewTimePicker(false);
                  if (selectedDate) {
                    setNewTime(selectedDate);
                  }
                }}
                onCancel={() => setShowNewTimePicker(false)}
              />
            )}

            <TouchableOpacity style={{ backgroundColor: '#121212', borderColor: 'white', borderWidth: 2, padding: 10, borderRadius: 10, marginBottom: 15 }} onPress={handleSubmit}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ backgroundColor: '#121212', borderColor: 'white', borderWidth: 2, padding: 10, borderRadius: 10 }} onPress={() => setCreateClassModalVisible(false)}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};



// Faysal 
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const BranchClassScreen = ({ route, navigation }) => {
  const { branch } = route.params; // Get the branchId from navigation params
  const [classes, setClasses] = useState([]);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [branchimages, setBranchimages] = useState([require('../../assets/branch1.jpg'), require('../../assets/branch20.jpeg'), require('../../assets/own10.jpg')])
  // Get branch details based on branchId
  const branchDetails = branch;
  console.log(branch)
  console.log("Here We Go ")

  useFocusEffect(
    useCallback(() => {
      const fetchClassesForBranch = async (branchId) => {
        try {
          const response = await fetch(`http://146.190.32.150:5000/get_classes_for_branch?id=${branchId}`);
          if (response.status === 200) {
            const data = await response.json();
            console.log(`Data: ${JSON.stringify(data)}`);
            if (data.success) {
              return data.classes;
            }
          }
          throw new Error('Failed to fetch classes');
        } catch (error) {
          console.error('Error fetching classes for branch:', error);
          return [];
        }
      };
      fetchClassesForBranch(branchDetails.branchID).then(classes => {
        console.log("Classes:", classes);
        setClasses(classes);
      });
    }, [branchDetails])
  )
  useEffect(() => {
    const fetchClassesForBranch = async (branchId) => {
      try {
        const response = await fetch(`http://146.190.32.150:5000/get_classes_for_branch?id=${branchId}`);
        if (response.status === 200) {
          const data = await response.json();
          console.log(`Data: ${JSON.stringify(data)}`);
          if (data.success) {
            return data.classes;
          }
        }
        throw new Error('Failed to fetch classes');
      } catch (error) {
        console.error('Error fetching classes for branch:', error);
        return [];
      }
    };
    console.log("Branch Details:", branchDetails);
    fetchClassesForBranch(branchDetails.branchID).then(classes => {
      console.log("Classes:", classes);
      setClasses(classes);
    });
  }, [branchDetails]);

  const deleteClass = async (id) => {
    try {
      const response = await fetch('http://146.190.32.150:5000/delete_class', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setClasses(classes.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <LinearGradient colors={["#666", "#000"]} style={{ ...styles.container, padding: 2 }}>
      <View style={{}}>
        <Text style={styles.title}>{branch.name} Branch Details</Text>
      </View>
      {/* <TouchableOpacity onPress={generatePdf}>
        <Text style={{ color: 'red' }}>Download PDF</Text>
      </TouchableOpacity> */}
      {/* <ScrollView contentContainerStyle={styles.content}> */}
      {branchDetails && (
        <View style={{ ...styles.branchContainer, marginHorizontal: 10, borderColor: 'white', borderWidth: 1 }}>
          <Text style={styles.branchName}>{branchDetails.name}</Text>
          <Image source={branchimages[Math.floor(Math.random() * branchimages.length)]} style={styles.image} />
          <View style={styles.detailsContainer}>
            <Text style={styles.detailText}>Location: {branchDetails.location}</Text>
            {/* <Text style={styles.detailText}>branchID: {branchDetails.branchID}</Text> */}

            <Text style={styles.detailText}>Users: {branchDetails.users.length}</Text>
            {/* <Text style={styles.detailText}>Monthly Profit: ${branchDetails.profit}</Text> */}
            <Text style={styles.detailText}>Phone Number: {branchDetails.phoneNumber}</Text>
          </View>
        </View>
      )}
      {/* User Table */}

      {/* </ScrollView> */}
      <ScrollView>
        <View style={{ marginTop: 20, marginHorizontal: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#E0E0E0', marginBottom: 10, flex: 1, textAlign: 'center' }}>Classes</Text>
          <TouchableOpacity
            onPress={() => setCreateClassModalVisible(true)}
            style={{
              backgroundColor: 'black',
              padding: 15,
              borderRadius: 5,
              borderColor: 'white',
              borderWidth: 1,
              shadowColor: 'white',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 5,
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 20,
              width: '70%',
              alignSelf: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Add New Class</Text>
          </TouchableOpacity>
          {classes.map((classItem, index) => (
            <View key={index} style={{
              backgroundColor: '#1E1E1E',
              borderRadius: 10,
              borderColor: 'white',
              borderWidth: 1,
              padding: 15,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5
            }}>
              <TouchableOpacity onPress={() => navigation.navigate('ClassSpecsScreenSuperAdmin', { 'theClass': classItem, 'from': 'BranchClassScreen', 'branch': branch })}>
                <View style={{ marginBottom: 10, paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#E0E0E0' }}>{classItem.className}</Text>
                  <Text style={{ fontSize: 14, color: '#B0B0B0' }}>{classItem.instructor}</Text>
                </View>
              </TouchableOpacity>
              <View style={{ borderTopWidth: 1, borderTopColor: '#303030', paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{
                    fontSize: 14, color: '#E0E0E0', marginRight: 5
                  }}>Every {classItem.days} : </Text>
                  {Array.isArray(classItem.the_date) && classItem.the_date.length > 0 ? (
                    <Text style={{ fontSize: 14, color: '#E0E0E0', marginRight: 5 }}>
                      @{new Date(classItem.the_date[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </Text>
                  ) : (
                    <Text style={{ fontSize: 14, color: '#E0E0E0' }}>No times available</Text>
                  )}
                </View>

                {/*End and Start Date */}
                <Text style={{ fontSize: 14, color: '#E0E0E0', marginRight: 5 }}>
                  Start Date: {new Date(classItem.startDate).toLocaleDateString()}
                </Text>
                <Text style={{ fontSize: 14, color: '#E0E0E0', marginRight: 8 }}>
                  End Date: {new Date(classItem.endDate).toLocaleDateString()}
                </Text>


                <Text style={{ fontSize: 12, color: '#E0E0E0', marginBottom: 5 }}>Participants: {classItem.participants}/{classItem.capacity}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: classItem.availability === 'Locked' ? 'orange' : ((classItem.participants < classItem.capacity) && classItem.availability === 'Available') ? 'green' : 'red' }}>
                  {classItem.availability === 'Locked' ? 'Locked' : ((classItem.participants < classItem.capacity) && classItem.availability === 'Available') ? 'Available' : 'Full'}
                </Text>

              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => deleteClass(classItem._id)}
                  style={{
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 5,
                    borderColor: 'white',
                    borderWidth: 1,
                    shadowColor: 'white',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 5
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BookedClients', { classId: classItem._id });
                    console.log(`Class ID: ${classItem._id}`);
                  }}

                  style={{
                    backgroundColor: 'black',
                    padding: 10,
                    borderRadius: 5,
                    borderColor: 'white',
                    borderWidth: 1,
                    shadowColor: 'white',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                    elevation: 5
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Booked Clients </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal visible={createClassModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <CreateClassForm
            onSubmit={() => { console.log('Creating a new Class for Branch ' + branchDetails.branchID) }}
            branch={branchDetails.branchID}
            navigation={navigation}
            setCreateClassModalVisible={setCreateClassModalVisible}
          />

        </View>
      </Modal>
    </LinearGradient>
  )
}


const BranchDetailScreen = ({ route, navigation }) => {
  const { branch } = route.params; // Get the branchId from navigation params
  const [branchimages, setBranchimages] = useState([require('../../assets/branch1.jpg'), require('../../assets/branch20.jpeg'), require('../../assets/own10.jpg')])
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  // Get branch details based on branchId
  const branchDetails = branch;
  console.log(branch)

  // Function to navigate to edit screen
  const goToEditScreen = () => {
    navigation.navigate('EditBranchScreen', { branch });
  };

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const filteredUsers = branchDetails && Array.isArray(branchDetails.users) ? branchDetails.users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) || user.id.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleDeleteBranch = () => {
    console.log(`Delete branch clicked ${branch.branchID}`);
    Alert.alert(
      "Delete Branch",
      "Are you sure you want to delete this branch?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => {
            fetch(`http://146.190.32.150:5000/delete_branch?id=${branch._id}`, {
              method: 'DELETE',
            })
              .then(response => response.json())
              .then(data => {
                console.log('Branch deleted:', data);
                navigation.navigate('ManageBranchesScreen', { refresh: Math.random() });
              })
              .catch(error => {
                console.error('Error deleting branch:', error);
                Alert.alert('Error', 'Failed to delete branch. Please try again.');
              });
          }
        }
      ]
    );
  }

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
          <h1>Our Customers Report Branch: ${branchDetails.name}</h1>
          ${filteredUsers.map((user, index) => (`
            <h2>Customer ${index + 1}</h2>
            <table>
              <tr><th>Name</th><td>${user.username}</td></tr>
              <tr><th>Email</th><td>${user.email}</td></tr>
              
            </table>`
    )).join('')}
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log('PDF generated:', uri);

    const downloadPath = `${FileSystem.documentDirectory}Property_Rent_Report_All.pdf`;
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
    <LinearGradient colors={["#000", "#111"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Branch Detail</Text>
      </View>
      <TouchableOpacity onPress={generatePdf}>
        <Text style={{ color: 'red' }}>Download PDF</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.content}>
        {branchDetails && (
          <View style={styles.branchContainer}>
            <TouchableOpacity onPress={goToEditScreen}>
              <Text style={styles.branchName}>{branchDetails.name}</Text>
              <Image source={branchimages[Math.floor(Math.random() * branchimages.length)]} style={styles.image} />
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Location: {branchDetails.location}</Text>
                <Text style={styles.detailText}>branchID: {branchDetails.branchID}</Text>

                <Text style={styles.detailText}>Users: {branchDetails.users.length}</Text>
                {/* <Text style={styles.detailText}>Monthly Profit: ${branchDetails.profit}</Text> */}
                <Text style={styles.detailText}>Phone Number: {branchDetails.phoneNumber}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={goToEditScreen}>
              <FontAwesomeIcon icon={faEdit} size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AllBranchClasses', { branchId: branchDetails.branchID })}>
              <Text style={styles.buttonText}>All Branch Classes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteBranch}>
              <FontAwesomeIcon icon={faTrash} size={20} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

          </View>
        )}
        {/* User Table */}
        <View style={styles.userTableContainer}>
          <View style={styles.userTableHeader}>
            <Text style={styles.tableHeader}>Users</Text>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search user..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <FontAwesomeIcon icon={faSearch} size={20} color="#fff" />
            </View>
          </View>
          <ScrollView style={[styles.userTable, { height: 70 }]}>
            {filteredUsers.map(user => (
              <View key={user.id} style={styles.userRow}>
                <Text style={styles.userText}>- {user.username}</Text>
                <Text style={styles.userEmail}>({user.email})</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

    </LinearGradient>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#cacaca',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#111',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
  },
  branchContainer: {
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    // borderColor: '#222',
    padding: 10,
    marginBottom: 20,
    // width: '100%',
    alignItems: 'center',
  },
  branchName: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    width: '90%',
    textAlign: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 4,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#fff',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#ff4444',
  },
  userTableContainer: {
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  userTableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  userTable: {
    width: '100%',
    maxHeight: 200,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userText: {
    fontSize: 16,
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#aaa',
    marginLeft: 5,
  },
});

export { BranchClassScreen };
export default BranchDetailScreen;

