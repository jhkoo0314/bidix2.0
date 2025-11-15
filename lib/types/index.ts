// lib/types/index.ts
// Auction Engine v2.0 - SSOT Barrel Export
// Version: 2.0
// Last Updated: 2025-11-07

export * from "./property";
export * from "./valuation";
export * from "./rights";
export * from "./cost";
export * from "./profit";
export * from "./courtdocs";
export * from "./result";

// Explicit re-exports for commonly used types (to ensure TypeScript resolution)
export { DifficultyMode, PropertyCategory, PropertyType } from "./property";
export type { PropertySeed, Property } from "./property";

// Policy types (SSOT re-export)
export type { Policy, PolicyOverrides } from "@/lib/policy/policy";