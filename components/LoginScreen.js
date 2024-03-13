import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin } from '@react-native-community/google-signin';



if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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

const LoginScreen = () => {
  const navigation = useNavigation(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert(
        'Fields Empty',
        'Please fill in the email and password fields',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')}
        ],
        {cancelable: false}
      );
    } else {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User signed in!');
          navigation.navigate('Home');
        })
        .catch(error => {
          let errorMessage = '';
          if (error.code === 'auth/user-not-found') {
            errorMessage = 'No user found with this email address!';
          } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Wrong password!';
          } else {
            errorMessage = error.message;
          }
          Alert.alert(
            'Login Error',
            errorMessage,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed')}
            ],
            {cancelable: false}
          );
        });
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '866393106718-d6jnu20phmnl13re37mldai1f1oin3mf.apps.googleusercontent.com', 
    });
  }, []);
  
  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn(); // Destructure idToken directly from userInfo
  
      // Sign in the user on Firebase
      const firebaseUserCredential = await auth().signInWithCredential(
        auth.GoogleAuthProvider.credential(idToken) // Pass idToken directly
      );
  
      console.log(`User ${firebaseUserCredential.user.email} has signed in`);
      navigation.navigate('Home'); // Navigate to Home screen
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('User does not exist. Please sign up.');
      } else {
        console.log('Error during sign-in:', error);
      }
    }
  };
  
  
  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Text style={styles.headerTitle}>SIGN IN</Text>
      </View>
          <View style={styles.contentContainer}>
          <View style={styles.IntialContainer}>
      <Text style={styles.greeting}>Welcome to FlixPhantom</Text>
      <Text style={styles.subheading}>Please sign in with your account</Text>
      </View>
      <Text style={styles.fieldTitle}>Email</Text>
      <View style={styles.inputContainer}>
      <TextInput
  style={styles.input}
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  placeholderTextColor='gray'
/>

  <Image source={require('../assets/maillogin.png')} style={styles.icon} />
</View>
<Text style={styles.fieldTitle}>Password</Text>
<View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    value={password}
    onChangeText={setPassword}
    placeholder="Enter your password"
    secureTextEntry={hidePassword}
    placeholderTextColor='gray'
  />
 
  <TouchableOpacity onPress={() => setHidePassword(!hidePassword)} style={styles.eyeIcon}>
    <Image source={require('../assets/eye-slash.png')} />
  </TouchableOpacity>
</View>

      <TouchableOpacity onPress={() => {}}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      </View>
      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>
      <Text style={styles.or}>Or continue with Google</Text>
    <View style={styles.socialIcons}>
      <TouchableOpacity onPress={handleGoogleSignin}>
        <Image source={require('../assets/google.png')} style={styles.icon1} />
      </TouchableOpacity>
    </View>
    <View style={styles.createAccountContainer}>
      <Text style={styles.createAccount}>Don't have an account?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('SIGN UP')}>
        <Text style={styles.createAccountLink}> Create Account</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1321',
    paddingHorizontal: width * 0.05, // 5% of screen width
    paddingTop: height * 0.05, // 5% of screen height
  },
  header: {
    marginBottom: height * 0.05, // 5% of screen height
  },
  headerTitle: {
    color: '#E0E1DD',
    fontSize: width * 0.08, // 8% of screen width
    fontWeight: '700',
  },
  contentContainer: {
    flex: 1,
    marginTop: height * 0.02, // 2% of screen height
  },
 
  greeting: {
    color: '#E0E1DD',
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: '700',
  },
  subheading: {
    color: '#E0E1DD',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '400',
    marginBottom: height * 0.02, // 2% of screen height
    alignSelf: 'flex-start',
    marginLeft:  width * 0.04,
    marginTop: height * 0.015, 
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E1DD',
    marginBottom: height * 0.02, // 2% of screen height
  },
  input: {
    flex: 1,
    color: '#E0E1DD',
    fontSize: width * 0.04, // 4% of screen width
    placeholderTextColor: 'gray',
    
  },
  icon: {
    marginLeft: width * 0.02, // 2% of screen width
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#E0E1DD',
    fontSize: width * 0.034, // 4% of screen width
    fontWeight: '500',
    marginBottom: height * 0.02, // 2% of screen height
  },
  signInButton: {
    backgroundColor: '#3CBBB1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.015, // 1.5% of screen height
    marginBottom: height * 0.085, // 3% of screen height
  },
  signInText: {
    color: '#E0E1DD',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
  },
  or: {
    color: '#E0E1DD',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: height * 0.03, // 1% of screen height
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.029, // 2% of screen height
  },
  icon1: {
    marginHorizontal: width * 0.02, // 2% of screen width
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.025, // 2% of screen height
  },
  createAccount: {
    color: '#E0E1DD',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
  },
  createAccountLink: {
    color: '#3CBBB1',
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
  },

  IntialContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05, // increased from 0.02
  },
  fieldTitle: {
    color: '#E0E1DD',
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginLeft: width * 0.05, // 5% of screen width
    marginTop: height * 0.01, // reduced from 0.02
  },
});






export default LoginScreen;


