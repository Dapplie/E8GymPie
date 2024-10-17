import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AllBranchClasses = ({ route }) => {
  const { branchId } = route.params;
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://146.190.32.150:5000/get_classes_for_branch?id=${branchId}`);
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
            <Text style={[styles.text, styles.bold]}>Instructor: </Text>
            <Text style={styles.text}>{cls.instructor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Time: </Text>
            {/* <Text style={styles.text}>{new Date(cls.to_date).toLocaleString()}</Text> */}
            <Text style={styles.text}>
              {Array.isArray(cls.the_date) && cls.the_date.length > 0 ? (
                <Text style={styles.text}>
                  {new Date(cls.the_date[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              ) : (
                <Text style={styles.text}>No times available</Text>
              )}
            </Text>

          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Availability: </Text>
            <Text style={styles.text}>{cls.availability}</Text>
          </View>
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
            <Text style={[styles.text, styles.bold]}>Days: </Text>
            <Text style={styles.text}>{cls.days}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>End Time: </Text>
            {console.log(cls.endDate)}
            {/* <Text style={styles.text}>{new Date(cls.endDate).toLocaleString()}</Text> */}
            <Text style={styles.text}>
              {new Date(cls.endDate).toISOString().split('T')[0]}
            </Text>

          </View>
          <View style={styles.row}>
            <Text style={[styles.text, styles.bold]}>Participants: </Text>
            <Text style={styles.text}>{cls.participants}</Text>
          </View>
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
