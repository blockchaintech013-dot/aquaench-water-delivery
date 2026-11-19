import { describe, expect, it } from "vitest";

import {
  AQUAENCH_PRODUCTS,
  calculateBottleCharge,
  calculateOrderTotal,
  calculateWaterSubtotal,
  DELIVERY_FEE,
  WATER_BOTTLE_PRICE,
} from "@/lib/aquaench-store";

describe("Aquaench order pricing", () => {
  it("prices 20L water at Ksh 150", () => {
    expect(calculateWaterSubtotal([{ productId: "20L", quantity: 1 }])).toBe(150);
  });

  it("prices 10L water at Ksh 90", () => {
    expect(calculateWaterSubtotal([{ productId: "10L", quantity: 1 }])).toBe(90);
  });

  it("keeps delivery free", () => {
    expect(DELIVERY_FEE).toBe(0);
    expect(calculateOrderTotal([{ productId: "20L", quantity: 2 }])).toBe(300);
  });

  it("keeps the optional bottle unpriced and excludes it from the payable total", () => {
    expect(AQUAENCH_PRODUCTS["20L"].price).toBe(150);
    expect(WATER_BOTTLE_PRICE).toBeNull();
    expect(calculateBottleCharge(2)).toBe(0);
    expect(calculateOrderTotal([{ productId: "10L", quantity: 1 }], true, 2)).toBe(90);
  });
});