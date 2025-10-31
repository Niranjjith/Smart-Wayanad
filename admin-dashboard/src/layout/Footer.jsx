import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
        textAlign: "center",
        mt: "auto",
        bgcolor: "#f1f1f1",
        borderTop: "1px solid #ddd",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Smart Wayanad | Created by{" "}
        <strong>Niranjan A R</strong>
      </Typography>
    </Box>
  );
}
