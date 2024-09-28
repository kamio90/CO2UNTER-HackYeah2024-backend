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

export default router;