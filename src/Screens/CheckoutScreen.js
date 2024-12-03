import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import { IP_ADDRESS } from '../../config';

import Header from './Header';

const CheckoutScreen = ({ route }) => {
  const { cartItems } = route.params || {}; // Add null check for route.params  const [selectedCountry, setSelectedCountry] = useState('');
  const [country, setCountry] = useState(null);
  const [items, setItems] = useState(addKeysToItems(cartItems));
  const [deletedItems, setDeletedItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [Address, setAddress]= useState('');
  const [region, setRegion] = useState('');
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [regionError, setRegionError] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const navigation = useNavigation();
  const [userId,setUserId] = useState('') 
  function addKeysToItems(items) {
    return items.map((item, index) => {
      return { ...item, key: `${item.id}-${index}`, price: parseFloat(item.price) };
    });
  }

  useEffect(() => {
    let cost = 0;
    items.forEach(item => {
      cost += item.price;
    });
    setTotalCost(cost);
  }, [items]);

  useEffect( ()=>{
     AsyncStorage.getItem("userId").then((value)=>{
      if (value !== null){
        console.error(`User ID In  Use : ${value}`);
        setUserId(value)
      }
     }).catch((err)=>console.log(err))
  },[])
  const handleDeleteItem = (itemKey) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            const updatedItems = items.filter(item => item.key !== itemKey);
            const deletedItem = items.find(item => item.key === itemKey);
            setDeletedItems(prevDeletedItems => [...prevDeletedItems, deletedItem]);
            setItems(updatedItems);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      Alert.alert('Payment Method Required', 'Please choose a payment method.');
      return;
    }
    if (!firstName) {
      setFirstNameError(true);
      return;
    }
    if (!lastName) {
      setLastNameError(true);
      return;
    }
    if (!region) {
      setRegionError(true);
      return;
    }
    if (paymentMethod === 'credit_card' && (!cardNumber || !expiryDate || !cvv)) {
      Alert.alert('Card Details Required', 'Please fill in all card details.');
      return;
    }
    if (paymentMethod === 'Cash' && (!firstName || !lastName || !Address)) {
      Alert.alert("Missing Information", "Please provide your full name and address for cash.");
      return;
    }
    
    try {
      const response = await fetch(`${IP_ADDRESS}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          region: region,
          products: items,
          totalCost: totalCost,
          paymentMethod: paymentMethod,
          cardNumber: cardNumber,
          expiryDate: expiryDate,
          cvv: cvv,
          Address:Address,
          userid:userId,
        }),
      });
try {
  // Your existing code
  
  // Save purchased items to AsyncStorage
  await AsyncStorage.setItem('purchasedItems', JSON.stringify(items));
} catch (error) {
  console.error('Error saving purchased items to AsyncStorage:', error);
}

      if (response.ok) {
        setShowPaymentDetails(true);
        setPurchasedItems(items);     
        Alert.alert('Checkout Successful', 'Your order has been placed successfully!');
        // Pass booked classes to PurchaseInfoScreen
        navigation.navigate('PurchaseInfoScreen', { purchasedItems: items });
      } else {
        Alert.alert('Checkout Failed', 'An error occurred during checkout. Please try again later.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Checkout Error', 'An error occurred during checkout. Please try again later.');
    }
  };

  const handlePaymentMethodChange = (itemValue) => {
    setPaymentMethod(itemValue);
    setPaymentMethodSelected(true);
    setCardNumber('');
    setExpiryDate('');
    setCVV('');
  };

  const handleRegionChange = (itemValue) => {
    setSelectedCountry(itemValue);
    setRegionError(false); // Reset the region error when a region is selected
  };

  const onSelectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
    setRegion(selectedCountry.name);
    console.log(selectedCountry)
  };

  return (
    <ScrollView contentContainerStyle={styles.container} nestedScrollEnabled={true}>
      {/* Render PurchaseInfoScreen if purchasedItems is available 
      && <PurchaseInfoScreen purchasedItems={purchasedItems} />
      */}
      {purchasedItems.length > 0 }
      <Header />
      <Text style={styles.title}>Billing details</Text>
      <View style={styles.fieldWrapper}>
        <View style={styles.fieldRow}>
          <View style={styles.field}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, firstNameError && styles.errorInput]}
              placeholder="First Name"
              autoCompleteType="name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                setFirstNameError(!text); // Set error if first name is empty
              }}
            />
            {firstNameError && <Text style={styles.errorText}>First name is required</Text>}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[styles.input, lastNameError && styles.errorInput]}
              placeholder="Last Name"
              autoCompleteType="name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                setLastNameError(!text); // Set error if last name is empty
              }}
            />
            {lastNameError && <Text style={styles.errorText}>Last name is required</Text>}
          </View>
        </View>
        <View style={styles.field}>
         {/*<Text style={styles.title1}>Select Your Country </Text>*/} 
          <View style={{ display: 'flex', flexDirection:'row', justifyContent:'center' }}>
          <ScrollView style={styles.countryPickerContainer}>
              <CountryPicker
                withFlag
                withFilter
                withCountryNameButton={false}
                withCallingCodeButton
                withAlphaFilter
                onSelect={(country) => onSelectCountry(country)}
              />
            </ScrollView>
            {country && ( 
              <TouchableOpacity onPress={() => console.log('Open country picker')} style={styles.countryInfo}>
                <Text style={styles.countryName}>{country.name}</Text>
              </TouchableOpacity>
            )}
          </View>
          {regionError && <Text style={styles.errorText}>Region is required</Text>}
        </View>
      </View>
    
      <Text style={styles.cartTitle}>Cart Items</Text>
      <ScrollView horizontal={true} style={{ width: "100%" }}>
      <FlatList style={{ width: "100%" }}
        data={items.filter(item => !deletedItems.includes(item))}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>Price: <Text style={styles.orangePrice}>{item.price}</Text></Text>
            <TouchableOpacity onPress={() => handleDeleteItem(item.key)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </ScrollView>

      <View style={styles.paymentDetails}>
        <Text style={styles.paymentDetailsTitle}>Payment Details</Text>
        <Picker
          selectedValue={paymentMethod}
          style={styles.paymentMethodPicker}
          onValueChange={handlePaymentMethodChange}>
        <Picker.Item label="Select Payment Method" value="" />
          {/*   <Picker.Item label="Credit Card" value="credit_card" /> */}
          <Picker.Item label="Cash" value="Cash" />
          {/* Add other payment methods as Picker.Item */}
        </Picker>
        {/* {paymentMethod === 'credit_card' && (
          <View style={styles.cardDetails}>
            <TextInput
              style={[styles.cardInput, !cardNumber && styles.errorInput]}
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <TextInput
              style={[styles.cardInput, !expiryDate && styles.errorInput]}
              placeholder="Expiration Date (MM/YY)"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <TextInput
              style={[styles.cardInput, !cvv && styles.errorInput]}
              placeholder="CVV"
              value={cvv}
              onChangeText={setCVV}
            />
            {!cardNumber && <Text style={styles.errorText}>Card number is required</Text>}
            {!expiryDate && <Text style={styles.errorText}>Expiration date is required</Text>}
            {!cvv && <Text style={styles.errorText}>CVV is required</Text>}
          </View>
        )} */}
        {paymentMethod === 'Cash' && (
          <View style={styles.cardDetails}>
            <TextInput
              style={[styles.cardInput, !firstName && styles.errorInput]}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.cardInput, !lastName && styles.errorInput]}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={[styles.cardInput, !Address && styles.errorInput]}
              placeholder="Address"
              value={Address}
              onChangeText={setAddress}
            />
            {!firstName && <Text style={styles.errorText}>First Name is required</Text>}
            {!lastName && <Text style={styles.errorText}>Last Name is required</Text>}
            {!Address && <Text style={styles.errorText}>Address is required</Text>}
          </View>
        )}
        {typeof totalCost === 'number' && (
          <Text style={styles.totalCost}>Total Cost: ${totalCost.toFixed(2)}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Checkout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  title1:{
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  fieldWrapper: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  field: {
    flex: 1,
    marginRight: 5,
    
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  select: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  productContainer: {
    marginLeft:20,
    width:370,
    marginRight:10,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#888',
  },
  orangePrice: {
    color: 'orange',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentDetails: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },
  paymentDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentMethodPicker: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  cardDetails: {
    marginTop: 10,
  },
  cardInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  countryPickerContainer: {
    flex: 1,
    maxHeight: 200,
    marginLeft: 20,
  },
  countryName: {
    fontSize: 16,
    marginRight:20,
    //flex:1,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default CheckoutScreen;
