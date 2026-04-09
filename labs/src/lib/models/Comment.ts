import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  reactions: {
    userId: mongoose.Types.ObjectId;
    emoji: string;
  }[];
  parentId?: mongoose.Types.ObjectId;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    reactions: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String }
    }],
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ projectId: 1 });
commentSchema.index({ createdAt: -1 });

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);