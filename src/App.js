import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Container, Typography, Tabs, Tab, Box } from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import BankSelector from "./components/BankSelector";
import BranchCards from "./components/BranchCards";
import MapView from "./components/MapView";
import SearchBar from "./components/SearchBar";
import CitySearch from "./components/CitySearch";
import Header from "./components/Header";
import { fetchAllBanks } from "./api/banksApi";
import createAppTheme from "./theme";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export default function App() {
  const { t, i18n } = useTranslation();
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [branches, setBranches] = useState([]);
  const [nearestBranches, setNearestBranches] = useState([]);
  const [currentTab, setCurrentTab] = useState(0); // Start with "Find Nearest Branch" (now tab 0)
  const [selectedBranch, setSelectedBranch] = useState(null);

  // Determine text direction based on language
  const isRTL = i18n.language === 'he' || i18n.language === 'ar';
  const theme = createAppTheme(isRTL ? 'rtl' : 'ltr');

  // Update document direction when language changes
  useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRTL, i18n.language]);

  // Get user location
  useEffect(() => {
    // Default location: Baqa Algharbiya, Israel
    const defaultLocation = { lat: 32.4186, lng: 35.0417 };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (error) => {
          console.log("Location access denied or failed, using default location:", error);
          // Use default location when geolocation fails
          setUserLocation(defaultLocation);
          setMapCenter(defaultLocation);
        }
      );
    } else {
      console.log("Geolocation not supported, using default location");
      // Use default location when geolocation is not supported
      setUserLocation(defaultLocation);
      setMapCenter(defaultLocation);
    }
  }, []);

  // Fetch all banks
  useEffect(() => {
    const loadBanks = async () => {
      const { banks: uniqueBanks, allBranches } = await fetchAllBanks();
      setBanks(uniqueBanks);
      setBranches(allBranches);
    };
    
    loadBanks();
  }, []);

  // Compute nearest branches when bank or location changes
  useEffect(() => {
    if (!selectedBank || !userLocation) return;

    const bankBranches = branches.filter((b) => b.Bank_Name === selectedBank);

    if (!bankBranches.length) return;

    console.log("User location:", userLocation);
    console.log("Bank branches found:", bankBranches.length);

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371; // km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const sorted = bankBranches
      .map((b) => {
        const lat = parseFloat(b.X_Coordinate);
        const lng = parseFloat(b.Y_Coordinate);
        
        console.log(`Branch: ${b.Branch_Name}`);
        console.log(`Raw coordinates: X=${b.X_Coordinate}, Y=${b.Y_Coordinate}`);
        console.log(`Parsed coordinates: lat=${lat}, lng=${lng}`);
        console.log(`User location: ${userLocation.lat}, ${userLocation.lng}`);
        
        // Check if coordinates are valid
        if (isNaN(lat) || isNaN(lng)) {
          console.error(`Invalid coordinates for branch ${b.Branch_Name}: lat=${lat}, lng=${lng}`);
          return {
            ...b,
            lat: 0,
            lng: 0,
            distance: Infinity, // Mark as invalid
          };
        }
        
        const distance = haversineDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng
        );
        
        console.log(`Distance: ${distance.toFixed(2)}km`);
        
        return {
          ...b,
          lat,
          lng,
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance);

    console.log("Sorted branches:", sorted.slice(0, 3));
    setNearestBranches(sorted.slice(0, 3)); // nearest 3
  }, [selectedBank, userLocation, branches]);

  // Update map center when user location changes
  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation);
    }
  }, [userLocation]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Header />
          
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange} 
              centered
              sx={{ 
                mb: 4,
                "& .MuiTab-root": {
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  minHeight: 56,
                  borderRadius: "8px 8px 0 0",
                  mx: 0.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    color: "primary.main",
                  },
                },
                "& .Mui-selected": {
                  backgroundColor: "primary.50",
                  color: "primary.main",
                  fontWeight: 700,
                  "&:hover": {
                    backgroundColor: "primary.100",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: "primary.main",
                },
              }}
            >
              <Tab label={`📍 ${t("findNearestBranch")}`} />
              <Tab label={`🔍 ${t("searchByCity")}`} />
            </Tabs>

            {currentTab === 0 && (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
                  {t("findNearestBranch")}
                </Typography>

                <BankSelector
                  banks={banks}
                  selectedBank={selectedBank}
                  setSelectedBank={setSelectedBank}
                />

                <SearchBar setUserLocation={setUserLocation} />

                {nearestBranches.length > 0 && userLocation && (
                  <>
                    <BranchCards
                      branches={nearestBranches}
                      userLocation={userLocation}
                      selectedBranch={selectedBranch}
                      setCenter={(lat, lng) => setMapCenter({ lat, lng })}
                      onBranchSelect={setSelectedBranch}
                    />

                    <MapView
                      nearestBranches={nearestBranches}
                      userLocation={userLocation}
                      mapCenter={mapCenter}
                    />
                  </>
                )}
              </Box>
            )}

            {currentTab === 1 && (
              <CitySearch />
            )}
          </Container>
        </Box>
      </LoadScript>
    </ThemeProvider>
  );
}
