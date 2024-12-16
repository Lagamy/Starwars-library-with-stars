import axios from "axios";
import { DatabaseUrl } from "../DatabaseConstants";

export const fetchAPI = async (url, setData, setError) => {
  try {
    let allData = []; // Array to accumulate all results
    let nextUrl = url; // Start with the initial URL
    while (nextUrl) { // Loop until there's no next page
      const response = await axios.get(nextUrl);
      
      allData = [...allData, ...response.data]; // Collect results
      nextUrl = response.data.next; // Get the next URL if it exists
    }
    console.log(allData);
    setData(allData); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};

export const fetchDataRelatedToCharacter = async (setData, setError, wantedCharacterField) => {
  try {
    let Data = [];
    
    for (const object of wantedCharacterField) {
     const response = await axios.get(`${object}.json`);
     //console.log(response.data);
     Data = [...Data, response.data]; 
    }
    console.log(Data);
    setData(Data); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};
