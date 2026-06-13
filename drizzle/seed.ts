import { unitOfMeasure } from "#/lib/constants";
import { db } from ".";
import {
  adjustmentLineItems,
  issueLineItems,
  materialIssues,
  materialReceipts,
  materials,
  receiptLineItems,
  stockAdjustments,
  stockTrackingPeriods,
} from "./schema";

// ─── Seed Data ──────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Materials ───────────────────────────────────────────────────────────────
  const materialData = [
    // Struktur
    {
      id: "mat-001",
      name: "Besi Beton Ulir D16",
      materialCode: "BB-D16",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Besi beton ulir diameter 16mm panjang 12m",
    },
    {
      id: "mat-002",
      name: "Besi Beton Ulir D13",
      materialCode: "BB-D13",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Besi beton ulir diameter 13mm panjang 12m",
    },
    {
      id: "mat-003",
      name: "Baja WF 200x100",
      materialCode: "BJ-WF200",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Baja profil WF 200x100 panjang 6m",
    },
    {
      id: "mat-004",
      name: "Semen Portland (40 kg)",
      materialCode: "SM-40",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.SAK,
      description: "Semen Portland tipe I, 40 kg/sak",
    },
    {
      id: "mat-005",
      name: "Pasir Cor",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M3,
      description: "Pasir beton/cor halus",
    },
    {
      id: "mat-006",
      name: "Kerikil Beton",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M3,
      description: "Kerikil split 2-3 cm untuk beton",
    },
    {
      id: "mat-007",
      name: "Kawat Bendrat",
      inventoryMode: "LOG_ONLY" as const,
      unitOfMeasure: unitOfMeasure.KG,
      description: "Kawat ikat besi beton",
    },
    {
      id: "mat-008",
      name: "Bata Ringan AAC 10cm",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BUAH,
      description: "Bata ringan 60x20x10cm",
    },

    // Finishing Lantai & Dinding
    {
      id: "mat-009",
      name: "Granit 60x60 Polished",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M2,
      description: "Granit tile 60x60 cm polished, import",
    },
    {
      id: "mat-010",
      name: "Granit 120x60 Matte",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M2,
      description: "Granit tile 120x60 cm matte finish",
    },
    {
      id: "mat-011",
      name: "Keramik Dinding 30x60",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M2,
      description: "Keramik dinding kamar mandi 30x60 cm",
    },
    {
      id: "mat-012",
      name: "Mortar Perekat Keramik",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.SAK,
      description: "Mortar instan tile adhesive 25 kg/sak",
    },
    {
      id: "mat-013",
      name: "Nat / Grouting Keramik",
      inventoryMode: "LOG_ONLY" as const,
      unitOfMeasure: unitOfMeasure.KG,
      description: "Grouting warna putih tulang",
    },
    {
      id: "mat-014",
      name: "Cat Tembok Eksterior",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.LITER,
      description: "Cat eksterior premium weathershield",
    },
    {
      id: "mat-015",
      name: "Cat Tembok Interior",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.LITER,
      description: "Cat interior low odour premium",
    },
    {
      id: "mat-016",
      name: "Wallpaper Dinding Premium",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.ROLL,
      description: "Wallpaper import vinyl 53cm x 10m",
    },

    // Plafon & Partisi
    {
      id: "mat-017",
      name: "Gypsum Board 9mm",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.LEMBAR,
      description: "Gypsum board standar 1200x2400mm",
    },
    {
      id: "mat-018",
      name: "Gypsum Board Moisture Resist",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.LEMBAR,
      description: "Gypsum tahan lembab untuk area basah",
    },
    {
      id: "mat-019",
      name: "Rangka Hollow Galvanis 4x4",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Hollow galvanis 40x40x0.6mm panjang 6m",
    },
    {
      id: "mat-020",
      name: "Compound Gypsum",
      inventoryMode: "LOG_ONLY" as const,
      unitOfMeasure: unitOfMeasure.KG,
      description: "Joint compound untuk finishing gypsum",
    },

    // Kusen, Pintu & Jendela
    {
      id: "mat-021",
      name: "Pintu Panel Kayu Solid",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Pintu kayu solid mahoni, finishing HPL",
    },
    {
      id: "mat-022",
      name: "Pintu Kaca Frameless",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Pintu kaca tempered 12mm frameless",
    },
    {
      id: "mat-023",
      name: "Jendela Aluminium Casement",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Jendela aluminium casement double glass",
    },
    {
      id: "mat-024",
      name: "Handle Pintu Set",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.SET,
      description: "Handle pintu stainless brushed gold",
    },

    // MEP (Mekanikal, Elektrikal, Plumbing)
    {
      id: "mat-025",
      name: "Kabel NYM 2x2.5",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M,
      description: "Kabel listrik NYM 2x2.5mm² SNI",
    },
    {
      id: "mat-026",
      name: "Kabel NYY 4x10",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M,
      description: "Kabel daya NYY 4x10mm² untuk panel",
    },
    {
      id: "mat-027",
      name: 'Pipa PVC AW 3/4"',
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Pipa PVC AW 3/4 inci panjang 4m",
    },
    {
      id: "mat-028",
      name: 'Pipa PPR PN20 3/4"',
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.BATANG,
      description: "Pipa PPR PN20 air panas/dingin 3/4 inci",
    },
    {
      id: "mat-029",
      name: "Titik Instalasi Listrik",
      inventoryMode: "LOG_ONLY" as const,
      unitOfMeasure: unitOfMeasure.TITIK,
      description: "Titik pekerjaan instalasi listrik",
    },
    {
      id: "mat-030",
      name: "Stop Kontak & Saklar Set",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.SET,
      description: "Stop kontak + saklar premium serie",
    },

    // Sanitary
    {
      id: "mat-031",
      name: "Closet Duduk Premium",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Kloset duduk one piece, rimless",
    },
    {
      id: "mat-032",
      name: "Wastafel Countertop",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Wastafel countertop ceramic putih",
    },
    {
      id: "mat-033",
      name: "Shower Set Premium",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.SET,
      description: "Shower set rain shower + hand shower",
    },
    {
      id: "mat-034",
      name: "Bathtub Freestanding",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.UNIT,
      description: "Bathtub freestanding akrilik 170cm",
    },

    // Waterproofing & Insulasi
    {
      id: "mat-035",
      name: "Waterproofing Membran Bakar",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.ROLL,
      description: "Membran waterproofing torch-on 4mm, 10m²/roll",
    },
    {
      id: "mat-036",
      name: "Waterproofing Coating",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.KG,
      description: "Coating waterproofing berbasis semen elastis",
    },
    {
      id: "mat-037",
      name: "Rockwool Insulasi 50mm",
      inventoryMode: "STOCK_TRACKED" as const,
      unitOfMeasure: unitOfMeasure.M2,
      description: "Rockwool thermal & acoustic insulation 50mm",
    },
  ];

  await db.insert(materials).values(materialData);
  console.log("✅ Materials seeded");

  // ── Stock Tracking Periods ──────────────────────────────────────────────────
  const trackingStartDate = "2024-12-01T00:00:00.000Z";
  const periodData = materialData
    .filter((m) => m.inventoryMode === "STOCK_TRACKED")
    .map((m) => ({
      materialId: m.id,
      startedAt: trackingStartDate,
      endedAt: null as string | null,
    }));

  await db.insert(stockTrackingPeriods).values(periodData);
  console.log("✅ Stock tracking periods seeded");

  // ── Material Receipts ───────────────────────────────────────────────────────
  const receiptData = [
    {
      id: "rcpt-001",
      receiptDate: "2025-01-10",
      notes: "Penerimaan material awal proyek tahap 1",
    },
    {
      id: "rcpt-002",
      receiptDate: "2025-01-12",
      notes: "Penerimaan baja struktural dari supplier",
    },
    {
      id: "rcpt-003",
      receiptDate: "2025-02-01",
      notes: "Restok material finishing — granit dan cat",
    },
    {
      id: "rcpt-004",
      receiptDate: "2025-02-10",
      notes: "Penerimaan material sanitary dan electrical",
    },
  ];

  await db.insert(materialReceipts).values(receiptData);
  console.log("✅ Material receipts seeded");

  // ── Receipt Line Items ──────────────────────────────────────────────────────
  const receiptItemData = [
    // rcpt-001: penerimaan material struktural
    { receiptId: "rcpt-001", materialId: "mat-001", quantity: 100 },
    { receiptId: "rcpt-001", materialId: "mat-002", quantity: 80 },
    { receiptId: "rcpt-001", materialId: "mat-004", quantity: 200 },
    { receiptId: "rcpt-001", materialId: "mat-005", quantity: 20 },
    { receiptId: "rcpt-001", materialId: "mat-006", quantity: 15 },
    { receiptId: "rcpt-001", materialId: "mat-008", quantity: 2000 },

    // rcpt-002: penerimaan baja dan consumables
    { receiptId: "rcpt-002", materialId: "mat-003", quantity: 40 },
    { receiptId: "rcpt-002", materialId: "mat-007", quantity: 50 },

    // rcpt-003: restok finishing
    { receiptId: "rcpt-003", materialId: "mat-009", quantity: 150 },
    { receiptId: "rcpt-003", materialId: "mat-010", quantity: 100 },
    { receiptId: "rcpt-003", materialId: "mat-014", quantity: 80 },
    { receiptId: "rcpt-003", materialId: "mat-015", quantity: 120 },
    { receiptId: "rcpt-003", materialId: "mat-011", quantity: 80 },
    { receiptId: "rcpt-003", materialId: "mat-012", quantity: 100 },

    // rcpt-004: sanitary dan electrical
    { receiptId: "rcpt-004", materialId: "mat-025", quantity: 500 },
    { receiptId: "rcpt-004", materialId: "mat-027", quantity: 60 },
    { receiptId: "rcpt-004", materialId: "mat-028", quantity: 40 },
    { receiptId: "rcpt-004", materialId: "mat-030", quantity: 30 },
    { receiptId: "rcpt-004", materialId: "mat-031", quantity: 6 },
    { receiptId: "rcpt-004", materialId: "mat-032", quantity: 6 },
    { receiptId: "rcpt-004", materialId: "mat-033", quantity: 6 },
  ];

  const receiptItemDataWithIds = receiptItemData.map((item) => ({
    id: crypto.randomUUID(),
    ...item,
  }));

  await db.insert(receiptLineItems).values(receiptItemDataWithIds);
  console.log("✅ Receipt line items seeded");

  // ── Material Issues ─────────────────────────────────────────────────────────
  const issueData = [
    {
      id: "iss-001",
      issueDate: "2025-01-15",
      houseUnit: "R01-10",
      collector: "Dedi Kurniawan",
      workDescription: "Pekerjaan pondasi",
    },
    {
      id: "iss-002",
      issueDate: "2025-01-18",
      houseUnit: "R01-12",
      collector: "Eko Wijaya",
      workDescription: "Bekisting kolom",
    },
    {
      id: "iss-003",
      issueDate: "2025-02-05",
      houseUnit: "R02-05",
      collector: "Agus Santoso",
      workDescription: "Pekerjaan plumbing",
    },
    {
      id: "iss-004",
      issueDate: "2025-02-12",
      houseUnit: "R02-08",
      collector: "Budi Prasetyo",
      workDescription: "Pekerjaan lantai dan dinding",
    },
  ];

  await db.insert(materialIssues).values(issueData);
  console.log("✅ Material issues seeded");

  // ── Issue Line Items ────────────────────────────────────────────────────────
  const issueItemData = [
    // iss-001: pondasi R01-10
    { issueId: "iss-001", materialId: "mat-001", quantity: 30 },
    { issueId: "iss-001", materialId: "mat-004", quantity: 60 },
    { issueId: "iss-001", materialId: "mat-005", quantity: 8 },
    { issueId: "iss-001", materialId: "mat-006", quantity: 5 },

    // iss-002: kolom R01-12
    { issueId: "iss-002", materialId: "mat-002", quantity: 20 },
    { issueId: "iss-002", materialId: "mat-003", quantity: 10 },
    { issueId: "iss-002", materialId: "mat-007", quantity: 15 },

    // iss-003: plumbing R02-05
    { issueId: "iss-003", materialId: "mat-027", quantity: 20 },
    { issueId: "iss-003", materialId: "mat-028", quantity: 15 },
    { issueId: "iss-003", materialId: "mat-030", quantity: 5 },

    // iss-004: lantai dan dinding R02-08
    { issueId: "iss-004", materialId: "mat-009", quantity: 40 },
    { issueId: "iss-004", materialId: "mat-012", quantity: 20 },
    { issueId: "iss-004", materialId: "mat-014", quantity: 25 },
  ];

  const issueItemDataWithIds = issueItemData.map((item) => ({
    id: crypto.randomUUID(),
    ...item,
  }));

  await db.insert(issueLineItems).values(issueItemDataWithIds);
  console.log("✅ Issue line items seeded");

  // ── Stock Adjustments ───────────────────────────────────────────────────────
  const adjustmentData = [
    {
      id: "adj-001",
      adjustmentDate: "2025-01-20",
      reason: "Stock opname awal — koreksi hasil fisik",
    },
    {
      id: "adj-002",
      adjustmentDate: "2025-02-15",
      reason: "Koreksi kerusakan material saat pengiriman",
    },
  ];

  await db.insert(stockAdjustments).values(adjustmentData);
  console.log("✅ Stock adjustments seeded");

  // ── Adjustment Line Items ───────────────────────────────────────────────────
  const adjustmentItemData = [
    // adj-001: stock opname
    { adjustmentId: "adj-001", materialId: "mat-001", delta: 10 },
    { adjustmentId: "adj-001", materialId: "mat-004", delta: -5 },
    { adjustmentId: "adj-001", materialId: "mat-008", delta: 50 },

    // adj-002: kerusakan
    { adjustmentId: "adj-002", materialId: "mat-009", delta: -3 },
    { adjustmentId: "adj-002", materialId: "mat-031", delta: -1 },
  ];

  const adjustmentItemDataWithIds = adjustmentItemData.map((item) => ({
    id: crypto.randomUUID(),
    ...item,
  }));

  await db.insert(adjustmentLineItems).values(adjustmentItemDataWithIds);
  console.log("✅ Adjustment line items seeded");

  console.log("🎉 Seeding complete!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
