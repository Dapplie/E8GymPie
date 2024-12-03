import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminDashboardScreen = ({ route, navigation }) => {
  const { admin } = route.params;

  const goToBranchSpecificScreen = () => {
    navigation.navigate('BranchSpecificScreen', { branch: admin.branch });
  };

  const ManageUsers = () => {
    navigation.navigate('ManageUsersScreenForBranch', { branch: admin.branch });
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={require('../../assets/admin22.png')} style={styles.backgroundImage}>
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.title}>{admin.name}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={goToBranchSpecificScreen}>
              <Text style={styles.optionText}>Explore Branch</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={ManageUsers}>
              <Text style={styles.optionText}>Manage Users</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  optionsContainer: {
    width: '80%',
    alignItems: 'center',
  },
  option: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
  },
  optionText: {
    fontSize: 24,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

export default AdminDashboardScreen;
