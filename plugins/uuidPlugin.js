import { v4 as uuidv4 } from 'uuid';

const uuidPlugin = (schema) => {
  let currentTime = Date.now();
  // Add _id field with string type and default value generated using uuid
  schema.add({
    _id: {
      type: String,
      default: () => uuidv4(),
      columnName: 'id',
    },
    createdAt: {
      type: Number,
      default: currentTime,
    },
    updatedAt: {
      type: Number,
      default: currentTime,
    },
  });

  schema.set('versionKey', false);
};

export default uuidPlugin;
