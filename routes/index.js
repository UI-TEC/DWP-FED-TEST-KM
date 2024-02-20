// Importing the express module
const express = require('express');

// Creating a router object from the express module
const router = express.Router();

// Handling GET requests to the root route
router.get('/', function(req, res){
    // Rendering the index.njk view when the root route is accessed
    res.render('../views/index.njk');
})

// Exporting the router object to be used in other parts of the application
module.exports = router;
