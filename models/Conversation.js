import { mongoose, uuid } from '../config/constants.js';

const conversationSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuid, // Generate a UUID as the default value for the _id field
  },
  senderId: {
    type: String,
    required: true,
    ref: 'User',
  },
  receiverId: {
    type: String,
    required: true,
    ref: 'User',
  },
  messages: [
    {
      type: String,
      ref: 'Message',
    },
  ],
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export { Conversation };
