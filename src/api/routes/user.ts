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

router.post('/user', async (req: Request, res: Response) => {
    try {
        const {
            averageConsumption,
            distance,
            fuelType,
            passengers,
            vehicleType
        }: IUser = req.body;

        if (!averageConsumption ||
            !distance ||
            !fuelType ||
            !passengers ||
            !vehicleType) {

            res.status(400).send('Request body is missing required fields');
        } else {
            const user = new User({
                averageConsumption,
                distance,
                fuelType,
                passengers,
                vehicleType
            });

            await user.save();
            res.status(201).json(user);
        }
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when creating a user: ${err.message}`);
    }
});

router.post('/users/:id/actions', async (req: Request, res: Response) => {
    try {
        const user: IUser | null = await User.findById(req.params.id);

        if (!user) {
            res.status(404).send("User not found");
        } else {
            user.averageConsumption = req.body.averageConsumption;
            user.distance = req.body.distance;
            user.fuelType = req.body.fuelType;
            user.passengers = req.body.passengers;
            user.vehicleType = req.body.vehicleType;

            await user.save();

            res.status(200).json(user);
        }
    } catch (err) {
        //@ts-ignore
        throw new Error(`Error when updating user CO2 emission related info: ${err.message}`);
    }
});

export default router;