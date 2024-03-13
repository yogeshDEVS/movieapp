import React,{useEffect, useState, } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert,  } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native'; 
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-community/google-signin';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import messaging from '@react-native-firebase/messaging';


import PhoneInput from 'react-native-phone-input';


  // Define the getToken function
  async function getToken() {
    const token = await messaging().getToken();
    console.log('FCM token:', token);
    return token;
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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const { width, height } = Dimensions.get('window');

const SignupScreen = () => {



  
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const handleSignup = async () => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      console.log('User account created & signed in!');
      navigation.navigate('Home');
  
      // Generate the FCM token
      const fcmToken = await getToken();
  
      // Parse and format the phone number
      const parsedPhoneNumber = parsePhoneNumberFromString(phoneNumber, 'IN'); // replace 'IN' with the user's country code
      const formattedPhoneNumber = parsedPhoneNumber ? parsedPhoneNumber.formatInternational() : '';
  
      await firestore().collection('users').doc(userCredential.user.uid).set({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: formattedPhoneNumber, // store the formatted phone number
        fcmToken: fcmToken, 
      });
      console.log('User added to Firestore');
    } catch (error) {
      let errorMessage = '';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'That email address is already in use!';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'That email address is invalid!';
      } else {
        errorMessage = error.message;
      }
      Alert.alert(
        'Signup Error',
        errorMessage,
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        {cancelable: false}
      );
    }
  };
  
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '866393106718-d6jnu20phmnl13re37mldai1f1oin3mf.apps.googleusercontent.com', 
    });
  }, []);
  

  const handleGoogleSignup = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); 
      const { idToken, user } = await GoogleSignin.signIn(); // Destructure user directly from userInfo
      // Create a new user on Firebase
      const firebaseUserCredential = await auth().signInWithCredential(
        auth.GoogleAuthProvider.credential(idToken) // Pass idToken directly
      );
      firestore().collection('users').doc(firebaseUserCredential.user.uid).set({
        firstName: user.givenName,
        lastName: '', // Google Sign-In does not provide separate first and last names
        email: user.email,
        profile_picture: user.photo // Save the user's profile picture URL to Firestore
      }).then(() => {
        console.log('User added to Firestore');
        console.log(`User ${user.email} has signed in`);
        navigation.navigate('Home'); // Navigate to Home screen
      });
    } catch (error) {
      console.log('Error during sign-in:', error);
    }
  };

  
  
  
  

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>SIGN UP</Text>
      </View>
      <Text style={styles.greeting}>Welcome to the SkyRocket Movies</Text>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/user.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor='gray'
          
        />
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/user.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor='gray'
        />
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/email.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor='gray'
        />
      </View>
      <View style={styles.inputContainer}>
        <Image source={require('../assets/lock.png')} style={styles.icon} />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor='gray'
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
  <Image source={require('../assets/iphone.png')} style={styles.icon} />
  <PhoneInput
  style={styles.input}
  ref={(ref) => {
    this.phone = ref;
  }}
  initialCountry='in' // Set the initial country to India
  onPressFlag={() => {}} // Disable changing the country
  textProps={{ 
    placeholder: 'Enter phone number', 
    placeholderTextColor: '#FFFFFF', // Change this to white
    color: '#FFFFFF', // Change this to white
  }}
  onChangePhoneNumber={setPhoneNumber} 
/>


</View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSignup}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
     
      <Text style={styles.or}>Or continue with Google</Text>
      <View style={styles.socialIcons}>
      <TouchableOpacity onPress={handleGoogleSignup}>
        <Image source={require('../assets/google.png')} style={styles.icon1} />
      </TouchableOpacity>
       
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#0D1321', // Change the background color to dark blue
  },
  greeting: {
    fontSize: width * 0.06,
    marginBottom: height * 0.035,
    marginTop: height * 0.065,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#E0E1DD', // Change the text color to off-white
  },
  headerTitle: {
    fontSize: width * 0.042,
    alignSelf:'center',
    color: '#E0E1DD', // Change the text color to off-white
  },
  fieldTitle: {
    fontSize: width * 0.04,
    marginBottom: height * 0.005,
    color: '#A9A9A9',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingLeft: width * 0.025,
    marginBottom: height * 0.03,
    alignItems: 'center',
    borderBottomWidth: 1, // Add a bottom border
    borderBottomColor: '#A9A9A9', // Set the bottom border color
    backgroundColor: 'transparent', // Remove the background color
    borderRadius: 0, // Remove the border radius
    justifyContent:'space-evenly',
    shadowColor: 'transparent', // Remove the shadow
  },
  icon: {
    width: width * 0.044,
    height: height * 0.023,
    marginRight: width * 0.025,
  },
  input: {
    flex: 1,
    height: height * 0.055,
    paddingLeft: width * 0.025,
    color:'white'
  },
  submitButton: {
    backgroundColor: '#3CBBB1', // Change the button color to teal
    padding: height * 0.0125,
    alignItems: 'center',
    marginBottom: height * 0.01,
    borderRadius: 23,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitText: {
    color: 'white',
    fontSize: width * 0.045,
  },
  terms: {
    fontSize: width * 0.0345,
    color: '#A9A9A9',
    textAlign: 'center',
    marginBottom: height * 0.02,
    marginTop: height * 0.007,
  },
  or: {
    fontSize: width * 0.042,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: height * 0.0001,
    marginTop: height * 0.02,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the icons
    marginTop: height * 0.03,
  },
  icon1: {
    width: width * 0.075,
    height: height * 0.03,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: height * 0.02,
    color:'white',
  },
});

export default SignupScreen;
