import { mongoose, uuidv4 } from '../config/constants.js';

const messageSchema = new mongoose.Schema({
  textMessage: {
    type: String,
  },
  fileUrl: {
    type: Object, // {url: '', type: 'image/file/audio', name:''}
    defaultsTo: {},
  },
  status: {
    type: String, // sent, delivered, read
  },
});

const Message = mongoose.model('Message', messageSchema);

export { Message };
