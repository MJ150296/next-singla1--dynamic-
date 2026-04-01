import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITrafficMetrics extends Document {
  userId: string;
  totalPageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  pagesPerSession: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TrafficMetricsSchema: Schema<ITrafficMetrics> = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true,
    },
    totalPageViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    avgSessionDuration: {
      type: Number,
      default: 0,
    },
    pagesPerSession: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
TrafficMetricsSchema.index({ userId: 1, date: -1 });

const TrafficMetrics: Model<ITrafficMetrics> =
  mongoose.models.TrafficMetrics ||
  mongoose.model<ITrafficMetrics>("TrafficMetrics", TrafficMetricsSchema);

export default TrafficMetrics;