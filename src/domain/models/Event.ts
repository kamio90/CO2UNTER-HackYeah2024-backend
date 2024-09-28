import mongoose, {Document, Schema} from 'mongoose';

export interface IEvent extends Document {
    name: string;
    type: string;
    location: string;
    attendees: number;
    emissions: number;
}

const EventSchema: Schema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    location: {type: String, required: true},
    attendees: {type: Number, required: true},
    emissions: {type: Number, required: false, default: 0},
});

export default mongoose.model<IEvent>('Event', EventSchema);