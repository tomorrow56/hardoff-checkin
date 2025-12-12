import { drizzle } from "drizzle-orm/mysql2";
import { stores } from "./drizzle/schema.js";
import "dotenv/config";

const storesData = [
  {
    brand: "ECO TOWN HAWAII",
    storeName: "Iwilei Store",
    country: "USA",
    state: "Hawaii",
    address: "650 IWILEI RD #110, Honolulu, HI 96817",
    latitude: "21.3099000",
    longitude: "-157.8581000"
  },
  {
    brand: "ECO TOWN HAWAII",
    storeName: "SELECT ALA MOANA CENTER STORE",
    country: "USA",
    state: "Hawaii",
    address: "1450 Ala Moana Blvd, Honolulu, HI 96814",
    latitude: "21.2911000",
    longitude: "-157.8764000"
  },
  {
    brand: "ECO TOWN USA",
    storeName: "Fountain Valley Store",
    country: "USA",
    state: "California",
    address: "18968 Brookhurst St, Fountain Valley, CA 92708",
    latitude: "33.7170000",
    longitude: "-117.9192000"
  },
  {
    brand: "ECO TOWN USA",
    storeName: "Santa Ana Store",
    country: "USA",
    state: "California",
    address: "3309 S Bristol St, Santa Ana CA 92704",
    latitude: "33.7454000",
    longitude: "-117.8678000"
  },
  {
    brand: "ECO TEK",
    storeName: "Fountain Valley Store",
    country: "USA",
    state: "California",
    address: "18880 Brookhurst St, Fountain Valley, CA 92708",
    latitude: "33.7168000",
    longitude: "-117.9189000"
  },
  {
    brand: "HARD OFF",
    storeName: "THEPHARAK STORE",
    country: "Thailand",
    state: "Samut Prakan",
    address: "1999/86-87 Moo6, Thanon Thepharak, Tambon Theparak, Amphoe Mueang Samut Prakan",
    latitude: "13.5753000",
    longitude: "100.7541000"
  },
  {
    brand: "HARD OFF",
    storeName: "SRIRACHA STORE",
    country: "Thailand",
    state: "Chonburi",
    address: "Land Title No35024 88/15 Moo.4 Thungsukla, Sriracha, Chonburi Province",
    latitude: "12.8801000",
    longitude: "100.9145000"
  },
  {
    brand: "HARD OFF",
    storeName: "MAIYALAP STORE",
    country: "Thailand",
    state: "Bangkok",
    address: "200 Soi Prasert Manukit 29, Chorakhe Bua, Lat Phrao, Bangkok Thailand",
    latitude: "13.8328000",
    longitude: "100.6274000"
  },
  {
    brand: "HARD OFF",
    storeName: "SRINAKARIN STORE",
    country: "Thailand",
    state: "Bangkok",
    address: "931 Srinakarin Road, On Nut Sub-District, Suan Luang District",
    latitude: "13.7485000",
    longitude: "100.8103000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "桃園中壢店",
    country: "Taiwan",
    state: "Taoyuan",
    address: "中歴區 中華路一段480號",
    latitude: "24.9604000",
    longitude: "121.2191000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "台南頂美店",
    country: "Taiwan",
    state: "Tainan",
    address: "中西區 中華西路二段685號",
    latitude: "22.9975000",
    longitude: "120.1912000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "台南永康店",
    country: "Taiwan",
    state: "Tainan",
    address: "永康區 中華路143號",
    latitude: "22.9844000",
    longitude: "120.2356000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "屏東新屏店",
    country: "Taiwan",
    state: "Pingtung",
    address: "屏東市 台糖街3號",
    latitude: "22.6778000",
    longitude: "120.4892000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "台南東門店",
    country: "Taiwan",
    state: "Tainan",
    address: "東區東門路三段319號2樓之2",
    latitude: "22.9961000",
    longitude: "120.2167000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "桃園楊梅店",
    country: "Taiwan",
    state: "Taoyuan",
    address: "桃園市楊梅區中山北路二段45號",
    latitude: "24.9086000",
    longitude: "121.0029000"
  },
  {
    brand: "HARDOFF TAIWAN",
    storeName: "南投家樂福店",
    country: "Taiwan",
    state: "Nantou",
    address: "南投縣南投市 三和三路21號1樓",
    latitude: "23.8103000",
    longitude: "120.8758000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECO TOWN Northbridge",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "#251 Northbridge St. Sangkat Toeuk Thla, Khan Sen Sok, Phnom Penh",
    latitude: "11.5564000",
    longitude: "104.9282000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "Eco Town St.371 Boeung Tum",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "No.278-280, St.199, Sangkat Tumnub Tuek, Khan Chamkar Morn, Phnom Penh",
    latitude: "11.5667000",
    longitude: "104.9167000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECO TOWN St598 Camko Store",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "No.N/A, Street 598(Tralauk Bek), Kangkea Phos Village, Sangkat Toul Sangke 2, Khan Russey Keo, Phnom Penh",
    latitude: "11.5500000",
    longitude: "104.9333000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECO TOWN Chbar Ampov",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "National Road No.1, Sangkat Niroth, Khan Chbar Ampov, Phnom Penh",
    latitude: "11.5333000",
    longitude: "104.8667000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECO TOWN Tep Phan",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "237, Group20, Village7, Street182, Sangkat Tuol Kouk, Khan Toul Kork",
    latitude: "11.5667000",
    longitude: "104.8833000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECO TOWN National Road No.3",
    country: "Cambodia",
    state: "Kandal",
    address: "Khan Kamboul 168, National Road3, Angkorkiet Village, Sangkat Kantouk",
    latitude: "11.4667000",
    longitude: "104.7833000"
  },
  {
    brand: "MOTTAINAI WORLD",
    storeName: "ECOTOWN Russian Hospital Store",
    country: "Cambodia",
    state: "Phnom Penh",
    address: "Khan Boeung Keng Kang No.21, Street 430, Village 4, Sangkat Tumnob Teuk",
    latitude: "11.5667000",
    longitude: "104.9167000"
  }
];

async function seedStores() {
  const db = drizzle(process.env.DATABASE_URL);
  
  console.log("Seeding stores...");
  
  for (const store of storesData) {
    await db.insert(stores).values(store);
  }
  
  console.log(`Successfully seeded ${storesData.length} stores!`);
  process.exit(0);
}

seedStores().catch((error) => {
  console.error("Error seeding stores:", error);
  process.exit(1);
});
