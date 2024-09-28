import express from 'express';
import cors from 'cors';
import {connectToDb} from "./infra/mongo-connection";
import errorHandler from "./infra/error-handler";
import townParks from "./api/routes/town-parks";
import {importParksData} from "./applicaiton/services/park-service";
import {importSmallParksData} from "./applicaiton/services/small-park-service";
import smallParks from "./api/routes/small-parks";
import {importUsersData} from "./applicaiton/services/user-service";
import user from "./api/routes/user";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/data', townParks);
app.use('/data', smallParks);
app.use('/data', user);
app.use(errorHandler);
connectToDb().then(async () => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
    try {
        await importParksData();
        console.log('Successfully imported large parks data');
    } catch (err) {
        console.log(`An error occurred while importing large parks data: ${err}`);
    }
    try {
        await importSmallParksData();
        console.log('Successfully imported small parks data');
    } catch (err) {
        console.log(`An error occurred while importing small parks data: ${err}`);
    }
    try {
        await importUsersData();
        console.log('Successfully imported users data');
    } catch (err) {
        console.log(`An error occurred while importing users data: ${err}`);
    }
});