require('dotenv').config();

const { updatePricesJob } = require('./src/scheduler');

updatePricesJob();
