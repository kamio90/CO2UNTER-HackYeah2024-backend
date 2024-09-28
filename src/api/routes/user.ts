import express, {Request, Response} from 'express';
import User, {IUser} from "../../domain/models/User";

const router = express.Router();

router.get('/users', async (req: Request, res: Response) => {
    try {
        const users: IUser[] = await User.find();
        res.json(users);
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when getting users: ${err.message}`);
    }
});

export default router;