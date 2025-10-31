import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import {
  Box, Toolbar, Paper, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Stack
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { toast } from "react-toastify";

const TYPES = [
  { value: "police", label: "Police" },
  { value: "hospital", label: "Hospital" },
  { value: "taxi", label: "Taxi Stand" },
  { value: "auto", label: "Auto Stand" },
  { value: "bus", label: "Bus Stop" },
];

export default function Locations() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type: "", name: "", contact: "", lat: "", lng: "", extraInfo: "" });

  const load = async () => {
    const { data } = await API.get("/location");
    setRows(data || []);
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { field: "type", headerName: "Type", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "contact", headerName: "Contact", flex: 1 },
    { field: "lat", headerName: "Lat", flex: .6 },
    { field: "lng", headerName: "Lng", flex: .6 },
    {
      field: "actions", headerName: "Actions", flex: 1, renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => onEdit(params.row)}>
            Edit
          </Button>
          <Button size="small" color="error" variant="outlined" startIcon={<Delete />} onClick={() => setConfirm({ open: true, id: params.row._id })}>
            Delete
          </Button>
        </Stack>
      )
    }
  ];

  const onEdit = (row) => {
    setEditId(row._id);
    setForm({
      type: row.type, name: row.name, contact: row.contact,
      lat: row.lat, lng: row.lng, extraInfo: row.extraInfo || ""
    });
    setOpen(true);
  };

  const onSave = async () => {
    try {
      if (!form.type || !form.name) return toast.error("Type & Name are required");
      if (editId) await API.put(`/location/${editId}`, form);
      else await API.post("/location", form);
      setOpen(false);
      setEditId(null);
      setForm({ type: "", name: "", contact: "", lat: "", lng: "", extraInfo: "" });
      load();
      toast.success("Saved");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  const onDelete = async () => {
    try {
      await API.delete(`/location/${confirm.id}`);
      setConfirm({ open: false, id: null });
      load();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Topbar title="Locations" />
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />
        <Paper sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Manage Locations</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Location</Button>
          </Stack>
          <Box sx={{ height: 620 }}>
            <DataGrid rows={rows} columns={columns} getRowId={(r) => r._id} pageSize={10} />
          </Box>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editId ? "Edit Location" : "Add Location"}</DialogTitle>
          <DialogContent>
            <TextField select label="Type" fullWidth margin="dense" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {TYPES.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
            </TextField>
            <TextField label="Name" fullWidth margin="dense" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Contact" fullWidth margin="dense" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
            <Stack direction="row" spacing={2}>
              <TextField label="Latitude" fullWidth margin="dense" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
              <TextField label="Longitude" fullWidth margin="dense" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
            </Stack>
            <TextField label="Extra Info" fullWidth margin="dense" multiline minRows={2} value={form.extraInfo} onChange={(e) => setForm({ ...form, extraInfo: e.target.value })} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <ConfirmDialog
          open={confirm.open}
          onClose={() => setConfirm({ open: false, id: null })}
          onConfirm={onDelete}
          title="Delete Location"
          message="This will permanently delete the location."
        />
      </Box>
    </Box>
  );
}
