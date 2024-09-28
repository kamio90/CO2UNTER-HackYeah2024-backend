import mongoose, {Document, Schema} from 'mongoose';

export interface IUser extends Document {
    averageConsumption: number;
    distance: number;
    fuelType: string;
    passengers: number;
    vehicleType: string;
    typeOfMeal: string;
}

const UserSchema: Schema = new Schema({
    averageConsumption: {type: Number, required: true},
    distance: {type: Number, required: true},
    fuelType: {type: String, required: true},
    passengers: {type: Number, required: true},
    vehicleType: {type: String, required: true},
    typeOfMeal: {type: String, required: true},
});

export default mongoose.model<IUser>('User', UserSchema);