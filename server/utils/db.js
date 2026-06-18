const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
const LaundryService = require('../models/laundryServiceModel');

dotenv.config();

const defaultServices = [
  {
    name: 'Wash & Fold',
    category: 'Wash',
    description: 'Standard wash, dry, and fold service for everyday laundry.',
    price: 12.99,
    duration: '24 hours',
    options: [
      { name: 'Express service', priceAdjustment: 5.0, description: 'Delivered within 12 hours.' },
      { name: 'Extra stain treatment', priceAdjustment: 3.0, description: 'Treat stubborn stains with special care.' },
    ],
    active: true,
  },
  {
    name: 'Dry Clean Shirt',
    category: 'Dry Clean',
    description: 'Premium dry cleaning for shirts and blouses.',
    price: 8.5,
    duration: '48 hours',
    options: [
      { name: 'Express dry clean', priceAdjustment: 4.0, description: 'Ready in 24 hours.' },
      { name: 'Delicate finish', priceAdjustment: 2.0, description: 'Gentle finishing for delicate fabrics.' },
    ],
    active: true,
  },
  {
    name: 'Ironing Service',
    category: 'Iron',
    description: 'Professional ironing for garments and linens.',
    price: 5.0,
    duration: '24 hours',
    options: [
      { name: 'Shirt press', priceAdjustment: 1.5, description: 'Professional shirt pressing service.' },
      { name: 'Suit set', priceAdjustment: 4.0, description: 'Iron both jacket and pants.' },
    ],
    active: true,
  },
  {
    name: 'Express Laundry',
    category: 'Express',
    description: 'Fast-turnaround laundry for urgent needs.',
    price: 18.99,
    duration: '12 hours',
    options: [
      { name: 'Same-day pickup', priceAdjustment: 6.0, description: 'Pickup and delivery in the same day.' },
      { name: 'Premium detergent', priceAdjustment: 2.5, description: 'Upgrade to our premium fragrance-free detergent.' },
    ],
    active: true,
  },
];

const seedServices = async () => {
  const count = await LaundryService.countDocuments();
  if (count === 0) {
    await LaundryService.insertMany(defaultServices);
    console.log('Inserted default laundry services into the catalog.');
  }
};

const connectWithUri = async (uri, label) => {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected (${label}): ${conn.connection.host}`);
  return conn;
};

const buildAtlasSeedlistUri = (srvUri) => {
  try {
    const parsed = new URL(srvUri);
    if (parsed.protocol !== 'mongodb+srv:') {
      return null;
    }

    const hostParts = parsed.hostname.split('.');
    if (hostParts.length < 3) {
      return null;
    }

    const clusterName = hostParts[0];
    const atlasDomain = hostParts.slice(1).join('.');
    const credentials = `${encodeURIComponent(parsed.username)}:${encodeURIComponent(parsed.password)}@`;
    const hosts = [0, 1, 2]
      .map((index) => `${clusterName}-shard-00-${String(index).padStart(2, '0')}.${atlasDomain}:27017`)
      .join(',');
    const params = new URLSearchParams(parsed.searchParams);

    params.set('authSource', 'admin');
    params.set('retryWrites', 'true');
    params.set('w', 'majority');
    params.set('tls', 'true');
    if (params.has('appName')) {
      params.set('appName', params.get('appName'));
    }

    return `mongodb://${credentials}${hosts}/?${params.toString()}`;
  } catch {
    return null;
  }
};

const connectDB = async () => {
  try {
    const dnsServers = process.env.DNS_SERVERS;
    if (dnsServers) {
      const servers = dnsServers
        .split(',')
        .map((server) => server.trim())
        .filter(Boolean);

      if (servers.length > 0) {
        dns.setServers(servers);
        console.log(`Using custom DNS servers: ${servers.join(', ')}`);
      }
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set in server/.env');
    }

    try {
      await connectWithUri(uri, 'primary');
    } catch (primaryError) {
      const atlasSeedlistUri = buildAtlasSeedlistUri(uri);
      if (atlasSeedlistUri) {
        try {
          console.log('Trying Atlas seed-list URI without SRV lookup...');
          await connectWithUri(atlasSeedlistUri, 'atlas-seedlist');
          await seedServices();
          return;
        } catch (seedlistError) {
          console.error('Atlas seed-list connection also failed.');
          console.error(`Error: ${seedlistError.message}`);
        }
      }

      const fallbackUri = process.env.MONGODB_URI_FALLBACK || 'mongodb://127.0.0.1:27017/cleanwash';
      console.error('Primary MongoDB connection failed.');
      console.error(`Error: ${primaryError.message}`);
      console.log(`Trying fallback MongoDB URI (${fallbackUri})...`);
      await connectWithUri(fallbackUri, 'fallback');
    }

    await seedServices();
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || /querySrv/i.test(error.message)) {
      console.error(
        'MongoDB connection failed while resolving the Atlas SRV record. Check your network, DNS, VPN, or use a non-SRV MongoDB URI from Atlas.'
      );
    }
    console.error(`Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
