import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import {
  Box,
  Toolbar,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { toast } from "react-toastify";

/**
 * ✅ BusRoutes.jsx
 * Admin management panel for bus route CRUD (Create, Read, Update, Delete)
 * Connected to backend /api/bus endpoints.
 */
export default function BusRoutes() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    routeNo: "",
    origin: "",
    destination: "",
    firstBus: "",
    lastBus: "",
    frequencyMin: "",
  });

  // ✅ Fetch bus routes from backend
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bus"); // ✅ Backend endpoint
      setRows(data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to load bus routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ DataGrid column definitions
  const columns = [
    { field: "routeNo", headerName: "Route #", flex: 0.8 },
    { field: "origin", headerName: "Origin", flex: 1 },
    { field: "destination", headerName: "Destination", flex: 1 },
    { field: "firstBus", headerName: "First Bus", flex: 0.7 },
    { field: "lastBus", headerName: "Last Bus", flex: 0.7 },
    { field: "frequencyMin", headerName: "Frequency (min)", flex: 0.8 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit />}
            onClick={() => onEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            variant="outlined"
            startIcon={<Delete />}
            onClick={() =>
              setConfirm({ open: true, id: params.row._id })
            }
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  // ✅ Edit handler
  const onEdit = (row) => {
    setEditId(row._id);
    setForm({
      routeNo: row.routeNo || "",
      origin: row.origin || "",
      destination: row.destination || "",
      firstBus: row.firstBus || "",
      lastBus: row.lastBus || "",
      frequencyMin: row.frequencyMin || "",
    });
    setOpen(true);
  };

  // ✅ Save (Add or Edit)
  const onSave = async () => {
    try {
      if (!form.routeNo.trim() || !form.origin.trim() || !form.destination.trim()) {
        toast.error("Route #, Origin, and Destination are required");
        return;
      }

      if (editId) {
        await API.put(`/bus/${editId}`, form);
        toast.success("✅ Route updated successfully");
      } else {
        await API.post("/bus", form);
        toast.success("✅ Route added successfully");
      }

      setOpen(false);
      setEditId(null);
      setForm({
        routeNo: "",
        origin: "",
        destination: "",
        firstBus: "",
        lastBus: "",
        frequencyMin: "",
      });
      load();
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error("❌ Save failed. Try again.");
    }
  };

  // ✅ Delete handler
  const onDelete = async () => {
    try {
      await API.delete(`/bus/${confirm.id}`);
      toast.success("🗑️ Route deleted successfully");
      setConfirm({ open: false, id: null });
      load();
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Delete failed");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Bus Routes" />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />

        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            background: "#fff",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Manage Bus Routes
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpen(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Add Route
            </Button>
          </Stack>

          {/* ✅ DataGrid */}
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
            <Box sx={{ height: 620 }}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(r) => r._id}
                pageSize={10}
                disableSelectionOnClick
                sx={{
                  border: "none",
                  backgroundColor: "#fafafa",
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

        {/* ✅ Add/Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700 }}>
            {editId ? "Edit Route" : "Add New Route"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Route #"
              fullWidth
              margin="dense"
              value={form.routeNo}
              onChange={(e) => setForm({ ...form, routeNo: e.target.value })}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Origin"
                fullWidth
                margin="dense"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
              />
              <TextField
                label="Destination"
                fullWidth
                margin="dense"
                value={form.destination}
                onChange={(e) =>
                  setForm({ ...form, destination: e.target.value })
                }
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Bus (HH:mm)"
                fullWidth
                margin="dense"
                value={form.firstBus}
                onChange={(e) => setForm({ ...form, firstBus: e.target.value })}
              />
              <TextField
                label="Last Bus (HH:mm)"
                fullWidth
                margin="dense"
                value={form.lastBus}
                onChange={(e) => setForm({ ...form, lastBus: e.target.value })}
              />
              <TextField
                label="Frequency (min)"
                type="number"
                fullWidth
                margin="dense"
                value={form.frequencyMin}
                onChange={(e) =>
                  setForm({ ...form, frequencyMin: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={onSave}>
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* ✅ Delete Confirmation Dialog */}
        <ConfirmDialog
          open={confirm.open}
          onClose={() => setConfirm({ open: false, id: null })}
          onConfirm={onDelete}
          title="Delete Bus Route"
          message="This will permanently delete the selected route."
        />
      </Box>
    </Box>
  );
}
