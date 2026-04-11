import mongoose, { Schema, Document } from 'mongoose';

export type NotificationType = 
  | 'project_submitted'
  | 'project_accepted'
  | 'project_rejected'
  | 'project_completed'
  | 'milestone_completed'
  | 'payment_due'
  | 'payment_received'
  | 'comment_added'
  | 'update_posted'
  | 'invitation_sent'
  | 'status_changed';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        'project_submitted',
        'project_accepted',
        'project_rejected',
        'project_completed',
        'milestone_completed',
        'payment_due',
        'payment_received',
        'comment_added',
        'update_posted',
        'invitation_sent',
        'status_changed'
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: String,
    read: {
      type: Boolean,
      default: false,
    },
    readAt: Date
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.models?.Notification || mongoose.model<INotification>('Notification', notificationSchema);