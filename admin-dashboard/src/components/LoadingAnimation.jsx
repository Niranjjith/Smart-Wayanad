import { Box, CircularProgress, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";

/**
 * 🎬 Premium Loading Animation Component
 * Beautiful animated loading screen with smooth transitions
 */
export default function LoadingAnimation({ message = "Loading..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 200 + i * 100,
            height: 200 + i * 100,
            borderRadius: "50%",
            background: `linear-gradient(135deg, rgba(102, 126, 234, ${0.1 - i * 0.03}), rgba(118, 75, 162, ${0.1 - i * 0.03}))`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Loading Content */}
      <Stack spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
        {/* Animated Logo/Icon */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            },
            scale: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: "white",
                background: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SW
            </Typography>
          </Box>
        </motion.div>

        {/* Spinner */}
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: "#667eea",
            "& .MuiCircularProgress-circle": {
              strokeLinecap: "round",
            },
          }}
        />

        {/* Loading Text */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#667eea",
              letterSpacing: 1,
            }}
          >
            {message}
          </Typography>
        </motion.div>

        {/* Loading Dots */}
        <Stack direction="row" spacing={1}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#667eea",
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * 🎬 Compact Loading Component for Inline Use
 */
export function CompactLoading({ size = 40, message }) {
  return (
    <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: "#667eea",
        }}
      />
      {message && (
        <Typography
          variant="body2"
          sx={{
            color: "#667eea",
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      )}
    </Stack>
  );
}

/**
 * 🎬 Skeleton Loading Component
 */
export function SkeletonLoading({ count = 3 }) {
  return (
    <Stack spacing={2}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          <Box
            sx={{
              height: 100,
              borderRadius: 2,
              bgcolor: "rgba(102, 126, 234, 0.1)",
            }}
          />
        </motion.div>
      ))}
    </Stack>
  );
}











