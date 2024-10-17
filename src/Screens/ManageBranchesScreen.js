import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { faDumbbell, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';

// Faysal
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
    setTheDates([...theDates, newTime]);
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

  const handleSubmit = async () => {
    // Check if any field is empty
    if (!className || !instructor || !startDate || !theDates || theDates.length == 0 || isNaN(capacity) || !endDate) {
      Alert.alert('Error', 'Please fill in all fields');
      // Alert.alert('Error', `${className} ${instructor} ${startDate} ${theDates} ${capacity} ${endDate}`);
      // console.log(isNaN(capacity))
      // console.log(capacity)
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
    /*
        'className':className,
        'instructor':instructor,
        'time':startDate,
        'name':className,
        'availability':availability,
        'description':description,
        'capacity':capacity
    */
    console.log(`Sending Create Classes OF \n\n\t${JSON.stringify({
      'className': className,
      'instructor': instructor,
      'startDate': startDate.toISOString(),
      'endDate': endDate.toISOString(),
      'the_date': theDates,
      'days': days,
      'name': className,
      'description': description,
      'capacity': capacity,
      'branch': 'ALL'
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
      'branch': 'ALL'
    });
    try {
      const response = await fetch('http://146.190.32.150:5000/createClassesNew', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyToSend,
      })


      if (response.status == 200) {
        setClassName('');
        setInstructor('');
        // setSchedule('');
        Alert.alert('Success', 'Class created successfully for all branches');
        // setShowDatePicker(false);
        // setShowTimePicker(false);
        setCreateClassModalVisible(false);
      }

    } catch (error) {
      Alert.alert("Failure", "Couldn't Create Classes for all Branches");
      Alert.alert(error);
    }
    // onSubmit({ className, instructor, schedule:the_date, branch});

    // Clear form fields


    // Show success message


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
    <LinearGradient colors={["#0000", "black"]} style={{ height: '100%', width: '100%', marginTop: '15%' }}>
      <View style={{ ...styles.formContainer }}>
        <Text style={styles.formTitle}>Create New Class</Text>
        <Text style={styles.formTitle}>{className}</Text>
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
            <Text style={styles.label}>Every:</Text>
            <Picker
              style={styles.picker}
              selectedValue={days}
              onValueChange={(itemValue) => setDays(itemValue)}
            >
              <Picker.Item label="Select Day" value={null} enabled={false} />
              {daysOfWeek.map((value, index) => (
                <Picker.Item key={index} value={value} label={value} />
              ))}
            </Picker>


            {/* <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>@Time:</Text>
              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
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
                <FontAwesome name="hourglass" size={20} color="white" />
                <Text style={{ color: '#E0E0E0', textAlign: 'center', fontSize: 16 }}>
                  {the_date ? `@${String(the_date.getHours())}:${String(the_date.getMinutes())}` : "Select Time"}
                </Text>
              </TouchableOpacity>
            </View> */}


            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Times:</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
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


              {showTimePicker && (
                <DateTimePicker
                  testID="TimePicker"
                  value={newTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) {
                      setNewTime(selectedTime);
                    }
                  }}
                />
              )}
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
                    setStartDate(selectedDate);
                  }
                  // setDateChanged(true);
                  console.log(selectedDate);
                  // const currentDate = selectedDate || startDate;

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
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                  // setEndDateChanged(true);
                  console.log(selectedDate);
                  // const currentDate = selectedDate || endDate;
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
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {

                  setShowTimePicker(false);
                  if (selectedDate) {
                    setTheDate(selectedDate);
                  }
                  // setTimeChanged(true);
                  // console.log(selectedDate);
                  // const currentDate = selectedDate || startDate;
                  // setTheDate(currentDate);
                }}
                onCancel={() => setShowTimePicker(false)}
              />
            )}
            {showNewTimePicker && (
              <DateTimePicker
                testID="newTimePicker"
                value={newTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowNewTimePicker(false);
                  if (selectedDate) {
                    setNewTime(selectedDate);
                  }
                  // setTimeChanged(true);
                  // console.log(selectedDate);
                  // const currentDate = selectedDate || startDate;
                  // setNewTime(currentDate);
                }}
                onCancel={() => setShowNewTimePicker(false)}
              />
            )}

            <TouchableOpacity style={{ backgroundColor: '#121212', borderColor: 'white', borderWidth: 2, padding: 10, borderRadius: 10, marginBottom: 15 }} onPress={handleSubmit}>
              <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
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






const ManageBranchesScreen = ({ route, navigation }) => {
  // Define your branch data
  const { refresh } = route.params || Math.floor(Math.random() * 1000);
  const [Branches, setBranches] = useState([]);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [branchImages, setBranchImages] = useState([
    require('../../assets/branch1.jpg'),
    require('../../assets/branch20.jpeg'),
    require('../../assets/own10.jpg')
  ]);

  useEffect(() => {
    const fetchBranches = async () => {
      console.log("Fetching Branches  [ManageBranchesScreen]");
      try {
        const resp = await fetch("http://146.190.32.150:5000/branches_for_super_admin");
        if (resp.status === 200) {
          const res = await resp.json();
          setBranches(res);
        } else {
          setBranches([]);
        }
      } catch (error) {
        console.error("Error Fetching ");
      }
    };
    fetchBranches();
  }, [refresh]);

  // Define a function to navigate to a specific branch detail screen
  const goToBranchDetail = (branch) => {
    // Navigate to the screen where you view branch details
    console.log(`Going to branch ${branch}`);
    console.log(branch);
    navigation.navigate('BranchDetailScreen', { branch });
  };

  const createNewBranch = () => {
    navigation.navigate('NewBranchCreationScreen');
  };

  // Define your custom color palette
  const colors = ['#0f0f0f', '#2b2b2b']; // Luxurious dark shades
  const handleCreateClasses = () => {
    console.log("Handle Creating Classes [ManageBranchesScreen]");
  }
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <ScrollView contentContainerStyle={{ ...styles.content, display: 'flex', flexDirection: 'column', marginTop: 40, marginBottom: 150, borderColor: '#2b2b2b', borderWidth: 1, borderRadius: 5, marginHorizontal: 10 }}>
        <TouchableOpacity
          style={{ marginVertical: 10 }}
          onPress={createNewBranch}
          activeOpacity={0.1}
        >
          <Text style={styles.newBranchText}>
            <FontAwesomeIcon icon={faStar} size={16} color="white" /> New Branch
          </Text>
        </TouchableOpacity>
        <View style={{ borderColor: '#2b2b2b', borderBottomWidth: 1, width: '100%' }}></View>
        {/* Faysal */}
        <TouchableOpacity
          style={{ marginVertical: 10 }}
          // onPress={createNewBranch}   // shouild handle creation of new class
          onPress={() => setCreateClassModalVisible(true)}
          activeOpacity={0.1}
        >
          <Text style={{ color: 'white', }}>
            <FontAwesomeIcon icon={faStar} size={16} color="white" /> New Class
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Manage Branches</Text>
        {Branches.map(branch => (
          <View key={branch.branchID} style={styles.branchCard}>
            <TouchableOpacity
              // key={branch.branchID}
              // style={styles.branchCard}
              activeOpacity={0.5}
              onPress={() => goToBranchDetail(branch)}
            >
              <Image source={branchImages[Math.floor(Math.random() * branchImages.length)]} style={styles.branchImage} />
              <Text style={styles.branchName}>{branch.name}</Text>
            </TouchableOpacity>
            {/* Faysal */}
            <TouchableOpacity
              // key={branch.branchID + "ID01"}
              activeOpacity={0.3}
              onPress={() => {
                console.log("Manage Classes");
                navigation.navigate('BranchClassScreen', { branch });
              }}
            >
              <Text style={{ textAlign: 'center', color: 'white' }}>Manage Classes</Text>

            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faDumbbell} size={30} color="white" style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} style={styles.fade} />
      </ScrollView>
      <Modal visible={createClassModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <CreateClassForm
            onSubmit={handleCreateClasses}
            branch="ALL"
            navigation={navigation}
            setCreateClassModalVisible={setCreateClassModalVisible}
          />

        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  content: {
    alignItems: 'center',
    position: 'relative', // Make the container relative to position its children absolutely
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white', // Luxurious gold color for the title text
    textAlign: 'center',
  },
  newBranchButton: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: 'white',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.8,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginTop: 30,
    marginBottom: 20,
  },
  newBranchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  branchCard: {
    width: '90%',
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  branchImage: {
    width: '100%',
    height: 200, // Adjust the height as needed
    marginBottom: 10,
    borderRadius: 15,
  },
  branchName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#333333',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 10,
    textAlign: 'center',
    color: 'white',
  },
  iconContainer: {
    position: 'absolute',
    top: 78,
    right: 20,
  },
  fade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  formContainer: {
    alignItems: 'center',
  },
  picker: {
    height: 50,
    color: 'white',
    backgroundColor: '#222',
    marginBottom: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ManageBranchesScreen;
