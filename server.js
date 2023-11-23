const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// start the server on the port of 3000
const port = process.env.PORT || 3000;
app.listen(port);
// console.log(process.env);
