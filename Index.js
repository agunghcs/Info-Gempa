
const express = require('express');
const axios = require('axios');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    try {
        const xml = await getWarningBMGK();
        const doc = await parseXML(xml);
        const data = `
        Magnitudo: ${doc.alert.info[0].magnitude}
        Kedalaman: ${doc.alert.info[0].depth}
        Lokasi Gempa: ${doc.alert.info[0].area}
        Arahan: ${doc.alert.info[0].potential}
        Saran BMKG: ${doc.alert.info[0].instruction}
        "${doc.alert.info[0].description}"
        `;
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const getWarningBMGK = async () => {
    const response = await axios.get("https://bmkg-content-inatews.storage.googleapis.com/warninggeof.xml");
    return response.data;
}

const parseXML = async (xml) => {
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(xml);
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
