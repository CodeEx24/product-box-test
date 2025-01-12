import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Product } from "../../types";
import { ProductSelector } from "../ProductSelector";

describe("ProductSelector Component", () => {
  const mockProducts: Product[] = [
    { id: 1, name: "Product 1", length: 10, width: 5, height: 3, weight: 2 },
    { id: 2, name: "Product 2", length: 20, width: 10, height: 6, weight: 4 },
  ];

  const mockOnProductsChange = vi.fn();

  beforeEach(() => {
    mockOnProductsChange.mockClear();
  });

  it("should render the component with initial UI elements", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    expect(screen.getByText("Select Products")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /add product/i })[0],
    ).toBeInTheDocument();
    expect(screen.getByText("Clear Items")).toBeInTheDocument();
  });

  it("should allow adding a product and update the product list", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    const addProduct = screen.getAllByRole("button", {
      name: /add product/i,
    })[0];
    fireEvent.click(addProduct);
    expect(mockOnProductsChange).toHaveBeenCalledWith([
      { productId: 1, quantity: 1 },
    ]);
  });

  it("should disable the Add Product button when the maximum product limit is reached", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={1}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    const addProduct = screen.getAllByRole("button", {
      name: /add product/i,
    })[0];
    expect(addProduct).toBeDisabled();
  });

  it("should prevent adding more products than the maximum limit", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={1}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    fireEvent.click(screen.getByText("Add Product"));
    expect(mockOnProductsChange).toHaveBeenCalledTimes(0);
  });

  it("should allow removing a selected product", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    // Open the menu by clicking the "More options" icon button
    fireEvent.click(screen.getByLabelText("More options"));

    // Click on the "Delete" option in the menu
    fireEvent.click(screen.getByText("Delete"));

    expect(mockOnProductsChange).toHaveBeenCalledWith([]); // Ensure that the onProductsChange is called with the updated state
  });

  it("should clear all selected products when Clear Items button is clicked", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    fireEvent.click(screen.getByText("Clear Items"));
    expect(mockOnProductsChange).toHaveBeenCalledWith([]);
  });

  it("should allow changing the quantity of a selected product", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "5" },
    });
    expect(mockOnProductsChange).toHaveBeenCalledWith([
      { productId: 1, quantity: 5 },
    ]);
  });

  it("should render product options correctly and handle selection", () => {
    render(
      <ProductSelector
        products={mockProducts}
        selectedProducts={[{ productId: 1, quantity: 1 }]}
        onProductsChange={mockOnProductsChange}
        maxProducts={5}
        handlePack={() => {}}
        isCalculating={false}
      />,
    );

    const product = screen.getAllByText("Product 1")[0];
    expect(product).toBeInTheDocument();

    const selectCombobox = screen.getByRole("combobox");
    fireEvent.mouseDown(selectCombobox);

    mockProducts.forEach((product) => {
      expect(screen.getAllByText(product.name)[0]).toBeInTheDocument();
    });
  });
});
