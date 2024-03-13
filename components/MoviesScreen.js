import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const MoviesScreen = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/movie/popular?api_key=a9d49f607fa2a26bbf2352e6802c7fd9')
      .then(response => {
        setMovies(response.data.results);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View>
      {movies.map(movie => (
        <Text key={movie.id}>{movie.title}</Text>
      ))}
    </View>
  );
};

export default MoviesScreen;
