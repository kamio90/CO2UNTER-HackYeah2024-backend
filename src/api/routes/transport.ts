import express, {Request, Response} from 'express';
import User, {IUser} from "../../domain/models/User";
import {transportCalc} from "../../applicaiton/services/calculator-service";

const router = express.Router();

router.post('/transport/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const user: IUser | null = await User.findById(req.params.id);

        if (!user) {
            res.status(404).send("User not found");
        } else {
        return transportCalc(user);
        }
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when calculating emission for public transportation: ${err.message}`);
    }
});