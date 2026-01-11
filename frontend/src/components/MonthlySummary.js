import { useState, useCallback } from "react";
import api from "../api";
import ExpenseCharts from "./ExpenseCharts";
import {
  Card, CardContent, Typography,
  Button, Stack, Box, Grid, Chip, CircularProgress, Alert, Switch, FormControlLabel, Tabs, Tab, Paper, LinearProgress, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";

function MonthlySummary() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [total, setTotal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [prevTotal, setPrevTotal] = useState(null);
  const [prevCategories, setPrevCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [autoFetch, setAutoFetch] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const fetchSummary = useCallback(async (fetchPrevious = false) => {
    if (!month || !year) {
      setError("Please select both month and year");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [summaryRes, categoryRes] = await Promise.all([
        api.get(`/expenses/summary/monthly?month=${month}&year=${year}`),
        api.get(`/expenses/summary/category?month=${month}&year=${year}`)
      ]);
      setTotal(summaryRes.data.total);
      setCategories(categoryRes.data);

      // Fetch previous month data if requested
      if (fetchPrevious) {
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const [prevSummaryRes, prevCategoryRes] = await Promise.all([
          api.get(`/expenses/summary/monthly?month=${prevMonth}&year=${prevYear}`),
          api.get(`/expenses/summary/category?month=${prevMonth}&year=${prevYear}`)
        ]);
        setPrevTotal(prevSummaryRes.data.total);
        setPrevCategories(prevCategoryRes.data);
      }
    } catch (err) {
      setError("Failed to fetch summary");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevMonthName = new Date(prevYear, prevMonth - 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  const getCategoryColor = (category) => {
    const colors = {
      "Food": "#FF6B6B",
      "Travel": "#4ECDC4",
      "Rent": "#45B7D1",
      "Entertainment": "#FFA07A",
      "Utilities": "#98D8C8",
    };
    return colors[category] || "#9B59B6";
  };

  const topCategory = categories.length > 0 ? categories.reduce((max, cat) => cat.total > max.total ? cat : max) : null;
  const avgCategory = categories.length > 0 ? (total / categories.length).toFixed(2) : 0;
  
  const prevTopCategory = prevCategories.length > 0 ? prevCategories.reduce((max, cat) => cat.total > max.total ? cat : max) : null;
  const prevAvgCategory = prevCategories.length > 0 ? (prevTotal / prevCategories.length).toFixed(2) : 0;

  // Calculate comparison percentage
  const getComparisonPercentage = () => {
    if (prevTotal === null || prevTotal === 0) return null;
    return (((total - prevTotal) / prevTotal) * 100).toFixed(1);
  };

  const comparisonPercent = getComparisonPercentage();
  const isIncrease = comparisonPercent > 0;

  return (
    <Card sx={{
      mb: 4,
      background: "white",
      color: "#333",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
      borderRadius: "20px",
      overflow: "hidden",
      border: "1px solid rgba(0, 0, 0, 0.06)",
    }}>
      <CardContent sx={{ p: 0 }}>
        {/* Header Section with Gradient Overlay */}
        <Box sx={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            zIndex: 0
          }
        }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3, flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "900", mb: 0.5, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
                  📊 Monthly Summary
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, fontSize: "16px", color: "#555" }}>
                  Track your expenses and spending trends
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", md: "auto" }, flexDirection: { xs: "column", sm: "row" } }}>
                {/* Current Month */}
                <Paper sx={{
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  color: "white",
                  borderRadius: "16px",
                  p: 2,
                  border: "none",
                  flex: 1,
                  minWidth: "180px",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(30, 60, 114, 0.2)"
                  }
                }}>
                  <Typography variant="caption" sx={{ opacity: 0.8, display: "block", mb: 1, fontSize: "13px", fontWeight: "600" }}>
                    CURRENT MONTH
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
                    {total !== null ? `₹${Number(total).toFixed(2)}` : "—"}
                  </Typography>
                </Paper>

                {/* Previous Month (when data available) */}
                {prevTotal !== null && (
                  <Paper
                    sx={{
                      background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
                      borderRadius: "16px",
                      p: 2,
                      border: "1px solid rgba(0,0,0,0.06)",
                      flex: 1,
                      minWidth: "180px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.08)"
                      }
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 1, fontSize: "13px", fontWeight: "600" }}>
                      {prevMonthName.toUpperCase()}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: "900", margin: 0, mb: 1, color: "#333" }}>
                      ₹{Number(prevTotal).toFixed(2)}
                    </Typography>
                    {comparisonPercent !== null && (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: isIncrease ? "#FF6B6B" : "#4ECDC4",
                            fontWeight: "700",
                            fontSize: "14px"
                          }}
                        >
                          {isIncrease ? "📈 +" : "📉 "}{comparisonPercent}%
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && <Alert severity="error" sx={{ m: 2, mt: 3, borderRadius: "12px" }}>{error}</Alert>}

        {/* Input & Controls Section */}
        <Box sx={{ p: 3, background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <Stack spacing={2}>
            {/* Toggle for auto-fetch */}
            <FormControlLabel
              control={
                <Switch
                  checked={autoFetch}
                  onChange={(e) => setAutoFetch(e.target.checked)}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&.Mui-checked": {
                      color: "rgba(255,255,255,0.9)",
                    }
                  }}
                />
              }
              label={
                <Typography sx={{ color: "#333", fontWeight: "600", fontSize: "14px" }}>
                  {autoFetch ? "✓ Auto-fetch with comparison" : "Manual mode - Click Get Summary"}
                </Typography>
              }
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: "flex-end" }}>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Month</InputLabel>
                <Select
                  value={month}
                  label="Month"
                  onChange={(e) => setMonth(e.target.value)}
                  sx={{
                    color: "#333",
                    borderRadius: "10px",
                    background: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.1)" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.2)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72", boxShadow: "0 0 0 3px rgba(30,60,114,0.08)" },
                    "& .MuiSvgIcon-root": { color: "rgba(0,0,0,0.6)" },
                    fontWeight: "600"
                  }}
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m, i) => (
                    <MenuItem key={i + 1} value={i + 1} sx={{ fontWeight: "600" }}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel sx={{ color: "rgba(0,0,0,0.6)" }}>Year</InputLabel>
                <Select
                  value={year}
                  label="Year"
                  onChange={(e) => setYear(e.target.value)}
                  sx={{
                    color: "#333",
                    borderRadius: "10px",
                    background: "#ffffff",
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.1)" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.2)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1e3c72", boxShadow: "0 0 0 3px rgba(30,60,114,0.08)" },
                    "& .MuiSvgIcon-root": { color: "rgba(0,0,0,0.6)" },
                    fontWeight: "600"
                  }}
                >
                  {[2024, 2025, 2026, 2027, 2028].map((y) => (
                    <MenuItem key={y} value={y} sx={{ fontWeight: "600" }}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={() => fetchSummary(true)}
                disabled={loading}
                sx={{
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  color: "white",
                  fontWeight: "700",
                  textTransform: "none",
                  fontSize: "15px",
                  borderRadius: "10px",
                  py: 1,
                  px: 3,
                  boxShadow: "0 8px 20px rgba(30, 60, 114, 0.3)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255,255,255,0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2a5298 0%, #3a6aad 100%)",
                    transform: "translateY(-3px)",
                    boxShadow: "0 12px 30px rgba(30, 60, 114, 0.4)",
                    borderColor: "rgba(255,255,255,0.3)"
                  },
                  "&:disabled": {
                    background: "rgba(30, 60, 114, 0.5)",
                    color: "rgba(255,255,255,0.6)",
                  }
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: "white", mr: 1 }} /> : ""}
                {loading ? "Fetching..." : "Get Summary"}
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Tabs for Current & Previous Month */}
        {(total !== null || prevTotal !== null) && (
          <Box sx={{ p: 3, pt: 0 }}>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              sx={{
                borderBottom: "2px solid rgba(0,0,0,0.06)",
                "& .MuiTabs-indicator": {
                  background: "linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)",
                  height: "3px",
                  borderRadius: "3px"
                },
                "& .MuiTab-root": {
                  color: "rgba(0,0,0,0.5)",
                  fontWeight: "600",
                  fontSize: "15px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#333"
                  },
                  "&.Mui-selected": {
                    color: "#1e3c72"
                  }
                }
              }}
            >
              {total !== null && <Tab label={`📊 ${monthName}`} />}
              {prevTotal !== null && <Tab label={`📋 ${prevMonthName}`} />}
            </Tabs>

            {/* Current Month Tab */}
            {total !== null && tabValue === 0 && categories.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {/* Statistics Cards with Progress */}
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #FFE0E0",
                      borderLeft: "4px solid #FF6B6B",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(255,107,107,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#FF6B6B" }}>
                        🏷️ CATEGORIES
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        {categories.length}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(categories.length * 15, 100)}
                        sx={{
                          borderRadius: "10px",
                          background: "#FFE0E0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg, #FF6B6B, #FF8A80)",
                            borderRadius: "10px"
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #E0F2F1",
                      borderLeft: "4px solid #4ECDC4",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(78,205,196,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#4ECDC4" }}>
                        📊 AVG/CATEGORY
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        ₹{avgCategory}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "12px", color: "#666" }}>
                        Per category average
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #E0F7FA",
                      borderLeft: "4px solid #45B7D1",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(69,183,209,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#45B7D1" }}>
                        🎯 TOP CATEGORY
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        {topCategory?.category || "—"}
                      </Typography>
                      <Chip
                        label={`₹${topCategory?.total.toFixed(2) || "0"}`}
                        sx={{
                          background: getCategoryColor(topCategory?.category),
                          color: "white",
                          fontWeight: "700",
                          height: "24px"
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #FFE0B2",
                      borderLeft: "4px solid #FFA07A",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(255,160,122,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#FFA07A" }}>
                        💰 HIGHEST SPEND
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        ₹{topCategory?.total.toFixed(2) || "0"}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "12px", color: "#666" }}>
                        {topCategory?.category || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Category Breakdown */}
                <Paper sx={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "14px",
                  p: 2.5,
                  border: "1px solid rgba(255,255,255,0.15)",
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ fontWeight: "900", mb: 2 }}>
                    💳 Categories
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {categories.map((cat) => (
                      <Chip
                        key={cat.category}
                        label={`${cat.category}: ₹${cat.total.toFixed(2)}`}
                        sx={{
                          background: getCategoryColor(cat.category),
                          color: "white",
                          fontWeight: "700",
                          padding: "22px 8px",
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>

                {/* Charts */}
                <Paper sx={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  p: 3,
                  border: "1px solid rgba(0,0,0,0.06)"
                }}>
                  <Typography variant="h6" sx={{ fontWeight: "900", mb: 3, color: "#333" }}>
                    📈 Visualization
                  </Typography>
                  <ExpenseCharts data={categories} />
                </Paper>
              </Box>
            )}

            {/* Previous Month Tab */}
            {prevTotal !== null && prevCategories.length > 0 && tabValue === (total !== null ? 1 : 0) && (
              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #FFE0E0",
                      borderLeft: "4px solid #FF6B6B",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(255,107,107,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#FF6B6B" }}>
                        🏷️ CATEGORIES
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        {prevCategories.length}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(prevCategories.length * 15, 100)}
                        sx={{
                          borderRadius: "10px",
                          background: "#FFE0E0",
                          "& .MuiLinearProgress-bar": {
                            background: "linear-gradient(90deg, #FF6B6B, #FF8A80)",
                            borderRadius: "10px"
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #E0F2F1",
                      borderLeft: "4px solid #4ECDC4",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(78,205,196,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#4ECDC4" }}>
                        📊 AVG/CATEGORY
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        ₹{prevAvgCategory}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "12px", color: "#666" }}>
                        Per category average
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #E0F7FA",
                      borderLeft: "4px solid #45B7D1",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(69,183,209,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#45B7D1" }}>
                        🎯 TOP CATEGORY
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        {prevTopCategory?.category || "—"}
                      </Typography>
                      <Chip
                        label={`₹${prevTopCategory?.total.toFixed(2) || "0"}`}
                        sx={{
                          background: getCategoryColor(prevTopCategory?.category),
                          color: "white",
                          fontWeight: "700",
                          height: "24px"
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      p: 2.5,
                      border: "1px solid #FFE0B2",
                      borderLeft: "4px solid #FFA07A",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 30px rgba(255,160,122,0.15)"
                      }
                    }}>
                      <Typography variant="body2" sx={{ opacity: 0.8, mb: 1, fontWeight: "600", fontSize: "12px", color: "#FFA07A" }}>
                        💰 HIGHEST SPEND
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: "900", mb: 1, color: "#333" }}>
                        ₹{prevTopCategory?.total.toFixed(2) || "0"}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "12px", color: "#666" }}>
                        {prevTopCategory?.category || "N/A"}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Category Breakdown */}
                <Paper sx={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  p: 2.5,
                  border: "1px solid rgba(0,0,0,0.06)",
                  mb: 3
                }}>
                  <Typography variant="h6" sx={{ fontWeight: "900", mb: 2, color: "#333" }}>
                    💳 Categories
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {prevCategories.map((cat) => (
                      <Chip
                        key={cat.category}
                        label={`${cat.category}: ₹${cat.total.toFixed(2)}`}
                        sx={{
                          background: getCategoryColor(cat.category),
                          color: "white",
                          fontWeight: "700",
                          padding: "22px 8px",
                          fontSize: "13px",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 6px 16px rgba(0,0,0,0.2)"
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Paper>

                {/* Charts */}
                <Paper sx={{
                  background: "#ffffff",
                  borderRadius: "14px",
                  p: 3,
                  border: "1px solid rgba(0,0,0,0.06)"
                }}>
                  <Typography variant="h6" sx={{ fontWeight: "900", mb: 3, color: "#333" }}>
                    📈 Visualization
                  </Typography>
                  <ExpenseCharts data={prevCategories} />
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {total === null && !loading && (
          <Box sx={{
            textAlign: "center",
            py: 6,
            opacity: 0.7,
            color: "#333"
          }}>
            <Typography variant="h6" sx={{ fontWeight: "600", mb: 1 }}>
              📅 No Data Yet
            </Typography>
            <Typography variant="body2">
              Select month and year, then click "Get Summary" to view your expenses
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default MonthlySummary;
