const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb+srv://cuongndhe180335_db_user:nodaco35@kindness-connector.ghvcoe7.mongodb.net/kindness-connector');
  console.log('Connected to DB');
  const db = mongoose.connection;
  const booksCollection = db.collection('books');
  const books = await booksCollection.find({}, { projection: { title: 1, status: 1 } }).toArray();
  
  let availableCount = 0;
  let hiddenCount = 0;
  let requestedCount = 0;
  let otherCount = 0;
  let missingStatus = 0;

  for (const b of books) {
    if (b.status === 'AVAILABLE') availableCount++;
    else if (b.status === 'HIDDEN') hiddenCount++;
    else if (b.status === 'REQUESTED') requestedCount++;
    else if (!b.status) missingStatus++;
    else otherCount++;
  }

  console.log('Total Books:', books.length);
  console.log('AVAILABLE:', availableCount);
  console.log('HIDDEN:', hiddenCount);
  console.log('REQUESTED:', requestedCount);
  console.log('Missing Status:', missingStatus);
  console.log('Other:', otherCount);

  const oldLogic = await booksCollection.countDocuments({ status: { $ne: 'HIDDEN' } });
  console.log('Books matched by {$ne: "HIDDEN"}:', oldLogic);

  await mongoose.disconnect();
}

test().catch(console.error);
