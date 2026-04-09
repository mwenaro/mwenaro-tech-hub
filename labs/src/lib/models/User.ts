import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'client' | 'team';
export type TeamRole = 'lead' | 'developer' | 'designer' | 'pm' | 'qa';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  roleType?: TeamRole;
  isActive: boolean;
  invitedBy?: mongoose.Types.ObjectId;
  company?: string;
  phone?: string;
  avatar?: string;
  inviteCode?: string;
  inviteExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'client', 'team'],
      default: 'client',
    },
    roleType: {
      type: String,
      enum: ['lead', 'developer', 'designer', 'pm', 'qa'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    company: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    inviteCode: {
      type: String,
    },
    inviteExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

export const User = mongoose.models?.User || mongoose.model<IUser>('User', userSchema);