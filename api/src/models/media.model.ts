import mongoose from 'mongoose';

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export interface MediaInput {
  type: MediaType;
  contentType: string;
}

export interface MediaDocument extends MediaInput, mongoose.Document {
  originalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: MediaType,
    },
    contentType: {
      type: String,
    },
    originalUrl: {
      type: String,
    },
  },
  {
    collection: 'Media',
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

mediaSchema.post('save', async doc => {
  if (doc.createdAt === doc.updatedAt) {
    // await jobService.mediaCreated(doc);
  }
});

const MediaModel = mongoose.model<MediaDocument>('Media', mediaSchema);

export { MediaModel };
