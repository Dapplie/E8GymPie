import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../Screens/Header';

const DashboardScreen = ({route, navigation}) => {
  const [isFirstImageHovered, setIsFirstImageHovered] = useState(false);
  const [isSecondImageHovered, setIsSecondImageHovered] = useState(false);
  const [bmiUnit, setBmiUnit] = useState('metric');
  const [bmiWeightMetric, setBmiWeightMetric] = useState('');
  const [bmiHeightMetric, setBmiHeightMetric] = useState('');
  const [bmiWeightImperial, setBmiWeightImperial] = useState('');
  const [bmiHeightFeet, setBmiHeightFeet] = useState('');
  const [bmiHeightInch, setBmiHeightInch] = useState('');
  const [bmiResult, setBmiResult] = useState(null);
  const {fullName,email,uid,branch}=route.params;
  console.log("DashBoardScreen")
  console.log(route.params)
  // get the route.params and make sure you have email and fullName here 
  
 // in your react native what syntax you use to get the params ?
  const handleFirstImagePressIn = () => {
    setIsFirstImageHovered(true);
  };

  const handleFirstImagePressOut = () => {
    setIsFirstImageHovered(false);
  };

  const handleSecondImagePressIn = () => {
    setIsSecondImageHovered(true);
  };

  const handleSecondImagePressOut = () => {
    setIsSecondImageHovered(false);
  };

  const handleBookNowPress = () => {
    console.log(`DashBoard ${fullName} &&  ${email}`);
    navigation.navigate('ClassScheduleScreen', { branch });
  
    // Log branch every 2 seconds
    // setInterval(() => {
    //   console.log(branch);
    // }, 2000);
  
    console.log("Book Now button pressed");
  };
  

  const handleOwnNowPress = () => {
    navigation.navigate('OwnNow');
    console.log("Own Now button pressed");
  };

  const handleCalculateBMI = () => {
    // Implement the BMI calculation logic here
    let weight, height;
    if (bmiUnit === 'metric') {
      weight = parseFloat(bmiWeightMetric);
      height = parseFloat(bmiHeightMetric) / 100; // Convert height to meters
    } else {
      const weightLbs = parseFloat(bmiWeightImperial);
      const heightFeet = parseFloat(bmiHeightFeet);
      const heightInch = parseFloat(bmiHeightInch);
      weight = weightLbs * 0.453592; // Convert weight to kg
      height = ((heightFeet * 12) + heightInch) * 0.0254; // Convert height to meters
    }

    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
      // Handle invalid input
      console.log("Invalid input for BMI calculation");
      return;
    }

    const bmi = weight / (height * height);

    // Determine weight status based on BMI
    let status;
    if (bmi < 18.5) {
      status = 'Underweight';
    } else if (bmi < 25) {
      status = 'Normal';
    } else if (bmi < 30) {
      status = 'Overweight';
    } else {
      status = 'Obese';
    }

    setBmiResult({ bmi, status });
  };
  return (
    <ScrollView style={styles.container}>
      <Header />
      <View style={{ backgroundColor: 'black', flex: 1,marginBottom:40, alignItems: 'center', justifyContent: 'center' }}>
  <Image
    source={require('../../assets/own.jpg')}
    style={{ width: 200, height: 200, marginBottom: 20 }}
    resizeMode="contain"
  />
  <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
    Welcome to Endurance Eight!
  </Text>
  <Text style={{ color: 'white', textAlign: 'center', paddingHorizontal: 20 }}>
    E8 gym is a Circuit-based, general strength and condition training with aim to improve overall strength, endurance, flexibility, coordination, and balance, while also reducing the risk of injury. Our workouts are suitable for multiple age groups and all fitness levels.
  </Text>
</View>

     {/* <View style={styles.additionalContainer}>
        <View style={styles.additionalContent}>
          <Text style={styles.additionalSubTitle}>E8 Online</Text>
          <Text style={styles.additionalTitle}>Our Classes</Text>
          <Text style={styles.additionalParagraph}>
            In the digital age, we understand the need for flexibility and accessibility in sports training.
            E8 Online is our online training platform, offering you a wealth of resources, workouts, and expert guidance from the comfort of your own space.
            Our virtual training programs are designed to cater to all levels of fitness enthusiasts, helping you stay on track and achieve your goals.
          </Text>
          <View style={styles.additionalImagesContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EShop')} // Navigate to EShopScreen
              onPressIn={handleFirstImagePressIn}
              onPressOut={handleFirstImagePressOut}
              style={{ marginRight: 20, opacity: isFirstImageHovered ? 0.7 : 1 }}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/travelpack.jpg')}
                  style={styles.additionalImage}
                  resizeMode="contain"
                />
                <Text style={styles.imageText}>Travel Pack</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
          onPress={() => navigation.navigate('EShop')} // Navigate to EShopScreen
          onPressIn={handleSecondImagePressIn}
          onPressOut={handleSecondImagePressOut}
          style={{ opacity: isSecondImageHovered ? 0.7 : 1 }}
        >
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/homepack.jpg')}
                  style={styles.additionalImage}
                  resizeMode="contain"
                />
                <Text style={styles.imageText}>Home Pack</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>*/}
      {/* <View style={[styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <View>
          <Text style={styles.sectionTitle}>E8 Online</Text>
          <Text style={styles.sectionSubtitle}>Our Packs</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EShop')}  style={styles.buyNowButton}>
            <Text style={styles.buyNowText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/travelpack.jpg')}
          style={styles.sectionImage}
          resizeMode="contain"
        />
      </View> */}

<View style={{ flexDirection: 'row',borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'space-between', backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10, marginBottom: 20 }}>
  <View style={{ flex: 1 }}>
    <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Book</Text>
    <Text style={{ color: '#ffffff', fontSize: 16 }}>Your class</Text>
    <TouchableOpacity onPress={handleBookNowPress} style={{ backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10, alignSelf: 'flex-start' }}>
      <Text style={{ color: '#1a1a1a', fontSize: 16, fontWeight: 'bold' }}>Book Now</Text>
    </TouchableOpacity>
  </View>
  <Image
    source={require('../../assets/book.jpg')}
    style={{ width: '50%', aspectRatio: 1, borderRadius: 10 }}
    resizeMode="contain"
  />
</View>
<View style={{ flexDirection: 'row',borderRadius: 10, borderWidth: 1, borderColor: 'white', justifyContent: 'space-between', backgroundColor: '#1a1a1a', padding: 20, borderRadius: 10 }}>
  <View style={{ flex: 1 }}>
    <Text style={{ color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Own</Text>
    <Text style={{ color: '#ffffff', fontSize: 16 }}>An E8 Gym</Text>
    <TouchableOpacity onPress={handleOwnNowPress} style={{ backgroundColor: '#ffffff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginTop: 10, alignSelf: 'flex-start' }}>
      <Text style={{ color: '#1a1a1a', fontSize: 16, fontWeight: 'bold' }}>Own Now</Text>
    </TouchableOpacity>
  </View>
  <Image
    source={require('../../assets/own.jpg')}
    style={{ width: '50%', aspectRatio: 1, borderRadius: 10 }}
    resizeMode="contain"
  />
</View>





{/* BMI Calculator */}
<View style={{ backgroundColor: '#111',marginTop:20,marginBottom:40, padding: 20, borderRadius: 10, borderWidth: 1, borderColor: 'white' }}>
  {/* Header */}
  <View style={{ marginBottom: 20 }}>
    <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 5 }}>Calculate Your BMI</Text>
    <Text style={{ color: 'white', fontSize: 16 }}>Body Mass Index</Text>
  </View>

  {/* Form */}
  <View style={{ marginBottom: 20 }}>
    {/* Metric or Imperial Unit Selector */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: 'white',
          marginRight: 10,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setBmiUnit('metric')}
      >
        <Text style={{ color: 'white' }}>Metric Units</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'transparent',
          padding: 10,
          borderWidth: 1,
          borderRadius: 5,
          borderColor: 'white',
          marginLeft: 10,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setBmiUnit('imperial')}
      >
        <Text style={{ color: 'white' }}>Imperial Units</Text>
      </TouchableOpacity>
    </View>

    {/* Weight and Height input fields based on the selected unit */}
    {bmiUnit === 'metric' ? (
      <>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white', marginBottom:5 }}>Weight (kg)</Text>
          <View style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', borderRadius: 5 }}>
            <TextInput
              placeholder="Enter weight"
              value={bmiWeightMetric}
              onChangeText={setBmiWeightMetric}
              keyboardType="numeric"
              style={{ color: 'white', padding: 10 }}
              placeholderTextColor="white"
            />
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white',marginBottom:5 }}>Height (cm)</Text>
          <View style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', borderRadius: 5 }}>
            <TextInput
              placeholder="Enter height"
              value={bmiHeightMetric}
              onChangeText={setBmiHeightMetric}
              keyboardType="numeric"
              style={{ color: 'white', padding: 10 }}
              placeholderTextColor="white"
            />
          </View>
        </View>
      </>
    ) : (
      <>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ color: 'white',marginBottom:5 }}>Weight (lbs)</Text>
          <View style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', borderRadius: 5 }}>
            <TextInput
              placeholder="Enter weight"
              value={bmiWeightImperial}
              onChangeText={setBmiWeightImperial}
              keyboardType="numeric"
              style={{ color: 'white', padding: 10 }}
              placeholderTextColor="white"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flex: 1, marginRight: 10,  }}>
            <Text style={{ color: 'white', marginBottom:5 }}>Height (feet)</Text>
            <View style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', borderRadius: 5 }}>
              <TextInput
                placeholder="Enter feet"
                value={bmiHeightFeet}
                onChangeText={setBmiHeightFeet}
                keyboardType="numeric"
                style={{ color: 'white', padding: 10 }}
                placeholderTextColor="white"
              />
            </View>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: 'white',marginBottom:5 }}>Height (inches)</Text>
            <View style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: 'white', borderRadius: 5 }}>
              <TextInput
                placeholder="Enter inches"
                value={bmiHeightInch}
                onChangeText={setBmiHeightInch}
                keyboardType="numeric"
                style={{ color: 'white', padding: 10 }}
                placeholderTextColor="white"
              />
            </View>
          </View>
        </View>
      </>
    )}

    {/* Calculate button */}
    <TouchableOpacity onPress={handleCalculateBMI} style={{ backgroundColor: 'white', padding: 10, borderRadius: 5, alignItems: 'center' }}>
      <Text style={{ color: '#111', fontWeight: 'bold' }}>CALCULATE</Text>
    </TouchableOpacity>
  </View>

  {/* Result */}
  {bmiResult && (
    <View style={{ borderTopWidth: 1, borderTopColor: 'white', paddingTop: 20 }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Your BMI is: {bmiResult.bmi.toFixed(2)}</Text>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
        Your weight status is: {bmiResult.status === 'Obese' ? 'Obese' : bmiResult.status === 'Normal' ? 'Normal' : 'Underweight'}
      </Text>
    </View>
  )}
</View>

             </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'black',
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  logo: {
    width: 150,
    height: 50,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  welcomeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageText: {
    marginTop: 5,
    textAlign: 'center',
    color: 'black',
    fontSize: 15,
fontWeight:'bold',
  },
  welcomeImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  welcomeDescription: {
    flex: 1,
    marginLeft: 20,
    fontSize: 16,
    color: 'black',
  },
  additionalContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 32,
  },
  additionalContent: {
    alignItems: 'center',
  },
  additionalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  additionalSubTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 5,
  },
  additionalParagraph: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#888',
  },
  additionalImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  additionalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  section: {
    marginBottom: 32,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  facilityItem: {
    marginBottom: 5,
  },
  facilityName: {
    fontWeight: 'bold',
    color: '#2980B9',
  },
  facilityDescription: {
    color: '#888',
  },
  classItem: {
    marginBottom: 5,
  },
  className: {
    fontWeight: 'bold',
    color: '#2980B9',
  },
  classTime: {
    color: '#888',
  },
  userTarget: {
    marginBottom: 5,
    color: '#2980B9',
  },
  sectionImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  sectionSubtitle: {
    color: 'grey',
    marginTop: 5,
  },
  buyNowButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:45,
  },
  buyNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  bookNowButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:45,
  },
  bookNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ownNowButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:45,
  },
  ownNowText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bmiCalculatorContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 50,
  },
  bmiHeader: {
    marginBottom: 20,
  },
  bmiHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bmiHeaderSubtitle: {
    fontSize: 16,
    color: 'grey',
  },
  bmiForm: {
    marginBottom: 20,
  },
  bmiRadio: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  bmiRadioOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginRight:3,
  },
  bmiRadioOptionSelected: {
    backgroundColor: 'lightgrey',
    color:'white'
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  calculateButton: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calculateButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bmiResult: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    padding: 10,
  },
  obeseStatus: {
    color: 'red',
    textDecorationLine: 'underline',
  },
  normalStatus: {
    color: 'green',
    textDecorationLine: 'underline',
  },
  underweightStatus: {
    color: 'red',
    textDecorationLine: 'underline',
  },
});

export default DashboardScreen;