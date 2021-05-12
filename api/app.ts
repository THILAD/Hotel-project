import { Request, Response, Application } from "express";
import express from 'express';
import cors from "cors";
import * as bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import * as controller from './api/controller//store';
export let app: Application = express();

app.use(bodyParser.json({limit: '500mb'}));
app.use(bodyParser.urlencoded({limit: "500mb", extended: true, parameterLimit:50000}));
// app.use(express.static('images'))
app.use('/images', express.static('images'))
app.use(cors());
app.use(cookieParser())
controller.Init(app);
