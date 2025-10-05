import React from "react";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Box, Typography, Paper } from "@mui/material";
import { Map as MapIcon } from "@mui/icons-material";

export default function MapView({ nearestBranches, userLocation, mapCenter }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <MapIcon sx={{ color: "primary.main" }} />
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Interactive Map
        </Typography>
      </Box>
      
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          height: 500,
        }}
      >
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={mapCenter || userLocation}
          zoom={14}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {nearestBranches.map((branch, idx) => (
            <Marker
              key={branch.Branch_Name + idx}
              position={{ lat: branch.lat, lng: branch.lng }}
              title={branch.Branch_Name}
              icon={{
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="12" fill="${idx === 0 ? '#1976d2' : '#42a5f5'}" stroke="white" stroke-width="2"/>
                    <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${idx + 1}</text>
                  </svg>
                `)}`,
                scaledSize: new window.google.maps.Size(32, 32),
              }}
            />
          ))}
          <Marker 
            position={userLocation} 
            title={t("you")}
            icon={{
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="12" fill="#dc004e" stroke="white" stroke-width="2"/>
                  <text x="16" y="20" text-anchor="middle" fill="white" font-size="10" font-weight="bold">YOU</text>
                </svg>
              `)}`,
              scaledSize: new window.google.maps.Size(32, 32),
            }}
          />
        </GoogleMap>
      </Paper>
    </Box>
  );
}
