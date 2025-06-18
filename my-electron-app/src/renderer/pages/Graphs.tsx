import React, { useEffect, useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Graphs.css';

Chart.register(...registerables);

const Graphs: React.FC = () => {
  const [tab, setTab] = useState<'category' | 'monthly' | 'budget'>('category');
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [budgetCompare, setBudgetCompare] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      if (!window.electron) throw new Error('Electron API が使えません。');

      const category = await window.electron.getCategorySummary();
      const monthly = await window.electron.getMonthlySpending();
      const budget = await window.electron.getBudgetVsActual();

      setCategoryData(category);
      setMonthlyData(monthly);
      setBudgetCompare(budget);
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage('データの取得に失敗しました。');
    }
  };

  const pieData = {
    labels: categoryData.map(d => d.category),
    datasets: [{
      data: categoryData.map(d => d.total),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#90ee90'],
    }]
  };

  const lineData = {
    labels: monthlyData.map(d => d.month),
    datasets: [{
      label: '月別支出合計',
      data: monthlyData.map(d => d.total),
      borderColor: '#36A2EB',
      fill: false,
    }]
  };

  const barData = {
    labels: budgetCompare.map(d => d.month),
    datasets: [
      {
        label: '予算',
        data: budgetCompare.map(d => d.budget),
        backgroundColor: '#FFCE56'
      },
      {
        label: '実支出',
        data: budgetCompare.map(d => d.actual),
        backgroundColor: '#FF6384'
      }
    ]
  };

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Typography variant="h5" className="header-title">支出グラフ</Typography>
      </Box>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <Box className="graph-tab-buttons" sx={{ margin: '1rem 0' }}>
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(_, value) => value && setTab(value)}
          aria-label="グラフ切り替え"
        >
          <ToggleButton value="category">カテゴリー別</ToggleButton>
          <ToggleButton value="monthly">月別支出</ToggleButton>
          <ToggleButton value="budget">予算と出費の比較</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="graph-display-area" sx={{ padding: '1rem 0' }}>
        {tab === 'category' && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>カテゴリー別支出</Typography>
            <Pie data={pieData} />
          </>
        )}
        {tab === 'monthly' && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>月別支出推移</Typography>
            <Line data={lineData} />
          </>
        )}
        {tab === 'budget' && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>予算と出費の比較</Typography>
            <Bar data={barData} />
          </>
        )}
      </Box>
    </div>
  );
};

export default Graphs;
