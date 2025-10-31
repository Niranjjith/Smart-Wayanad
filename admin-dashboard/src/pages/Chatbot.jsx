import { useEffect, useState } from "react";
import {
  Box,
  Toolbar,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit, Send, Refresh } from "@mui/icons-material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { toast } from "react-toastify";

export default function Chatbot() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [form, setForm] = useState({ message: "", response: "" });

  // 🧩 Fetch chat logs
  const load = async () => {
    try {
      const { data } = await API.get("/chat");
      setRows(data || []);
    } catch (err) {
      console.error("❌ Failed to load chats:", err);
      toast.error("Failed to load chat logs");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // 📨 Send a new reply
  const handleReply = async () => {
    try {
      await API.post(`/chat`, {
        user: "Admin",
        message: form.response,
      });
      toast.success("Reply sent");
      setReplyDialog(false);
      load();
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  // ✏️ Edit a chat message
  const handleEdit = async () => {
    try {
      await API.put(`/chat/${selected._id}`, { message: form.message });
      toast.success("Message updated");
      setEditDialog(false);
      load();
    } catch (err) {
      toast.error("Failed to edit message");
    }
  };

  // 🗑 Delete a chat message
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/chat/${id}`);
      toast.success("Message deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  // 🧱 DataGrid Columns
  const columns = [
    { field: "user", headerName: "User", flex: 1 },
    {
      field: "message",
      headerName: "Message",
      flex: 2,
      renderCell: (params) => (
        <Typography sx={{ whiteSpace: "normal", lineHeight: 1.3 }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "response",
      headerName: "Reply",
      flex: 2,
      renderCell: (params) => (
        <Typography
          sx={{
            color: params.value ? "#16a34a" : "text.secondary",
            fontStyle: params.value ? "normal" : "italic",
            whiteSpace: "normal",
            lineHeight: 1.3,
          }}
        >
          {params.value || "— No reply —"}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Time",
      flex: 1.2,
      valueGetter: (p) => new Date(p.value).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Reply">
            <IconButton
              size="small"
              onClick={() => {
                setSelected(params.row);
                setForm({ message: "", response: "" });
                setReplyDialog(true);
              }}
              sx={{ color: "#16a34a" }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => {
                setSelected(params.row);
                setForm({ message: params.row.message, response: "" });
                setEditDialog(true);
              }}
              sx={{ color: "#2563eb" }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row._id)}
              sx={{ color: "#dc2626" }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  // 🧭 Layout
  return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f8" }}>
      <Sidebar />
      <Topbar title="Chatbot Logs" />
      <Box component="main" sx={{ flexGrow: 1, ml: "260px", p: 3 }}>
        <Toolbar />
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 3,
            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              💬 Chatbot Conversations
            </Typography>
            <Tooltip title="Refresh">
              <IconButton onClick={load} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box
            sx={{
              height: 640,
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f9fafb",
                fontWeight: 600,
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r._id}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </Box>
        </Paper>
      </Box>

      {/* 💬 Reply Dialog */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Reply to {selected?.user || "User"}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            multiline
            fullWidth
            rows={4}
            label="Reply Message"
            value={form.response}
            onChange={(e) => setForm({ ...form, response: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleReply} disabled={!form.response}>
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✏️ Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            multiline
            fullWidth
            rows={3}
            label="Edit Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEdit} disabled={!form.message}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
