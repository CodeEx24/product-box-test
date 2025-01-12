import { describe, expect, it } from "vitest";
import {
  Box,
  PackedBox,
  PackingResult,
  Product,
  ProductSelection,
} from "../../types";
import {
  addProductToBox,
  calculateProductEfficiency,
  canFitInBox,
  createNewPackedBox,
  findSmallestSuitableBox,
  findSuitableExistingBoxForCombination,
  packProducts,
} from "../packingAlgo";

describe("canFitInBox - Product Fits Within Box Dimensions", () => {
  it("should return true if the product fits within the box's dimensions", () => {
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 10,
      width: 5,
      height: 5,
      weight: 10,
    };
    const box: Box = {
      id: 1,
      name: "Box 1",
      length: 15,
      width: 10,
      height: 10,
      weight_limit: 50,
    };
    expect(canFitInBox(product, box)).toBe(true);
  });

  it("should return false if the product exceeds the box's dimensions", () => {
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 20,
      width: 15,
      height: 15,
      weight: 10,
    };
    const box: Box = {
      id: 1,
      name: "Box 1",
      length: 15,
      width: 10,
      height: 10,
      weight_limit: 50,
    };
    expect(canFitInBox(product, box)).toBe(false);
  });

  it("should return false if the product exceeds the box's weight limit", () => {
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 10,
      width: 5,
      height: 5,
      weight: 100,
    };
    const box: Box = {
      id: 1,
      name: "Box 1",
      length: 15,
      width: 10,
      height: 10,
      weight_limit: 50,
    };
    expect(canFitInBox(product, box)).toBe(false);
  });
});

describe("calculateProductEfficiency - Calculate Efficiency Based on Volume", () => {
  it("should return the correct efficiency ratio based on product dimensions", () => {
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 10,
      width: 5,
      height: 5,
      weight: 10,
    };
    const product2: Product = {
      id: 1,
      name: "Test Product",
      length: 35,
      width: 25,
      height: 15,
      weight: 10,
    };
    expect(calculateProductEfficiency(product)).toEqual(25);
    expect(calculateProductEfficiency(product2)).toEqual(1312.5);
  });
});

describe("findSmallestSuitableBox - Find the Smallest Box for a Product", () => {
  it("should return the smallest suitable box that fits the product and weight", () => {
    const boxes: Box[] = [
      {
        id: 1,
        name: "Box 1",
        length: 10,
        width: 10,
        height: 10,
        weight_limit: 50,
      },
      {
        id: 2,
        name: "Box 2",
        length: 15,
        width: 15,
        height: 15,
        weight_limit: 100,
      },
    ];
    const product: Product = {
      id: 1,
      name: "Product 1",
      length: 10,
      width: 10,
      height: 10,
      weight: 20,
    };
    const box = findSmallestSuitableBox(boxes, product, 20);
    expect(box).toEqual(boxes[0]);
  });

  it("should return null if no suitable box is found", () => {
    const boxes: Box[] = [
      {
        id: 1,
        name: "Box 1",
        length: 5,
        width: 5,
        height: 5,
        weight_limit: 20,
      },
    ];
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 10,
      width: 10,
      height: 10,
      weight: 30,
    };
    expect(findSmallestSuitableBox(boxes, product, 30)).toBeNull();
  });
});

