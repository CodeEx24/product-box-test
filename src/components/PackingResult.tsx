import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  AlertTitle,
  Box,
  Divider,
  Grid2 as Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import React from "react";
import { BoxIcon } from "../assets/svg/BoxIcon";
import { PackingResult } from "../types";

interface PackingResultsProps {
  result: PackingResult;
}

export const PackingResults: React.FC<PackingResultsProps> = ({ result }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        color="primary.main"
        fontWeight={"bold"}
      >
        Packing Results
      </Typography>

      {!result.success && result.unpackableProducts && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Warning: Some products could not be packed</AlertTitle>
          {result.unpackableProducts.map((item, index) => (
            <Typography key={index} variant="body2" sx={{ mt: 1 }}>
              {item.quantity}x {item.product.name}: {item.reason}
            </Typography>
          ))}
        </Alert>
      )}

      <Box sx={{ mt: 2 }}>
        {result.packedBoxes.map((packedBox, boxIndex) => {
          return (
            <Accordion key={boxIndex} defaultExpanded sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="subtitle1"
                  fontWeight={"bold"}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <BoxIcon style={{ marginBottom: 1 }} />
                  Box {boxIndex + 1}: {packedBox.box.name}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2">
                      Dimensions: {packedBox.box.length}x{packedBox.box.width}x
                      {packedBox.box.height} cm
                    </Typography>
                    <Typography variant="body2">
                      Weight Limit: {packedBox.box.weight_limit} kg
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="body2">
                      Total Weight: {packedBox.totalWeight.toFixed(1)} kg
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2">
                        Utilization: {packedBox.utilization.toFixed(1)}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={packedBox.utilization}
                        sx={{ flexGrow: 1 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Packed Items:
                </Typography>
                <List dense>
                  <Grid container spacing={2}>
                    {packedBox.products.map((item, itemIndex) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={itemIndex}>
                        <ListItem>
                          <Box
                            sx={{
                              width: "30px",
                              height: "30px",
                              backgroundColor: "primary.main",
                              color: "white",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: "50%",
                              marginRight: 2,
                            }}
                          >
                            <Typography variant="body2">
                              {itemIndex + 1}
                            </Typography>
                          </Box>
                          <ListItemText
                            primary={`${item.quantity}x ${item.product.name}`}
                            secondary={`${item.product.length}x${item.product.width}x${item.product.height} cm, ${item.product.weight} kg each`}
                          />
                        </ListItem>
                      </Grid>
                    ))}
                  </Grid>
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
};
