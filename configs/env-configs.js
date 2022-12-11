const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const express = require('express');

exports.provider = express();

exports.config = () => {

    // using bodyParser to parse JSON bodies into JS objects
    this.provider.use(bodyParser.json({
        limit: "5mb"
    }));

    this.provider.use(bodyParser.urlencoded({
        extended:true
    }))

    // enabling CORS for all requests
    this.provider.use(cors());

    // adding morgan to log HTTP requests
    this.provider.use(morgan('combined'));
}