import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Autocomplete
} from "@mui/material";
import { Search as SearchIcon, LocationOn as LocationIcon } from "@mui/icons-material";
import { fetchAllBanks } from "../api/banksApi";

export default function CitySearch() {
  const { t } = useTranslation();
  const [cityName, setCityName] = useState("");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [allBranches, setAllBranches] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      const { allBranches: branchesData, cities } = await fetchAllBanks();
      setAllBranches(branchesData);
      setAvailableCities(cities.sort());
    };
    loadData();
  }, []);

  const searchBranchesByCity = () => {
    if (!cityName.trim()) {
      setError(t("enterCityName"));
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      console.log("Searching for city:", cityName);
      
      // Filter branches locally from the already loaded data
      const filteredBranches = allBranches.filter(branch => 
        branch.City === cityName
      );
      
      console.log("Found branches:", filteredBranches.length);
      setBranches(filteredBranches);
      
      if (filteredBranches.length === 0) {
        setError(t("noBranchesFound", { city: cityName }));
      }
    } catch (err) {
      setError("Error searching data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event, newValue) => {
    setCityName(newValue || "");
    setBranches([]);
    setError("");
    setSelectedBranch(null);
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <LocationIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {t("searchByCity")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("description")}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, maxWidth: 600, mx: "auto" }}>
        <Autocomplete
          fullWidth
          options={availableCities}
          value={cityName}
          onChange={handleCityChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("cityPlaceholder")}
              variant="outlined"
              placeholder="לדוגמה: תל אביב, ירושלים, חיפה"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                  },
                  "&.Mui-focused": {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                },
              }}
            />
          )}
          sx={{
            "& .MuiAutocomplete-listbox": {
              maxHeight: 200,
            },
            "& .MuiAutocomplete-option": {
              "&:hover": {
                backgroundColor: "primary.50",
              },
              "&.Mui-focused": {
                backgroundColor: "primary.100",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={searchBranchesByCity}
          disabled={loading || !cityName.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ 
            minWidth: 140,
            px: 3,
            py: 1.5,
          }}
        >
          {loading ? t("searching") : t("search")}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: "auto" }}>
          {error}
        </Alert>
      )}

      {branches.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
            {t("foundBranches", { count: branches.length, city: cityName })}
          </Typography>
          
          <Grid container spacing={3}>
            {branches.map((branch, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card 
                  onClick={() => setSelectedBranch(branch)}
                  sx={{ 
                    height: '100%',
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                    border: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "3px solid #ff0080" 
                      : "1px solid",
                    borderColor: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "#ff0080" 
                      : "divider",
                    backgroundColor: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "rgba(255, 0, 128, 0.05)" 
                      : "background.paper",
                    boxShadow: selectedBranch?.Branch_Name === branch.Branch_Name 
                      ? "0 0 20px rgba(255, 0, 128, 0.3), 0 4px 12px rgba(0,0,0,0.15)" 
                      : "none",
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
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {branch.Bank_Name}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      color="primary" 
                      sx={{ fontWeight: 600, mb: 2 }}
                      className="branch-name"
                    >
                      {branch.Branch_Name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {branch.Branch_Address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        📞 {branch.Telephone}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`♿ ${branch.Handicap_Access}`}
                      size="small"
                      color={branch.Handicap_Access === "כן" ? "success" : "default"}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      🏙️ {branch.City}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
