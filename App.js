import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import 'react-native-gesture-handler';
import AccountScreen from './src/Screens/AccountScreen';
import AdminDashboardScreen from './src/Screens/AdminDashboardScreen';
import AdminDetailScreen from './src/Screens/AdminDetailScreen';
import AdminLoginScreen from './src/Screens/AdminLoginScreen';
import AnalyticsDashboardScreen from './src/Screens/AnalyticsDashboardScreen';
import AuthScreen from './src/Screens/AuthScreen'; // Correcting the path
import Branch1DashboardScreen from './src/Screens/Branch1DashboardScreen';
import Branch1SpecificScreen from './src/Screens/Branch1SpecificScreen';
import Branch2DashboardScreen from './src/Screens/Branch2DashboardScreen';
import Branch2SpecificScreen from './src/Screens/Branch2SpecificScreen';
import Branch3DashboardScreen from './src/Screens/Branch3DashboardScreen';
import Branch3SpecificScreen from './src/Screens/Branch3SpecificScreen';
import BranchDetailScreen from './src/Screens/BranchDetailScreen';
import { BranchClassScreen } from './src/Screens/BranchDetailScreen';
import BranchSelectionScreen from './src/Screens/BranchSelectionScreen';
import BranchSpecificScreen from './src/Screens/BranchSpecificScreen';
import CheckoutScreen from './src/Screens/CheckoutScreen';
import ClassScheduleScreen from './src/Screens/ClassScheduleScreen';
import ClassSpecsScreen from './src/Screens/ClassSpecsScreen';
import { ClassSpecsScreenSuperAdmin } from './src/Screens/ClassSpecsScreen';
import ContactUs from './src/Screens/ContactUs';
import DashboardScreen from './src/Screens/DashboardScreen'; // Assuming the path is correct
import EShopScreen from './src/Screens/EShopScreen';
import EditBranchScreen from './src/Screens/EditBranchScreen';
import ManageAdminsScreen from './src/Screens/ManageAdminsScreen';
import ManageBranchesScreen from './src/Screens/ManageBranchesScreen';
import ManageUsersScreen from './src/Screens/ManageUsersScreen';
import ManageUsersScreenForBranch from './src/Screens/ManageUsersScreenForBranch';
import NewAdminScreen from './src/Screens/NewAdminScreen';
import NewBranchCreationScreen from './src/Screens/NewBranchCreationScreen';
import OrderPageScreen from './src/Screens/OrderPageScreen';
import OwnNowScreen from './src/Screens/OwnNow';
import PurchaseInfoScreen from './src/Screens/PurchaseInfoScreen';
import SettingsScreen from './src/Screens/SettingsScreen';
import SuperAdminDashboardScreen from './src/Screens/SuperAdminDashboardScreen';
import SuperAdminLoginScreen from './src/Screens/SuperAdminLoginScreen';
import CancelBooking from './src/Screens/MyScreens/CancelBooking'
import AllBranchClasses from './src/Screens/MyScreens/AllBranchClasses'
import RequestToContactUs from './src/Screens/MyScreens/RequestToContactUs'
import BookedClients from './src/Screens/MyScreens/BookedClients'
import EmailVerification from './src/Screens/MyScreens/EmailVerification'

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        <Stack.Screen
          name="CancelBooking"
          component={CancelBooking}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        {/* EmailVerification */}
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerification}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        <Stack.Screen
          name="BookedClients"
          component={BookedClients}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        <Stack.Screen
          name="RequestToContactUs"
          component={RequestToContactUs}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        {/* nonono */}
        <Stack.Screen
          name="AllBranchClasses"
          component={AllBranchClasses}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        <Stack.Screen
          name="ManageUsersScreenForBranch"
          component={ManageUsersScreenForBranch}
          options={{ headerShown: false }} // Hide the header for AuthScreen
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen
          name="ManageUsersScreen"
          component={ManageUsersScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Contact" component={ContactUs}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="OwnNow" component={OwnNowScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="EShop" component={EShopScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="AccountScreen" component={AccountScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="SuperAdminLoginScreen" component={SuperAdminLoginScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="SuperAdminDashboardScreen" component={SuperAdminDashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="ManageBranchesScreen" component={ManageBranchesScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="BranchDetailScreen" component={BranchDetailScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="BranchClassScreen" component={BranchClassScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="AnalyticsDashboardScreen" component={AnalyticsDashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="BranchSelectionScreen" component={BranchSelectionScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="ClassScheduleScreen" component={ClassScheduleScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="AdminLoginScreen" component={AdminLoginScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="AdminDashboardScreen" component={AdminDashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch1DashboardScreen" component={Branch1DashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch1SpecificScreen" component={Branch1SpecificScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch2DashboardScreen" component={Branch2DashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch2SpecificScreen" component={Branch2SpecificScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch3DashboardScreen" component={Branch3DashboardScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="Branch3SpecificScreen" component={Branch3SpecificScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="OrderPageScreen" component={OrderPageScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="PurchaseInfoScreen" component={PurchaseInfoScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="EditBranchScreen" component={EditBranchScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="NewBranchCreationScreen" component={NewBranchCreationScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="ManageAdminsScreen" component={ManageAdminsScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="NewAdminScreen" component={NewAdminScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="AdminDetailScreen" component={AdminDetailScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="BranchSpecificScreen" component={BranchSpecificScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="ClassSpecsScreen" component={ClassSpecsScreen}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
        <Stack.Screen name="ClassSpecsScreenSuperAdmin" component={ClassSpecsScreenSuperAdmin}
          options={{ headerShown: false }} // Hide the header for DashboardScreen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
