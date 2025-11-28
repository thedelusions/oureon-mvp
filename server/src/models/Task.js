import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: String,
      enum: ['GA', 'Poly', 'Oureon', 'Personal'],
      default: 'Personal',
    },
    type: {
      type: String,
      enum: ['study', 'code', 'admin', 'life'],
      default: 'study',
    },
    deadline: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, deadline: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;
