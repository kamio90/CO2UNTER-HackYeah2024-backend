import express, {Request, Response} from 'express';
import Event, {IEvent} from "../../domain/models/Event";

const router = express.Router();

router.post('/events', async (req: Request, res: Response) => {
    const eventData: Partial<IEvent> = req.body;

    try {
        const event = new Event(eventData);
        await event.save();

        res.status(201).json(event);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when saving event data: ${err.message}`);
    }
});

router.put('/events/:eventId', async (req, res) => {
    const newData: Partial<IEvent> = req.body;

    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            res.status(404).send(`Event with id ${req.params.eventId} not found`);
            return;
        }

        Object.assign(event, newData);
        await event.save();

        res.json(event);
    } catch (err) {
        //@ts-ignores
        res.status(500).send(`Error when updating event data: ${err.message}`);
    }
});

router.get('/events/:eventId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            res.status(404).send(`Event with id ${req.params.eventId} not found`);
            return;
        }

        res.json(event);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when fetching event data: ${err.message}`);
    }
});

router.delete('/events/:eventId', async (req, res) => {
    try {
        const result = await Event.deleteOne({_id: req.params.eventId});

        if (result.deletedCount === 0) {
            res.status(404).send(`Event with id ${req.params.eventId} not found`);
            return;
        }

        res.sendStatus(204);
    } catch (err) {
        //@ts-ignore
        res.status(500).send(`Error when deleting event data: ${err.message}`);
    }
});

export default router;