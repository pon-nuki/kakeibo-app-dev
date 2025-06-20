import React, { useEffect, useState } from 'react';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useTranslation } from 'react-i18next';
import './Graphs.css';

Chart.register(...registerables);

const Graphs: React.FC = () => {
  const { t } = useTranslation();
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
      setErrorMessage(t('graphs.fetchError'));
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
      label: t('graphs.monthlyTotal'),
      data: monthlyData.map(d => d.total),
      borderColor: '#36A2EB',
      fill: false,
    }]
  };

  const barData = {
    labels: budgetCompare.map(d => d.month),
    datasets: [
      {
        label: t('graphs.budget'),
        data: budgetCompare.map(d => d.budget),
        backgroundColor: '#FFCE56'
      },
      {
        label: t('graphs.actual'),
        data: budgetCompare.map(d => d.actual),
        backgroundColor: '#FF6384'
      }
    ]
  };

  return (
    <div className="home-container">
      <Box className="header-wrapper">
        <Typography variant="h5" className="header-title">
          {t('graphs.title')}
        </Typography>
      </Box>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <Box className="graph-tab-buttons" sx={{ margin: '1rem 0' }}>
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={(_, value) => value && setTab(value)}
          aria-label={t('graphs.tabAriaLabel')}
        >
          <ToggleButton value="category">{t('graphs.category')}</ToggleButton>
          <ToggleButton value="monthly">{t('graphs.monthly')}</ToggleButton>
          <ToggleButton value="budget">{t('graphs.budget')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box className="graph-display-area" sx={{ padding: '1rem 0' }}>
        {tab === 'category' && (
          <>
            <Typography variant="h6">{t('graphs.categoryTitle')}</Typography>
            <Pie data={pieData} />
          </>
        )}
        {tab === 'monthly' && (
          <>
            <Typography variant="h6">{t('graphs.monthlyTitle')}</Typography>
            <Line data={lineData} />
          </>
        )}
        {tab === 'budget' && (
          <>
            <Typography variant="h6">{t('graphs.budgetTitle')}</Typography>
            <Bar data={barData} />
          </>
        )}
      </Box>
    </div>
  );
};

export default Graphs;
