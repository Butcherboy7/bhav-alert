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
    bangalore: { price: 102.86, change: 0 },
    hyderabad: { price: 107.41, change: 0 },
    chennai:   { price: 100.85, change: 0 },
    kolkata:   { price: 105.01, change: 0 },
    pune:      { price: 104.69, change: 0 },
    ahmedabad: { price: 93.72,  change: 0 },
    jaipur:    { price: 104.87, change: 0 },
    lucknow:   { price: 94.65,  change: 0 }
  },
  diesel: {
    mumbai:    { price: 92.15, change: 0 },
    delhi:     { price: 87.62, change: 0 },
    bangalore: { price: 88.95, change: 0 },
    hyderabad: { price: 93.76, change: 0 },
    chennai:   { price: 92.46, change: 0 },
    kolkata:   { price: 91.52, change: 0 },
    pune:      { price: 90.97, change: 0 },
    ahmedabad: { price: 89.87, change: 0 },
    jaipur:    { price: 89.57, change: 0 },
    lucknow:   { price: 87.55, change: 0 }
  },
  gold: {
    price_24k: 144710,
    price_22k: 132650,
    change_24k: 0,
    change_22k: 0
  },
  lpg:   { price: 803, change: 0 },
  onion: { price: 35,  change: 0 },
  rice:  { price: 45,  change: 0 },
  milk:  { price: 27,  change: 0 },
  trends: {
    petrol: { direction: "stable", percent: 0 },
    diesel: { direction: "stable", percent: 0 },
    gold24k: { direction: "stable", percent: 0 },
    gold22k: { direction: "stable", percent: 0 },
    lpg: { direction: "stable", percent: 0 },
    onion: { direction: "stable", percent: 0 },
    rice: { direction: "stable", percent: 0 },
    milk: { direction: "stable", percent: 0 },
  },
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
