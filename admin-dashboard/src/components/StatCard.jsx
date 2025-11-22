import { Card, CardContent, Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  subtitle,
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  icon,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        }}
      >
        <Box
          sx={{
            height: 6,
            background: gradient,
          }}
        />
        <CardContent sx={{ p: 2.5 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.75rem",
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>
            {icon && (
              <Typography
                variant="h5"
                sx={{
                  fontSize: "1.5rem",
                }}
              >
                {icon}
              </Typography>
            )}
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              background: gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2rem",
              mb: 0.5,
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontSize: "0.8rem",
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
