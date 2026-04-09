const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/mwenaro-labs';

async function updatePassword() {
  await mongoose.connect(MONGODB_URI);
  
  const hashedPassword = bcrypt.hashSync('Password', 12);
  
  const result = await mongoose.connection.db.collection('users').updateOne(
    { email: 'admin@labs.mwenaro.com' },
    { $set: { password: hashedPassword } }
  );
  
  console.log('Updated:', result);
  await mongoose.disconnect();
}

updatePassword().catch(console.error);