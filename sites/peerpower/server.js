import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(express.static("./"));
app.use(cors());
app.use(express.json())

let demandData = null;
let windData = null;
let date = '22-Mar-2025';

app.post('/api/date', async (req, res) => {
    date = req.body.date;
    demandData = null;
    windData = null;
    res.status(200).send('Date updated');
});

app.get('/api/demand', async (req, res) => {
    const apiUrl = `https://www.smartgriddashboard.com/DashboardService.svc/data?area=demandactual&region=ALL&datefrom=${date}+00%3A00&dateto=${date}+23%3A59`;
    try {
        if(demandData == null)
        {
            const response = await fetch(apiUrl);
            const data = await response.json();
            demandData = await data;
            res.status(200).json(data);
        }
        else
        {
            return res.status(200).json(demandData);
        }
        
    } catch (error) {
        console.error('Error fetching demand data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/api/wind', async (req, res) => {
    const apiUrl = `https://www.smartgriddashboard.com/DashboardService.svc/data?area=windactual&region=ALL&datefrom=${date}+00%3A00&dateto=${date}+23%3A59`;
    try {
        if(windData == null)
        {
            const response = await fetch(apiUrl);
            const data = await response.json();
            windData = await data;
            return res.status(200).json(data);
        }
        else
        {
            return res.status(200).json(windData);
        }
    } catch (error) {
        console.error('Error fetching wind data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(3002, () => console.log('Proxy server running on port 3002'));