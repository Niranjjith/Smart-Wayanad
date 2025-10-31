import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import { Box, Toolbar, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import API from "../services/api.js";

export default function Chatbot() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      const { data } = await API.get("/chat"); // implement backend to return logs
      setRows(data || []);
    } catch {
      setRows([]);
    }
  };
  useEffect(() => { load(); }, []);

  const columns = [
    { field: "user", headerName: "User", flex: 1 },
    { field: "message", headerName: "Message", flex: 2 },
    { field: "reply", headerName: "Reply", flex: 2 },
    { field: "createdAt", headerName: "Time", flex: 1, valueGetter: (p) => new Date(p.value).toLocaleString() }
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Chatbot Logs" />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Conversations</Typography>
          <Box sx={{ height: 620 }}>
            <DataGrid rows={rows} columns={columns} getRowId={(r) => r._id} pageSize={10} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
