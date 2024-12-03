import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../Screens/Header';
import Carousel from 'react-native-snap-carousel';
import OwnNowForm from '../components/OwnNowForm';

interface OwnNowScreenProps {
  style?: StyleProp<ViewStyle>;
}

const OwnNowScreen: React.FC<OwnNowScreenProps> = ({ style }) => {
  const images = [
    { source: require('../../assets/branchAjalt.jpg'), initialText: 'Minimal Space Required', pressedText: 'You can launch your own E8 gym in a space ranging from 100 to 200 square meters only!' },
    { source: require('../../assets/own20.jpg'), initialText: 'Low Investment with Quick ROI', pressedText: 'Only with a small investment that covers everything from gym decoration and civil work to flooring, top-notch equipment, access to E8 gym extensive workout database, application, and website, high-quality TVs, a superior sound system, and full support from the E8 team for a successful launch. Including access to E8 application, and website.' },
    { source: require('../../assets/book2.jpeg'), initialText: 'Lack of Competition', pressedText: 'Stand out in the fitness industry with a fresh, innovative concept that offers something unique and unmatched by competitors. E8 gym' },
    { source: require('../../assets/own40.jpeg'), initialText: 'Huge Database With Thousands Of Workouts', pressedText: 'Gain access to all E8 workout database, day by day all over the year, through E8 application, that includes thousands of workouts engineered by Professional athletes, something that will make you stand out in the gyms industry.' },
    { source: require('../../assets/own50.jpeg'), initialText: 'Worlds Best Quality Equipment', pressedText: 'Investmentpeice includes  all range of E8 equipment, including strength and cardio equipment, manufactured exclusively for E8 with highest quality worldwide.' },
    { source: require('../../assets/own60.jpeg'), initialText: 'Wide Range Of Customers', pressedText: 'E8 Gym welcomes a diverse range of customers, from fitness beginners to seasoned athletes, and all Age Groups, providing a training environment for everyone.' }
  ];

  const [pressedIndex, setPressedIndex] = useState(0);
  const [showOwnNowForm, setShowOwnNowForm] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPressedIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderImage = ({ item, index }: { item: any, index: number }) => (
    <View style={styles.imageContainer}>
      <Image source={item.source} style={styles.image} />
      <Text style={styles.initialText}>{item.initialText}</Text>
      <Text style={styles.pressedText}>{item.pressedText}</Text>
    </View>
  );

  const handleOwnNowPress = () => {
    setShowOwnNowForm(true);
  };

  return (
    <View>
      <ScrollView contentContainerStyle={[styles.container, style]}>
        <Header title="" />
        <Text style={styles.heading}>Reason To Choose E8 Gym Franchise</Text>
        <View style={styles.divider} />
        {!showOwnNowForm && (
          <View style={{ height: 600 }}>
            <Carousel
              data={images}
              renderItem={renderImage}
              sliderWidth={300}
              itemWidth={300}
              loop
              autoplay={false}
            />
          </View>
        )}
        {!showOwnNowForm && (
          <TouchableOpacity style={styles.ownNowButton} onPress={handleOwnNowPress}>
            <Text style={styles.ownNowButtonText}>Own Now</Text>
          </TouchableOpacity>
        )}
        {showOwnNowForm && <OwnNowForm onClose={() => setShowOwnNowForm(false)} />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  initialText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  pressedText: {
    position: 'absolute',
    top: 310,
    left: 10,
    right: 10,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  ownNowButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginTop: 20,
  },
  ownNowButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
});

export default OwnNowScreen;
