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
    const [sError, setSError] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const colors = ['#000', '#111']; // Darker background for better readability
  
useEffect(() => {
fetch(`${IP_ADDRESS}/AllUsers`)
    .then((res) => res.json())
    .then((res) => {
    console.log(res);
    setUsers(res['users']);
    })
    .catch((err) => {
    console.error(err);
    setSError('Failed to fetch users. Please try again later.');
    })
    .finally(() => setLoading(false)); // Set loading to false once fetching is complete
}, []);

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
        ${users
            .map(
            (user) => `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.result.map((cls) => cls.className).join(', ')}</td>
            </tr>
            `
            )
            .join('')}
        </table>
    </body>
    </html>
`;

const { uri } = await Print.printToFileAsync({ html: htmlContent });
const downloadPath = `${FileSystem.documentDirectory}E8Gym_Users_Report.pdf`;
await FileSystem.moveAsync({ from: uri, to: downloadPath });

FileSystem.getContentUriAsync(downloadPath).then((contentUri) => {
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
    <TouchableOpacity
        onPress={generateUsersPdf}
        style={{
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        }}
    >
        <Text
        style={{
            color: 'red',
            textAlign: 'center',
            fontWeight: 'bold',
        }}
        >
        Download Users PDF
        </Text>
    </TouchableOpacity>

    {/* Show ActivityIndicator while loading */}
    {loading && <ActivityIndicator size="large" color="white" style={{ marginVertical: 20 }} />}

    {/* Show message if no users found after loading */}
    {!loading && users.length === 0 && (
        <Text style={{ fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 20 }}>
        There are no users.
        </Text>
    )}

    {/* Render user cards if users exist */}
    {users.map((value, index) => (
        <View
        key={index}
        style={{
            backgroundColor: '#222',
            borderRadius: 10,
            marginBottom: 20,
            padding: 10,
            width: '90%',
        }}
        >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <FontAwesomeIcon icon={faUserCircle} size={50} color="lightgray" />
            <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: '#fff' }}>Name: {value['fullName']}</Text>
            <Text style={{ fontSize: 16, color: '#fff' }}>Phone: {value['phoneNumber']}</Text>
            </View>
        </View>
        <Text style={{ fontSize: 16, color: '#fff' }}>E-Mail: {value['email']}</Text>
        {value['result'].length > 0 && (
            <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>Classes:</Text>
            {value['result'].map((val, idx) => (
                <View key={idx} style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, color: '#fff' }}>- {val['className']}</Text>
                {val['Class'].length > 0 && (
                    <Text style={{ fontSize: 16, color: '#fff' }}>
                    Every {val['Class'][0]['days']} @ {val['classTime']}
                    </Text>
                )}
                </View>
            ))}
            </View>
        )}
        </View>
    ))}

    {/* Show error if fetching failed */}
    {sError.length > 0 && (
        <Text style={{ fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 }}>
        {sError}
        </Text>
    )}
    </ScrollView>
</LinearGradient>
);
};

export default ManageUsersScreen;
