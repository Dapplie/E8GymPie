import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const BranchSelectionScreen = ({ navigation }) => {
  const branches = [
    { id: 1, name: 'Qlayaa', image: require('../../assets/branchAjalt.jpg') },
    { id: 2, name: 'Ajaltoun', image: require('../../assets/branchAjalt.jpg') },
    { id: 3, name: 'Hazmieh', image: require('../../assets/branchAjalt.jpg') }
  ];

  const handleBranchSelect = (branch) => {
    navigation.navigate('ClassScheduleScreen', { branch });
  };

  return (
    <LinearGradient colors={['#0000', '#0000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Select a Branch</Text>
        {branches.map((branch) => (
          <TouchableOpacity
            key={branch.id}
            style={styles.branchCard}
            onPress={() => handleBranchSelect(branch)}
          >
            <Image source={branch.image} style={styles.branchImage} />
            <Text style={styles.branchName}>{branch.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faDumbbell} size={30} color="orange" style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        <LinearGradient colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.8)']} style={styles.fade} />
      </ScrollView>
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
    backgroundColor: 'orange',
    borderWidth: 0.6,
    borderColor: 'orange',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
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
});

export default BranchSelectionScreen;
