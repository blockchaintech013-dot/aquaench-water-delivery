export const AQUAENCH_PRODUCTS = {
  "20L": { id: "20L", name: "20L", volume: "20 Litres", price: 150 },
  "10L": { id: "10L", name: "10L", volume: "10 Litres", price: 90 },
} as const;

export type ProductId = keyof typeof AQUAENCH_PRODUCTS;
export type StoreProduct = (typeof AQUAENCH_PRODUCTS)[ProductId];

export interface CartLine {
  productId: ProductId;
  quantity: number;
}

export const DELIVERY_FEE = 0;
export const WATER_BOTTLE_PRICE: number | null = null;

export function calculateWaterSubtotal(cart: readonly CartLine[]): number {
  return cart.reduce(
    (subtotal, line) => subtotal + AQUAENCH_PRODUCTS[line.productId].price * line.quantity,
    0,
  );
}

export function calculateBottleCharge(quantity: number): number {
  return WATER_BOTTLE_PRICE === null ? 0 : WATER_BOTTLE_PRICE * quantity;
}

export function calculateOrderTotal(
  cart: readonly CartLine[],
  includeBottle = false,
  bottleQuantity = 1,
): number {
  return (
    calculateWaterSubtotal(cart) +
    (includeBottle ? calculateBottleCharge(bottleQuantity) : 0) +
    DELIVERY_FEE
  );
}