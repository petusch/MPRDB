const mongoose = require("mongoose");
import "regenerator-runtime/runtime";
import router from './routes';
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import morgan from 'morgan';
import cors from 'cors';
import touch from './postgres/touch'
import logRequestsMiddleware from './middleware/logRequestMiddleware';
require('./passportConfig')
const sequelize = require('./postgres/index')

const app = express();

app.use(bodyParser.json());
app.use(logRequestsMiddleware);
app.use(router);

app.use((req, res) => {
    return res.status(404).json(
        {
            message: 'Path not found.',
            statusCode: 404
        }
    );
});

app.use(morgan('dev'));
app.use(cors);
app.use(passport.initialize());

mongoose.connect("mongodb://localhost:27017/log", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('error', () => console.error('Mongo connection error'));

touch();

sequelize.sync({ forсe: true, })
    .then(result => console.log('Sequelize connected.'))
    .catch(err => console.log(err));

app.listen(30001, () => {
    console.info(`Running on port 30001`);
});

export default app;  
