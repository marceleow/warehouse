import { unitOfMeasure } from "#/lib/constants";
import { db } from ".";
import { locations, materialBalance, materials, transactionItems, transactions } from "./schema"; // sesuaikan path schema

// ─── Seed Data ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Locations ───────────────────────────────────────────────────────────────
  const locationData = [
    { id: "loc-001", name: "Gudang Utama" },
    { id: "loc-002", name: "Gudang Material Berat" },
    { id: "loc-003", name: "Site Proyek - Blok A" },
    { id: "loc-004", name: "Site Proyek - Blok B" },
    { id: "loc-005", name: "Workshop Fabrikasi" },
  ];

  await db.insert(locations).values(locationData);
  console.log("✅ Locations seeded");

  // ── Materials ────────────────────────────────────────────────────────────────
  const materialData = [
    // Struktur
    {
      id: "mat-001",
      name: "Besi Beton Ulir D16",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Besi beton ulir diameter 16mm panjang 12m",
    },
    {
      id: "mat-002",
      name: "Besi Beton Ulir D13",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Besi beton ulir diameter 13mm panjang 12m",
    },
    {
      id: "mat-003",
      name: "Baja WF 200x100",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Baja profil WF 200x100 panjang 6m",
    },
    {
      id: "mat-004",
      name: "Semen Portland (40 kg)",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.SAK,
      description: "Semen Portland tipe I, 40 kg/sak",
    },
    {
      id: "mat-005",
      name: "Pasir Cor",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M3,
      description: "Pasir beton/cor halus",
    },
    {
      id: "mat-006",
      name: "Kerikil Beton",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M3,
      description: "Kerikil split 2-3 cm untuk beton",
    },
    {
      id: "mat-007",
      name: "Kawat Bendrat",
      type: "log_only",
      unitOfMeasure: unitOfMeasure.KG,
      description: "Kawat ikat besi beton",
    },
    {
      id: "mat-008",
      name: "Bata Ringan AAC 10cm",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BUAH,
      description: "Bata ringan 60x20x10cm",
    },

    // Finishing Lantai & Dinding
    {
      id: "mat-009",
      name: "Granit 60x60 Polished",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M2,
      description: "Granit tile 60x60 cm polished, import",
    },
    {
      id: "mat-010",
      name: "Granit 120x60 Matte",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M2,
      description: "Granit tile 120x60 cm matte finish",
    },
    {
      id: "mat-011",
      name: "Keramik Dinding 30x60",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M2,
      description: "Keramik dinding kamar mandi 30x60 cm",
    },
    {
      id: "mat-012",
      name: "Mortar Perekat Keramik",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.SAK,
      description: "Mortar instan tile adhesive 25 kg/sak",
    },
    {
      id: "mat-013",
      name: "Nat / Grouting Keramik",
      type: "log_only",
      unitOfMeasure: unitOfMeasure.KG,
      description: "Grouting warna putih tulang",
    },
    {
      id: "mat-014",
      name: "Cat Tembok Eksterior",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.LITER,
      description: "Cat eksterior premium weathershield",
    },
    {
      id: "mat-015",
      name: "Cat Tembok Interior",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.LITER,
      description: "Cat interior low odour premium",
    },
    {
      id: "mat-016",
      name: "Wallpaper Dinding Premium",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.ROLL,
      description: "Wallpaper import vinyl 53cm x 10m",
    },

    // Plafon & Partisi
    {
      id: "mat-017",
      name: "Gypsum Board 9mm",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.LEMBAR,
      description: "Gypsum board standar 1200x2400mm",
    },
    {
      id: "mat-018",
      name: "Gypsum Board Moisture Resist",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.LEMBAR,
      description: "Gypsum tahan lembab untuk area basah",
    },
    {
      id: "mat-019",
      name: "Rangka Hollow Galvanis 4x4",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Hollow galvanis 40x40x0.6mm panjang 6m",
    },
    {
      id: "mat-020",
      name: "Compound Gypsum",
      type: "log_only",
      unitOfMeasure: unitOfMeasure.KG,
      description: "Joint compound untuk finishing gypsum",
    },

    // Kusen, Pintu & Jendela
    {
      id: "mat-021",
      name: "Pintu Panel Kayu Solid",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Pintu kayu solid mahoni, finishing HPL",
    },
    {
      id: "mat-022",
      name: "Pintu Kaca Frameless",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Pintu kaca tempered 12mm frameless",
    },
    {
      id: "mat-023",
      name: "Jendela Aluminium Casement",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Jendela aluminium casement double glass",
    },
    {
      id: "mat-024",
      name: "Handle Pintu Set",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.SET,
      description: "Handle pintu stainless brushed gold",
    },

    // MEP (Mekanikal, Elektrikal, Plumbing)
    {
      id: "mat-025",
      name: "Kabel NYM 2x2.5",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M,
      description: "Kabel listrik NYM 2x2.5mm² SNI",
    },
    {
      id: "mat-026",
      name: "Kabel NYY 4x10",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M,
      description: "Kabel daya NYY 4x10mm² untuk panel",
    },
    {
      id: "mat-027",
      name: 'Pipa PVC AW 3/4"',
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Pipa PVC AW 3/4 inci panjang 4m",
    },
    {
      id: "mat-028",
      name: 'Pipa PPR PN20 3/4"',
      type: "tracked",
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Pipa PPR PN20 air panas/dingin 3/4 inci",
    },
    {
      id: "mat-029",
      name: "Titik Instalasi Listrik",
      type: "log_only",
      unitOfMeasure: unitOfMeasure.TITIK,
      description: "Titik pekerjaan instalasi listrik",
    },
    {
      id: "mat-030",
      name: "Stop Kontak & Saklar Set",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.SET,
      description: "Stop kontak + saklar premium serie",
    },

    // Sanitary
    {
      id: "mat-031",
      name: "Closet Duduk Premium",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Kloset duduk one piece, rimless",
    },
    {
      id: "mat-032",
      name: "Wastafel Countertop",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Wastafel countertop ceramic putih",
    },
    {
      id: "mat-033",
      name: "Shower Set Premium",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.SET,
      description: "Shower set rain shower + hand shower",
    },
    {
      id: "mat-034",
      name: "Bathtub Freestanding",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Bathtub freestanding akrilik 170cm",
    },

    // Waterproofing & Insulasi
    {
      id: "mat-035",
      name: "Waterproofing Membran Bakar",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.ROLL,
      description: "Membran waterproofing torch-on 4mm, 10m²/roll",
    },
    {
      id: "mat-036",
      name: "Waterproofing Coating",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.KG,
      description: "Coating waterproofing berbasis semen elastis",
    },
    {
      id: "mat-037",
      name: "Rockwool Insulasi 50mm",
      type: "tracked",
      unitOfMeasure: unitOfMeasure.M2,
      description: "Rockwool thermal & acoustic insulation 50mm",
    },
  ];

  await db.insert(materials).values(materialData);
  console.log("✅ Materials seeded");

  // ── Material Balance (stok awal) ─────────────────────────────────────────────
  const balanceData = materialData.map((mat) => ({
    materialId: mat.id,
    quantity: getInitialStock(mat.id),
  }));

  await db.insert(materialBalance).values(balanceData);
  console.log("✅ Material balances seeded");

  // ── Transactions ─────────────────────────────────────────────────────────────
  const transactionData = [
    {
      id: "trx-001",
      type: "in" as const,
      requestedBy: "Agus Santoso",
      locationId: "loc-001",
      note: "Penerimaan material awal proyek tahap 1",
      timestamp: "2025-01-10T08:00:00.000Z",
    },
    {
      id: "trx-002",
      type: "in" as const,
      requestedBy: "Budi Prasetyo",
      locationId: "loc-002",
      note: "Penerimaan baja struktural dari supplier",
      timestamp: "2025-01-12T09:30:00.000Z",
    },
    {
      id: "trx-003",
      type: "out" as const,
      requestedBy: "Dedi Kurniawan",
      locationId: "loc-003",
      note: "Pengeluaran material untuk pekerjaan pondasi Blok A",
      timestamp: "2025-01-15T07:00:00.000Z",
    },
    {
      id: "trx-004",
      type: "out" as const,
      requestedBy: "Eko Wijaya",
      locationId: "loc-004",
      note: "Pengeluaran material untuk bekisting kolom Blok B",
      timestamp: "2025-01-18T08:00:00.000Z",
    },
    {
      id: "trx-005",
      type: "in" as const,
      requestedBy: "Fajar Nugroho",
      locationId: "loc-001",
      note: "Restok material finishing — granit dan cat",
      timestamp: "2025-02-01T10:00:00.000Z",
    },
  ];

  await db.insert(transactions).values(transactionData);
  console.log("✅ Transactions seeded");

  // ── Transaction Items ────────────────────────────────────────────────────────
  const itemData = [
    // trx-001: penerimaan material struktural
    { transactionId: "trx-001", materialId: "mat-001", quantity: 100 },
    { transactionId: "trx-001", materialId: "mat-002", quantity: 80 },
    { transactionId: "trx-001", materialId: "mat-004", quantity: 200 },
    { transactionId: "trx-001", materialId: "mat-005", quantity: 20 },
    { transactionId: "trx-001", materialId: "mat-006", quantity: 15 },

    // trx-002: penerimaan baja
    { transactionId: "trx-002", materialId: "mat-003", quantity: 40 },
    { transactionId: "trx-002", materialId: "mat-007", quantity: 50 },

    // trx-003: pengeluaran pondasi Blok A
    { transactionId: "trx-003", materialId: "mat-001", quantity: 30 },
    { transactionId: "trx-003", materialId: "mat-004", quantity: 60 },
    { transactionId: "trx-003", materialId: "mat-005", quantity: 8 },
    { transactionId: "trx-003", materialId: "mat-006", quantity: 5 },

    // trx-004: pengeluaran kolom Blok B
    { transactionId: "trx-004", materialId: "mat-002", quantity: 20 },
    { transactionId: "trx-004", materialId: "mat-003", quantity: 10 },
    { transactionId: "trx-004", materialId: "mat-007", quantity: 15 },

    // trx-005: restok finishing
    { transactionId: "trx-005", materialId: "mat-009", quantity: 150 },
    { transactionId: "trx-005", materialId: "mat-010", quantity: 100 },
    { transactionId: "trx-005", materialId: "mat-014", quantity: 80 },
    { transactionId: "trx-005", materialId: "mat-015", quantity: 120 },
  ];

  // Generate UUID untuk setiap item
  const itemDataWithIds = itemData.map((item) => ({
    id: crypto.randomUUID(),
    ...item,
  }));

  await db.insert(transactionItems).values(itemDataWithIds);
  console.log("✅ Transaction items seeded");

  console.log("🎉 Seeding complete!");
}

// ─── Helper: stok awal per material ──────────────────────────────────────────
function getInitialStock(materialId: string): number {
  const stocks: Record<string, number> = {
    "mat-001": 100,
    "mat-002": 80,
    "mat-003": 40,
    "mat-004": 200,
    "mat-005": 20,
    "mat-006": 15,
    "mat-007": 50,
    "mat-008": 2000,
    "mat-009": 150,
    "mat-010": 100,
    "mat-011": 80,
    "mat-012": 100,
    "mat-013": 30,
    "mat-014": 80,
    "mat-015": 120,
    "mat-016": 20,
    "mat-017": 60,
    "mat-018": 30,
    "mat-019": 50,
    "mat-020": 25,
    "mat-021": 20,
    "mat-022": 8,
    "mat-023": 24,
    "mat-024": 20,
    "mat-025": 500,
    "mat-026": 200,
    "mat-027": 60,
    "mat-028": 40,
    "mat-029": 0,
    "mat-030": 30,
    "mat-031": 6,
    "mat-032": 6,
    "mat-033": 6,
    "mat-034": 3,
    "mat-035": 20,
    "mat-036": 50,
    "mat-037": 80,
  };
  return stocks[materialId] ?? 0;
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
