import React from "react";
import { Box, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";
function Analytic({ handleDrawerToggle, mobileOpen, setFilter, drawerWidth }) {
  // Function to generate heatmap data for a month
  const generateMonthData = (year, month, monthName) => {
    let row1 = [];
    let row2 = [];
    const daysInMonth = new Date(year, month, 0).getDate(); // Get total days in the month

    for (let day = 1; day <= daysInMonth; day++) {
      const entry = {
        x: `${day}`, // Show just the day number
        y: Math.floor(Math.random() * 10), // Random expiry count (0-9)
      };
      if (day <= 15) {
        row1.push(entry);
      } else {
        row2.push(entry);
      }
    }

    return [
      { name: `${monthName} (1-15)`, data: row1 }, // Placed first so it appears on top
      { name: `${monthName} (16-${daysInMonth})`, data: row2 }, // Placed second so it's below
    ];
  };

  // Generate data for February and March
  const febSeries = generateMonthData(2024, 2, "February");
  const marchSeries = generateMonthData(2024, 3, "March");

  const options = {
    chart: {
      type: "heatmap",
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#008FFB"],
    xaxis: {
      type: "category",
      labels: {
        rotate: 0, // Keep labels straight
      },
    },
    title: {
      text: "Upcoming Expiry Heatmap - February & March",
      align: "center",
    },
    grid: {
      padding: {
        right: 50, // Adds spacing between months
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        distributed: true,
      },
    },
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Header handleDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} setFilter={setFilter} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: { sm: `${drawerWidth}px` },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
        }}
      >
        <Typography variant="h4">Analytic</Typography>
        <Typography variant="body1">Show summaries metric data here.</Typography>

        <Box sx={{ display: "flex", gap: 5 }}> {/* Add space between charts */}
          {/* February Chart */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" align="center">February</Typography>
            <Chart options={options} series={febSeries} type="heatmap" height={350} />
          </Box>

          {/* March Chart */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" align="center">March</Typography>
            <Chart options={options} series={marchSeries} type="heatmap" height={350} />
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}

export default Analytic;
