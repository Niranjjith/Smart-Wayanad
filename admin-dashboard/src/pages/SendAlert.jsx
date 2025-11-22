import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Toolbar,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import API from "../services/api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ALERT_TYPES = [
  { value: "earthquake", label: "🌍 Earthquake", color: "#f5576c" },
  { value: "tsunami", label: "🌊 Tsunami", color: "#4facfe" },
  { value: "flood", label: "🌧️ Flood", color: "#00f2fe" },
  { value: "landslide", label: "⛰️ Landslide", color: "#fa709a" },
  { value: "fire", label: "🔥 Fire", color: "#fee140" },
  { value: "medical", label: "🏥 Medical Emergency", color: "#f093fb" },
  { value: "other", label: "⚠️ Other", color: "#667eea" },
];

const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "#43e97b" },
  { value: "medium", label: "Medium", color: "#fee140" },
  { value: "high", label: "High", color: "#fa709a" },
  { value: "critical", label: "Critical", color: "#f5576c" },
];

export default function SendAlert() {
  const [form, setForm] = useState({
    message: "",
    alertType: "other",
    priority: "high",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendAlert = async () => {
    if (!form.message.trim()) {
      return toast.error("Message is required");
    }

    setLoading(true);
    try {
      const response = await API.post("/help/admin", {
        message: form.message.trim(),
        alertType: form.alertType,
        priority: form.priority,
      });
      
      if (response.status === 201 || response.status === 200) {
        toast.success("🚨 Alert broadcasted successfully to all users!");
        setForm({ message: "", alertType: "other", priority: "high" });
      }
    } catch (err) {
      console.error("Send alert error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to send alert. Please check your connection.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedType = ALERT_TYPES.find((t) => t.value === form.alertType);
  const selectedPriority = PRIORITY_LEVELS.find((p) => p.value === form.priority);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="Send Alert Broadcast" />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              boxShadow: "0 8px 32px rgba(245, 87, 108, 0.3)",
            }}
          >
            <Typography variant="h4" fontWeight={800} mb={1}>
              🚨 Broadcast Alert
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Send emergency alerts (Earthquake, Tsunami, Flood, etc.) to all users
            </Typography>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <Grid container spacing={3}>
              {/* Alert Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Alert Type</InputLabel>
                  <Select
                    name="alertType"
                    value={form.alertType}
                    onChange={handleChange}
                    label="Alert Type"
                    sx={{ borderRadius: 2 }}
                  >
                    {ALERT_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedType && (
                  <Chip
                    label={selectedType.label}
                    sx={{
                      mt: 1,
                      bgcolor: selectedType.color,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Grid>

              {/* Priority */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority Level</InputLabel>
                  <Select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    label="Priority Level"
                    sx={{ borderRadius: 2 }}
                  >
                    {PRIORITY_LEVELS.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {selectedPriority && (
                  <Chip
                    label={selectedPriority.label}
                    sx={{
                      mt: 1,
                      bgcolor: selectedPriority.color,
                      color: "white",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label="Alert Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Enter the alert message that will be broadcasted to all users..."
                  sx={{ borderRadius: 2 }}
                />
              </Grid>

              {/* Preview */}
              {form.message && (
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "#f8f9fa",
                      borderRadius: 2,
                      border: `2px solid ${selectedType?.color || "#667eea"}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" mb={1}>
                      Preview:
                    </Typography>
                    <Stack direction="row" spacing={1} mb={1}>
                      <Chip
                        label={selectedType?.label || "Alert"}
                        size="small"
                        sx={{
                          bgcolor: selectedType?.color || "#667eea",
                      color: "white",
                    }}
                  />
                      <Chip
                        label={selectedPriority?.label || "Priority"}
                        size="small"
                        sx={{
                          bgcolor: selectedPriority?.color || "#f5576c",
                          color: "white",
                        }}
                      />
                    </Stack>
                    <Typography variant="body1">{form.message}</Typography>
                  </Paper>
                </Grid>
              )}

              {/* Send Button */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={sendAlert}
                  disabled={loading || !form.message.trim()}
                  sx={{
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    py: 2,
                    fontSize: "18px",
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(245, 87, 108, 0.4)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 30px rgba(245, 87, 108, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? "Sending..." : "🚨 BROADCAST ALERT TO ALL USERS"}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}
