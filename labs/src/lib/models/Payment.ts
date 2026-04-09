import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'stripe' | 'mpesa' | 'bank_transfer';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  milestoneId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  stripePaymentId?: string;
  stripeSessionId?: string;
  mpesaReceiptNumber?: string;
  mpesaCheckoutRequestId?: string;
  bankReference?: string;
  description?: string;
  dueDate?: Date;
  paidAt?: Date;
  failedAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
    },
    method: {
      type: String,
      enum: ['stripe', 'mpesa', 'bank_transfer'],
    },
    stripePaymentId: String,
    stripeSessionId: String,
    mpesaReceiptNumber: String,
    mpesaCheckoutRequestId: String,
    bankReference: String,
    description: String,
    dueDate: Date,
    paidAt: Date,
    failedAt: Date,
    refundedAt: Date,
    metadata: Schema.Types.Mixed
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ projectId: 1 });
paymentSchema.index({ clientId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);