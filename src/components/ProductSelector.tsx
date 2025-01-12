import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { EmptyBox } from "../assets/svg/ExmptyBox";
import { Product, ProductSelection } from "../types";
interface ProductSelectorProps {
  products: Product[];
  selectedProducts: ProductSelection[];
  onProductsChange: (products: ProductSelection[]) => void;
  maxProducts: number;
  handlePack: () => void;
  isCalculating: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProducts,
  onProductsChange,
  maxProducts,
  handlePack,
  isCalculating,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddProduct = () => {
    if (selectedProducts.length >= maxProducts) return;

    const newProduct = products.find(
      (product) =>
        !selectedProducts.some((selected) => selected.productId === product.id),
    );

    if (newProduct) {
      onProductsChange([
        ...selectedProducts,
        { productId: newProduct.id, quantity: 1 },
      ]);
    }
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts];
    newProducts.splice(index, 1);
    onProductsChange(newProducts);
  };

  const handleClearProducts = () => {
    onProductsChange([]);
  };

  const handleProductChange = (
    index: number,
    event: SelectChangeEvent<number>,
  ) => {
    const newProducts = [...selectedProducts];
    newProducts[index] = {
      ...newProducts[index],
      productId: Number(event.target.value),
    };
    onProductsChange(newProducts);
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const quantity = Math.max(1, parseInt(event.target.value) || 1);
    const newProducts = [...selectedProducts];
    newProducts[index] = { ...newProducts[index], quantity };
    onProductsChange(newProducts);
  };

  const getProductDetails = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product
      ? {
          dimensions: `${product.length}x${product.width}x${product.height}cm`,
          weight: `${product.weight}kg`,
        }
      : { dimensions: "", weight: "" };
  };

  return (
    <Box className="product-selector-container">
      <Box className="product-selector-container-box">
        <Typography variant="h6" component="h2">
          Select Products
        </Typography>
        <Chip
          label={`${selectedProducts.length}/${maxProducts} items`}
          color={
            selectedProducts.length === maxProducts ? "warning" : "default"
          }
          size="small"
        />
      </Box>

      <Stack spacing={3}>
        <TableContainer component="div" className="custom-scrollbar">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: { xs: "400px", sm: "300px" },
                    fontWeight: "bold",
                  }}
                >
                  Item
                </TableCell>
                <TableCell
                  sx={{
                    width: { xs: "200px", sm: "400px" },
                    fontWeight: "bold",
                  }}
                >
                  Dimension
                </TableCell>
                <TableCell
                  sx={{ width: { xs: "50px", sm: "80px" }, fontWeight: "bold" }}
                >
                  Weight
                </TableCell>
                <TableCell
                  sx={{
                    width: { xs: "120px", sm: "120px" },
                    fontWeight: "bold",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{ width: { xs: "50px", sm: "80px" }, fontWeight: "bold" }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            {selectedProducts.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ paddingY: 6 }}>
                    <EmptyBox style={{ fontSize: "40px" }} />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 2 }}
                    >
                      No products added yet
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddProduct}
                    >
                      Add Product
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              selectedProducts.map((selection, index) => {
                const productDetails = getProductDetails(selection.productId);

                return (
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <FormControl fullWidth>
                          <Select
                            value={selection.productId}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                e as SelectChangeEvent<number>,
                              )
                            }
                            size="small"
                            inputProps={{
                              "data-testid": `product-select-${index}`,
                            }}
                          >
                            {products.map((product) => {
                              const isDisabled = selectedProducts.some(
                                (selected) =>
                                  selected.productId === product.id &&
                                  selected.productId !== selection.productId,
                              );
                              const prodData = getProductDetails(product.id);

                              return (
                                <MenuItem
                                  key={product.id}
                                  value={product.id}
                                  disabled={isDisabled}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Typography>{product.name}</Typography>
                                    {product.id !== selection.productId && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {prodData.dimensions} {prodData.weight}
                                      </Typography>
                                    )}
                                  </Box>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell>{productDetails.dimensions}</TableCell>

                      <TableCell>{productDetails.weight}</TableCell>

                      <TableCell>
                        <TextField
                          type="number"
                          value={selection.quantity}
                          onChange={(e) => handleQuantityChange(e, index)}
                          size="small"
                          label="Quantity"
                          InputProps={{
                            inputProps: {
                              min: 1,
                              max: 100,
                            },
                          }}
                          error={selection.quantity > 100}
                          helperText={
                            selection.quantity > 100
                              ? "Quantity cannot exceed 100"
                              : ""
                          }
                          fullWidth
                          sx={{
                            width: { xs: "90px", sm: "120px" },
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Remove item" aria-label="Remove Item">
                          <IconButton
                            onClick={() => handleRemoveProduct(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={productDetails.dimensions}>
                          <InfoIcon
                            sx={{
                              position: "absolute",
                              right: { xs: 48, sm: 8 },
                              top: 8,
                              color: "action.active",
                              display: { xs: "block", sm: "none" },
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })
            )}
          </Table>
        </TableContainer>
        <Box
          display="flex"
          justifyContent="flex-end"
          gap={2}
          sx={{
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            disabled={selectedProducts.length === maxProducts}
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            variant="outlined"
            color="primary"
            fullWidth={isMobile}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", sm: "flex-start" },
            }}
          >
            Add Product
          </Button>

          <Button
            disabled={selectedProducts.length === 0}
            startIcon={<DeleteIcon />}
            onClick={handleClearProducts}
            variant="outlined"
            color="secondary"
            fullWidth={isMobile}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", sm: "flex-start" },
            }}
          >
            Clear Items
          </Button>

          <Button
            variant="contained"
            onClick={handlePack}
            disabled={selectedProducts.length === 0 || isCalculating}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", sm: "flex-start" },
            }}
          >
            {isCalculating ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Calculate Packing"
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
