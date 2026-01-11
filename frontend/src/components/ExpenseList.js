import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import api from "../api";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  Stack,
  Box,
  Chip,
} from "@mui/material";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [filter, setFilter] = useState("");

  const getCategoryColor = (category) => {
    const colors = {
      "Food": "#FF6B6B",
      "Transport": "#4ECDC4",
      "Rent": "#45B7D1",
      "Entertainment": "#FFA07A",
      "Utilities": "#98D8C8",
      "other": "#9B59B6",
      "Shopping": "#F39C12",
    };
    return colors[category] || "#9B59B6";
  };

  const fetchExpenses = () => {
    api
      .get("/expenses")
      .then((res) => setExpenses(res.data));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = (id) => {
    api.delete(`/expenses/${id}`).then(fetchExpenses);
  };

  //   const exportCSV = () => {
  //     const csv = [
  //       ["Title", "Amount", "Category", "Date"],
  //       ...expenses.map(e => [e.title, e.amount, e.category, e.date])
  //     ].map(r => r.join(",")).join("\n");

  //     saveAs(new Blob([csv]), "expenses.csv");
  //   };
  const exportExcel = () => {
    // ======================
    // 1. Expense data
    // ======================
    const expenseData = expenses.map((e) => ({
      Title: e.title,
      Amount: e.amount,
      Category: e.category,
      Date: e.date,
    }));

    // ======================
    // 2. Total expense
    // ======================
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // ======================
    // 3. Category summary
    // ======================
    const categoryTotals = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] =
        (categoryTotals[e.category] || 0) + Number(e.amount);
    });

    const summaryData = Object.keys(categoryTotals).map((cat) => ({
      Category: cat,
      "Total Amount": categoryTotals[cat],
    }));

    // ======================
    // 4. Workbook
    // ======================
    const workbook = XLSX.utils.book_new();

    // -------- Expenses Sheet --------
    const expenseSheet = XLSX.utils.json_to_sheet(expenseData);

    XLSX.utils.sheet_add_aoa(expenseSheet, [["EXPENSE TRACKER REPORT"]], {
      origin: "A1",
    });

    expenseSheet["!cols"] = [
      { wch: 25 },
      { wch: 15 },
      { wch: 18 },
      { wch: 15 },
    ];

    XLSX.utils.book_append_sheet(workbook, expenseSheet, "Expenses");

    // -------- Summary Sheet --------
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    XLSX.utils.sheet_add_aoa(summarySheet, [["SUMMARY"]], { origin: "A1" });

    XLSX.utils.sheet_add_aoa(summarySheet, [["Total Expense", totalExpense]], {
      origin: "A3",
    });

    summarySheet["!cols"] = [{ wch: 20 }, { wch: 18 }];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    // ======================
    // 5. Export file
    // ======================
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "Expense_Report.xlsx");
  };

  return (
    <>
      <AddExpense
        selectedExpense={selectedExpense}
        onAdd={fetchExpenses}
        onUpdate={() => {
          setSelectedExpense(null);
          fetchExpenses();
        }}
      />

      <Card sx={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              💰 Expenses
            </Typography>
            <Button
              variant="contained"
              onClick={exportExcel}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                textTransform: "none",
                fontWeight: "bold"
              }}
            >
              Export Report
            </Button>
          </Box>

          <Box sx={{ mb: 3, p: 2, background: "#f5f5f5", borderRadius: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "center" }}>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Filter by Category
                </Typography>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  size="small"
                  sx={{ mt: 1, minWidth: 150 }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Transport">Transport</MenuItem>
                  <MenuItem value="Rent">Rent</MenuItem>
                  <MenuItem value="Entertainment">Entertainment</MenuItem>
                  <MenuItem value="Utilities">Utilities</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="Shopping">Shopping</MenuItem>
                </Select>
              </Box>
              {expenses.filter((e) => !filter || e.category === filter).length > 0 && (
                <Box sx={{ ml: "auto" }}>
                  <Typography variant="body2" color="textSecondary">
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#667eea" }}>
                    ₹{expenses
                      .filter((e) => !filter || e.category === filter)
                      .reduce((sum, e) => sum + Number(e.amount), 0)
                      .toFixed(2)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Title</TableCell>
                  <TableCell align="right" sx={{ fontWeight: "bold", color: "#333" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#333" }}>Date</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#333" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {expenses
                  .filter((e) => !filter || e.category === filter)
                  .length > 0 ? (
                  expenses
                    .filter((e) => !filter || e.category === filter)
                    .map((exp) => (
                      <TableRow
                        key={exp.id}
                        sx={{
                          "&:hover": { background: "#fafafa" },
                          borderBottom: "1px solid #eee"
                        }}
                      >
                        <TableCell sx={{ fontWeight: "500" }}>{exp.title}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#667eea" }}>₹{Number(exp.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={exp.category}
                            size="small"
                            sx={{
                              background: getCategoryColor(exp.category),
                              color: "white",
                              fontWeight: "bold"
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(exp.date).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            onClick={() => setSelectedExpense(exp)}
                            sx={{ color: "#667eea", textTransform: "none" }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(exp.id)}
                            sx={{ textTransform: "none" }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">No expenses found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </>
  );
}

export default ExpenseList;
