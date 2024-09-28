import mongoose, {Document, Schema} from 'mongoose';

export interface IServiceSector extends Document {
    userId: mongoose.Types.ObjectId; // Foreign Key to User model
    eatingOutFrequency: string;
    useOfDisposableUtensils: string;
    hotelUsageFrequency: string;
    shoppingFrequency: string;
}

const ServiceSectorSchema: Schema = new Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    eatingOutFrequency: {type: String, required: false},
    useOfDisposableUtensils: {type: String, required: false},
    hotelUsageFrequency: {type: String, required: false},
    shoppingFrequency: {type: String, required: false},
});

export default mongoose.model<IServiceSector>('ServiceSector', ServiceSectorSchema);