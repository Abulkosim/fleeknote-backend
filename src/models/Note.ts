import mongoose, { Document } from 'mongoose';

export interface INote extends Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    isPublic: boolean;
    slug: string;
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
    },
    slug: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true
});

noteSchema.pre('save', async function(next) {
    if (this.isModified('title')) {
        const slugBase = this.title.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        
        let slug = slugBase;
        let counter = 1;
        
        while (await mongoose.model('Note').findOne({ slug, _id: { $ne: this._id } })) {
            slug = `${slugBase}-${counter}`;
            counter++;
        }
        
        this.slug = slug;
    }
    next();
});

export default mongoose.model<INote>('Note', noteSchema); 