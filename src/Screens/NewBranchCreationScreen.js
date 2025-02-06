import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { IP_ADDRESS } from '../../config';
const { View, Text, StyleSheet, ScrollView, TextInput,Button,  TouchableOpacity, TouchableHighlight, Alert } = require('react-native');


const NewBranchCreationScreen = ({route,navigation}) => {
    const [branchimages,setBranchimages]=useState([require('../../assets/branch1.jpg'),require('../../assets/branch20.jpeg'),require('../../assets/branchAjalt.jpg')])
    const navigateBack = () =>{
        navigation.navigate('ManageBranchesScreen');
    }
    const [branchName,setBranchName]=useState()
    const [branchLocation,setBranchLocation]=useState()
    const [phone,setPhone]=useState()
    const [image,setImage]=useState()
    
    const SaveBranch = () =>{
        // // here we need to submit the branch details back to the server for savings.
        // console.log(`Saving Branch of name ${branchName}`)
        // console.log(branchName)
        fetch(`${IP_ADDRESS}/save_new_branch_information?name=${branchName}&location=${branchLocation}&phone=${phone}&image=${image}`)
        .then(res =>{
            if (res.status == 200){
               return res.json()
            }else{
                return undefined
            }
        })
        .then(res => {
          if (res == undefined) {
            Alert.alert("Error Creating New Branch")
          }else {
            console.log("We Recieved ")
            console.log(res)

            // Show success alert
            Alert.alert('Success', 'Branch created successfully.');

            navigation.navigate('ManageBranchesScreen',{refresh:Math.floor(Math.random()*1000)});
          }
            
            // setToNavigate(['BranchDetailScreen',branch2])
            
        })
        .catch(err=>{
            Alert.alert('Err',err);
        })
    }

    // Here We need to open just a form to view and edit the gym branch in question.
    // what needs to be edited is
    return (
        <LinearGradient colors={['black', 'lightgray']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>New Branch</Text>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Branch Name"
                            onChangeText={val => setBranchName(val)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Branch Location"
                            onChangeText={val => setBranchLocation(val)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone No.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Branch Phone Number"
                            onChangeText={val => setPhone(val)}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Image</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Branch Image Link"
                            onChangeText={val => setImage(val)}
                        />
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity onPress={SaveBranch} style={styles.button}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={navigateBack} style={styles.button}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    formContainer: {
      marginTop:110,
        width: '80%',
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: 'white',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        color: 'black',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
        width: '48%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight:'bold',
        fontStyle:'italic',
    },
});

export default NewBranchCreationScreen;
