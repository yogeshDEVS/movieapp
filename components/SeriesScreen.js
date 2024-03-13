import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const SeriesScreen = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    axios.get('http://www.omdbapi.com/?s=star&type=series&apikey=e5f1dc')
      .then(response => {
        setSeries(response.data.Search);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
    <Text style={styles.header}>EXPLORE SERIES</Text> 
    <Text style={styles.greeting}>Dive into the world of series</Text> 
    <FlatList
      data={series}
      keyExtractor={serie => serie.imdbID}
      renderItem={({ item }) => (
        <View style={styles.seriesCard}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#0D1321', // Change the background color to dark blue
  },
  header: {
    fontSize: width * 0.045,
    alignSelf:'center',
    marginBottom: height * 0.002,
    color:'#E0E1DD' // Change the header title color to off-white
  },
  greeting: {
    fontSize: width * 0.06,
    marginBottom: height * 0.035,
    marginTop: height * 0.065,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#E0E1DD', // Change the greeting color to off-white
  },
  seriesCard: {
    flex: 1,
    margin: 10,
    backgroundColor: '#1F2430', // Change the series card background color to dark grey
    borderRadius: 10,
    padding: 10,
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  title: {
    color: '#E0E1DD', // Change the title color to off-white
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
  },
  year: {
    color: '#3CBBB1', // Change the year color to teal
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
  },
});

export default SeriesScreen;
