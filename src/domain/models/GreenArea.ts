import mongoose, {Document, Schema} from 'mongoose';

export interface IGreenArea extends Document {
    parkCount: number;
    greenAreaSize: number;
    treeCount: number;
    co2AbsorptionRate: number; // rate calculated based on plant species, age, size, etc.
}

const GreenAreaSchema: Schema = new Schema({
    parkCount: {type: Number, required: true,},
    greenAreaSize: {type: Number, required: true}, // in square meters
    treeCount: {type: Number, required: true},
    co2AbsorptionRate: {type: Number, required: true},
});

export default mongoose.model<IGreenArea>('GreenArea', GreenAreaSchema);