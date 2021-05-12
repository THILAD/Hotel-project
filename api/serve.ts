const express = require('express');
require('dotenv/config')
const api = process.env.API_URL
import {app } from "./app";
let PORT =2020;
app.listen(PORT,'0.0.0.0', () => {
    console.log('')
    console.log('server is running on PORT:' +PORT);
    console.log(api);
    
});