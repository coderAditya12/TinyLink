import dotenv from 'dotenv'
dotenv.config() // must run before Prisma import
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// export default prisma;
// test-db.js
console.log('DATABASE_URL =', process.env.DATABASE_URL);


 const adapter = new PrismaPg({ connectionString });
 const prisma = new PrismaClient({ adapter });
export async function main(){
  try {
    await prisma.$connect();
    console.log('Connected to DB successfully');
  } catch (err) {
    console.error('Connection error:', err.message || err);
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
