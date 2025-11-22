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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { DataGrid } from "@mui/x-data-grid";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ALERT_TYPE_COLORS = {
  earthquake: "#f5576c",
  tsunami: "#4facfe",
  flood: "#00f2fe",
  landslide: "#fa709a",
  fire: "#fee140",
  medical: "#f093fb",
  emergency: "#e53935",
  other: "#667eea",
};

export default function HelpAlerts() {
  const [rows, setRows] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  // WebSocket
  const socket = useMemo(() => {
    try {
      return io("http://localhost:5000", { transports: ["websocket"] });
    } catch (err) {
      console.error("Socket connection error:", err);
      return null;
    }
  }, []);

  // Load alerts
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/help");
      setRows(data || []);
      setUnread(data?.filter((a) => a.status === "pending").length || 0);
    } catch (e) {
      console.error("Load alerts error:", e);
      toast.error("Failed to load alerts. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Setup socket listeners
  useEffect(() => {
    load();

    if (socket) {
      socket.on("help:new", (payload) => {
        setRows((r) => [payload, ...r]);
        setUnread((x) => x + 1);
        toast.info("New alert received!");
      });

      socket.on("help:update", (updated) => {
        setRows((oldRows) =>
          oldRows.map((a) => (a._id === updated._id ? updated : a))
        );
      });

      socket.on("help:delete", (id) => {
        setRows((oldRows) => oldRows.filter((a) => a._id !== id));
      });

      socket.on("alert:new", (alert) => {
        if (alert.source === "admin") {
          toast.success(`New admin alert: ${alert.alertType}`);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket]);

  // Action handlers
  const markAsRead = async (id) => {
    try {
      const { data } = await API.put(`/help/${id}`, { status: "read" });
      setRows((old) => old.map((a) => (a._id === data._id ? data : a)));
      toast.success("Alert marked as read");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update alert");
    }
  };

  const markAsResolved = async (id) => {
    try {
      const { data } = await API.put(`/help/${id}`, { status: "resolved" });
      setRows((old) => old.map((a) => (a._id === data._id ? data : a)));
      toast.success("Alert resolved");
    } catch (e) {
      console.error(e);
      toast.error("Failed to resolve alert");
    }
  };

  const deleteAlert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) return;
    
    try {
      await API.delete(`/help/${id}`);
      setRows((old) => old.filter((a) => a._id !== id));
      toast.success("Alert deleted");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete alert");
    }
  };

  const viewAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setViewDialog(true);
  };

  // DataGrid columns
  const columns = [
    {
      field: "source",
      headerName: "Source",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value === "admin" ? "Admin" : "User"}
          size="small"
          color={params.value === "admin" ? "primary" : "default"}
        />
      ),
    },
    {
      field: "alertType",
      headerName: "Type",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const type = params.value || "emergency";
        return (
          <Chip
            label={type.charAt(0).toUpperCase() + type.slice(1)}
            size="small"
            sx={{
              bgcolor: ALERT_TYPE_COLORS[type] || "#667eea",
              color: "white",
              fontWeight: 600,
            }}
          />
        );
      },
    },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 150 },
    {
      field: "message",
      headerName: "Message",
      flex: 1.5,
      minWidth: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        if (!params.value || !params.value.coordinates) return "N/A";
        const [lng, lat] = params.value.coordinates;
        return (
          <Tooltip title={`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`}>
            <Chip
              icon={<LocationOnIcon />}
              label={`${lat.toFixed(2)}, ${lng.toFixed(2)}`}
              size="small"
              variant="outlined"
            />
          </Tooltip>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => {
        const priority = params.value || "medium";
        const colors = {
          low: "success",
          medium: "warning",
          high: "error",
          critical: "error",
        };
        return (
          <Chip
            label={priority.toUpperCase()}
            size="small"
            color={colors[priority] || "default"}
          />
        );
      },
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
              : p.value === "active"
              ? "success"
              : "success"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.2,
      minWidth: 220,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              color="info"
              size="small"
              onClick={() => viewAlertDetails(params.row)}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          {params.row.status !== "resolved" && (
            <>
              <Tooltip title="Mark as Read">
                <IconButton
                  color="info"
                  size="small"
                  onClick={() => markAsRead(params.row._id)}
                >
                  <DoneIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Mark Resolved">
                <IconButton
                  color="success"
                  size="small"
                  onClick={() => markAsResolved(params.row._id)}
                >
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Delete Alert">
            <IconButton
              color="error"
              size="small"
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
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="Help Alerts" notifCount={unread} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: "260px",
        }}
      >
        <Toolbar />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  🚨 Emergency Alerts
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Real-time alerts from users and admin broadcasts
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={load}
                disabled={loading}
                sx={{
                  bgcolor: "white",
                  color: "#f5576c",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                Refresh
              </Button>
            </Stack>
          </Paper>

          {/* DataGrid */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ height: 650, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  getRowId={(r) => r._id}
                  pageSize={10}
                  sx={{
                    border: "none",
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f4f6f8",
                      fontWeight: "bold",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </motion.div>
      </Box>

      {/* Alert Details Dialog */}
      <Dialog
        open={viewDialog}
        onClose={() => setViewDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        {selectedAlert && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Alert Details
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  label="Name"
                  value={selectedAlert.name || ""}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Message"
                  value={selectedAlert.message || ""}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
                {selectedAlert.location && (
                  <TextField
                    label="Location"
                    value={`${selectedAlert.location.coordinates[1].toFixed(4)}, ${selectedAlert.location.coordinates[0].toFixed(4)}`}
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                )}
                <Stack direction="row" spacing={2}>
                  <Chip
                    label={`Type: ${selectedAlert.alertType || "emergency"}`}
                    color="primary"
                  />
                  <Chip
                    label={`Priority: ${selectedAlert.priority || "medium"}`}
                    color="secondary"
                  />
                  <Chip
                    label={`Status: ${selectedAlert.status || "pending"}`}
                    color={
                      selectedAlert.status === "resolved" ? "success" : "warning"
                    }
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
