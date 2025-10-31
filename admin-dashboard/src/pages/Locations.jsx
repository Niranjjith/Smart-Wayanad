import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Footer from "../layout/Footer.jsx";
import API from "../services/api.js";
import { toast } from "react-toastify";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    contact: "",
    address: "",
  });

  const fetchLocations = async () => {
    try {
      const { data } = await API.get("/location");
      setLocations(data);
    } catch (err) {
      toast.error("Failed to load locations");
    }
  };

  const handleAdd = async () => {
    try {
      await API.post("/location", form);
      toast.success("Location added successfully");
      setForm({ name: "", type: "", contact: "", address: "" });
      fetchLocations();
    } catch {
      toast.error("Failed to add location");
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px", // matches Sidebar width
          p: 4,
          mt: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ mb: 3, color: "#1e293b" }}
        >
          📍 Manage Locations
        </Typography>

        {/* Form to Add New Location */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              select
              label="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <MenuItem value="hospital">Hospital</MenuItem>
              <MenuItem value="taxi">Taxi Stand</MenuItem>
              <MenuItem value="clinic">Clinic</MenuItem>
              <MenuItem value="helpline">Helpline</MenuItem>
            </TextField>
            <TextField
              label="Contact Number"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <TextField
              label="Address"
              multiline
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#15803d" },
                width: "fit-content",
              }}
              onClick={handleAdd}
            >
              Add Location
            </Button>
          </Stack>
        </Paper>

        {/* List of All Locations */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          All Locations
        </Typography>
        {locations.length === 0 ? (
          <Typography color="text.secondary">
            No locations found. Add a new one above.
          </Typography>
        ) : (
          locations.map((l, i) => (
            <Paper key={i} sx={{ p: 2, mb: 1, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {l.name} ({l.type})
              </Typography>
              <Typography variant="body2">📍 {l.address}</Typography>
              <Typography variant="body2">📞 {l.contact}</Typography>
            </Paper>
          ))
        )}

        <Footer />
      </Box>
    </Box>
  );
}
