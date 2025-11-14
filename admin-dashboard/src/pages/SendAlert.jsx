import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import Sidebar from "../layout/Sidebar";
import Topbar from "../layout/Topbar";
import API from "../services/api";
import { toast } from "react-toastify";

export default function SendAlert() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
    lat: "",
    lng: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendAlert = async () => {
    if (!form.name || !form.phone || !form.message) {
      return toast.error("Name, phone and message are required");
    }

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        message: form.message,
        location:
          form.lat && form.lng
            ? { lat: Number(form.lat), lng: Number(form.lng) }
            : null,
      };

      await API.post("/help", payload);
      toast.success("🚨 Alert sent successfully!");
      setForm({ name: "", phone: "", message: "", lat: "", lng: "" });
    } catch (err) {
      toast.error("Failed to send alert");
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Send Manual Alert" />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          🚨 Send Emergency Alert
        </Typography>

        <Paper sx={{ p: 3, borderRadius: 3, maxWidth: 700 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Message"
                name="message"
                value={form.message}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Latitude (optional)"
                name="lat"
                value={form.lat}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Longitude (optional)"
                name="lng"
                value={form.lng}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={sendAlert}
                sx={{
                  bgcolor: "#e53935",
                  py: 1.3,
                  fontSize: "16px",
                  fontWeight: "700",
                  "&:hover": { bgcolor: "#c62828" },
                }}
              >
                SEND ALERT 🚨
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
}
