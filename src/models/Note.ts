import mongoose, { Document } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    isPublic: boolean;
    lastModified: Date;
}

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Untitled'
    },
    content: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model<INote>('Note', noteSchema); 