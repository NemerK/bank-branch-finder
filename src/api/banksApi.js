// src/api/banksApi.js
import axios from "axios";

// Fetch bank branches by city and bank name
export const fetchBranches = async (city, bankName, limit = 10) => {
  try {
    const response = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search",
      {
        params: {
          resource_id: "1c5bc716-8210-4ec7-85be-92e6271955c2",
          filters: JSON.stringify({
            City: city,
            Bank_Name: bankName,
          }),
          limit,
        },
      }
    );

    return response.data.result.records; // returns the array of branches
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return [];
  }
};

// Fetch all branches in a specific city
export const fetchBranchesByCity = async (city) => {
  try {
    console.log("API call for city:", city);
    const response = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search",
      {
        params: {
          resource_id: "1c5bc716-8210-4ec7-85be-92e6271955c2",
          filters: JSON.stringify({
            City: city,
          }),
          limit: 1000,
        },
      }
    );

    console.log("API response:", response.data);
    console.log("Records found:", response.data.result?.records?.length || 0);
    
    return response.data.result.records;
  } catch (error) {
    console.error("Failed to fetch branches by city:", error);
    return [];
  }
};

// Fetch all unique bank names
export const fetchAllBanks = async () => {
  try {
    const response = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search",
      {
        params: {
          resource_id: "1c5bc716-8210-4ec7-85be-92e6271955c2",
          limit: 1000,
        },
      }
    );

    const records = response.data.result.records;
    const uniqueBanks = [...new Set(records.map((r) => r.Bank_Name))];
    const uniqueCities = [...new Set(records.map((r) => r.City))];
    
    console.log("Available cities in database:", uniqueCities.sort());
    
    return { banks: uniqueBanks, allBranches: records, cities: uniqueCities };
  } catch (error) {
    console.error("Failed to fetch banks:", error);
    return { banks: [], allBranches: [], cities: [] };
  }
};