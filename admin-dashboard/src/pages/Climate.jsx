import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import { Box, Toolbar, Paper, Typography, Stack, TextField, Button } from "@mui/material";
import API from "../services/api.js";
import { toast } from "react-toastify";

export default function Climate() {
  const [city, setCity] = useState("Wayanad");
  const [data, setData] = useState(null);

  const load = async () => {
    try {
      const res = await API.get(`/climate/current?city=${encodeURIComponent(city)}`);
      setData(res.data);
    } catch {
      setData(null);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Climate" />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
            <Button variant="contained" onClick={load}>Refresh</Button>
          </Stack>
          <Box sx={{ mt: 3 }}>
            {data ? (
              <>
                <Typography variant="h5" fontWeight={800}>{data.city || city}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>{data.temp ? `${data.temp}°C` : "--"} • {data.description || "—"}</Typography>
                <Typography sx={{ mt: 1, color: "text.secondary" }}>Humidity: {data.humidity ?? "--"}% | Wind: {data.wind ?? "--"} km/h</Typography>
              </>
            ) : (
              <Typography color="text.secondary">No climate data yet — implement `/api/climate/current` in backend to feed this card.</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
