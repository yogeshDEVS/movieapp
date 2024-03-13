import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const UserScreen = () => {
  const navigation = useNavigation();
  const [userImage, setUserImage] = useState(require('../assets/defaultimg.png')); // Set the initial state to your default image
  const [userDetails, setUserDetails] = useState({});

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

  const selectImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.assets[0].uri };
        setUserImage(source);
  
        // Upload the image to Firebase Storage
        const user = auth().currentUser;
        const storageRef = firebase.storage().ref(`profile_images/${user.uid}`);
        const task = storageRef.putFile(source.uri);
  
        task.on('state_changed', taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });
  
        task.then(async () => {
          console.log('Image uploaded to the bucket!');
          const url = await storageRef.getDownloadURL();
  
          // Save the download URL in Firestore
          await firestore()
            .collection('users')
            .doc(user.uid)
            .set({ imageUri: url }, { merge: true }); // Use set with merge option
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header1}>USER ACCOUNT</Text>
      <Text style={styles.header}>Hey {userDetails.firstName}!</Text>
      <TouchableOpacity onPress={selectImage} style={styles.imageContainer}>
        <Image
          source={userImage}
          style={styles.image}
        />
        
      </TouchableOpacity>
      <Text style={styles.imageText}>Please upload your profile picture</Text>
      <Text style={styles.title}>Name</Text>
      <Text style={styles.info1}>{userDetails.firstName} {userDetails.lastName}</Text>
      <Text style={styles.title}>Email</Text>
      <Text style={styles.info}>{auth().currentUser.email}</Text>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.navText}>Movies</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('SeriesScreen')}>
        <Text style={styles.navText}>Web Series</Text>
      </TouchableOpacity>
    
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: screenWidth * 0.02, // 2% of screen width
    backgroundColor: '#0D1321', // Dark theme
  },
  header1: {
    fontSize: screenWidth * 0.0425, // 4.25% of screen width
    alignSelf: 'center',
    color: '#E0E1DD', // Light text color
    marginBottom: screenHeight * 0.05, // 26% of screen height
  },
  header: {
    fontSize: screenWidth * 0.06, // 6% of screen width
    color: '#E0E1DD', // Light text color
    fontWeight: 'bold',
    marginTop: screenHeight * 0.02, // 2% of screen height
  },
  imageContainer: {
    width: screenWidth * 0.3, // 20% of screen width
    height: screenWidth * 0.3, // 20% of screen width
    borderRadius: screenWidth * 0.2, // 10% of screen width
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * 0.02, // 2% of screen height
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: screenWidth * 0.2, // 10% of screen width
  },
  imageText: {
    fontSize: screenWidth * 0.037, // 3.5% of screen width
    color: '#888',
    marginTop: screenHeight * 0.01, // 1% of screen height
  },
  title: {
    fontSize: screenWidth * 0.05, // 4% of screen width
    color: '#E0E1DD', // Light text color
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: screenWidth * 0.05, // 5% of screen width
    marginTop: screenHeight * 0.02, // 2% of screen height
  },
  info: {
    fontSize: screenWidth * 0.037, // 3.5% of screen width
    color: '#E0E1DD', // Light text color
    alignSelf: 'flex-start',
    marginLeft: screenWidth * 0.05, // 5% of screen width
    marginBottom: screenHeight * 0.020, // 1.5% of screen height
  },
  info1: {
    fontSize: screenWidth * 0.037, // 3.5% of screen width
    color: '#E0E1DD', // Light text color
    alignSelf: 'flex-start',
    marginLeft: screenWidth * 0.05, // 5% of screen width
  },
  navItem: {
    width: '100%',
    padding: screenHeight * 0.015, // 1.5% of screen height
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navText: {
    fontSize: screenWidth * 0.045, // 4% of screen width
    color: '#E0E1DD', // Light text color
  },
});


export default UserScreen;
