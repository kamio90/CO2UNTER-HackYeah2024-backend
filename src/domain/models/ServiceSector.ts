import mongoose, {Document, Schema} from 'mongoose';

export interface IServiceSector extends Document {
    userId: mongoose.Types.ObjectId; // Foreign Key to User model
    eatingOutFrequency: number;
    useOfDisposableUtensils: string;
    hotelUsageFrequency: number;
    shoppingFrequency: number;
}

const ServiceSectorSchema: Schema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    eatingOutFrequency: {type: Number, required: false},
    useOfDisposableUtensils: {type: String, required: false},
    hotelUsageFrequency: {type: Number, required: false},
    shoppingFrequency: {type: Number, required: false},
});

export default mongoose.model<IServiceSector>('ServiceSector', ServiceSectorSchema);