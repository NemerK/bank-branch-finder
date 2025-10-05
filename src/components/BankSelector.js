import React from "react";
import { useTranslation } from "react-i18next";
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography
} from "@mui/material";
import { AccountBalance as BankIcon } from "@mui/icons-material";

export default function BankSelector({ banks, selectedBank, setSelectedBank }) {
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <BankIcon sx={{ color: "primary.main" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("selectBank")}
        </Typography>
      </Box>
      <FormControl fullWidth>
        <InputLabel>{t("selectBank")}</InputLabel>
        <Select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          label={t("selectBank")}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
          }}
        >
          {banks.map((bank) => (
            <MenuItem key={bank} value={bank}>
              {bank}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
