import express, {Request, Response} from 'express';
import GreenArea, {IGreenArea} from "../../domain/models/GreenArea";

const router = express.Router();

router.post('/greenArea', async (req: Request, res: Response) => {
    const greenAreaData: Partial<IGreenArea> = req.body;

    try {
        const greenArea = new GreenArea(greenAreaData);
        await greenArea.save();

        res.status(201).json(greenArea);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when saving green area data: ${err.message}`);
    }
});

router.put('/greenArea/:id', async (req, res) => {
    const newData: Partial<IGreenArea> = req.body;

    try {
        const greenArea = await GreenArea.findById(req.params.id);

        if (!greenArea) {
            res.status(404).send(`Green area data with id ${req.params.id} not found`);
            return;
        }

        Object.assign(greenArea, newData);
        await greenArea.save();

        res.json(greenArea);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when updating green area data: ${err.message}`);
    }
});

router.get('/greenArea/:id', async (req, res) => {
    try {
        const greenArea = await GreenArea.findById(req.params.id);

        if (!greenArea) {
            res.status(404).send(`Green area data with id ${req.params.id} not found`);
            return;
        }

        res.json(greenArea);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when fetching green area data: ${err.message}`);
    }
});

export default router;