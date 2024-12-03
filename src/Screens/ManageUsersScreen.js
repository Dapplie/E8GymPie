import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { IP_ADDRESS } from "../../config";


const ManageUsersScreen = ({ route, navigation }) => {
    const [users, setUsers] = useState([]);
    const [sError, setSError] = useState("")
    const colors = ['#000', '#111']; // Darker background for better readability
    useEffect(() => {
        fetch(`${IP_ADDRESS}/AllUsers`)
            .then(res => res.json())
            .then(res => {
                console.log(res)
                console.warn(res);
                setUsers(res["users"])
            })
            .catch(err => {
                setSError(err)
            })
    }, [])


    const generateUsersPdf = async () => {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body { font-family: 'Arial', sans-serif; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>E8 Gym Users Report</h1>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Classes</th>
                        </tr>
                        ${users.map(user => `
                            <tr>
                                <td>${user.fullName}</td>
                                <td>${user.email}</td>
                                <td>${user.phoneNumber}</td>
                                <td>${user.result.map(cls => cls.className).join(', ')}</td>
                            </tr>
                        `).join('')}
                    </table>
                </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        const downloadPath = `${FileSystem.documentDirectory}E8Gym_Users_Report.pdf`;
        await FileSystem.moveAsync({ from: uri, to: downloadPath });

        FileSystem.getContentUriAsync(downloadPath).then(contentUri => {
            IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                data: contentUri,
                flags: 1,
            });
        });

        console.log('PDF downloaded to:', downloadPath);
    };



    return (
        <LinearGradient colors={colors} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 }}>
                    Users
                </Text>
                <TouchableOpacity onPress={generateUsersPdf} style={{
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <Text style={{
                        color: 'red',
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>Download Users PDF</Text>
                </TouchableOpacity>

                {users.length === 0 ? (
                    <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
                        <ActivityIndicator size="large" color="white" />
                    </Text>
                ) : null}

                {users.map((value, index) => (
                    <View key={index} style={{ backgroundColor: '#222', borderRadius: 10, marginBottom: 20, padding: 10, width: '90%' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <FontAwesomeIcon icon={faUserCircle} size={50} color="lightgray" />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{ fontSize: 16, color: '#fff' }}>
                                    Name: {value["fullName"]}
                                </Text>
                                <Text style={{ fontSize: 16, color: '#fff' }}>
                                    Phone: {value["phoneNumber"]}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 16, color: '#fff' }}>
                            E-Mail: {value["email"]}
                        </Text>
                        {value["result"].length > 0 && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Classes:</Text>
                                {value["result"].map((val, idx) => (
                                    <View key={idx} style={{ marginLeft: 20 }}>
                                        <Text style={{ fontSize: 16, color: '#fff' }}>- {val['className']}</Text>
                                        {val['Class'].length > 0 && (
                                            <Text style={{ fontSize: 16, color: '#fff' }}>
                                                Every {val['Class'][0]['days']} @ {new Date(val['classTime']).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                })}
                                            </Text>
                                        )}
                                    </View>
                                ))}

                            </View>
                        )}
                    </View>
                ))}

                {sError.length > 0 && (
                    <Text style={{ fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 }}>
                        {sError}
                    </Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

export default ManageUsersScreen;
