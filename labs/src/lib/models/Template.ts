import mongoose, { Schema, Document } from 'mongoose';

export interface ITemplateMilestone {
  name: string;
  description: string;
  defaultPercentage: number;
  order: number;
}

export interface ITemplate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  description: string;
  milestones: ITemplateMilestone[];
  estimatedDurationWeeks: number;
  defaultPricing: {
    model: 'milestone' | 'upfront' | 'retainer';
    currency: string;
    suggestedMin: number;
    suggestedMax: number;
  };
  suggestedTechnologies: {
    frameworks: string[];
    languages: string[];
  };
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    milestones: [{
      name: { type: String, required: true },
      description: String,
      defaultPercentage: { type: Number, required: true },
      order: { type: Number, required: true }
    }],
    estimatedDurationWeeks: {
      type: Number,
      required: true,
    },
    defaultPricing: {
      model: { type: String, enum: ['milestone', 'upfront', 'retainer'], default: 'milestone' },
      currency: { type: String, default: 'USD' },
      suggestedMin: Number,
      suggestedMax: Number
    },
    suggestedTechnologies: {
      frameworks: [String],
      languages: [String]
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

templateSchema.index({ type: 1 });
templateSchema.index({ isDefault: 1 });

export const Template = mongoose.models.Template || mongoose.model<ITemplate>('Template', templateSchema);