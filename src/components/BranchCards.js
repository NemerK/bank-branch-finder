import React from "react";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Grid,
  Avatar
} from "@mui/material";
import { 
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Accessibility as AccessibilityIcon,
  Directions as DirectionsIcon
} from "@mui/icons-material";

export default function BranchCards({ branches, userLocation, setCenter, selectedBranch, onBranchSelect }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        {t("closestBranches")}
      </Typography>
      
      <Grid container spacing={3}>
        {branches.map((branch, idx) => (
          <Grid item xs={12} md={4} key={branch.Branch_Name + idx}>
            <Card
              onClick={() => {
                setCenter(branch.lat, branch.lng);
                onBranchSelect(branch);
              }}
              sx={{
                cursor: "pointer",
                height: "100%",
                border: selectedBranch?.Branch_Name === branch.Branch_Name 
                  ? "3px solid #ff0080" 
                  : idx === 0 
                    ? "2px solid" 
                    : "1px solid",
                borderColor: selectedBranch?.Branch_Name === branch.Branch_Name 
                  ? "#ff0080" 
                  : idx === 0 
                    ? "primary.main" 
                    : "divider",
                backgroundColor: selectedBranch?.Branch_Name === branch.Branch_Name 
                  ? "rgba(255, 0, 128, 0.05)" 
                  : idx === 0 
                    ? "primary.50" 
                    : "background.paper",
                boxShadow: selectedBranch?.Branch_Name === branch.Branch_Name 
                  ? "0 0 20px rgba(255, 0, 128, 0.3), 0 4px 12px rgba(0,0,0,0.15)" 
                  : "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": { 
                  transform: "translateY(-4px)",
                  boxShadow: selectedBranch?.Branch_Name === branch.Branch_Name 
                    ? "0 0 25px rgba(255, 0, 128, 0.4), 0 8px 25px rgba(0,0,0,0.15)" 
                    : "0 8px 25px rgba(0,0,0,0.15)",
                  borderColor: selectedBranch?.Branch_Name === branch.Branch_Name 
                    ? "#ff0080" 
                    : "primary.main",
                  "& .branch-name": {
                    color: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "#ff0080" 
                      : "primary.main",
                  },
                  "& .branch-address": {
                    color: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "#ff0080" 
                      : "primary.dark",
                  },
                },
                position: "relative",
              }}
            >
              {idx === 0 && (
                <Chip
                  label={t("closest")}
                  color="primary"
                  size="small"
                  data-closest="true"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: { xs: 12, md: 12 }, // Right side for LTR
                    left: { xs: "auto", md: "auto" }, // Auto for LTR
                    fontWeight: 600,
                    zIndex: 1,
                    // RTL positioning will be handled by CSS
                  }}
                />
              )}
              
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    <DirectionsIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 600 }}
                    className="branch-name"
                  >
                    {branch.Branch_Name}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
                  <LocationIcon sx={{ fontSize: 16, color: "text.secondary", mt: 0.5 }} />
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    className="branch-address"
                  >
                    {branch.Branch_Address}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Typography variant="body2" color="text.secondary">
                    {branch.Telephone}
                  </Typography>
                </Box>
                
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <AccessibilityIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                  <Chip 
                    label={branch.Handicap_Access}
                    size="small"
                    color={branch.Handicap_Access === "כן" ? "success" : "default"}
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider"
                }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    {isFinite(branch.distance) ? `${branch.distance.toFixed(2)} ${t("distance")}` : "Location unavailable"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Click to view on map
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
