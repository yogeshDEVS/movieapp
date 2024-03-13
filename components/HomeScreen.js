import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Dimensions, Linking, KeyboardAvoidingView, FlatList, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

// Import the screens
import SeriesScreen from './SeriesScreen';

// Get the screen's width and height
const { width, height } = Dimensions.get('window');

const icons = {
  drawer: require('../assets/hamburger.png'),
  movies: require('../assets/moviesicon.png'),
  series: require('../assets/webseries.png'),
};


const Tab = createBottomTabNavigator();
const HomeScreenContent = () => {
  const [movies, setMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://www.omdbapi.com/?s=hollywood&apikey=e5f1dc')
      .then(response => {
        setMovies(response.data.Search);
      })
      .catch(error => console.error(error));

    axios.get('http://www.omdbapi.com/?s=popular&apikey=e5f1dc')
      .then(response => {
        setRecommendations(response.data.Search);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.iconContainer}>
          <Image source={icons.drawer} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXPLORE MOVIES</Text> 
      </View>
  
      <Text style={styles.greeting}>Welcome to the world of movies</Text> 
      <Text style={styles.recommendationTitle}>Handpicked for You</Text>
      <ScrollView horizontal={true} style={styles.recommendationContainer}>
        {recommendations.map((movie) => (
          <View style={styles.recommendationCard} key={movie.imdbID}>
            <Image
              source={{ uri: movie.Poster }}
              style={styles.recommendationPoster}
            />
            <Text style={styles.recommendationMovieTitle} numberOfLines={1} ellipsizeMode='tail'>{movie.Title}</Text>
          </View>
        ))}
      </ScrollView>
      <FlatList
        data={movies}
        keyExtractor={movie => movie.imdbID}
        renderItem={({ item }) => (
          <View style={styles.movieCard}>
            <Image
              source={{ uri: item.Poster }}
              style={styles.poster}
            />
            <Text style={styles.title}>{item.Title}</Text>
            <Text style={styles.year}>{item.Year}</Text>
          </View>
        )}
      />
    </View>
  );
};

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Movies') {
            iconName = focused ? icons.movies : icons.movies;
          } else if (route.name === 'Series') {
            iconName = focused ? icons.series : icons.series;
          }

          // You can return any component that you like here!
          return <Image source={iconName} style={{ width: 20, height: 20, tintColor: color }} />;
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: [
          {
            display: 'flex',
            backgroundColor: '#0D132199', // Semi-transparent #0D1321
            borderTopColor: 'transparent',
            position: 'absolute',
            left: 50,
            right: 50,
            bottom: 0,
            borderRadius: 15,
            height: 60,
            paddingBottom: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          },
          null
        ]
      })}
    >
      <Tab.Screen name="Movies" component={HomeScreenContent} />
      <Tab.Screen name="Series" component={SeriesScreen} />
    </Tab.Navigator>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#0D1321',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: width * 0.05,
    marginBottom: height * 0.001,
    backgroundColor: '#0D1321',
  },
  iconContainer: {
    position: 'absolute',
    left: 10,
  },
  icon: {
    width: width * 0.0570,
    height: height * 0.022,
  },
  headerTitle: {
    fontSize: width * 0.0450,
    color:'#E0E1DD'
  },
 
  greeting: {
    fontSize: width * 0.06,
    marginBottom: height * 0.015,
    marginTop: height * 0.03,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#E0E1DD',
  },
  recommendationTitle: {
    fontSize: width * 0.050,
    marginBottom: height * 0.01,
    marginTop: height * 0.02,
    fontWeight: 'bold',
    
    color: '#E0E1DD',
  },
  recommendationContainer: {
    marginBottom: height * 0.02,
  },
  recommendationCard: {
    flex: 1,
    marginRight: width * 0.04,
    backgroundColor: '#1F2430',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    width: width * 0.4, // Fixed width for the card
    paddingBottom: 20, // Added paddingBottom to create space for the movie title
  },
  recommendationPoster: {
    width: '100%',
    height: height * 0.3,
    borderRadius: 10,
  },
  recommendationMovieTitle: {
    color: '#FFF',
    fontSize: width * 0.04,
    fontWeight: '700',
    position: 'absolute', // Positioned the movie title absolutely
    bottom: 0, // Positioned the movie title at the bottom of the card
    marginLeft: width * 0.02,
  },
  recommendationYear: {
    color: '#3CBBB1',
    fontSize: width * 0.03,
    fontWeight: '500',
  },
  movieCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#1F2430',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  title: {
    color: '#E0E1DD',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  year: {
    color: '#3CBBB1',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
  container1: {
    flex: 1,
    margin: 10,
    backgroundColor: '#0D1321',
    borderRadius: 10,
    padding: 10,
  },
});


export default HomeScreen;