import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { IP_ADDRESS } from '../../config';

const ManageUsersScreenForBranch = ({ route, navigation }) => {
    const branchId = route.params.branch;
    const [users, setUsers] = useState([]);
    const [sError, setSError] = useState('');

    useEffect(() => {
        try {
            fetch(`${IP_ADDRESS}/AllUsersForBranch?bid=${branchId}`)
                .then((res) => {
                    if (res.status === 200) {
                        setSError('');
                        return res.json();
                    }
                    setSError(res.status.toString());
                    return { users: [] };
                })
                .then((res) => {
                    setUsers(res.users);
                })
                .catch((err) => {
                    setUsers([]);
                    console.warn(err.toString());
                });
        } catch (error) {
            setSError(error.toString());
        }
    }, []);

    // const handleDeleteUser = async (_id) => {
    //     try {
    //         await axios.delete('http://146.190.32.150:5000/DeleteUser', {
    //             data: { _id },
    //         });
    //         // Refetch users after deletion
    //         fetch(`http://146.190.32.150:5000/AllUsersForBranch?bid=${branchId}`)
    //             .then((res) => {
    //                 if (res.status === 200) {
    //                     setSError('');
    //                     return res.json();
    //                 }
    //                 setSError(res.status.toString());
    //                 return { users: [] };
    //             })
    //             .then((res) => {
    //                 setUsers(res.users);
    //             })
    //             .catch((err) => {
    //                 setUsers([]);
    //                 console.warn(err.toString());
    //             });
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.heading}>Users</Text>
                {users.length === 0 ? (
                    <ActivityIndicator size="large" color="white" />
                ) : (
                    users.map((value, index) => (
                        <View key={index} style={styles.userContainer}>
                            <FontAwesomeIcon icon={faUserCircle} size={50} color="#ffffff" />
                            <View style={styles.userInfo}>
                                <Text style={styles.userInfoText}>Name: {value.fullName}</Text>
                                <Text style={styles.userInfoText}>Phone: {value.phoneNumber}</Text>
                                <Text style={styles.userInfoText}>Branch: {value.branchName.length > 0 ? value.branchName[0].name : '--'}</Text>
                                {/* <Text style={styles.userInfoText}>Rank: {value.rank || '--'}</Text> */}
                                <Text style={styles.userInfoText}>E-Mail: {value.email}</Text>
                                {/* <TouchableOpacity onPress={() => handleDeleteUser(value._id)} style={styles.deleteButton}>
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
            {sError.length > 0 && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Error: {sError}</Text>
                </View>
            )}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    heading: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 40,
        marginBottom: 20,
        color: '#ffffff',
        textAlign: 'center',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 20,
        padding: 20,
        width: '90%',
        backgroundColor: '#1a1a1a',
    },
    userInfo: {
        marginLeft: 20,
        flex: 1,
    },
    userInfoText: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 10,
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    deleteButton: {
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    deleteButtonText: {
        color: 'black',
        fontWeight:'bold',
        fontStyle:'italic',
        textAlign: 'center',
    },
    errorContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#1a1a1a',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
    },
    errorText: {
        color: 'red',
        textShadowColor: 'rgba(255, 255, 255, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default ManageUsersScreenForBranch;
