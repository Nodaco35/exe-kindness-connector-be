const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://cuongndhe180335_db_user:nodaco35@kindness-connector.ghvcoe7.mongodb.net/kindness-connector';

async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  // also try to count "exchanges"
  const exchangesCount = await db.collection('exchanges').countDocuments();
  console.log("Exchanges count:", exchangesCount);

  // check if there's any other exchange-related collection
  const exchange_requests_count = await db.collection('exchangerequests').countDocuments().catch(()=>0);
  console.log("exchangerequests count:", exchange_requests_count);
  
  await mongoose.disconnect();
}
run();
