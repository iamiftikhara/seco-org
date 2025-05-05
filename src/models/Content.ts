import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Content || mongoose.model('Content', contentSchema);