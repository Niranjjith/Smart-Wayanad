import { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Badge,
  Tooltip,
  Tabs,
  Tab,
  FormControl,
  Select,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import API from "../services/api.js";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Toolbar } from "@mui/material";
import {
  Send,
  Refresh,
  Search,
  Delete,
  Edit,
  SmartToy,
  Person,
  FilterList,
  Analytics,
  TrendingUp,
  Message,
  ChatBubble,
  MoreVert,
  Clear,
  CheckCircle,
  Schedule,
} from "@mui/icons-material";

export default function Chatbot() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [replyDialog, setReplyDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState("");
  const [filterIntent, setFilterIntent] = useState("all");
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const intents = [
    "all",
    "greeting",
    "emergency",
    "hospital",
    "police",
    "bus",
    "weather",
    "location",
    "taxi",
    "helpline",
    "thanks",
    "general",
  ];

  const fetchChats = async () => {
    try {
      setRefreshing(true);
      const { data } = await API.get("/chat");
      setChats(data || []);
    } catch (err) {
      console.error("Failed to load chats:", err);
      toast.error("Failed to load chat logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/chatbot/analytics");
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    fetchStats();
    const interval = setInterval(fetchChats, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chats, selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await API.post("/chat", {
        user: "Admin",
        message: replyText,
      });
      toast.success("Reply sent");
      setReplyDialog(false);
      setReplyText("");
      fetchChats();
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    try {
      await API.put(`/chat/${selectedChatId}`, { message: editText });
      toast.success("Message updated");
      setEditDialog(false);
      setEditText("");
      setSelectedChatId(null);
      fetchChats();
    } catch (err) {
      toast.error("Failed to edit message");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await API.delete(`/chat/${id}`);
      toast.success("Message deleted");
      fetchChats();
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      !searchQuery ||
      chat.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.response?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIntent = filterIntent === "all" || chat.intent === filterIntent;
    return matchesSearch && matchesIntent;
  });

  const groupedChats = filteredChats.reduce((acc, chat) => {
    const user = chat.user || "Guest";
    if (!acc[user]) acc[user] = [];
    acc[user].push(chat);
    return acc;
  }, {});

  const handleMenuOpen = (event, chatId) => {
    setAnchorEl(event.currentTarget);
    setSelectedChatId(chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedChatId(null);
  };

  const getIntentColor = (intent) => {
    const colors = {
      greeting: "success",
      emergency: "error",
      hospital: "warning",
      police: "error",
      bus: "info",
      weather: "primary",
      location: "secondary",
      taxi: "info",
      helpline: "primary",
      thanks: "success",
      general: "default",
    };
    return colors[intent] || "default";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="Chatbot" />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            ml: "260px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Sidebar />
      <Topbar title="Chatbot" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: "260px",
          pt: 3,
          px: 3,
          minHeight: "100vh",
        }}
      >
        <Toolbar />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box>
                <Typography variant="h4" fontWeight={800} mb={1}>
                  🤖 AI Chatbot Management
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Monitor and manage chatbot conversations
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Refresh />}
                  onClick={() => {
                    fetchChats();
                    fetchStats();
                  }}
                  disabled={refreshing}
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
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>

        {/* Statistics Cards */}
        {stats && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Total Conversations
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                          {stats.totalChats || chats.length}
                        </Typography>
                      </Box>
                      <Message sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Today's Chats
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                          {chats.filter(
                            (c) =>
                              new Date(c.createdAt).toDateString() ===
                              new Date().toDateString()
                          ).length}
                        </Typography>
                      </Box>
                      <ChatBubble sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Unique Users
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                          {Object.keys(groupedChats).length}
                        </Typography>
                      </Box>
                      <Person sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Avg Confidence
                        </Typography>
                        <Typography variant="h4" fontWeight={800}>
                          {chats.length > 0
                            ? (
                                chats.reduce((sum, c) => sum + (c.confidence || 0.8), 0) /
                                chats.length
                              ).toFixed(1)
                            : "0.0"}
                        </Typography>
                      </Box>
                      <TrendingUp sx={{ fontSize: 40, opacity: 0.3 }} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          {/* Left Sidebar - Chat List */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "calc(100vh - 400px)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                  {/* Search and Filter */}
                  <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: "#667eea" }} />
                          </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setSearchQuery("")}
                            >
                              <Clear fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth size="small">
                      <Select
                        value={filterIntent}
                        onChange={(e) => setFilterIntent(e.target.value)}
                        displayEmpty
                        startAdornment={<FilterList sx={{ mr: 1, color: "#667eea" }} />}
                      >
                        {intents.map((intent) => (
                          <MenuItem key={intent} value={intent}>
                            {intent.charAt(0).toUpperCase() + intent.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Chat List */}
                  <Box
                    sx={{
                      flex: 1,
                      overflowY: "auto",
                      p: 1,
                    }}
                  >
                    {Object.keys(groupedChats).length === 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 4,
                        }}
                      >
                        <ChatBubble sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          No conversations found
                        </Typography>
                      </Box>
                    ) : (
                      Object.keys(groupedChats).map((user) => {
                        const userChats = groupedChats[user];
                        const lastChat = userChats[userChats.length - 1];
                        const unreadCount = userChats.filter((c) => !c.response).length;

                        return (
                          <Paper
                            key={user}
                            onClick={() => setSelectedChat(userChats)}
                            sx={{
                              p: 2,
                              mb: 1,
                              cursor: "pointer",
                              borderRadius: 2,
                              border:
                                selectedChat?.[0]?.user === user
                                  ? "2px solid #667eea"
                                  : "1px solid #e0e0e0",
                              bgcolor:
                                selectedChat?.[0]?.user === user
                                  ? "rgba(102, 126, 234, 0.05)"
                                  : "white",
                              "&:hover": {
                                bgcolor: "rgba(102, 126, 234, 0.05)",
                                transform: "translateX(4px)",
                              },
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Badge badgeContent={unreadCount} color="error">
                                <Avatar
                                  sx={{
                                    bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                  }}
                                >
                                  {user[0]?.toUpperCase() || "U"}
                                </Avatar>
                              </Badge>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="subtitle2" fontWeight={700} noWrap>
                                  {user}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ display: "block" }}
                                >
                                  {lastChat.message?.substring(0, 40)}
                                  {lastChat.message?.length > 40 ? "..." : ""}
                                </Typography>
                                <Stack direction="row" spacing={1} mt={0.5}>
                                  {lastChat.intent && (
                                    <Chip
                                      label={lastChat.intent}
                                      size="small"
                                      color={getIntentColor(lastChat.intent)}
                                      sx={{ height: 20, fontSize: "0.65rem" }}
                                    />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {new Date(lastChat.createdAt).toLocaleTimeString()}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          </Paper>
                        );
                      })
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Right Side - Chat Messages */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "calc(100vh - 400px)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedChat && selectedChat.length > 0 ? (
                  <>
                    {/* Chat Header */}
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid #e0e0e0",
                        bgcolor: "rgba(102, 126, 234, 0.05)",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            {selectedChat[0].user[0]?.toUpperCase() || "U"}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight={700}>
                              {selectedChat[0].user}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {selectedChat.length} message{selectedChat.length !== 1 ? "s" : ""}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          variant="contained"
                          startIcon={<Send />}
                          onClick={() => {
                            setReplyDialog(true);
                            setReplyText("");
                          }}
                          sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          Reply
                        </Button>
                      </Stack>
                    </Box>

                    {/* Messages */}
                    <Box
                      sx={{
                        flex: 1,
                        overflowY: "auto",
                        p: 2,
                        bgcolor: "#f9fafb",
                      }}
                    >
                      <AnimatePresence>
                        {selectedChat.map((chat, idx) => (
                          <motion.div
                            key={chat._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            {/* User Message */}
                            <Stack
                              direction="row"
                              justifyContent="flex-end"
                              spacing={1}
                              sx={{ mb: 2 }}
                            >
                              <Box
                                sx={{
                                  maxWidth: "70%",
                                  bgcolor: "white",
                                  p: 2,
                                  borderRadius: 3,
                                  borderTopRightRadius: 0,
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                }}
                              >
                                <Stack direction="row" spacing={1} alignItems="flex-start" mb={1}>
                                  <Person sx={{ fontSize: 16, color: "#667eea" }} />
                                  <Typography variant="body2" fontWeight={600}>
                                    {chat.user}
                                  </Typography>
                                </Stack>
                                <Typography variant="body1">{chat.message}</Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  mt={1}
                                  justifyContent="flex-end"
                                >
                                  <Chip
                                    icon={<Schedule sx={{ fontSize: 12 }} />}
                                    label={new Date(chat.createdAt).toLocaleString()}
                                    size="small"
                                    sx={{ height: 20, fontSize: "0.65rem" }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleMenuOpen(e, chat._id)}
                                  >
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Stack>
                              </Box>
                            </Stack>

                            {/* Bot Response */}
                            {chat.response && (
                              <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ mb: 2 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                  }}
                                >
                                  <SmartToy />
                                </Avatar>
                                <Box
                                  sx={{
                                    maxWidth: "70%",
                                    bgcolor: "white",
                                    p: 2,
                                    borderRadius: 3,
                                    borderTopLeftRadius: 0,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                    <SmartToy sx={{ fontSize: 16, color: "#4facfe" }} />
                                    <Typography variant="body2" fontWeight={600}>
                                      AI Assistant
                                    </Typography>
                                    {chat.intent && (
                                      <Chip
                                        label={chat.intent}
                                        size="small"
                                        color={getIntentColor(chat.intent)}
                                        sx={{ height: 20, fontSize: "0.65rem" }}
                                      />
                                    )}
                                    {chat.confidence && (
                                      <Chip
                                        icon={<CheckCircle sx={{ fontSize: 12 }} />}
                                        label={`${(chat.confidence * 100).toFixed(0)}%`}
                                        size="small"
                                        color={getConfidenceColor(chat.confidence)}
                                        sx={{ height: 20, fontSize: "0.65rem" }}
                                      />
                                    )}
                                  </Stack>
                                  <Typography variant="body1">{chat.response}</Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: "block", mt: 1 }}
                                  >
                                    {new Date(chat.createdAt).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Stack>
                            )}

                            {!chat.response && (
                              <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ mb: 2 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "rgba(255, 152, 0, 0.1)",
                                    color: "#ff9800",
                                  }}
                                >
                                  <SmartToy />
                                </Avatar>
                                <Box
                                  sx={{
                                    maxWidth: "70%",
                                    bgcolor: "rgba(255, 152, 0, 0.05)",
                                    p: 2,
                                    borderRadius: 3,
                                    border: "1px dashed #ff9800",
                                  }}
                                >
                                  <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    No response yet
                                  </Typography>
                                </Box>
                              </Stack>
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <div ref={messagesEndRef} />
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 4,
                    }}
                  >
                    <ChatBubble sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={1}>
                      Select a conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose a conversation from the list to view messages
                    </Typography>
                  </Box>
                )}
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Reply Dialog */}
        <Dialog
          open={replyDialog}
          onClose={() => setReplyDialog(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>Send Reply</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              fullWidth
              rows={4}
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleReply}
              disabled={!replyText.trim()}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
              }}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialog}
          onClose={() => {
            setEditDialog(false);
            setEditText("");
            setSelectedChatId(null);
          }}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: { borderRadius: 3 },
          }}
        >
          <DialogTitle>Edit Message</DialogTitle>
          <DialogContent>
            <TextField
              multiline
              fullWidth
              rows={4}
              placeholder="Edit message..."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => {
                setEditDialog(false);
                setEditText("");
                setSelectedChatId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleEdit}
              disabled={!editText.trim()}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Context Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              const chat = chats.find((c) => c._id === selectedChatId);
              if (chat) {
                setEditText(chat.message);
                setEditDialog(true);
              }
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 2, fontSize: 20 }} /> Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedChatId) handleDelete(selectedChatId);
              handleMenuClose();
            }}
            sx={{ color: "error.main" }}
          >
            <Delete sx={{ mr: 2, fontSize: 20 }} /> Delete
          </MenuItem>
        </Menu>

        <Box sx={{ height: 50 }} />
      </Box>
    </Box>
  );
}
