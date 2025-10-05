import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  TextField, 
  List, 
  ListItem, 
  ListItemButton, 
  Box,
  Typography,
  Paper
} from "@mui/material";
import { MyLocation as MyLocationIcon } from "@mui/icons-material";

export default function SearchBar({ setUserLocation }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setSuggestions([]);
      return;
    }

    // Fetch city suggestions
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${value}&country=Israel&format=json`
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const handleSelect = (place) => {
    setUserLocation({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
    setQuery(place.display_name);
    setSuggestions([]);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <MyLocationIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("yourLocation")}
        </Typography>
      </Box>
      
      <Box sx={{ position: "relative" }}>
        <TextField
          fullWidth
          label={t("selectCity")}
          variant="outlined"
          value={query}
          onChange={handleSearch}
          placeholder="Enter city name to search..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />

        {suggestions.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 1,
              maxHeight: 200,
              overflowY: "auto",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <List disablePadding>
              {suggestions.map((place, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton 
                    onClick={() => handleSelect(place)}
                    sx={{
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Typography variant="body2">
                      {place.display_name}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
