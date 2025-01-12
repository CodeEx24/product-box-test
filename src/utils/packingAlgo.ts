import _ from "lodash";
import {
  Box,
  PackedBox,
  PackingResult,
  Product,
  ProductSelection,
} from "../types";

/**
 * Determines if a product can fit inside a box
 * @param product - The product to check
 * @param box - The box to check against
 * @returns boolean indicating if the product can fit
 */
const canFitInBox = (product: Product, box: Box): boolean => {
  const isVolumeFit =
    product.length <= box.length &&
    product.width <= box.width &&
    product.height <= box.height;
  const isWeightFit = product.weight <= box.weight_limit;
  return isVolumeFit && isWeightFit;
};

/**
 * Calculates volume-to-weight efficiency ratio for product packing priority
 * Higher ratio means product should be packed earlier (Render priority in the UI)
 * @param product - Product to calculate efficiency for
 * @returns Efficiency ratio (volume/weight)
 */
const calculateProductEfficiency = (product: Product): number => {
  const volume = product.length * product.width * product.height;

  return volume / product.weight;
};

/**
 * Finds the smallest box that can fit a product and handle its weight
 * @param boxes - Array of available boxes
 * @param product - Product to fit
 * @param weight - Total weight to support (product weight × quantity)
 * @returns The smallest suitable box or null if none found
 */
const findSmallestSuitableBox = (
  boxes: Box[],
  product: Product,
  weight: number,
): Box | null => {
  const smallestBox = _.find(
    _.sortBy(boxes, (box) => box.length * box.width * box.height),
    (box) => canFitInBox(product, box) && weight <= box.weight_limit,
  );

  return smallestBox || null;
};

/**
 * Finds an existing packed box that can accommodate additional weight and dimensions
 * @param packedBoxes - Array of already packed boxes
 * @param product - Product to fit
 * @param quantity - Quantity of the product
 * @returns Suitable packed box or null if none found
 */
const findSuitableExistingBoxForCombination = (
  packedBoxes: PackedBox[],
  product: Product,
  quantity: number,
): PackedBox | null => {
  const totalWeight = product.weight * quantity;

  return (
    _.find(packedBoxes, (packedBox) => {
      return (
        packedBox.totalWeight + totalWeight <= packedBox.box.weight_limit &&
        canFitInBox(product, packedBox.box)
      );
    }) || null
  );
};

/**
 * Creates a new empty packed box instance
 * @param box - Box type to create packed box from
 * @returns New PackedBox instance with initial values
 */
const createNewPackedBox = (box: Box): PackedBox => ({
  box,
  products: [],
  totalWeight: 0,
  remainingWeight: box.weight_limit,
  utilization: 0,
});

/**
 * Adds a product to a packed box and updates its metrics
 * @param packedBox - Existing packed box to update
 * @param product - Product to add
 * @param quantity - Quantity of product to add
 * @returns Updated packed box with new product and metrics
 */
const addProductToBox = (
  packedBox: PackedBox,
  product: Product,
  quantity: number,
): PackedBox => {
  const totalWeight = product.weight * quantity;

  return {
    ...packedBox,
    products: [...packedBox.products, { product, quantity }],
    totalWeight: packedBox.totalWeight + totalWeight,
    remainingWeight:
      packedBox.box.weight_limit - (packedBox.totalWeight + totalWeight),
    utilization:
      ((packedBox.totalWeight + totalWeight) / packedBox.box.weight_limit) *
      100,
  };
};

/**
 * Main packing function that distributes products among boxes optimally
 * @param products - Array of product selections (id and quantity)
 * @param productList - Master list of all available products
 * @param boxes - Array of available box types
 * @returns Packing result with success status and box assignments
 */
const packProducts = (
  products: ProductSelection[],
  productList: Product[],
  boxes: Box[],
): PackingResult => {
  const result: PackingResult = {
    success: true,
    packedBoxes: [],
    unpackableProducts: [],
  };

  const productsWithData = _.orderBy(
    products.map((selection) => ({
      selection,
      product: _.find(productList, { id: selection.productId })!,
      efficiency: calculateProductEfficiency(
        _.find(productList, { id: selection.productId })!,
      ),
    })),
    ["efficiency"],
    ["desc"],
  );

  for (const { selection, product } of productsWithData) {
    const totalWeight = product.weight * selection.quantity;
    let packedBox = findSuitableExistingBoxForCombination(
      result.packedBoxes,
      product,
      selection.quantity,
    );

    if (!packedBox) {
      const smallestBox = findSmallestSuitableBox(boxes, product, totalWeight);
      if (!smallestBox) {
        result.success = false;
        result.unpackableProducts!.push({
          product,
          quantity: selection.quantity,
          reason: "No suitable box found for product dimensions or weight",
        });
        continue;
      }
      packedBox = createNewPackedBox(smallestBox);
      result.packedBoxes.push(packedBox);
    }

    const boxIndex = result.packedBoxes.findIndex((pb) => pb === packedBox);
    result.packedBoxes[boxIndex] = addProductToBox(
      packedBox,
      product,
      selection.quantity,
    );
  }

  return result;
};

export {
  addProductToBox,
  calculateProductEfficiency,
  canFitInBox,
  createNewPackedBox,
  findSmallestSuitableBox,
  findSuitableExistingBoxForCombination,
  packProducts,
};
