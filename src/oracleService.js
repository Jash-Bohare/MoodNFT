require('dotenv').config();
const axios = require('axios');

async function getMoodScore() {
    // Simulating fetching data from an API
    try {
        const response = await axios.get(process.env.SENTIMENT_API_URL); // Replace with a real API
        const moodData = response.data;
        
        // Return the mood score (you can modify this to fit your use case)
        return moodData.score;
    } catch (error) {
        console.error('Error fetching mood data:', error);
        return 0; // Default if there is an error
    }
}

module.exports = { getMoodScore };
