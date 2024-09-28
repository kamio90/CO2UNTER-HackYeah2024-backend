import express, {Request, Response} from 'express';
import Park, {IPark} from "../../domain/models/Park";

const router = express.Router();

router.get('/town-parks', async (req: Request, res: Response) => {
    try {
        const parks: IPark[] = await Park.find();
        res.json(parks);
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when getting town parks: ${err.message}`);
    }
});

router.get('/town-parks/total-area', async (req: Request, res: Response) => {
    try {
        const parks: IPark[] = await Park.find();
        const totalArea = parks.reduce((sum, park) => sum + park.areaHa, 0);
        res.json({totalArea});
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when calculating total area of town parks: ${err.message}`);
    }
});

router.get('/town-parks/count', async (req: Request, res: Response) => {
    try {
        const count: number = await Park.countDocuments();
        res.json({count});
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when counting town parks: ${err.message}`);
    }
});

router.get('/town-parks/by-name/:name', async (req: Request, res: Response) => {
    const name = req.params.name;
    try {
        const park: IPark[] = await Park.find({name: {$regex: name, $options: 'i'}});
        if (park.length > 0) {
            res.json(park);
        } else {
            res.status(404).json({message: `No town parks found with the name containing "${name}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching town parks with the name containing "${name}": ${err.message}`});
    }
});

router.get('/town-parks/by-district/:district', async (req: Request, res: Response) => {
    const district = req.params.district;
    try {
        const parks: IPark[] = await Park.find({district: {$regex: district, $options: 'i'}});
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No town parks found in district "${district}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching town parks in district "${district}": ${err.message}`});
    }
});

router.get('/town-parks/by-type/:type', async (req: Request, res: Response) => {
    const type = req.params.type;
    try {
        const parks: IPark[] = await Park.find({type: {$regex: type, $options: 'i'}});
        if (parks.length > 0) {
            res.json(parks);
        } else {
            res.status(404).json({message: `No town parks found of type "${type}"`});
        }
    } catch (err) {
        //@ts-ignore
        res.status(500).json({message: `Error when fetching town parks of type "${type}": ${err.message}`});
    }
});

export default router;