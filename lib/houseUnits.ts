export const HOUSE_UNITS = ["R01-10", "R01-12", "R02-05", "R02-08", "R03-01", "R03-04"] as const;

export type HouseUnit = (typeof HOUSE_UNITS)[number];
