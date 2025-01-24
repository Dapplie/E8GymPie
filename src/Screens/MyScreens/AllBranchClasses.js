import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { IP_ADDRESS } from '../../../config';

const AllBranchClasses = ({ route }) => {
  const { branchId } = route.params;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${IP_ADDRESS}/get_classes_for_branch?id=${branchId}`);
        setClasses(response.data.classes);
        console.log(response.data.classes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setLoading(false);
      }
    };

    fetchData(); // Fetch data initially

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 2 seconds
    }, 2000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [branchId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Branch ID: {branchId}</Text>
      <Text style={styles.header}>Classes:</Text>
      {classes.map(cls => (
        <View key={cls._id} style={styles.classContainer}>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Class Name: </Text>
            <Text style={styles.text}>{cls.className}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Class Name: </Text>
            <Text style={styles.text}>{cls.description}</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>occupancy: </Text>
            <Text style={styles.text}>{cls.participants}/{cls.capacity}</Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Instructor: </Text>
            <Text style={styles.text}>{cls.instructor}</Text>
          </View> */}


          {/* <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Participants: </Text>
            <Text style={styles.text}>{cls.participants}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Capacity: </Text>
            <Text style={styles.text}>{cls.capacity}</Text>
          </View> */}
          {/* <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Description: </Text>
            <Text style={styles.text}>{cls.description}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Day: </Text>
            <Text style={styles.text}>{cls.days}</Text>
          </View>


          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Start Time: </Text>
            {console.log(cls.endDate)}
            {/* <Text style={styles.text}>{new Date(cls.endDate).toLocaleString()}</Text> */}
            <Text style={styles.text}>
              {new Date(cls.startDate).toISOString().split('T')[0]}
            </Text>

          </View>

          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>End Time: </Text>
            {console.log(cls.endDate)}
            {/* <Text style={styles.text}>{new Date(cls.endDate).toLocaleString()}</Text> */}
            <Text style={styles.text}>
              {new Date(cls.endDate).toISOString().split('T')[0]}
            </Text>
          </View>

          {/* <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>All Participants: </Text>
            <Text style={styles.text}>{cls.participants}</Text>
          </View> */}

          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Time:</Text>
          </View>
          {Array.isArray(cls.the_date) && cls.the_date.length > 0 ? (
            cls.the_date.map((time, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.text}>
                  {/* Display the time directly without creating a new Date object */}
                  {time}
                  {', Participants: '}
                  {cls.TotalParticipants && cls.TotalParticipants[index] != null ? (
                    <Text style={styles.text}>{cls.TotalParticipants[index]}</Text>
                  ) : (
                    <Text style={styles.text}>0</Text>
                  )}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No times available</Text>
          )}




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
              navigation.navigate('BookedClients', { classId: cls._id });
              console.log(`Class ID: ${cls._id}`);
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
              Booked Clients
            </Text>
          </TouchableOpacity>
          <View style={styles.separator} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  classContainer: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AllBranchClasses;
