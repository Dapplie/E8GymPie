import { faDumbbell, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axios from 'axios';

const ManageAdminsScreen = ({ route, navigation }) => {
  const { refresh } = route.params || Math.floor(Math.random() * 1000);
  const [Admins, setAdmins] = useState([]);
  const [branchimages, setBranchimages] = useState([
    require('../../assets/branch1.jpg'),
    require('../../assets/branch20.jpeg'),
    require('../../assets/own10.jpg'),
  ]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        fetch('http://146.190.32.150:5000/get_admins_list')
          .then((resp) => {
            if (resp.status === 200) {
              return resp.json();
            } else {
              return [];
            }
          })
          .then((res) => {
            setAdmins(res);
          })
          .catch((err) => {
            console.error(err);
          });
      } catch (error) {
        console.error('Error Fetching');
      }
    };
    fetchBranches();
  }, [refresh]);

  const goToBranchDetail = (branch) => {
    console.log(`going to branch ${branch}`);
    console.log(branch);
    navigation.navigate('AdminDetailScreen', { refresh: Math.random(), admin: branch });
  };

  const createNewBranch = () => {
    navigation.navigate('NewAdminScreen');
  };

  const deleteAdmin = (adminId) => {
    axios.post('http://146.190.32.150:5000/delete_admin', { _id: adminId })
      .then((res) => {
        // Handle success, e.g., remove the deleted admin from the state
        console.log(res.data);
        setAdmins(Admins.filter(admin => admin._id !== adminId));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const colors = ['#000', '#000'];

  return (
    <LinearGradient colors={colors} style={styles.container}>
      <ScrollView contentContainerStyle={{ ...styles.content, marginTop: 40, marginBottom: 40 }}>
        <TouchableOpacity style={styles.newAdminButton} onPress={() => createNewBranch()}>
          <Text style={styles.newAdminText}>
            <FontAwesomeIcon icon={faStar} size={16} color="#fff" /> New Admin
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Manage Admins</Text>
        {Admins.map((branch, index) => (
          <TouchableOpacity activeOpacity={0.5} key={index} style={styles.branchCard} onPress={() => goToBranchDetail(branch)}>
            <Image source={branchimages[Math.floor(Math.random() * branchimages.length)]} style={styles.branchImage} />
            <Text style={styles.branchName}>{branch.name}</Text>
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: 'black',
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={() => deleteAdmin(branch._id)}
            >
              <Text style={{ color: 'black', fontWeight: 'bold' }}>Delete Admin</Text>
            </TouchableOpacity>

          </TouchableOpacity>
        ))}
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faDumbbell} size={30} color="#fff" style={{ transform: [{ rotate: '45deg' }] }} />
        </View>
        <LinearGradient colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']} style={styles.fade} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  newAdminButton: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  newAdminText: {
    textAlignVertical: 'top',
    color: '#fff',
    paddingHorizontal: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  branchCard: {
    width: '90%',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderColor: 'lightgray',
    borderWidth: 1,
    elevation: 5,
    position: 'relative',
  },
  branchImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 15,
  },
  branchName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#000',
    borderWidth: 0.6,
    borderColor: 'orange',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconContainer: {
    position: 'absolute',
    top: 78,
    right: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  fade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  deleteButton: {
    // position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderRadius: 5,
    padding: 5,
  },
});

export default ManageAdminsScreen;
