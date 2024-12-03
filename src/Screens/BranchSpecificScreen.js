import { FontAwesome } from '@expo/vector-icons';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from '../../config';




const EditModal = ({ visible, onClose, onSubmit }) => {
  const [editedData, setEditedData] = useState({
    name: '',
    location: '',
    users: '',
    profit: '',
    phoneNumber: ''
  });

  const handleEditSubmit = () => {
    // Validate editedData if needed
    onSubmit(editedData);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Edit Branch Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={value => setEditedData({ ...editedData, name: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={value => setEditedData({ ...editedData, location: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Users"
          onChangeText={value => setEditedData({ ...editedData, users: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Profit"
          onChangeText={value => setEditedData({ ...editedData, profit: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={value => setEditedData({ ...editedData, phoneNumber: value })}
        />
        <TouchableOpacity style={styles.button} onPress={handleEditSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const CreateClassForm = ({ navigation, onSubmit, branch, setCreateClassModalVisible }) => {
  const [className, setClassName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [schedule, setSchedule] = useState(new Date());
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState(10)
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);


  const handleSubmit = () => {
    // Check if any field is empty
    if (!className || !instructor || !schedule || !time || !capacity) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    console.log(schedule)
    console.log(time);
    the_date = new Date(Date.UTC(schedule.getUTCFullYear(), schedule.getUTCMonth(), schedule.getUTCDate(), time.getUTCHours(), time.getUTCMinutes()));
    the_date = the_date.toISOString()
    console.log(the_date);
    // return;
    console.log("Submitting ")
    console.log(branch)
    // Call onSubmit with the class details
    /*
        'className':className,
        'instructor':instructor,
        'time':schedule,
        'name':className,
        'availability':availability,
        'description':description,
        'capacity':capacity
    */
    try {
      fetch(`${IP_ADDRESS}/createClass`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          'className': className,
          'instructor': instructor,
          'time': schedule,
          'name': className,
          'description': description,
          'capacity': capacity,
          'branch': branch
        }),
      })
        .then(res => {
          if (res.status == 200) {
            setClassName('');
            setInstructor('');
            setSchedule('');
            Alert.alert('Success', 'Class created successfully.');
            setShowDatePicker(false);
            setShowTimePicker(false);
            navigation.navigate('BranchSpecificScreen', { branch, refresh: Math.random() });
          }
        })
    } catch (error) {
      Alert.alert("Failure", "Couldn't Create Class");
    }
    // onSubmit({ className, instructor, schedule:the_date, branch});

    // Clear form fields


    // Show success message


  };
  const deleteClass = async (id) => {
    try {
      await axios.delete(`${IP_ADDRESS}/delete_class`, {
        data: { _id: id }
      });
      // setClasses(classes.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <LinearGradient colors={["#0000", "black"]} style={{ height: '100%', width: '100%', marginTop: '15%' }}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Create New Class</Text>
        <Text style={styles.formTitle}>{className}</Text>
        {/* hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh */}
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={{ padding: 30, backgroundColor: '#121212', marginBottom: 150, borderRadius: 15, maxWidth: '90%', marginHorizontal: '5%' }}>
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
                value={String(capacity)}
                inputMode='numeric'
                onChangeText={(text) => {
                  setCapacity(parseInt(text) || 10);
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
                  {schedule ? `${String(schedule.getDate())}-${String(schedule.getMonth() + 1)}-${String(schedule.getFullYear())}` : "Select Date"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 25 }}>
              <Text style={{ color: '#E0E0E0', fontWeight: 'bold', marginBottom: 10, fontSize: 16 }}>Time:</Text>
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
                  {time ? `@${String(time.getHours())}:${String(time.getMinutes())}` : "Select Time"}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                testID="timePicker"
                value={schedule ? schedule : new Date()}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setDateChanged(true);
                  console.log(selectedDate);
                  const currentDate = selectedDate || schedule;
                  setSchedule(currentDate);
                }}
                onCancel={() => setShowDatePicker(false)}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                testID="TimePicker"
                value={schedule ? schedule : new Date()}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  setTimeChanged(true);
                  console.log(selectedDate);
                  const currentDate = selectedDate || schedule;
                  setTime(currentDate);
                }}
                onCancel={() => setShowTimePicker(false)}
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

const BranchSpecificScreen = ({ route, navigation }) => {
  const [branchData, setBranchData] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranchData, setSelectedBranchData] = useState(null);
  const [classes, setClasses] = useState([])
  const { branch, refresh } = route.params;
  console.log(`Branch Specific Screen => ${JSON.stringify(branch)}`)

  useEffect(() => {
    setCreateClassModalVisible(false);
    fetchData();
  }, [branch, refresh]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${IP_ADDRESS}/BranchSpecficScreen?id=${branch}`);
      const data = await response.json();
      // const filteredData = data.filter(branch => branch.branchID === '1');
      if (data.hasOwnProperty("branch")) {
        setBranchData(data['branch']);
      }

      console.log("We Got Data Specific Screen 2")
      console.log(branchData)
      fetch(`${IP_ADDRESS}/get_classes_for_branch?id=${branch}`)
        .then(res => {
          if (res.status == 200) {
            return res.json()
          } else {
            return []
          }
        })
        .then(res => {
          console.log("Classes We Got 1")

          setClasses(res["classes"])
          console.log(classes)
        })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateBranchDetails = async (updatedBranchData) => {
    try {
      // Include the branch ID in the updated data
      updatedBranchData.branchID = '1'; // Update the branch ID to 1
      const response = await fetch(`${IP_ADDRESS}/updateBranchDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBranchData)
      });
      if (response.ok) {
        Alert.alert('Success', 'Branch details updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update branch details');
      }
    } catch (error) {
      console.error('Error updating branch details:', error);
      Alert.alert('Error', 'Failed to update branch details');
    }
  };

  const handleEdit = (branchID, updatedDetails) => {
    const updatedData = branchData.map(branch => {
      if (branch._id === branchID) {
        return { ...branch, ...updatedDetails };
      }
      return branch;
    });
    setBranchData(updatedData);
    updateBranchDetails(updatedDetails); // Send updated details to the server
    setEditModalVisible(false); // Close the edit modal
  };

  const handleCreateClass = async (classDetails) => {
    try {
      // Post class details to the server
      console.error(classDetails)
      const response = await axios.post(`${IP_ADDRESS}/createClass`, classDetails);

      if (response.status === 200) {
        // Show success message
        Alert.alert('Success', 'Class created successfully 1');
      } else {
        // Show error message if posting fails
        Alert.alert('Error', 'Failed to create class 1');
      }
    } catch (error) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'Failed to create class 2');
    }
  };
  const OpenClassSpecs = async (classId) => {
    navigation.navigate('ClassSpecsScreen', { 'theClass': classId, 'from': 'BranchSpecificScreen', 'branch': branch })
  }
  const deleteClass = async (id) => {
    try {
      await axios.delete(`${IP_ADDRESS}/delete_class`, {
        data: { _id: id }
      });
      setClasses(classes.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <LinearGradient colors={["#0000", "black"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}> Branch Details</Text>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
          color: 'white',
        }}>{branchData.name}</Text>
        {/* {branchData.map(branch => ( */}
        <TouchableOpacity
          key={branchData._id}
          style={styles.branchCard}
          onPress={() => {
            setSelectedBranchId(branchData._id);
            setSelectedBranchData(branchData);
            setEditModalVisible(true);
          }}
          activeOpacity={1}
        >
          <Image
            source={require("../../assets/branchAjalt.jpg")}
            style={styles.branchImage}
          />
          <Text style={styles.branchName}>{branchData.name}</Text>
          <Text style={styles.branchLocation}>
            Location: {branchData.location}
          </Text>
          <Text style={styles.branchInfo}>
            Phone Number: {branchData.phoneNumber}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            // backgroundColor: '#000',
            // flex: 1,
            // padding: 20,
            // alignItems: 'center',
            backgroundColor: 'black',
            // padding: 10,
            borderRadius: 10,
            // borderColor: 'white',
            // borderWidth: 1,
            shadowColor: 'white',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 4,
            elevation: 5,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 20,
            width: '80%',
            alignSelf: 'center',
          }}
        >
          {/* Classes */}
          <Text
            style={{
              width: '100%',
              fontSize: 24,
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              marginTop:5,
              marginBottom: 20,
            }}
          >
            Classes
          </Text>
          {/* Faysal */}
          {/* <TouchableOpacity
    style={{
      backgroundColor: '#fff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 20,
    }}
    onPress={() => setCreateClassModalVisible(true)}
  >
    <Text style={{ color: '#000', fontSize: 16 }}>
      Add New Class
    </Text>
  </TouchableOpacity> */}
          {/* ta7ettttttttttttttttttttttttttttt */}
          {classes.map((the_class) => (
            <View
              key={the_class.id}
              style={{
                backgroundColor: '#1E1E1E',
                borderRadius: 10,
                borderColor: 'white',
                borderWidth: 1,
                padding: 2,
                margin: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                width: '80%'
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  padding: 15,
                  width: '100%',
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                }}
                onPress={() => {
                  OpenClassSpecs(the_class);
                }}
              >
                <View style={{ marginBottom: 10, paddingHorizontal: 20 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  >
                    {the_class.className}
                  </Text>
                  {/* <Text style={{ color: '#fff', marginTop: 5 }}>
                    Instructor: {the_class.instructor}
                  </Text> */}
                </View>
              </TouchableOpacity>
              <View style={{ borderTopWidth: 1, borderTopColor: '#303030', paddingTop: 5 }}>

                
                <Text style={{ fontSize: 14, color: '#E0E0E0', marginRight: 5 }}>
                    Description: {the_class.description}  </Text>


                <Text style={{ fontSize: 14, color: '#E0E0E0' }}>occupancy: {the_class.participants}/{the_class.capacity}</Text>
                
                {/* Star and end date */}
                <Text style={{ fontSize: 14, color: '#E0E0E0' }}>
                  Start Date: {new Date(the_class.startDate).toLocaleDateString()}
                </Text>
                <Text style={{ fontSize: 14, color: '#E0E0E0' }}>
                  End Date: {new Date(the_class.endDate).toLocaleDateString()}
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  <Text style={{ fontSize: 14, color: '#E0E0E0', marginRight: 5 }}>
                    Day: {the_class.days}  </Text>

                  {/* {new Date(the_class.the_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                </View>

                <Text style={{ fontSize: 14, color: '#E0E0E0' }}>Time:</Text>
                {Array.isArray(the_class.the_date) && the_class.the_date.length > 0 ? (
                  the_class.the_date.map((time, index) => (
                    <Text key={index} style={{ fontSize: 14, color: '#E0E0E0', marginRight: 5 }}>
                      {new Date(time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                      {', Participants: '}
                      {the_class.TotalParticipants && the_class.TotalParticipants[index] != null
                        ? the_class.TotalParticipants[index]
                        : 0}
                    </Text>
                  ))
                ) : (
                  <Text style={{ fontSize: 14, color: '#E0E0E0' }}>No times available</Text>
                )}


                <Text style={{ fontSize: 12,marginTop:5, marginBottom: 5, fontWeight: 'bold', color: the_class.availability === 'Locked' ? 'orange' : ((the_class.participants < the_class.capacity) && the_class.availability === 'Available') ? 'green' : 'red' }}>
                  {the_class.availability === 'Locked' ? 'Locked' : ((the_class.participants < the_class.capacity) && the_class.availability === 'Available') ? 'Available' : 'Full'}
                </Text>
                {/* Faysal  */}
                {/* <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: 'black',
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderWidth: 2,
                    borderColor: 'black',
                    alignItems: 'center',
                  }}
                  onPress={() => deleteClass(the_class._id)}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Delete
                  </Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    backgroundColor: 'black',
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderWidth: 2,
                    borderColor: 'black',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    navigation.navigate('BookedClients', { classId: the_class._id });
                    console.log(`Class ID: ${the_class._id}`);
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                    Booked Clients
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

        </View>
        {/* fo22222222222222222 */}


        <View style={styles.iconContainer}>
          <FontAwesomeIcon
            icon={faDumbbell}
            size={30}
            color="black"
            style={{ transform: [{ rotate: "45deg" }] }}
          />
        </View>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]}
          style={styles.fade}
        />
      </ScrollView>
      <EditModal
        visible={false}
        onClose={() => setEditModalVisible(false)}
        onSubmit={(editedData) => handleEdit(selectedBranchId, editedData)}
      />
      <Modal visible={createClassModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <CreateClassForm
            onSubmit={handleCreateClass}
            branch={branchData.branchID}
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
    backgroundColor: 'gray',
    color: 'white',
  },
  content: {
    paddingTop: 50,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  branchCard: {
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  branchImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  classes: {
    backgroundColor: 'black',
  },
  branchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  branchLocation: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  branchInfo: {
    fontSize: 16,
    marginBottom: 5,
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
    backgroundColor: 'black',
    opacity: 0.5,
  },
  editButton: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
  addClassButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 15,
  },
  addClassButtonText: {
    color: 'black',
    fontSize: 16,
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: 'white',
  },
  input1: {
    width: '50%',
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: 'white',
  },
  formContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  classCard: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    width: '100%',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  className: {
    flex: 1,
    fontSize: 15,
    width: '100%',
    paddingHorizontal: 15,
    fontWeight: 'bold',
    textAlignVertical: 'center',
    color: 'white',
  },
  classInfoContainer: {
    backgroundColor: 'black',
    flex: 0.5,
    flexDirection: 'column',
    borderRadius: 5,
    padding: 5,
  },
  classInfoText: {
    flex: 1,
    fontSize: 15,
    width: '100%',
    fontWeight: 'bold',
    textAlignVertical: 'center',
    color: 'white',
  },
});



export default BranchSpecificScreen;
