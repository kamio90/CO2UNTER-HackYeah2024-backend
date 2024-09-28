import express, {Request, Response} from 'express';
import SmallParkSchema, {ISmallPark} from "../../domain/models/SmalPark";

const router = express.Router();

router.get('/small-parks', async (req: Request, res: Response) => { // New endpoint for small parks
    try {
        const smallParks: ISmallPark[] = await SmallParkSchema.find();
        res.json(smallParks);
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when getting small parks: ${err.message}`);
    }
});

router.get('/small-parks/total-area', async (req: Request, res: Response) => {
    try {
        const smallParks: ISmallPark[] = await SmallParkSchema.find();
        const totalArea = smallParks.reduce((sum, park) => sum + park.areaHa, 0);
        res.json({totalArea});
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when calculating total area of small parks: ${err.message}`);
    }
});

router.get('/small-parks/count', async (req: Request, res: Response) => {
    try {
        const count: number = await SmallParkSchema.countDocuments();
        res.json({count});
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when counting small parks: ${err.message}`);
    }
});

router.get('/small-parks/by-name/:name', async (req: Request, res: Response) => {
    const name = req.params.name;
    try {
        const park: ISmallPark[] = await SmallParkSchema.find({name: {$regex: name, $options: 'i'}}); // Use regex to match the pattern in name
        if (park.length > 0) {
            res.json(park);
        } else {
            res.status(404).json({message: `No small parks found with the name containing "${name}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching small parks with the name containing "${name}": ${err.message}`});
    }
});

router.get('/small-parks/by-status/:status', async (req: Request, res: Response) => {
    const status = req.params.status;
    try {
        const parks: ISmallPark[] = await SmallParkSchema.find({status: {$regex: status, $options: 'i'}}); // Use regex to match the pattern in status
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No small parks found with status containing "${status}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching small parks with status containing "${status}": ${err.message}`});
    }
});

router.get('/small-parks/by-district/:district', async (req: Request, res: Response) => {
    const district = req.params.district;
    try {
        const parks: ISmallPark[] = await SmallParkSchema.find({district: {$regex: district, $options: 'i'}});
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No small parks found in district "${district}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching small parks in district "${district}": ${err.message}`});
    }
});

router.get('/small-parks/by-accessibility/:accessibility', async (req: Request, res: Response) => {
    const accessibility = req.params.accessibility;
    try {
        const parks: ISmallPark[] = await SmallParkSchema.find({accessibility: {$regex: accessibility, $options: 'i'}});
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No small parks found with accessibility "${accessibility}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching small parks with accessibility "${accessibility}": ${err.message}`});
    }
});

router.get('/small-parks/by-type/:type', async (req: Request, res: Response) => {
    const type = req.params.type;
    try {
        const parks: ISmallPark[] = await SmallParkSchema.find({type: {$regex: type, $options: 'i'}});
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No small parks found of type "${type}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching small parks of type "${type}": ${err.message}`});
    }
});

export default router;