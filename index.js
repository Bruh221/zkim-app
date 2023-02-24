const express = require('express');
const axios = require(`axios`);
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Вова Братец Лох'));