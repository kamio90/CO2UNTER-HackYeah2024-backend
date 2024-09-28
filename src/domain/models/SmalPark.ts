import mongoose, {Document, Schema} from 'mongoose';

export interface ISmallPark extends Document {
    lp: number;
    type: string;
    name: string;
    district: string;
    districtNumber: string;
    status: string;
    accessibility: string;
    mpzpDane: string;
    areaHa: number;
}

const SmallParkSchema: Schema = new Schema({
    lp: {type: Number, required: true},
    type: {type: String, required: true},
    name: {type: String, required: true},
    district: {type: String, required: true},
    districtNumber: {type: String, required: true},
    status: {type: String, required: true},
    accessibility: {type: String, required: true},
    mpzpDane: {type: String, required: true},
    areaHa: {type: Number, required: true},
});

export default mongoose.model<ISmallPark>('SmallPark', SmallParkSchema);