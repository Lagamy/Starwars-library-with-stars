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

