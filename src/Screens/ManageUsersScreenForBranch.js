import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { IP_ADDRESS } from '../../config';

const ManageUsersScreenForBranch = ({ route }) => {
    const branchId = route.params.branch;
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sError, setSError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        fetch(`${IP_ADDRESS}/AllUsersForBranch?bid=${branchId}`)
            .then((res) => {
                if (res.status === 200) {
                    setSError('');
                    return res.json();
                }
                setSError(`Error ${res.status}`);
                return { users: [] };
            })
            .then((res) => {
                if (Array.isArray(res.users) && res.users.length > 0) {
                    setUsers(res.users);
                } else {
                    setUsers([]); // No valid users found
                }
            })
            .catch((err) => {
                setSError(err.toString());
                setUsers([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [branchId]);

    return (
        <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.heading}>Users</Text>
                {isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                ) : users.length === 0 ? (
                    <Text style={styles.noUsersText}>There are no users for this branch!</Text>
                ) : (
                    users.map((value, index) => (
                        <View key={index} style={styles.userContainer}>
                            <FontAwesomeIcon icon={faUserCircle} size={50} color="#ffffff" />
                            <View style={styles.userInfo}>
                                <Text style={styles.userInfoText}>Name: {value.fullName}</Text>
                                <Text style={styles.userInfoText}>Phone: {value.phoneNumber}</Text>
                                <Text style={styles.userInfoText}>
                                    Branch: {value.branchName?.[0]?.name || '--'}
                                </Text>
                                <Text style={styles.userInfoText}>E-Mail: {value.email}</Text>
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
    noUsersText: {
        fontSize: 18,
        color: '#ffffff',
        textAlign: 'center',
        marginVertical: 20,
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
