const admin = require('firebase-admin');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is missing');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const data = {
  petrol: {
    mumbai:    { price: 104.21, change: 0 },
    delhi:     { price: 94.72,  change: 0 },
    bangalore: { price: 101.94, change: 0 },
    hyderabad: { price: 107.41, change: 0 },
    chennai:   { price: 100.75, change: 0 },
    kolkata:   { price: 104.95, change: 0 },
    pune:      { price: 104.69, change: 0 },
    ahmedabad: { price: 104.17, change: 0 },
    jaipur:    { price: 105.48, change: 0 },
    lucknow:   { price: 94.65,  change: 0 }
  },
  diesel: {
    mumbai:    { price: 92.15, change: 0 },
    delhi:     { price: 87.62, change: 0 },
    bangalore: { price: 87.89, change: 0 },
    hyderabad: { price: 95.65, change: 0 },
    chennai:   { price: 93.26, change: 0 },
    kolkata:   { price: 91.76, change: 0 },
    pune:      { price: 92.33, change: 0 },
    ahmedabad: { price: 91.78, change: 0 },
    jaipur:    { price: 90.37, change: 0 },
    lucknow:   { price: 87.55, change: 0 }
  },
  gold: {
    price_24k: 89000,
    price_22k: 81600,
    change_24k: 0,
    change_22k: 0
  },
  lpg:   { price: 803, change: 0 },
  onion: { price: 35,  change: 0 },
  rice:  { price: 45,  change: 0 },
  milk:  { price: 27,  change: 0 },
  updatedAt: new Date().toISOString()
};

async function seed() {
  try {
    await db.collection('prices').doc('latest').set(data);
    console.log('✅ Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();
