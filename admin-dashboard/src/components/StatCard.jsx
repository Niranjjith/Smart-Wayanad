import { Card, CardContent, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, subtitle, gradient = "linear-gradient(135deg, #6366F1, #8B5CF6)" }) {
  return (
    <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ height: 6, background: gradient }} />
      <CardContent>
        <Typography variant="overline" sx={{ color: "text.secondary" }}>{title}</Typography>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: .5 }}>{subtitle}</Typography>
        )}
      </CardContent>
    </Card>
  );
}
