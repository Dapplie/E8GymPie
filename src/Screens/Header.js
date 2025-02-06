import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Header = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigateToContactUs = () => {
    navigation.navigate('Contact');
    closeMenu(); // Close the menu after navigating
  };

  const navigateToAccountScreen = () => {
    navigation.navigate('AccountScreen');
    closeMenu(); // Close the menu after navigating
  };

  const navigateToSettingsScreen = () => {
    navigation.navigate('SettingsScreen');
    closeMenu(); // Close the menu after navigating
  };

  const navigateToPurchaseInfoScreen = () => {
    navigation.navigate('PurchaseInfoScreen');
    closeMenu(); // Close the menu after navigating
  };

  const handleSignOut = () => {
    // Implement your sign out logic here
    // For example, clearing user data, navigating to sign-in screen, etc.
    // For demonstration, let's just navigate to the sign-in screen
    navigation.navigate('Auth');
    closeMenu(); // Close the menu after signing out
  };

  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo_1.png')}
          style={[styles.logo, styles.logoBackground]}
          resizeMode="contain"
        />
      </View> 
      <TouchableOpacity onPress={toggleMenu}>
        <Image
          source={require('../../assets/burger-bar2.png')}
          style={[styles.burgerIcon]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {isMenuOpen && (
        <View style={[styles.menu, styles.absolutePosition]}>
          <TouchableOpacity style={styles.closeIconContainer} onPress={closeMenu}>
            <Image
              source={require('../../assets/close.png')}
              style={[styles.closeIcon]}  // , styles.whiteBorder
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToAccountScreen}>
            <View style={styles.userIconContainer}>
              <Text style={[styles.menuText, styles.whiteText]}>Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToContactUs}>
            <View style={styles.settingsIconContainer}>
              <Text style={[styles.menuText, styles.whiteText]}>Contact Us</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToSettingsScreen}>
            <View style={styles.settingsIconContainer}>
              <Text style={[styles.menuText, styles.whiteText]}>Settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <View style={styles.settingsIconContainer}>
              <Text style={[styles.menuText, styles.whiteText]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  burgerIcon: {
    width: 40,
    height: 40,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: '95%',
    height: 80,
  },
  logoBackground: {
    backgroundColor: 'white',
  },
  menu: {
    position: 'absolute',
    top: 68,
    right: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 20,
    zIndex: 1,
    elevation: 3,
  },
  closeIconContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  closeIcon: {
    width: 20,
    height: 20,
  },
  menuItem: {
    marginBottom: 20,
  },
  menuText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
  },
  userIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 20,
    height: 20,
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: 'white',
  },
  whiteText: {
    color: 'white',
  },
  absolutePosition: {
    position: 'absolute',
  },
});

export default Header;
