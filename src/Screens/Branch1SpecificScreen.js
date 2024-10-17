import { FontAwesome } from '@expo/vector-icons';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';




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
          onChangeText={value => setEditedData({...editedData, name: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={value => setEditedData({...editedData, location: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Users"
          onChangeText={value => setEditedData({...editedData, users: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Profit"
          onChangeText={value => setEditedData({...editedData, profit: value})}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          onChangeText={value => setEditedData({...editedData, phoneNumber: value})}
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

const CreateClassForm = ({ onSubmit }) => {
  const [className, setClassName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [schedule, setSchedule] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = () => {
    // Check if any field is empty
    if (!className || !instructor || !schedule) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Call onSubmit with the class details
    onSubmit({ className, instructor, schedule });

    // Clear form fields
    setClassName('');
    setInstructor('');
    setSchedule('');

    // Show success message
    Alert.alert('Success', 'Class created successfully');
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Create New Class</Text>
      <TextInput
        style={styles.input1}
        placeholder="Class Name"
        value={className}
        onChangeText={text => setClassName(text)}
      />
      <TextInput
        style={styles.input1}
        placeholder="Instructor"
        value={instructor}
        onChangeText={text => setInstructor(text)}
      />
      {/* <TextInput
        style={styles.input1}
        placeholder="Schedule"
        value={schedule}
        onChangeText={text => setSchedule(text)}
      /> */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
            <FontAwesome name="calendar" size={24} color="black" style={styles.icondate} />
            <Text style={styles.inputdate}>{schedule ? schedule.toLocaleDateString() : 'Select Date and Time'}</Text>
          </TouchableOpacity>
      {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={schedule ? new  Date(schedule) : new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              const currentDate = selectedDate || schedule;
              setSchedule(currentDate);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const Branch1SpecificScreen = () => {
  const [branchData, setBranchData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [createClassModalVisible, setCreateClassModalVisible] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [selectedBranchData, setSelectedBranchData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://146.190.32.150:5000/Branch1SpecificScreen');
      const data = await response.json();
      const filteredData = data.filter(branch => branch.branchID === '1');
      setBranchData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateBranchDetails = async (updatedBranchData) => {
    try {
      // Include the branch ID in the updated data
      updatedBranchData.branchID = '1'; // Update the branch ID to 1
      const response = await fetch('http://146.190.32.150:5000/updateBranchDetails', {
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
      const response = await axios.post('http://146.190.32.150:5000/createClass', classDetails);
  
      if (response.status === 201) {
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
    return (
    <LinearGradient colors={['#0000', 'blue']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Qlayaa Branch Details</Text>
        {branchData.map(branch => (
          <TouchableOpacity
            key={branch._id}
            style={styles.branchCard}
            onPress={() => {
              setSelectedBranchId(branch._id);
              setSelectedBranchData(branch);
              setEditModalVisible(true);
            }}
          >
            <Image source={require('../../assets/branch1.jpg')} style={styles.branchImage} />
            <Text style={styles.branchName}>{branch.name}</Text>
            <Text style={styles.branchLocation}>Location: {branch.location}</Text>
            <Text style={styles.branchInfo}>Users: {branch.users}</Text>
            {/* <Text style={styles.branchInfo}>Profit: ${branch.profit}</Text> */}
            <Text style={styles.branchInfo}>Phone Number: {branch.phoneNumber}</Text>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addClassButton} onPress={() => setCreateClassModalVisible(true)}>
          <Text style={styles.addClassButtonText}>Add New Class</Text>
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faDumbbell} size={30} color="orange" style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        <LinearGradient colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']} style={styles.fade} />
      </ScrollView>
      <EditModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSubmit={editedData => handleEdit(selectedBranchId, editedData)}
      />
      <Modal visible={createClassModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <CreateClassForm onSubmit={handleCreateClass} />
          <TouchableOpacity style={styles.button} onPress={() => setCreateClassModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'black',
  },
  branchCard: {
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  branchImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  branchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  branchLocation: {
    fontSize: 16,
    marginBottom: 5,
  },
  branchInfo: {
    fontSize: 16,
    marginBottom: 5,
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
  editButton: {
    color: 'orange',
    fontSize: 16,
    marginTop: 10,
  },
  addClassButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 15,
  },
  addClassButtonText: {
    color: 'white',
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
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  input1: {
    width:300,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  formContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  formTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});

export default Branch1SpecificScreen;
