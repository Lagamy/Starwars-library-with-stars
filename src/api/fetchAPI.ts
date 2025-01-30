import axios from "axios";
import { CharacterType, FilmType, StarshipType } from "../types";

export const fetchCharactersFromAPI = async (url: string, setData: (data: CharacterType[]) => void, setError: (error: string) => void) => {
  try {
    let allData: CharacterType[] = []; // Array to accumulate all results
    let currentUrl = url; // Start with the initial URL
    while (currentUrl) { // Loop until there's no next page
      const response = await axios.get(currentUrl);
      allData.push({
        name: response.data.name,
        films: response.data.films,
        starships: response.data.starships,
        skin_color: response.data.skin_color,
        hair_color: response.data.hair_color,
        eye_color: response.data.eye_color,
        url: response.data.url
      })
      currentUrl = response.data.next; // Get the next URL if it exists
    }
    //console.log(allData);
    setData(allData); // Set data only once after all fetches are complete
  } catch (err) {
    setError((err as Error).message);  // Set error message
  }
};

export const fetchFilmsRelatedToCharacter = async (setData: (data: FilmType[]) => void, setError: (error: string) => void, wantedCharacterField: string[]) => {
  try {
    let Data:FilmType[] = [];
    
    for (const object of wantedCharacterField) {
     const response = await axios.get(`${object}`);
     Data.push(
      { 
      url: response.data.url,
      title: response.data.title,
      episode_id: response.data.episode_id,
      starships: response.data.starships
     })
    }
    //console.log(Data);
    setData(Data); // Set data only once after all fetches are complete
  } catch (err) {
    setError((err as Error).message); // Set error message
  }
};

export const fetchStarshipsRelatedToCharacter = async (setData: (data: StarshipType[]) => void, setError: (error: string) => void, wantedCharacterField: string[]) => {
  try {
    let Data:StarshipType[] = [];
    
    for (const object of wantedCharacterField) {
     const response = await axios.get(`${object}`);
     Data.push({ name: response.data.name, url: response.data.url })
    }
    //console.log(Data);
    setData(Data); // Set data only once after all fetches are complete
  } catch (err) {
    setError((err as Error).message); // Set error message
  }
};
