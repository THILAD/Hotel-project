const express = require('express');
import {app } from "./app";
let PORT =2020;
app.listen(PORT,'0.0.0.0', () => {
    console.log('server is running on PORT:' +PORT);
    
});