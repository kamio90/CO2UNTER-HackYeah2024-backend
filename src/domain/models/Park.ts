import mongoose, {Document, Schema} from 'mongoose';

export interface IPark extends Document {
    lp: number;
    type: string;
    name: string;
    district: string;
    areaHa: number;
    consumptionCO: number;
}

const ParkSchema: Schema = new Schema({
    lp: {type: Number, required: true},
    type: {type: String, required: true},
    name: {type: String, required: true},
    district: {type: String, required: true},
    areaHa: {type: Number, required: true},
    consumptionCO: {type: Number, required: false}
});

export default mongoose.model<IPark>('Park', ParkSchema);