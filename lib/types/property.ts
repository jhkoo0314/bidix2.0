// lib/types/property.ts
// Auction Engine v2.2 – Property Types
// Last Updated: 2025-11-13

export enum PropertyCategory {
  Residential = "residential",
  Commercial = "commercial",
}

export enum PropertyType {
  Apartment = "apartment",
  Villa = "villa",
  Officetel = "officetel",
  MultiHouse = "multi_house",
  Detached = "detached",
  ResidentialLand = "res_land",
  Store = "store",
  Office = "office",
  Factory = "factory",
  Warehouse = "warehouse",
  CommercialLand = "com_land",
}

export enum DifficultyMode {
  Easy = "easy",
  Normal = "normal",
  Hard = "hard",
}

export interface PropertySeed {
  id?: string;
  category: PropertyCategory;
  type: PropertyType;
  sizeM2: number;
  landSizeM2?: number;
  yearBuilt?: number;
  floorInfo?: { total: number | null; current: number | null };
  address?: string;
  auctionStep?: number;
  difficulty: DifficultyMode;
  buildingUse?: string;
}

export interface Property {
  id: string;
  category: PropertyCategory;
  type: PropertyType;
  sizeM2: number;
  landSizeM2: number | null;
  yearBuilt: number | null;
  appraisalValue: number;
  auctionStep: number;
  address: string;
  difficulty: DifficultyMode;
  floorInfo: { total: number | null; current: number | null };
  buildingUse: string;
}
