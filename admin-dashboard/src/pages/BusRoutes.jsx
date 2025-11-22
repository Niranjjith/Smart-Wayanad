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
  Card,
  CardContent,
  Chip,
  IconButton,
  Collapse,
  Divider,
  Grid,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  ExpandLess,
  DirectionsBus,
  Route,
  AccessTime,
  LocationOn,
} from "@mui/icons-material";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ✅ Premium BusRoutes.jsx with Sub-Routes Support
 * Modern UI with expandable sub-routes, premium styling, and smooth animations
 */
export default function BusRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSubDialog, setOpenSubDialog] = useState(false);
  const [expandedRoutes, setExpandedRoutes] = useState({});
  const [confirm, setConfirm] = useState({ open: false, id: null, type: "route" });
  const [editId, setEditId] = useState(null);
  const [parentRouteId, setParentRouteId] = useState(null);
  const [editSubRouteId, setEditSubRouteId] = useState(null);

  const [form, setForm] = useState({
    routeNo: "",
    origin: "",
    destination: "",
    firstBus: "",
    lastBus: "",
    frequencyMin: "",
    description: "",
    isActive: true,
  });

  const [subRouteForm, setSubRouteForm] = useState({
    subRouteNo: "",
    origin: "",
    destination: "",
    firstBus: "",
    lastBus: "",
    frequencyMin: "",
    via: "",
  });

  // ✅ Fetch bus routes from backend
  const loadRoutes = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bus");
      setRoutes(data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      toast.error("Failed to load bus routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // ✅ Toggle route expansion
  const toggleExpand = (routeId) => {
    setExpandedRoutes((prev) => ({
      ...prev,
      [routeId]: !prev[routeId],
    }));
  };

  // ✅ Open main route dialog
  const handleOpenDialog = (route = null) => {
    if (route) {
      setEditId(route._id);
      setForm({
        routeNo: route.routeNo || "",
        origin: route.origin || "",
        destination: route.destination || "",
        firstBus: route.firstBus || "",
        lastBus: route.lastBus || "",
        frequencyMin: route.frequencyMin || "",
        description: route.description || "",
        isActive: route.isActive !== undefined ? route.isActive : true,
      });
    } else {
      setEditId(null);
      setForm({
        routeNo: "",
        origin: "",
        destination: "",
        firstBus: "",
        lastBus: "",
        frequencyMin: "",
        description: "",
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  // ✅ Open sub-route dialog
  const handleOpenSubDialog = (parentId, subRoute = null) => {
    setParentRouteId(parentId);
    if (subRoute) {
      setEditSubRouteId(subRoute._id);
      setSubRouteForm({
        subRouteNo: subRoute.subRouteNo || "",
        origin: subRoute.origin || "",
        destination: subRoute.destination || "",
        firstBus: subRoute.firstBus || "",
        lastBus: subRoute.lastBus || "",
        frequencyMin: subRoute.frequencyMin || "",
        via: subRoute.via || "",
      });
    } else {
      setEditSubRouteId(null);
      setSubRouteForm({
        subRouteNo: "",
        origin: "",
        destination: "",
        firstBus: "",
        lastBus: "",
        frequencyMin: "",
        via: "",
      });
    }
    setOpenSubDialog(true);
  };

  // ✅ Save main route
  const handleSaveRoute = async () => {
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

      setOpenDialog(false);
      setEditId(null);
      loadRoutes();
    } catch (err) {
      console.error("❌ Save error:", err);
      toast.error(err.response?.data?.message || "❌ Save failed. Try again.");
    }
  };

  // ✅ Save sub-route
  const handleSaveSubRoute = async () => {
    try {
      if (!subRouteForm.subRouteNo.trim() || !subRouteForm.origin.trim() || !subRouteForm.destination.trim()) {
        toast.error("Sub-route #, Origin, and Destination are required");
        return;
      }

      if (editSubRouteId) {
        await API.put(`/bus/${parentRouteId}/subroutes/${editSubRouteId}`, subRouteForm);
        toast.success("✅ Sub-route updated successfully");
      } else {
        await API.post(`/bus/${parentRouteId}/subroutes`, subRouteForm);
        toast.success("✅ Sub-route added successfully");
      }

      setOpenSubDialog(false);
      setEditSubRouteId(null);
      setParentRouteId(null);
      loadRoutes();
    } catch (err) {
      console.error("❌ Save sub-route error:", err);
      toast.error(err.response?.data?.message || "❌ Save failed. Try again.");
    }
  };

  // ✅ Delete handler
  const handleDelete = async () => {
    try {
      if (confirm.type === "route") {
        await API.delete(`/bus/${confirm.id}`);
        toast.success("🗑️ Route deleted successfully");
      } else {
        const route = routes.find((r) => r.subRoutes?.some((sr) => sr._id === confirm.id));
        if (route) {
          await API.delete(`/bus/${route._id}/subroutes/${confirm.id}`);
          toast.success("🗑️ Sub-route deleted successfully");
        }
      }
      setConfirm({ open: false, id: null, type: "route" });
      loadRoutes();
    } catch (err) {
      console.error("❌ Delete error:", err);
      toast.error("Delete failed");
    }
  };

  // ✅ Route Card Component
  const RouteCard = ({ route }) => {
    const isExpanded = expandedRoutes[route._id];
    const subRoutesCount = route.subRoutes?.length || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            border: `2px solid ${route.isActive ? "#4caf50" : "#e0e0e0"}`,
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                  <Chip
                    icon={<DirectionsBus />}
                    label={`Route ${route.routeNo}`}
                    color="primary"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      height: 32,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                    }}
                  />
                  <Chip
                    label={route.isActive ? "Active" : "Inactive"}
                    color={route.isActive ? "success" : "default"}
                    size="small"
                  />
                  {subRoutesCount > 0 && (
                    <Chip
                      icon={<Route />}
                      label={`${subRoutesCount} Sub-route${subRoutesCount > 1 ? "s" : ""}`}
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn sx={{ color: "#667eea", fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={600}>
                      {route.origin}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    →
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn sx={{ color: "#f093fb", fontSize: 20 }} />
                    <Typography variant="body1" fontWeight={600}>
                      {route.destination}
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {route.firstBus && (
                    <Grid item xs={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: "#667eea" }} />
                        <Typography variant="caption" color="text.secondary">
                          First: {route.firstBus}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {route.lastBus && (
                    <Grid item xs={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 16, color: "#667eea" }} />
                        <Typography variant="caption" color="text.secondary">
                          Last: {route.lastBus}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  {route.frequencyMin && (
                    <Grid item xs={4}>
                      <Typography variant="caption" color="text.secondary">
                        Every {route.frequencyMin} min
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {route.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
                    {route.description}
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1}>
                {subRoutesCount > 0 && (
                  <IconButton
                    onClick={() => toggleExpand(route._id)}
                    sx={{
                      bgcolor: "rgba(102, 126, 234, 0.1)",
                      "&:hover": { bgcolor: "rgba(102, 126, 234, 0.2)" },
                    }}
                  >
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => handleOpenDialog(route)}
                  sx={{ borderRadius: 2 }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<Delete />}
                  onClick={() => setConfirm({ open: true, id: route._id, type: "route" })}
                  sx={{ borderRadius: 2 }}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>

            {/* Sub-Routes Section */}
            <Collapse in={isExpanded}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
                  SUB-ROUTES
                </Typography>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenSubDialog(route._id)}
                  sx={{
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textTransform: "none",
                  }}
                >
                  Add Sub-Route
                </Button>
              </Stack>

              <AnimatePresence>
                {route.subRoutes?.map((subRoute, index) => (
                  <motion.div
                    key={subRoute._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f8f9fa",
                        borderLeft: "4px solid #667eea",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                            <Chip
                              label={subRoute.subRouteNo}
                              size="small"
                              sx={{
                                bgcolor: "#667eea",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {subRoute.origin} → {subRoute.destination}
                            </Typography>
                          </Stack>
                          {subRoute.via && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                              Via: {subRoute.via}
                            </Typography>
                          )}
                          <Stack direction="row" spacing={2} mt={1}>
                            {subRoute.firstBus && (
                              <Typography variant="caption" color="text.secondary">
                                First: {subRoute.firstBus}
                              </Typography>
                            )}
                            {subRoute.lastBus && (
                              <Typography variant="caption" color="text.secondary">
                                Last: {subRoute.lastBus}
                              </Typography>
                            )}
                            {subRoute.frequencyMin && (
                              <Typography variant="caption" color="text.secondary">
                                Every {subRoute.frequencyMin} min
                              </Typography>
                            )}
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenSubDialog(route._id, subRoute)}
                            sx={{ color: "#667eea" }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setConfirm({ open: true, id: subRoute._id, type: "subroute" })}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!route.subRoutes || route.subRoutes.length === 0) && (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                  No sub-routes added yet
                </Typography>
              )}
            </Collapse>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      <Sidebar />
      <Topbar title="Bus Routes Management" />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: "260px" }}>
        <Toolbar />

        {/* Header Section */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight={800} mb={1}>
                🚌 Bus Routes Management
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage main routes and their sub-routes with detailed scheduling information
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: "white",
                color: "#667eea",
                fontWeight: 700,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.9)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Add New Route
            </Button>
          </Stack>
        </Paper>

        {/* Routes List */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 400,
            }}
          >
            <CircularProgress size={60} sx={{ color: "#667eea" }} />
          </Box>
        ) : routes.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <DirectionsBus sx={{ fontSize: 80, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={1}>
              No bus routes found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Get started by adding your first bus route
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
                px: 4,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              Add First Route
            </Button>
          </Paper>
        ) : (
          <Box>
            {routes.map((route) => (
              <RouteCard key={route._id} route={route} />
            ))}
          </Box>
        )}

        {/* Main Route Dialog */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: 700,
              fontSize: "1.5rem",
            }}
          >
            {editId ? "Edit Bus Route" : "Add New Bus Route"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Route Number"
                fullWidth
                value={form.routeNo}
                onChange={(e) => setForm({ ...form, routeNo: e.target.value })}
                required
                sx={{ borderRadius: 2 }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Origin"
                  fullWidth
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  required
                />
                <TextField
                  label="Destination"
                  fullWidth
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  required
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Bus (HH:mm)"
                  fullWidth
                  value={form.firstBus}
                  onChange={(e) => setForm({ ...form, firstBus: e.target.value })}
                  placeholder="06:00"
                />
                <TextField
                  label="Last Bus (HH:mm)"
                  fullWidth
                  value={form.lastBus}
                  onChange={(e) => setForm({ ...form, lastBus: e.target.value })}
                  placeholder="22:00"
                />
                <TextField
                  label="Frequency (minutes)"
                  type="number"
                  fullWidth
                  value={form.frequencyMin}
                  onChange={(e) => setForm({ ...form, frequencyMin: e.target.value })}
                />
              </Stack>
              <TextField
                label="Description (Optional)"
                fullWidth
                multiline
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Additional information about this route..."
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    color="primary"
                  />
                }
                label="Active Route"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveRoute}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
              }}
            >
              Save Route
            </Button>
          </DialogActions>
        </Dialog>

        {/* Sub-Route Dialog */}
        <Dialog
          open={openSubDialog}
          onClose={() => setOpenSubDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              fontWeight: 700,
            }}
          >
            {editSubRouteId ? "Edit Sub-Route" : "Add New Sub-Route"}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={2}>
              <TextField
                label="Sub-Route Number"
                fullWidth
                value={subRouteForm.subRouteNo}
                onChange={(e) => setSubRouteForm({ ...subRouteForm, subRouteNo: e.target.value })}
                required
                placeholder="e.g., 1A, 1B"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Origin"
                  fullWidth
                  value={subRouteForm.origin}
                  onChange={(e) => setSubRouteForm({ ...subRouteForm, origin: e.target.value })}
                  required
                />
                <TextField
                  label="Destination"
                  fullWidth
                  value={subRouteForm.destination}
                  onChange={(e) => setSubRouteForm({ ...subRouteForm, destination: e.target.value })}
                  required
                />
              </Stack>
              <TextField
                label="Via (Intermediate Stops)"
                fullWidth
                value={subRouteForm.via}
                onChange={(e) => setSubRouteForm({ ...subRouteForm, via: e.target.value })}
                placeholder="e.g., Station A, Station B"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First Bus (HH:mm)"
                  fullWidth
                  value={subRouteForm.firstBus}
                  onChange={(e) => setSubRouteForm({ ...subRouteForm, firstBus: e.target.value })}
                />
                <TextField
                  label="Last Bus (HH:mm)"
                  fullWidth
                  value={subRouteForm.lastBus}
                  onChange={(e) => setSubRouteForm({ ...subRouteForm, lastBus: e.target.value })}
                />
                <TextField
                  label="Frequency (min)"
                  type="number"
                  fullWidth
                  value={subRouteForm.frequencyMin}
                  onChange={(e) => setSubRouteForm({ ...subRouteForm, frequencyMin: e.target.value })}
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpenSubDialog(false)} sx={{ borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveSubRoute}
              sx={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: 2,
                px: 3,
                textTransform: "none",
              }}
            >
              Save Sub-Route
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={confirm.open}
          onClose={() => setConfirm({ open: false, id: null, type: "route" })}
          onConfirm={handleDelete}
          title={confirm.type === "route" ? "Delete Bus Route" : "Delete Sub-Route"}
          message={
            confirm.type === "route"
              ? "This will permanently delete the route and all its sub-routes. This action cannot be undone."
              : "This will permanently delete the sub-route. This action cannot be undone."
          }
        />
      </Box>
    </Box>
  );
}