describe("findSuitableExistingBoxForCombination - Find Suitable Packed Box for Product", () => {
  it("should return a suitable packed box if the product can fit", () => {
    const packedBoxes: PackedBox[] = [
      {
        box: {
          id: 1,
          name: "Box 1",
          length: 15,
          width: 15,
          height: 15,
          weight_limit: 100,
        },
        products: [
          {
            product: {
              id: 1,
              name: "Test Product",
              length: 10,
              width: 10,
              height: 10,
              weight: 20,
            },
            quantity: 1,
          },
        ],
        totalWeight: 20,
        remainingWeight: 80,
        utilization: 20,
      },
    ];
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
    };
    const packedBox = findSuitableExistingBoxForCombination(
      packedBoxes,
      product,
      3,
    );
    expect(packedBox).toBeTruthy();
  });

  it("should return null if no suitable packed box exists", () => {
    const packedBoxes: PackedBox[] = [
      {
        box: {
          id: 1,
          name: "Box 1",
          length: 10,
          width: 10,
          height: 10,
          weight_limit: 50,
        },
        products: [
          {
            product: {
              id: 1,
              name: "Test Product",
              length: 8,
              width: 8,
              height: 8,
              weight: 10,
            },
            quantity: 5,
          },
        ],
        totalWeight: 50,
        remainingWeight: 0,
        utilization: 100,
      },
    ];
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 10,
      width: 10,
      height: 10,
      weight: 20,
    };
    expect(
      findSuitableExistingBoxForCombination(packedBoxes, product, 2),
    ).toBeNull();
  });
});

describe("createNewPackedBox - Create a New Packed Box", () => {
  it("should create a new packed box instance with the correct structure", () => {
    const box: Box = {
      id: 1,
      name: "Box 1",
      length: 15,
      width: 15,
      height: 15,
      weight_limit: 100,
    };
    const packedBox = createNewPackedBox(box);
    expect(packedBox).toEqual({
      box,
      products: [],
      totalWeight: 0,
      remainingWeight: 100,
      utilization: 0,
    });
  });
});

describe("addProductToBox - Add Product and Update Packed Box", () => {
  it("should add the product to the packed box and update its metrics", () => {
    const packedBox: PackedBox = {
      box: {
        id: 1,
        name: "Box 1",
        length: 15,
        width: 15,
        height: 15,
        weight_limit: 100,
      },
      products: [
        {
          product: {
            id: 1,
            name: "Test Product",
            length: 10,
            width: 10,
            height: 10,
            weight: 20,
          },
          quantity: 1,
        },
      ],
      totalWeight: 20,
      remainingWeight: 80,
      utilization: 20,
    };
    const product: Product = {
      id: 1,
      name: "Test Product",
      length: 5,
      width: 5,
      height: 5,
      weight: 10,
    };
    const updatedPackedBox = addProductToBox(packedBox, product, 2);
    expect(updatedPackedBox.products.length).toBe(2);
    expect(updatedPackedBox.totalWeight).toBe(40);
    expect(updatedPackedBox.remainingWeight).toBe(60);
    expect(updatedPackedBox.utilization).toBe(40);
  });
});

describe("packProducts - Pack Products into Boxes", () => {
  it("should correctly pack the products into suitable boxes", () => {
    const products: ProductSelection[] = [
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 2 },
    ];
    const productList: Product[] = [
      {
        id: 1,
        length: 10,
        width: 10,
        height: 10,
        weight: 20,
        name: "Product 1",
      },
      { id: 2, length: 5, width: 5, height: 5, weight: 10, name: "Product 2" },
    ];
    const boxes: Box[] = [
      {
        id: 1,
        name: "Box 1",
        length: 15,
        width: 15,
        height: 15,
        weight_limit: 100,
      },
      {
        id: 2,
        name: "Box 2",
        length: 10,
        width: 10,
        height: 10,
        weight_limit: 50,
      },
    ];

    const result: PackingResult = packProducts(products, productList, boxes);

    expect(result.success).toBe(true);
    expect(result.packedBoxes.length).toBe(1);
    expect(result.unpackableProducts?.length).toBe(0);
  });

  it("should handle the case where no suitable box exists for a product", () => {
    const products: ProductSelection[] = [{ productId: 1, quantity: 10 }];
    const productList: Product[] = [
      {
        id: 1,
        length: 10,
        width: 10,
        height: 10,
        weight: 100,
        name: "Product 1",
      },
    ];
    const boxes: Box[] = [
      {
        id: 1,
        name: "Box 1",
        length: 15,
        width: 15,
        height: 15,
        weight_limit: 100,
      },
    ];

    const result: PackingResult = packProducts(products, productList, boxes);

    expect(result.success).toBe(false);
    expect(result.unpackableProducts?.length).toBe(1);
  });
});
