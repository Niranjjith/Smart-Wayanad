import { useEffect, useMemo, useState } from "react";
import { Box, Toolbar, Typography, Paper, Chip } from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import { io } from "socket.io-client";

export default function HelpAlerts() {
  const [rows, setRows] = useState([]);
  const [unread, setUnread] = useState(0);

  const socket = useMemo(() => {
    // Ensure your backend sets up Socket.IO server at same host:port
    return io("http://localhost:5000", { transports: ["websocket"] });
  }, []);

  const load = async () => {
    try {
      const { data } = await API.get("/help");
      setRows(data || []);
    } catch (e) {}
  };

  useEffect(() => {
    load();
    socket.on("connect", () => {});
    socket.on("help:new", (payload) => {
      setRows((r) => [payload, ...r]);
      setUnread((x) => x + 1);
    });
    return () => {
      socket.off("help:new");
      socket.disconnect();
    };
  }, []);

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "message", headerName: "Message", flex: 1.2 },
    { field: "createdAt", headerName: "Time", flex: 1, valueGetter: (p) => new Date(p.value).toLocaleString() },
    { field: "status", headerName: "Status", flex: .8, renderCell: (p) => <Chip label={p.value} color={p.value === "pending" ? "warning" : "success"} /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Help Alerts" notifCount={unread} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Live Alerts</Typography>
          <Box sx={{ height: 600 }}>
            <DataGrid rows={rows} columns={columns} getRowId={(r) => r._id} pageSize={10} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
