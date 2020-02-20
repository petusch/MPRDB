const mongoose = require("mongoose");
import router from './routers';
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import morgan from 'morgan';
import cors from 'cors';
require('./passportConfig')

const app = express();

app.use(bodyParser.json());
app.use(router);
app.use(morgan('dev'));
app.use(cors);
app.use(passport.initialize());

mongoose.connect("mongodb://localhost:27017/hospital", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
mongoose.connection.on('error', () => console.error('Mongo connection error'));

app.listen(30003, () => {
    console.info(`Running on port 30003`);
});

export default app;
