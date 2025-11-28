import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mode: {
      type: String,
      enum: ['study', 'coding', 'review', 'exam'],
      default: 'study',
    },
    project: {
      type: String,
      enum: ['GA', 'Poly', 'Oureon', 'Personal'],
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
    plannedMinutes: {
      type: Number,
      min: 1,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for duration in minutes
focusSessionSchema.virtual('durationMinutes').get(function () {
  if (this.endedAt) {
    return Math.round((this.endedAt - this.startedAt) / 1000 / 60);
  }
  return null;
});

// Virtual for checking if session is active
focusSessionSchema.virtual('isActive').get(function () {
  return !this.endedAt;
});

// Include virtuals in JSON
focusSessionSchema.set('toJSON', { virtuals: true });
focusSessionSchema.set('toObject', { virtuals: true });

// Index for faster queries
focusSessionSchema.index({ userId: 1, startedAt: -1 });
focusSessionSchema.index({ userId: 1, endedAt: 1 });

const FocusSession = mongoose.model('FocusSession', focusSessionSchema);

export default FocusSession;
