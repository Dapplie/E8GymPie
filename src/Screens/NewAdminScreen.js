import { Picker } from '@react-native-picker/picker';
import { Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
const { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, Button, TouchableOpacity, TouchableHighlight, Alert } = require('react-native');


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
const NewAdminScreen = ({ route, navigation }) => {
    const [branchimages, setBranchimages] = useState([require('../../assets/branch1.jpg'), require('../../assets/branch20.jpeg'), require('../../assets/own10.jpg')])
    const { refresh } = route.params || Math.floor(Math.random() * 1000);
    const navigateBack = () => {
        navigation.navigate('ManageAdminsScreen');
    }
    const [branchName, setBranchName] = useState()
    const [branchLocation, setBranchLocation] = useState()

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [branches, setBranches] = useState([]);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [info, setInfo] = useState('');

    useEffect(() => {

        fetch('http://146.190.32.150:5000/branches_for_super_admin')
            .then(res => {
                if (res.status == 200) {
                    return res.json()
                } else {
                    return []
                }
            })
            .then(res => {
                setBranches(res)
            })
            .catch(err => {
                Alert.alert('error', err)
            })
    }, [refresh])
    const SaveBranch = () => {
        let errors = false;
        if (!validateEmail(email)) {
            errors = true;
            Alert.alert("E-Mail", "Invalid E-Mail");
        }
        if (password.trim().length <= 5) {
            errors = true;
            Alert.alert("Password", "Password Should be at least 6 Characters");
        }
        if (selectedBranch == null) {
            errors = true;
            Alert.alert("Branch", "Branch Must Be Selected")
        }
        if (errors == false) {
            fetch(
                `http://146.190.32.150:5000/save_new_admin_user?name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}`
            )
                .then((res) => {
                    if (res.status == 200) {
                        return res.json();
                    } else {
                        return undefined;
                    }
                })
                .then((res) => {
                    if (res == undefined) {
                        Alert.alert("Error Creating New Branch");
                    } else {
                        console.log("We Recieved ");
                        console.log(res);
                        navigation.navigate("ManageAdminsScreen", {
                            refresh: Math.floor(Math.random() * 1000),
                        });
                    }

                    // setToNavigate(['BranchDetailScreen',branch2])
                })
                .catch((err) => {
                    Alert.alert("Err", err);
                });
        }

    }

    // Here We need to open just a form to view and edit the gym branch in question.
    // what needs to be edited is the name, 
    return (
        <View style={styles.container}>
            <Video
                source={require('../../assets/E8Gymvideo.mp4')}
                rate={1.0}
                volume={1.0}
                isMuted={true}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={styles.videoBackground}
            />
            <View style={{ ...styles.formContainer, marginTop: 50 }}>
                <Text style={styles.formTitle}>New Admin {branchName}</Text>
                <ScrollView>
                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Admin Name"
                            onChangeText={(val) => setName(val)}
                        />
                    </View>
                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Info</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Admin Info"
                            onChangeText={(val) => setInfo(val)}
                        />
                    </View>
                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Admin Email"
                            onChangeText={(val) => setEmail(val)}
                        />
                    </View>
                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Admin Password"
                            onChangeText={(val) => setPassword(val)}
                        />
                    </View>
                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Phone No.</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Admin Phone Number"
                            onChangeText={(val) => setPhone(val)}
                        />
                    </View>

                    <View style={styles.flexDisplay}>
                        <Text style={styles.title}>Branch</Text>
                        <View style={styles.dropdown}>
                            <Picker
                                selectedValue={selectedBranch}
                                onValueChange={(itemValue, itemIndex) => {
                                    setSelectedBranch(itemValue)
                                }}
                            >
                                <Picker.Item label="Select Branch" value={null} />
                                {branches.map((branch) => (
                                    <Picker.Item key={branch.branchID} label={branch.name} value={branch.branchID} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.flexDisplay}>
                        <TouchableOpacity
                            onPress={SaveBranch}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateBack}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        padding: 10,
        paddingHorizontal: 20,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    flexDisplay: {
        flexDirection: 'column',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    dropdown: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 5,
    },
    videoBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    button: {
        borderColor: 'white',
        borderWidth: 1,
        backgroundColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: 16,
    },
});

export default NewAdminScreen;