import merge from 'lodash/merge';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField } from '@mui/material';
//
import { useTheme } from '@mui/material/styles';
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: 'Total Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
  { name: 'Total Expenses', data: [18, 56, 89, 45, 77, 66, 23, 48, 92] },
  { name: 'Total Income', data: [57, 24, 172, 65, 89, 36, 60, 164, 56] },
  { name: 'Total Expenses', data: [34, 65, 32, 45, 42, 154, 84, 32, 45] },
];

export default function EcommerceYearlySales() {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    legend: { position: 'top', horizontalAlign: 'right' },
    colors: [
      theme.palette.primary.main,
      theme.palette.other.yellow,
      theme.palette.other.orange,
      theme.palette.other.purple,
    ],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    stroke: {
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100]
      },
    },
  });

  return (
    <Card>
      <CardHeader
        title="日志记录"
      />
        <Box  sx={{ mt: 7, mx: 3 }} dir="ltr">
           <ReactApexChart type="area" series={CHART_DATA} options={chartOptions} height={364} />
        </Box>

    </Card>
  );
}
