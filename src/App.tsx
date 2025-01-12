import {
  Box,
  Button,
  Container,
  GlobalStyles,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { MainBox } from "./assets/svg/MainBox";
import { PackingResults, ProductSelector } from "./components";
import { boxes, products } from "./data";
import { appTheme } from "./theme";
import {
  PackingResult,
  Product,
  Box as ProductBox,
  ProductSelection,
} from "./types";
import { packProducts } from "./utils";

export default function App() {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const [activeStep, setActiveStep] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState<ProductSelection[]>(
    [],
  );
  const [packingResult, setPackingResult] = useState<PackingResult | null>(
    null,
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const steps = ["Select Products", "Review Packing"];

  const handlePack = async () => {
    setIsCalculating(true);

    setTimeout(() => {
      const result = packProducts(
        selectedProducts,
        products as Product[],
        boxes as ProductBox[],
      );
      setPackingResult(result);
      setActiveStep(1);
      setIsCalculating(false);
    }, 800);
  };

  const handleGoBack = () => {
    setPackingResult(null);
    setActiveStep(0);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            "&::-webkit-scrollbar": {
              width: "4px",
              height: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "green",
              borderRadius: "10px",
              border: "3px solid hsl(217.2, 91.2%, 59.8%)",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#ffffff",
              borderRadius: "10px",
            },
          },
          "#root": {
            padding: 0,
          },
        }}
      />
      <Box
        sx={{
          bgcolor: "background.default",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={0}
            sx={{
              bgcolor: "transparent",
              p: { xs: 0, sm: 1 },
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              gutterBottom
              sx={{
                my: 6,
                textAlign: { xs: "center", sm: "left" },
                color: "primary.main",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <MainBox style={{ marginBottom: 1 }} />
              Boxing Challenge
            </Typography>

            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                display: { xs: "none", sm: "flex" },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <Button onClick={handleGoBack}>
                    <StepLabel>{label}</StepLabel>
                  </Button>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ mb: 4 }}>
              {activeStep === 0 ? (
                <Box>
                  <ProductSelector
                    products={products as Product[]}
                    selectedProducts={selectedProducts}
                    onProductsChange={setSelectedProducts}
                    maxProducts={10}
                    handlePack={handlePack}
                    isCalculating={isCalculating}
                  />
                </Box>
              ) : (
                <Box>
                  <div ref={contentRef} className="print-results">
                    <PackingResults result={packingResult!} />
                  </div>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleGoBack}
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: { xs: "100%", sm: "200px" },
                      }}
                    >
                      Go Back
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => reactToPrintFn()}
                      size={isMobile ? "large" : "medium"}
                      sx={{
                        minWidth: { xs: "100%", sm: "200px" },
                      }}
                    >
                      Print Results
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
