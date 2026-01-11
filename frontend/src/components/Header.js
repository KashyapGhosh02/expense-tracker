import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";

function Header() {
  const { isAuthenticated, logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1, cursor: "pointer" }} onClick={() => navigate("/")}>
          <Box
            sx={{
              fontSize: 32,
              fontWeight: "bold",
              background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 4px rgba(255,255,255,0.1)",
            }}
          >
            💰
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "800",
                letterSpacing: "0.5px",
                background: "linear-gradient(135deg, #fff 0%, #f0f0f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ExpenseTracker
            </Typography>
            {isAuthenticated && (
              <Typography
                variant="caption"
                sx={{
                  opacity: 0.8,
                  fontSize: "10px",
                  fontWeight: "500",
                  letterSpacing: "1px",
                }}
              >
                {username ? username.toUpperCase() : "USER"}
              </Typography>
            )}
          </Box>
        </Box>

        {isAuthenticated && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "rgba(255,255,255,0.2)",
                border: "2px solid rgba(255,255,255,0.3)",
                fontSize: "20px",
              }}
            >
              💼
            </Avatar>
            <Button
              onClick={handleLogout}
              sx={{
                color: "white",
                textTransform: "none",
                fontWeight: "600",
                padding: "8px 20px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "rgba(255,255,255,0.25)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
