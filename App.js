import React, {useState, useEffect} from 'react';
import { StripeProvider } from '@stripe/stripe-react-native';
import { KeyboardAvoidingView, Platform, StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen'; // assuming HomeScreen.js is in the same directory
import SeriesScreen from './components/SeriesScreen';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MoviesScreen from './components/MoviesScreen';
import UserScren from './components/UserScreen';






if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firebaseConfig = {
  apiKey: "AIzaSyCom1ZXGJmMqBvQdZSAyeu9kUQaWKT6MwU",
  authDomain: "diarylatest-88632.firebaseapp.com",
  databaseURL: "https://diarylatest-88632.firebaseio.com",
  projectId: "diarylatest-88632",
  storageBucket: "diarylatest-88632.appspot.com",
  messagingSenderId: "866393106718",
  appId: "1:866393106718:android:c01dccdc7a4bc0782ec10f"
};


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const drawerItems = [
  { name: 'Movies', icon: require('./assets/moviesicon.png'), target: 'Home' },
  { name: 'Web Series', icon: require('./assets/webseries.png'), target: 'SeriesScreen' },

];

const CustomDrawerContent = (props) => {

  const [userDetails, setUserDetails] = useState({});
  const [userImage, setUserImage] = useState(require('./assets/defaultimg.png'));

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            const userData = documentSnapshot.data();
            setUserDetails(userData);
            if (userData.imageUri) {
              setUserImage({ uri: userData.imageUri });
            }
          }
        });
    }
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User signed out!');
        props.navigation.navigate('SIGN IN');
      });
  };
  return (
    <View style={styles.container}>
    {/* User Details */}
    <TouchableOpacity onPress={() => props.navigation.navigate('UserScreen')} style={styles.userContainer}>
      <Image  source={require('./assets/userimgnew.png')} style={styles.userImage} />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userDetails.firstName} {userDetails.lastName}</Text>
        <Text style={styles.userEmail}>{auth().currentUser.email}</Text>
      </View>
    </TouchableOpacity>
    {/* Drawer Items */}
    <View style={styles.drawerItemsContainer}>
      {drawerItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate(item.target)}
        >
          <Image source={item.icon} style={styles.drawerItemIcon} />
          <Text style={styles.drawerItemText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>

    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Image source={require('./assets/logout.png')} style={styles.logoutIcon} />
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
    <View style={styles.footer}>
  <Text style={styles.footerText}>Created by Yogesh Tripathi</Text>
  <Text style={styles.footerText2}>Email: yogeshtripathi058@gmai.com</Text>
  <Text style={styles.footerText3}>Contact: +91 7985058785</Text>
</View>
  </View>
  );
};

const HomeNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="HomeDrawer" drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="HomeDrawer" component={HomeScreen} options={{ headerShown: false }}  />
    </Drawer.Navigator>
  );
};


const App = () => {
  return (
    <StripeProvider publishableKey="pk_test_51OqamVSB1jj7UmQH74b8HRVXyi0PzMYagOzjgqOV4VMbDk2kTUqPIQNMlF0VnbAp2BelmyqJHj3WmEu5ApuQGUSS00EGoeN730">
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'margin' : 'height'}
    style={{ flex: 15 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
  >  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SIGN IN">
        <Stack.Screen name="SIGN IN" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SIGN UP" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MoviesScreen" component={MoviesScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="UserScreen" component={UserScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="SeriesScreen" component={SeriesScreen}  options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
    </KeyboardAvoidingView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1321',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 19,
    color: '#E0E1DD',
  },
  userEmail: {
    fontSize: 11,
    color: 'gray',
  },
  drawerItemsContainer: {
    marginVertical: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 10,
  },
  drawerItemIcon: {
    width: 21,
    height: 21,
    marginRight: 15,
    marginLeft: 12,
    tintColor: '#E0E1DD',
  },
  drawerItemText: {
    fontSize: 15,
    color: '#E0E1DD',
  },
  logoutButton: {
    position: 'absolute',
    bottom: '15%',
    left: 0,
    right: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  logoutIcon: {
    width: 20,
    height: 18,
    marginRight: 10,
    tintColor: '#E0E1DD',
  },
  logoutText: {
    fontSize: 15,
    color: '#E0E1DD',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#0D1321', // same as container background
    padding: 10, // add some padding
  },
  
  footerText: {
    color: '#FFFFFF',
    fontSize: 16, // increase font size
    fontWeight: 'bold', // make it bold
  },
  
  footerText2: {
    color: '#FFFFFF',
    fontSize: 12, // slightly smaller font size
  },
  
  footerText3: {
    color: '#FFFFFF',
    fontSize: 12, // slightly smaller font size
  },
  
});

export default App;
