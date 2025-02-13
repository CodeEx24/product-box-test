import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PackedBox, PackingResult, Product } from "../../types";
import { PackingResults } from "../PackingResult";

const mockProduct: Product = {
  id: 1,
  name: "Product A",
  length: 5,
  width: 5,
  height: 5,
  weight: 10,
};

const mockPackedBox: PackedBox = {
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
      product: mockProduct,
      quantity: 2,
    },
  ],
  totalWeight: 20,
  remainingWeight: 30,
  utilization: 40,
};

const mockPackingResultSuccess: PackingResult = {
  success: true,
  packedBoxes: [mockPackedBox],
};

const mockUnpackableProduct = {
  product: {
    id: 2,
    name: "Product B",
    length: 6,
    width: 6,
    height: 6,
    weight: 15,
  },
  quantity: 1,
  reason: "Exceeded weight limit",
};

const mockPackingResultFailure: PackingResult = {
  success: false,
  unpackableProducts: [mockUnpackableProduct],
  packedBoxes: [mockPackedBox],
};

describe("PackingResults Component", () => {
  it("should display successful packing result with packed box details", () => {
    render(<PackingResults result={mockPackingResultSuccess} />);
    expect(screen.getByText("Packing Results")).toBeInTheDocument();
    expect(screen.getByText("Box 1: Box 1")).toBeInTheDocument();
    expect(screen.getByText("Total Weight: 20.0 kg")).toBeInTheDocument();
  });

  it("should render unsuccessful packing result with unpackable product details", () => {
    render(<PackingResults result={mockPackingResultFailure} />);
    expect(screen.getByText("Packing Results")).toBeInTheDocument();
    expect(screen.getByText("Box 1: Box 1")).toBeInTheDocument();
    expect(
      screen.getByText("1x Product B: Exceeded weight limit"),
    ).toBeInTheDocument();
    expect(screen.getByText("Total Weight: 20.0 kg")).toBeInTheDocument();
  });

  it("should display warning for unpackable products when there are packing issues", () => {
    render(<PackingResults result={mockPackingResultFailure} />);
    expect(
      screen.getByText("Warning: Some products could not be packed"),
    ).toBeInTheDocument();
    expect(screen.getByText("Packing Results")).toBeInTheDocument();
  });

  it("should not show warning for unpackable products if all products are packed successfully", () => {
    render(<PackingResults result={mockPackingResultSuccess} />);
    expect(
      screen.queryByText("Warning: Some products could not be packed"),
    ).not.toBeInTheDocument();
  });

  it("should render packed box details with correct dimensions, weight, and utilization", () => {
    render(<PackingResults result={mockPackingResultSuccess} />);
    expect(screen.getByText("Box 1: Box 1")).toBeInTheDocument();
    expect(screen.getByText("Dimensions: 10x10x10 cm")).toBeInTheDocument();
    expect(screen.getByText("Weight Limit: 50 kg")).toBeInTheDocument();
    expect(screen.getByText("Utilization: 40.0%")).toBeInTheDocument();
    expect(screen.getByText("2x Product A")).toBeInTheDocument();
  });
});
