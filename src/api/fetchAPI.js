import axios from "axios";

export const fetchAPI = async (url, setData, setError) => {
    try {
      let allData = []; // Array to accumulate all results
      let nextUrl = url; // Start with the initial URL
  
      while (nextUrl) { // Loop until there's no next page
        const response = await axios.get(nextUrl);
        allData = [...allData, ...response.data.results]; // Collect results
        nextUrl = response.data.next; // Get the next URL
      }
  
      setData(allData); // Set data only once after all fetches are complete
    } catch (err) {
      setError(err.message); // Set error message
    }
};


export const fetchFilms = async (url, setData, setError, character) => {
  try {
    let allFilms = []; // Array to accumulate all results
    let nextUrl = url; // Start with the initial URL
    let Films = [];

    while (nextUrl) { // Loop until there's no next page
      const response = await axios.get(nextUrl);
      allFilms = [...allFilms, ...response.data.results]; // Collect results
      nextUrl = response.data.next; // Get the next URL
    }
    allFilms.forEach(film => {
      if(film.characters.includes(character.id))
      {
        Films.push(film)
      }
    });
    setData(Films); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};


export const fetchStarships = async (url, setData, setError, character) => {
  try {
    let allStarships = []; // Array to accumulate all results
    let Starships = [];
    let nextUrl = url; // Start with the initial URL

    while (nextUrl) { // Loop until there's no next page
      const response = await axios.get(nextUrl);
      allStarships = [...allStarships, ...response.data.results]; // Collect results
      nextUrl = response.data.next; // Get the next URL
    }

    allStarships.forEach(starship => {
      if(starship.characters.includes(character.id))
      {
        Starships.push(starship)
      }
    });

    setData(Starships); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};