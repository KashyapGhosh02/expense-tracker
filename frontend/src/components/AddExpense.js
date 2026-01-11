import { useEffect, useState } from "react";
import api from "../api";
import {
  Card, CardContent, Typography,
  TextField, Button, Grid, Box, Alert, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";

function AddExpense({ selectedExpense, onAdd, onUpdate }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedExpense) {
      setTitle(selectedExpense.title);
      setAmount(selectedExpense.amount);
      setCategory(selectedExpense.category);
      setDate(selectedExpense.date);
    } else {
      resetForm();
    }
  }, [selectedExpense]);

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setError("");
  };

  const submit = () => {
    if (!title || !amount || !category || !date) {
      setError("All fields are required");
      return;
    }

    const payload = { title, amount: parseFloat(amount), category, date };

    if (selectedExpense) {
      api.put(`/expenses/${selectedExpense.id}`, payload)
        .then(() => {
          resetForm();
          onUpdate();
        })
        .catch(() => setError("Failed to update expense"));
    } else {
      api.post("/expenses", payload)
        .then(() => {
          resetForm();
          onAdd();
        })
        .catch(() => setError("Failed to add expense"));
    }
  };

  return (
    <Card sx={{
      mb: 4,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)"
    }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {selectedExpense ? "Edit Expense" : "Add New Expense"}
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&:hover fieldset": { borderColor: "white" }
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" }
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="number"
              label="Amount (₹)"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputProps={{ step: "0.01" }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&:hover fieldset": { borderColor: "white" }
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" }
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>Category</InputLabel>
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                renderValue={(selected) => (
                  <span style={{ opacity: selected ? 1 : 0.6 }}>
                    {selected ? selected : "Select a category"}
                  </span>
                )}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.5)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.7)" }
                }}
              >
                <MenuItem value="" disabled>Select a category</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Transport">Transport</MenuItem>
                <MenuItem value="Entertainment">Entertainment</MenuItem>
                <MenuItem value="Utilities">Utilities</MenuItem>
                <MenuItem value="Shopping">Shopping</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                  "&:hover fieldset": { borderColor: "white" }
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& input": { color: "white" }
              }}
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={submit}
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                color: "#667eea",
                fontWeight: "bold",
                borderRadius: "12px",
                py: 1.5,
                boxShadow: "0 8px 24px rgba(255, 255, 255, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "white",
                  boxShadow: "0 12px 32px rgba(255, 255, 255, 0.5)",
                  transform: "translateY(-2px)"
                },
                "&:active": {
                  transform: "translateY(0)"
                }
              }}
            >
              {selectedExpense ? "Update" : "Add"}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AddExpense;
