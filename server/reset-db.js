const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Finance = require('./models/Finance');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'your-mongo-uri')
  .then(async () => {
    await User.deleteMany({});
    await Finance.deleteMany({});
    console.log('✅ Database cleared! All users/finances deleted.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

