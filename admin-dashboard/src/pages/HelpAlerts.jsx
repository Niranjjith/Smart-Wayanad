import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Toolbar,
  Typography,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";

import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import { io } from "socket.io-client";

import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function HelpAlerts() {
  const [rows, setRows] = useState([]);
  const [unread, setUnread] = useState(0);

  // WebSocket
  const socket = useMemo(() => {
    return io("http://localhost:5000", { transports: ["websocket"] });
  }, []);

  // Load alerts
  const load = async () => {
    try {
      const { data } = await API.get("/help");
      setRows(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  // Setup socket listeners
  useEffect(() => {
    load();

    socket.on("help:new", (payload) => {
      setRows((r) => [payload, ...r]);
      setUnread((x) => x + 1);
    });

    socket.on("help:update", (updated) => {
      setRows((oldRows) =>
        oldRows.map((a) => (a._id === updated._id ? updated : a))
      );
    });

    socket.on("help:delete", (id) => {
      setRows((oldRows) => oldRows.filter((a) => a._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Action handlers
  const markAsRead = async (id) => {
    try {
      const { data } = await API.put(`/help/${id}`, { status: "read" });
      setRows((old) => old.map((a) => (a._id === data._id ? data : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const markAsResolved = async (id) => {
    try {
      const { data } = await API.put(`/help/${id}`, { status: "resolved" });
      setRows((old) => old.map((a) => (a._id === data._id ? data : a)));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAlert = async (id) => {
    try {
      await API.delete(`/help/${id}`);
      setRows((old) => old.filter((a) => a._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // DataGrid columns
  const columns = [
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 150 },
    { field: "message", headerName: "Message", flex: 1.5, minWidth: 200 },

    {
      field: "location",
      headerName: "Location (lat,lng)",
      flex: 1,
      minWidth: 200,
      valueGetter: (p) =>
        p.value
          ? `${p.value.coordinates[1].toFixed(4)}, ${p.value.coordinates[0].toFixed(4)}`
          : "N/A",
    },

    {
      field: "createdAt",
      headerName: "Time",
      flex: 1,
      minWidth: 160,
      valueGetter: (p) => new Date(p.value).toLocaleString(),
    },

    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={
            p.value === "pending"
              ? "warning"
              : p.value === "read"
              ? "info"
              : "success"
          }
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {/* Mark as Read */}
          <Tooltip title="Mark as Read">
            <IconButton
              color="info"
              onClick={() => markAsRead(params.row._id)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>

          {/* Mark as Resolved */}
          <Tooltip title="Mark Resolved">
            <IconButton
              color="success"
              onClick={() => markAsResolved(params.row._id)}
            >
              <DoneIcon />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete Alert">
            <IconButton
              color="error"
              onClick={() => deleteAlert(params.row._id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <Topbar title="Help Alerts" notifCount={unread} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          ml: { xs: 0, sm: "260px" }, // Responsive Sidebar spacing
          width: "100%",
        }}
      >
        <Toolbar />

        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            width: "100%",
            overflow: "hidden",
          }}
          elevation={2}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, fontSize: { xs: 16, sm: 18 } }}
          >
            Live Emergency Alerts
          </Typography>

          <Box sx={{ height: { xs: 400, sm: 600 }, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r._id}
              pageSize={10}
              sx={{
                "& .pending": { bgcolor: "#fff3cd" },
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
