import { useState, useEffect, useContext } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import Sidebar from "../layout/Sidebar.jsx";
import Topbar from "../layout/Topbar.jsx";
import { PhotoCamera, Save, Lock, Person, Email } from "@mui/icons-material";
import { toast } from "react-toastify";
import API from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { Toolbar } from "@mui/material";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch current profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get("/auth/profile");
        if (res.data) {
          setProfileData({
            name: res.data.name || "",
            email: res.data.email || "",
            password: "",
            confirmPassword: "",
          });
          setProfileImage(res.data.profilePhoto || localStorage.getItem("adminAvatar") || "");
          if (res.data.profilePhoto) {
            localStorage.setItem("adminAvatar", res.data.profilePhoto);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Compress image before uploading
  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB before compression)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      // Compress the image
      const compressedBase64 = await compressImage(file);
      setProfileImage(compressedBase64);
      localStorage.setItem("adminAvatar", compressedBase64);
      toast.success("Image loaded and compressed");
    } catch (err) {
      console.error("Image compression error:", err);
      toast.error("Failed to process image");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!profileData.email || !/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (profileData.password) {
      if (profileData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (profileData.password !== profileData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      setSaving(true);
      const updateData = {
        name: profileData.name.trim(),
        email: profileData.email.trim(),
      };

      if (profileData.password) {
        updateData.password = profileData.password;
      }

      if (profileImage) {
        updateData.profilePhoto = profileImage;
      }

      const res = await API.put("/auth/profile", updateData);

      if (res.data) {
        toast.success("Profile updated successfully!");
        // Clear password fields
        setProfileData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));
        // Update localStorage
        if (res.data.user?.profilePhoto) {
          localStorage.setItem("adminAvatar", res.data.user.profilePhoto);
        }
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", bgcolor: "#f5f7fa", minHeight: "100vh" }}>
        <Sidebar />
        <Topbar title="Settings" />
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
      <Topbar title="Settings" />

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
        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Profile Settings
            </Typography>

            {/* Profile Image Section */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Profile Picture
                    </Typography>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Avatar
                        src={profileImage}
                        sx={{
                          width: 120,
                          height: 120,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          fontSize: "3rem",
                          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        {!profileImage && (profileData.name?.[0]?.toUpperCase() || "A")}
                      </Avatar>
                      <Box>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<PhotoCamera />}
                          sx={{
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            textTransform: "none",
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            fontWeight: 600,
                            "&:hover": {
                              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                            },
                          }}
                        >
                          Change Photo
                          <input
                            hidden
                            accept="image/*"
                            type="file"
                            onChange={handleImageUpload}
                          />
                        </Button>
                        <Typography
                          variant="caption"
                          sx={{ display: "block", mt: 1, color: "text.secondary" }}
                        >
                          Images will be automatically compressed (max 5MB, recommended: square image)
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Personal Information
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Name"
                        fullWidth
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        error={!!errors.name}
                        helperText={errors.name}
                        InputProps={{
                          startAdornment: (
                            <Person sx={{ mr: 1, color: "#667eea" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label="Email"
                        fullWidth
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        error={!!errors.email}
                        helperText={errors.email}
                        InputProps={{
                          startAdornment: (
                            <Email sx={{ mr: 1, color: "#667eea" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <CardContent>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={2}>
                      Change Password
                    </Typography>
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                      Leave password fields empty if you don't want to change your password.
                    </Alert>
                    <Stack spacing={2}>
                      <TextField
                        label="New Password"
                        fullWidth
                        type="password"
                        value={profileData.password}
                        onChange={(e) =>
                          setProfileData({ ...profileData, password: e.target.value })
                        }
                        error={!!errors.password}
                        helperText={errors.password}
                        InputProps={{
                          startAdornment: (
                            <Lock sx={{ mr: 1, color: "#667eea" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label="Confirm New Password"
                        fullWidth
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            confirmPassword: e.target.value,
                          })
                        }
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <Lock sx={{ mr: 1, color: "#667eea" }} />
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  textTransform: "none",
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}

