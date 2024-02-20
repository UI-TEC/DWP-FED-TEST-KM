// Importing required modules
const express = require('express');
const router = express.Router();

// Constants for API
const API_KEY = 'Xi0Px2KXSPHlwu1AD6FLR8kWJMgAoQQu';
const API_URL = 'https://api.os.uk/search/names/v1/find';

// Custom Error class for handling errors
class CustomError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// Function to render error page
const renderError = (res, message) => {
    res.status(500).render('../views/index.njk', { error: message });
}

// Route for handling POST requests
router.post('/', async function(req, res, next){
    const postcode = req.body.postcode;
    if (!postcode) {
        return next(new CustomError('Postcode is empty', 500));
    }
    try {
        // Fetch data from API
        const response = await fetch(`${API_URL}?key=${API_KEY}&query=${postcode}`);
        if (!response.ok) {
            throw new CustomError('Network response was not ok', 500);
        }
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            return next(new CustomError('Invalid postcode', 500));
        }
        
        // Extract relevant information from API response
        const addresses = data.results.map(result => {
            const { GAZETTEER_ENTRY } = result;
            let postcodeDistrict = '';
            // Check for populated place or district borough
            if (!GAZETTEER_ENTRY || (!GAZETTEER_ENTRY.POPULATED_PLACE && !GAZETTEER_ENTRY.DISTRICT_BOROUGH)) {
                postcodeDistrict = GAZETTEER_ENTRY && GAZETTEER_ENTRY.COUNTY_UNITARY ? GAZETTEER_ENTRY.COUNTY_UNITARY : 'Unknown';
            } else {
                postcodeDistrict = GAZETTEER_ENTRY.POPULATED_PLACE ? GAZETTEER_ENTRY.POPULATED_PLACE : GAZETTEER_ENTRY.DISTRICT_BOROUGH;
            }
            const name = GAZETTEER_ENTRY ? GAZETTEER_ENTRY.NAME1 : 'Unknown';
            return `${name} ${postcodeDistrict}`;
        });
        // Render the addresses
        res.render('../views/addresses.njk', { addresses });
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
router.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err.message);
    // Handle custom errors and other errors separately
    if (err instanceof CustomError) {
        renderError(res, err.message);
    } else {
        renderError(res, 'An error occurred while fetching the data.');
    }
});

module.exports = router;
