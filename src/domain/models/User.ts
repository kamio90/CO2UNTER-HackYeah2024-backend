import mongoose, {Document, Schema} from 'mongoose';

export interface IUser extends Document {
    averageConsumption: number;
    distance: number;
    fuelType: string;
    passengers: number;
    vehicleType: string;
    typeOfMeal: string;
    waterUsage: number;
    wasteProduced: number;
    internetUsage: number;
    shoppingFrequency: string;
    energyConsumption: number;
    leisureActivities: string;
    travelFrequency: string;
    dietType: string;
    timePeriod: string;
}

const UserSchema: Schema = new Schema({
    averageConsumption: {type: Number, required: true},
    distance: {type: Number, required: true},
    fuelType: {type: String, required: true},
    passengers: {type: Number, required: true},
    vehicleType: {type: String, required: true},
    typeOfMeal: {type: String, required: false},
    waterUsage: {type: Number, required: false},
    wasteProduced: {type: Number, required: false},
    internetUsage: {type: Number, required: false},
    shoppingFrequency: {type: String, required: false},
    energyConsumption: {type: Number, required: false},
    leisureActivities: {type: String, required: false},
    travelFrequency: {type: String, required: false},
    dietType: {type: String, required: false},
    timePeriod: {type: String, required: true},
});

export default mongoose.model<IUser>('User', UserSchema);