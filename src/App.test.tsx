import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { products } from "./data";

describe("App Component", () => {
  it("should render the main elements of the app", async () => {
    render(<App />);

    expect(screen.getByText(/Boxing Challenge/i)).toBeInTheDocument();
    expect(screen.getAllByText("Select Products")[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Clear Items" })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Calculate Packing/i }),
    ).toBeDisabled();
  });

  it("should allow product selection and enable the Calculate Packing button", async () => {
    render(<App />);

    const buttons = screen.getAllByRole("button", { name: /add product/i });
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);

    const productSelect = screen.getByTestId("product-select-0");
    fireEvent.change(productSelect, { target: { value: products[0].id } });

    const productOption = await screen.findByText(products[0].name);
    fireEvent.click(productOption);

    await waitFor(() => {
      const calcButton = screen.getByRole("button", {
        name: /Calculate Packing/i,
      });
      expect(calcButton).toBeEnabled();
    });
  });
});
