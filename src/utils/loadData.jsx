// src/utils/loadData.js
import Papa from 'papaparse';

// This function loads and parses the CSV file
export const loadData = async (path) => {
    // Fetch the CSV file from the given path
    const response = await fetch(path);
    const csv = await response.text(); // Get the text content of the file
    
    // Return a Promise that resolves when parsing is complete
    return new Promise((resolve, reject) => {
        Papa.parse(csv, {
            header: true,           // The first row contains headers
            skipEmptyLines: true,  // Skip any empty lines in the CSV file
            complete: (result) => resolve(result.data), // Resolve with the parsed data
            error: (error) => reject(error), // Reject if there's an error during parsing
        });
    });
};