import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from './Header';

const PurchaseInfoScreen = ({ route }) => {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedClass, setSelectedClass] = useState({});
  const [classesData, setClassesData] = useState([]);

  useEffect( () =>  {
    
    fetchData(); // fetch data fetches the data for purchased items
    fetchClasses(); // fetches data for the booked classes
    fetchBranches(); // this is just a test to see what the branches brings
    fetchBranchesAndClasses(); // this is just a test to get all branches and classes included 
  }, []);

  const fetchBranchesAndClasses = async() => {
    try {
      fetch("http://146.190.32.150:5000/getBranchesAndClasses")
      .then((response) => response.json())
      .then((data) => {
        console.log('Successful Data Fetching');
        console.log(data);
      }).catch((error)=>console.log('Error: ', error));
    }catch(err){
      console.log("Error in fetching Branches and Classes: " + err);
  }
  };
  const fetchBranches = async () => {
    try {
      fetch("http://146.190.32.150:5000/BranchList")
      .then(response => response.json())
      .then((data) => {
        // console.log('Successful branch call');
        // console.log(data);
      })
      .catch((error) =>{
          console.error('Error:', error);
      });
    }catch(err){
      console.log('Caught Error in Branch Fetch')
      console.log(err);
    }
};

  const fetchData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      fetch(`http://146.190.32.150:5000/PurchaseInfoScreen?userid=${userId}`)
        .then(res => res.json())
        .then(data => {
          // console.log( data);
          setPurchasedItems(data);
        })
        .catch(err => {
          console.log('Error fetching data:', err.message);
        });
      } catch (err) {
        console.log('Error:', err.message);
      }
  };
  const fetchClasses = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      fetch(`http://146.190.32.150:5000/PurchaseInfoScreenBooking?userid=${userId}`)
        .then(res => res.json())
        .then(data => {
          console.log('The Booking Data We Got:', data);
          console.log(data);
          setClassesData(data);
        })
        .catch(err => {
          console.log('Error fetching booking data:', err.message);
        });
    } catch (err) {
      console.log('Error:', err.message);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollcontainer}>
      <View style={styles.container}>
        <Header />
        <Text style={styles.header}>Your Booked Classes</Text>
        
        {purchasedItems.length > 0 ? (
          purchasedItems.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {item.products.map((product, idx) => (
                <View key={idx}>
                  <Text>Product Name: {product.name}</Text>
                  <Text>Product Price: {product.price}</Text>
                  <Text>Purchased At: {item.timestamp}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <Text>No purchased items</Text>
        )}

        {classesData.length > 0 ? (
          classesData.map((item, index) => (
            <View key={index} style={styles.itemContainer}>
              {/* Check if className exists before rendering */}
              {item.className && <Text>Class Name: {item.className}</Text>}
              {/* Check if classTime exists before rendering */}
              {item.classTime && <Text>Class Time: {item.classTime}</Text>}
              {/* Check if branch exists before accessing its name property */}
              {item.branch && <Text>Class At: {item.branch.name}</Text>}
            </View>
          ))
        ) : (
          <Text></Text>
        )}
        
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetail: {},
});

export default PurchaseInfoScreen;
