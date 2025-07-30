const express  = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

const path = require('path');
const app = express();
const PORT = 3005;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


dotenv.config();

const TARGET_URL = process.env.TARGET_URL; // http://192.168.70.100:8585/iqserver
const BASE_URL = process.env.BASE_URL;  //https://ds.iqtv.in:8080/iqworld

// app.use(cors());
app.use(cors({
  origin: '*', // Or specify allowed origins for security
  methods: ['GET', 'POST']
}));

app.use(express.json());


let dynamicBaseURL = null; // Store dynamic URL

// Fetch server details on start
const fetchServerDetails = async () => {
  try {
    const res = await fetch(`${process.env.BASE_URL}/api/server/getserverdetails`);
    const data = await res.json();
    dynamicBaseURL = data.application_url;

    console.log('== Application URL Set ==');
    console.log(dynamicBaseURL);
  } catch (err) {
    console.error('Failed to fetch server details:', err);
  }
};

// Call on server start
fetchServerDetails();

// Optional: Refresh the URL every few minutes if needed
setInterval(fetchServerDetails, 5 * 60 * 1000); // Every 5 mins

app.post('/api/v1/none-auth/device/isexist', async (req, res) => {
  try {
    const deviceId = req.query.deviceId;

    if (!dynamicBaseURL) {
      return res.status(500).json({ error: 'Application URL not set yet' });
    }

    const response = await fetch(`https://ds.iqtv.in:8080/iqworld/api/v1/none-auth/device/isexist?android_id=${deviceId}`);
    const data = await response.json();

    console.log('== Device Check API Response ==');
    console.log(JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy server error' });
  }
});
 

// API Route for Signin (POST)
app.post('/api/auth/signin', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('== Signin API Response ==');
    console.log(JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});



// Serve local Downloads folder
const downloadsPath = path.join(require('os').homedir(), 'Downloads');
app.use('/media', express.static(downloadsPath));

app.listen(PORT, () => {
  console.log(`Media server running at http://localhost:${PORT}/media`);
});
