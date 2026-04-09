import mongoose, { Schema, Document } from 'mongoose';

export type ProjectType = 'web' | 'mobile' | 'both' | 'api';
export type ProjectStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'active' | 'completed' | 'cancelled';
export type PaymentModel = 'milestone' | 'upfront' | 'retainer';
export type FeaturePriority = 'must_have' | 'nice_to_have' | 'can_wait';

export interface IProjectFeature {
  name: string;
  description: string;
  priority: FeaturePriority;
}

export interface IMilestone {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  amount: number;
  percentage: number;
  dueDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  deliverables: string[];
  completedAt?: Date;
}

export interface IClientUpdate {
  title: string;
  description: string;
  createdAt: Date;
}

export interface IAttachment {
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
}

export interface IActivity {
  type: 'comment' | 'status_change' | 'milestone_update' | 'payment' | 'feature_update';
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: ProjectType;
  status: ProjectStatus;
  proposalDetails: {
    problem: string;
    targetUsers: string;
    features: IProjectFeature[];
    budget: {
      min: number;
      max: number;
      currency: string;
    };
    timeline: string;
  };
  pricing: {
    model: PaymentModel;
    totalAmount: number;
    currency: string;
    installments: number;
    retainerAmount?: number;
    retainerMonths?: number;
  };
  assignedTeam: {
    lead?: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
  };
  milestones: IMilestone[];
  timeline: {
    startDate?: Date;
    endDate?: Date;
    estimatedCompletion?: Date;
  };
  technology: {
    frameworks: string[];
    languages: string[];
    resources: string[];
  };
  clientUpdates: IClientUpdate[];
  attachments: IAttachment[];
  templateType?: string;
  activities: IActivity[];
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['web', 'mobile', 'both', 'api'],
      default: 'web',
    },
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'draft',
    },
    proposalDetails: {
      problem: { type: String },
      targetUsers: { type: String },
      features: [{
        name: String,
        description: String,
        priority: { type: String, enum: ['must_have', 'nice_to_have', 'can_wait'] }
      }],
      budget: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'USD' }
      },
      timeline: { type: String }
    },
    pricing: {
      model: { type: String, enum: ['milestone', 'upfront', 'retainer'] },
      totalAmount: { type: Number, default: 0 },
      currency: { type: String, default: 'USD' },
      installments: { type: Number, default: 1 },
      retainerAmount: Number,
      retainerMonths: Number
    },
    assignedTeam: {
      lead: { type: Schema.Types.ObjectId, ref: 'User' },
      members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    milestones: [{
      _id: { type: Schema.Types.ObjectId, auto: true },
      name: { type: String, required: true },
      description: String,
      amount: { type: Number, required: true },
      percentage: Number,
      dueDate: Date,
      status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
      deliverables: [String],
      completedAt: Date
    }],
    timeline: {
      startDate: Date,
      endDate: Date,
      estimatedCompletion: Date
    },
    technology: {
      frameworks: [String],
      languages: [String],
      resources: [String]
    },
    clientUpdates: [{
      title: String,
      description: String,
      createdAt: { type: Date, default: Date.now }
    }],
    attachments: [{
      name: String,
      url: String,
      type: String,
      uploadedAt: { type: Date, default: Date.now }
    }],
    templateType: String,
    activities: [{
      type: { type: String, enum: ['comment', 'status_change', 'milestone_update', 'payment', 'feature_update'] },
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      content: String,
      createdAt: { type: Date, default: Date.now }
    }],
    rejectionReason: String,
    adminNotes: String
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.models?.Project || mongoose.model<IProject>('Project', projectSchema);