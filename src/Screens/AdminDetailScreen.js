import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import { IP_ADDRESS } from "../../config";
import moment from 'moment-timezone';
const {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
} = require("react-native");

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const AdminDetailScreen = ({ route, navigation }) => {
  const { refresh } = route.params || Math.floor(Math.random() * 1000);
  const { admin } = route.params;
  console.log(`Admin => ${JSON.stringify(admin)}`);
  const navigateBack = () => {
    navigation.navigate("ManageAdminsScreen");
  };
  const [branchName, setBranchName] = useState();
  const [branchLocation, setBranchLocation] = useState();

  const [selectedBranch, setSelectedBranch] = useState(admin.branch);
  const [branches, setBranches] = useState([]);
  const [email, setEmail] = useState(admin.email);
  const [name, setName] = useState(admin.name);
  const [phone, setPhone] = useState(admin.phone);
  const [password, setPassword] = useState(admin.password);
  const [info, setInfo] = useState(admin.info);

  useEffect(() => {
    fetch(`${IP_ADDRESS}/branches_for_super_admin`)
      .then((res) => {
        if (res.status == 200) {
          return res.json();
        } else {
          return [];
        }
      })
      .then((res) => {
        setBranches(res);
      })
      .catch((err) => {
        Alert.alert("error", err);
      });
  }, [refresh]);

  useEffect(() => {
    branches.map(((branch) => {
      if (branch.branchID == admin.branch) {
        setBranchName(branch.name);
      }
    }))
  }, [branches])


  const SaveBranch = () => {
    // Detect the admin's time zone
    const timeZone = moment.tz.guess(); // Automatically detects the admin's time zone
    console.log("Detected Timezone:", timeZone);

    // Validate input fields
    if (!validateEmail(email)) {
      Alert.alert("E-Mail", "Invalid E-Mail");
    } else if (password.trim().length < 6) {
      Alert.alert("Password", "Password Should be at least 6 Characters");
    } else if (selectedBranch == null) {
      Alert.alert("Branch", "Branch Must Be Selected");
    } else {
      // Make the API request, including the timeZone in the URL
      fetch(
        `${IP_ADDRESS}/update_admin_user?id=${admin._id}&name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}&timezone=${encodeURIComponent(timeZone)}`
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            return undefined;
          }
        })
        .then((res) => {
          if (res === undefined) {
            Alert.alert("Update", "Error Updating Admin User");
          } else {
            console.log("We Received ", res);
            navigation.navigate("ManageAdminsScreen", {
              refresh: Math.floor(Math.random() * 1000),
            });
          }
        })
        .catch((err) => {
          Alert.alert("Err", err.toString());
        });
    }
  };



  // const SaveBranch = () => {
  //   if (!validateEmail(email)) {
  //     Alert.alert("E-Mail", "Invalid E-Mail");
  //   } else if (password.trim().length < 6) {
  //     Alert.alert("Password", "Password Should be at least 6 Characters");
  //   } else if (selectedBranch == null) {
  //     Alert.alert("Branch", "Branch Must Be Selected");
  //   } else {
  //     fetch(
  //       `${IP_ADDRESS}/update_admin_user?id=${admin._id}&name=${name}&phone=${phone}&email=${email}&password=${password}&info=${info}&branch=${selectedBranch}`
  //     )
  //       .then((res) => {
  //         if (res.status == 200) {
  //           return res.json();
  //         } else {
  //           return undefined;
  //         }
  //       })
  //       .then((res) => {
  //         if (res == undefined) {
  //           Alert.alert("Update", "Error Updating Admin User");
  //         } else {
  //           console.log("We Recieved ");
  //           console.log(res);
  //           navigation.navigate("ManageAdminsScreen", {
  //             refresh: Math.floor(Math.random() * 1000),
  //           });
  //         }

  //         // setToNavigate(['BranchDetailScreen',branch2])
  //       })
  //       .catch((err) => {
  //         Alert.alert("Err", err);
  //       });
  //   }
  // };
  return (
    <View style={{ backgroundColor: 'black', flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Video
        source={require('../../assets/E8Gymvideo.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={true}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.videoBackground}
       /> */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}> Editing Admin </Text>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#fff',
            textAlign: 'center'
          }}>{branchName}</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Admin Name"
              defaultValue={name}
              onChangeText={(val) => setName(val)}
              placeholderTextColor="#777"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Info</Text>
            <TextInput
              style={styles.input}
              defaultValue={info}
              placeholder="Admin Info"
              onChangeText={(val) => setInfo(val)}
              placeholderTextColor="#777"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              defaultValue={email}
              placeholder="Admin Email"
              onChangeText={(val) => setEmail(val)}
              placeholderTextColor="#777"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              defaultValue={password}
              placeholder="Admin Password"
              onChangeText={(val) => setPassword(val)}
              placeholderTextColor="#777"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone No.</Text>
            <TextInput
              style={styles.input}
              defaultValue={phone}
              placeholder="Admin Phone Number"
              onChangeText={(val) => setPhone(val)}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Branch</Text>
            <Picker
              selectedValue={selectedBranch}
              onValueChange={(itemValue, itemIndex) => setSelectedBranch(itemValue)}
              style={styles.input}>
              <Picker.Item label="Select Branch" value={null} />
              {branches.map((branch) => (
                <Picker.Item
                  key={branch.branchID}
                  label={branch.name}
                  value={branch.branchID}
                  selected={branch.branchID === admin.branchID}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={SaveBranch} style={styles.button}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.button, backgroundColor: '#444' }}
              onPress={navigateBack}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView></View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    backgroundColor: 'black',
  },
  formContainer: {
    width: '80%',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    marginBottom: 150,
    marginTop: 40,
    alignSelf: 'center',
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ccc',
  },
  input: {
    height: 40,
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#eee',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#343333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
});
export default AdminDetailScreen;
