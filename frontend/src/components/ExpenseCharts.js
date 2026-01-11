import { useMemo } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { Box, Typography } from "@mui/material";

const COLORS = [
  "#667eea", // Purple
  "#764ba2", // Dark Purple
  "#f093fb", // Pink
  "#f5576c", // Red
  "#4ecdc4", // Teal
  "#45b7d1", // Blue
  "#96ceb4", // Green
  "#ffeaa7", // Yellow
  "#dfe6e9", // Gray
  "#fd79a8", // Light Pink
];

const getCategoryColor = (category, index) => {
  const colorMap = {
    "Food": "#FF6B6B",
    "Travel": "#4ECDC4",
    "Rent": "#45B7D1",
    "Entertainment": "#FFA07A",
    "Utilities": "#98D8C8",
  };
  return colorMap[category] || COLORS[index % COLORS.length];
};

function ExpenseCharts({ data }) {
  const enhancedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      color: getCategoryColor(item.category, index),
    }));
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: "rgba(0, 0, 0, 0.85)",
            border: "2px solid #667eea",
            borderRadius: "8px",
            p: 1.5,
            color: "white",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "600", mb: 0.5 }}>
            {payload[0].payload.category}
          </Typography>
          <Typography variant="body2" sx={{ color: "#667eea", fontWeight: "bold" }}>
            ₹{Number(payload[0].value).toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            {((payload[0].value / data.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Box sx={{ width: "100%", py: 2 }}>
      {/* Pie Chart Section */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🥧 Expense Distribution
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", overflowX: "auto" }}>
          <ResponsiveContainer width={400} height={350}>
            <PieChart>
              <Pie
                data={enhancedData}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={60}
                paddingAngle={2}
                label={({ category, total }) => (
                  `${category}: ₹${total.toFixed(0)}`
                )}
                labelLine={false}
              >
                {enhancedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mt: 3,
          }}
        >
          {enhancedData.map((item, index) => (
            <Box
              key={index}
              sx={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "8px",
                p: 1.5,
                border: `2px solid ${item.color}`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "600", mb: 0.5 }}>
                {item.category}
              </Typography>
              <Typography variant="h6" sx={{ color: item.color, fontWeight: "bold", mb: 0.5 }}>
                ₹{item.total.toFixed(2)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {((item.total / totalAmount) * 100).toFixed(1)}% of total
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Bar Chart Section */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📊 Category Comparison
        </Typography>
        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            p: 2,
            border: "1px solid rgba(255,255,255,0.1)",
            overflowX: "auto",
          }}
        >
          <ResponsiveContainer width="100%" height={300} minWidth={500}>
            <BarChart
              data={enhancedData}
              margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="category"
                tick={{ fill: "white", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                tick={{ fill: "white", fontSize: 12 }}
                label={{ value: "Amount (₹)", angle: -90, position: "insideLeft", fill: "white" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                iconType="circle"
              />
              <Bar
                dataKey="total"
                fill="#667eea"
                name="Expense Amount"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
              >
                {enhancedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 2,
            mt: 3,
          }}
        >
          <Box
            sx={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Highest Spending
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {enhancedData.reduce((max, cat) => cat.total > max.total ? cat : max)?.category || "—"}
            </Typography>
            <Typography variant="h6" sx={{ color: "#667eea", fontWeight: "bold" }}>
              ₹{Math.max(...data.map(d => d.total)).toFixed(2)}
            </Typography>
          </Box>

          <Box
            sx={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Average per Category
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              ₹{(totalAmount / data.length).toFixed(2)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              across {data.length} categories
            </Typography>
          </Box>

          <Box
            sx={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "8px",
              p: 2,
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
              Lowest Spending
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {enhancedData.reduce((min, cat) => cat.total < min.total ? cat : min)?.category || "—"}
            </Typography>
            <Typography variant="h6" sx={{ color: "#764ba2", fontWeight: "bold" }}>
              ₹{Math.min(...data.map(d => d.total)).toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ExpenseCharts;
