import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
const { View, Text, StyleSheet, ScrollView, TextInput,Button,  TouchableOpacity, TouchableHighlight, Alert } = require('react-native');


const EditBranchScreen = ({route,navigation}) => {
    const { branch } = route.params;
    const [branchimages,setBranchimages]=useState([require('../../assets/branch1.jpg'),require('../../assets/branch20.jpeg'),require('../../assets/own10.jpg')])
    const navigateBack = () =>{
        navigation.navigate('BranchDetailScreen', { branch });
    }
    const [branchName,setBranchName]=useState(branch.name)
    const [branchLocation,setBranchLocation]=useState(branch.location)
    const [phone,setPhone]=useState(branch.phoneNumber)
    const [toNavigate,setToNavigate]=useState([])
    useEffect(()=>{
        if (toNavigate.length == 2 ) {
            let to=toNavigate[0]
            let br=toNavigate[1]
            navigation.navigate(to, { br });
        }
    },[toNavigate])
    const SaveBranch = () =>{
        // // here we need to submit the branch details back to the server for savings.
        // console.log(`Saving Branch of name ${branchName}`)
        // console.log(branchName)
        fetch(`http://146.190.32.150:5000/save_branch_information?name=${branchName}&location=${branchLocation}&phone=${phone}&id=${branch._id}`)
        .then(res =>{
            if (res.status == 200){
               return res.json()
            }else{
                return {}
            }
        })
        .then(res => {
            console.log("We Recieved ")
            console.log(res)
            // let branch2=JSON.parse(JSON.stringify(branch))
            branch['name']=branchName
            branch['phoneNumber']=phone
            branch['location']=branchLocation
            navigation.navigate('BranchDetailScreen', { branch });
            // setToNavigate(['BranchDetailScreen',branch2])
            
        })
        .catch(err=>{
            Alert.alert('Err',err);
        })
    }

    // Here We need to open just a form to view and edit the gym branch in question.
    // what needs to be edited is
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Editing Branch {branchName}</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} placeholder='Branch Name' defaultValue={branch.name} onChangeText={val => setBranchName(val)} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Location</Text>
                    <TextInput style={styles.input} placeholder='Branch Location' defaultValue={branch.location} onChangeText={val => setBranchLocation(val)} />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone No.</Text>
                    <TextInput style={styles.input} placeholder='Branch Phone Number' defaultValue={branch.phoneNumber} onChangeText={val => setPhone(val)} />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={SaveBranch} style={styles.button}>
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateBack} style={styles.button}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    label: {
        color: '#ccc',
        fontSize: 18,
        marginBottom: 5,
    },
    input: {
        width: '100%',
        height: 40,
        backgroundColor: '#333',
        borderRadius: 5,
        paddingHorizontal: 10,
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        backgroundColor: '#111',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default EditBranchScreen;
