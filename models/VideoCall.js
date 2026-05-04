import mongoose from 'mongoose';

const videoCallSchema = new mongoose.Schema(
  {
    callerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['initiating', 'ringing', 'active', 'ended', 'missed'],
      default: 'initiating',
    },
    startTime: Date,
    endTime: Date,
    duration: Number,
  },
  { timestamps: true }
);

export default mongoose.models.VideoCall || mongoose.model('VideoCall', videoCallSchema);
