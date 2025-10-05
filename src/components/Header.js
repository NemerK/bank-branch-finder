import React from "react";
import { useTranslation } from "react-i18next";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Language as LanguageIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

export default function Header() {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLanguageMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const languages = [
    { code: "he", name: "עברית", flag: "🇮🇱" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === i18n.language);

  const isRTL = i18n.language === 'he' || i18n.language === 'ar';

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
      <Toolbar sx={{ justifyContent: "space-between", py: 1, direction: isRTL ? 'rtl' : 'ltr' }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LocationIcon sx={{ color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: isRTL ? 'right' : 'left',
              }}
            >
              {t("appName")}
            </Typography>
          </Box>
          <Chip
            label={t("description")}
            size="small"
            variant="outlined"
            sx={{ display: { xs: "none", sm: "flex" } }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            aria-controls="language-menu"
            aria-haspopup="true"
            onClick={handleLanguageMenu}
            startIcon={!isRTL ? <LanguageIcon /> : undefined}
            endIcon={
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 0.5,
                minWidth: isRTL ? 60 : 50,
                justifyContent: isRTL ? 'flex-start' : 'flex-end'
              }}>
                <span style={{ fontSize: '16px' }}>{currentLanguage?.flag}</span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}>
                  {currentLanguage?.name}
                </span>
                {isRTL ? <LanguageIcon sx={{ fontSize: 18 }} /> : undefined}
              </Box>
            }
            sx={{
              color: "text.primary",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              px: 2,
              py: 1,
              minWidth: isRTL ? 140 : 120,
              "&:hover": {
                bgcolor: "action.hover",
              },
              direction: isRTL ? 'rtl' : 'ltr',
            }}
          >
            {!isRTL && t("language")}
          </Button>

          <Menu
            id="language-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                borderRadius: 2,
                direction: isRTL ? 'rtl' : 'ltr',
              },
            }}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                selected={i18n.language === language.code}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 1.5,
                  px: 2,
                  justifyContent: isRTL ? 'flex-end' : 'flex-start',
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                  "&.Mui-selected": {
                    bgcolor: "primary.50",
                    "&:hover": {
                      bgcolor: "primary.100",
                    },
                  },
                }}
              >
                <span style={{ 
                  fontSize: '18px',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {language.flag}
                </span>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: 500,
                  flex: 1,
                  textAlign: isRTL ? 'right' : 'left'
                }}>
                  {language.name}
                </span>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
