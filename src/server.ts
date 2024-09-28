import express from 'express';
import {connectToDb} from "./infra/mongo-connection";
import errorHandler from "./infra/error-handler";
import townParks from "./api/routes/town-parks";
import {importParksData} from "./applicaiton/services/park-service";
import {importSmallParksData} from "./applicaiton/services/small-park-service";
import smallParks from "./api/routes/small-parks";

const app = express();
const port = 3000;

app.use('/data', townParks);
app.use('/data', smallParks);
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
});