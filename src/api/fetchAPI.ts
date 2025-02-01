import axios from "axios";
import { CharacterType, FilmType, StarshipType } from "../types";

export const fetchCharactersFromAPI = async (url: string, setData: (data: CharacterType[]) => void, setError: (error: string) => void) => {
  try {
    const response = await axios.get(url);
    const allData = response.data.map((character: CharacterType) => ({ // Array to accumulate all results 
      name: character.name,
      films: character.films,
      starships: character.starships,
      skin_color: character.skin_color,
      hair_color: character.hair_color,
      eye_color: character.eye_color,
      url: character.url
    }));
    
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
