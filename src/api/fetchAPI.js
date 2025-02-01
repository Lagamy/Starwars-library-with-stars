import axios from "axios";

export const fetchAPI = async (url, setData, setError) => {
  try {
    const response = await axios.get(url);
    const allData = response.data;
    setData(allData); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};

export const fetchDataRelatedToCharacter = async (setData, setError, wantedCharacterField) => {
  try {
    let Data = [];
    
    for (const object of wantedCharacterField) {
     const response = await axios.get(`${object}`);
     Data = [...Data, response.data]; 
    }
    //console.log(Data);
    setData(Data); // Set data only once after all fetches are complete
  } catch (err) {
    setError(err.message); // Set error message
  }
};
