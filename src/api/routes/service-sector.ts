import express, {Request, Response} from 'express';
import ServiceSector, {IServiceSector} from "../../domain/models/ServiceSector";

const router = express.Router();

router.post('/users/:userId/service-sector', async (req: Request, res: Response) => {
    const serviceSectorData: Partial<IServiceSector> = req.body;
    // @ts-ignore
    serviceSectorData.userId = req.params.userId;

    try {
        const serviceSector = new ServiceSector(serviceSectorData);
        await serviceSector.save();

        res.status(201).json(serviceSector);
    } catch (err) {
        // @ts-ignore
        res.status(500).send(`Error when saving service sector data: ${err.message}`);
    }
});

router.put('/users/:userId/service-sector', async (req, res) => {
    const newData: Partial<IServiceSector> = req.body;

    try {
        const serviceSector = await ServiceSector.findOne({userId: req.params.userId});

        if (!serviceSector) {
            res.status(404).send(`Service sector data for user id ${req.params.userId} not found`);
            return;
        }

        Object.assign(serviceSector, newData);
        await serviceSector.save();

        res.json(serviceSector);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when updating service sector data: ${err.message}`);
    }
});

router.get('/users/:userId/service-sector', async (req, res) => {
    try {
        const serviceSector = await ServiceSector.findOne({userId: req.params.userId});

        if (!serviceSector) {
            res.status(404).send(`Service sector data for user id ${req.params.userId} not found`);
            return;
        }

        res.json(serviceSector);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when fetching service sector data: ${err.message}`);
    }
});

export default router;