'use client';

import { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useTranslation } from 'react-i18next';
import { useFinanceStore } from '@/store/financeStore';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppLayout from '@/components/Layout/AppLayout';
import { formatCurrency } from '@/utils/format';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function ReportsPage() {
  const { t } = useTranslation();
  const getMonthlyReport = useFinanceStore((state) => state.getMonthlyReport);
  const getYearlyReport = useFinanceStore((state) => state.getYearlyReport);
  const comparePeriods = useFinanceStore((state) => state.comparePeriods);
  const getFinancialProjection = useFinanceStore((state) => state.getFinancialProjection);
  const currency = useFinanceStore((state) => state.settings.currency);

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [tabValue, setTabValue] = useState(0);
  const [comparisonPeriod1, setComparisonPeriod1] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [comparisonPeriod2, setComparisonPeriod2] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });

  const monthlyReport = useMemo(() => getMonthlyReport(selectedYear, selectedMonth), [selectedYear, selectedMonth, getMonthlyReport]);
  const yearlyReport = useMemo(() => getYearlyReport(selectedYear), [selectedYear, getYearlyReport]);
  const comparison = useMemo(() => comparePeriods(comparisonPeriod1, comparisonPeriod2), [comparisonPeriod1, comparisonPeriod2, comparePeriods]);
  const projection = useMemo(() => getFinancialProjection(6), [getFinancialProjection]);

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleExportPDF = (type: 'monthly' | 'yearly' | 'comparison') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    let content = '';
    if (type === 'monthly') {
      content = `
Monthly Report - ${selectedMonth}/${selectedYear}
Income: ${formatCurrency(monthlyReport.income, currency)}
Expenses: ${formatCurrency(monthlyReport.expenses, currency)}
Balance: ${formatCurrency(monthlyReport.income - monthlyReport.expenses, currency)}
Transactions: ${monthlyReport.transactions}
      `;
    } else if (type === 'yearly') {
      content = `
Yearly Report - ${selectedYear}
Total Income: ${formatCurrency(yearlyReport.totalIncome, currency)}
Total Expenses: ${formatCurrency(yearlyReport.totalExpenses, currency)}
Balance: ${formatCurrency(yearlyReport.totalIncome - yearlyReport.totalExpenses, currency)}
Transactions: ${yearlyReport.transactions}
      `;
    }

    const htmlContent = `
      <html>
        <head><title>Report</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <pre>${content}</pre>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleExportExcel = (type: 'monthly' | 'yearly') => {
    let csvContent = '';
    let filename = '';

    if (type === 'monthly') {
      filename = `monthly-report-${selectedYear}-${selectedMonth}.csv`;
      csvContent = 'Category,Amount\n';
      csvContent += `Income,${monthlyReport.income}\n`;
      csvContent += `Expenses,${monthlyReport.expenses}\n`;
      csvContent += `Balance,${monthlyReport.income - monthlyReport.expenses}\n`;
      csvContent += `Transactions,${monthlyReport.transactions}\n\n`;
      csvContent += 'Expenses by Category\n';
      monthlyReport.byCategory.forEach((item) => {
        csvContent += `${item.category},${item.amount}\n`;
      });
    } else if (type === 'yearly') {
      filename = `yearly-report-${selectedYear}.csv`;
      csvContent = 'Month,Income,Expenses,Balance\n';
      yearlyReport.monthlyBreakdown.forEach((month, index) => {
        const monthName = new Date(selectedYear, index, 1).toLocaleDateString('en-US', { month: 'short' });
        csvContent += `${monthName},${month.income},${month.expenses},${month.income - month.expenses}\n`;
      });
      csvContent += `\nTotal Income,${yearlyReport.totalIncome}\n`;
      csvContent += `Total Expenses,${yearlyReport.totalExpenses}\n`;
      csvContent += `Balance,${yearlyReport.totalIncome - yearlyReport.totalExpenses}\n`;
      csvContent += `Transactions,${yearlyReport.transactions}\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          {t('reports.title') || 'Reports & Analytics'}
        </Typography>
      </Box>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label={t('reports.monthly') || 'Monthly Report'} />
        <Tab label={t('reports.yearly') || 'Yearly Report'} />
        <Tab label={t('reports.comparison') || 'Period Comparison'} />
        <Tab label={t('reports.projection') || 'Financial Projection'} />
        <Tab label={t('reports.advancedAnalytics') || 'Advanced Analytics'} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{t('reports.year') || 'Year'}</InputLabel>
                  <Select value={selectedYear} label={t('reports.year') || 'Year'} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{t('reports.month') || 'Month'}</InputLabel>
                  <Select value={selectedMonth} label={t('reports.month') || 'Month'} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {months.map((month) => (
                      <MenuItem key={month} value={month}>
                        {new Date(2000, month - 1).toLocaleDateString('en-US', { month: 'long' })}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => handleExportPDF('monthly')}
                  sx={{ mr: 1 }}
                >
                  {t('reports.exportPDF') || 'Export PDF'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleExportExcel('monthly')}
                >
                  {t('reports.exportExcel') || 'Export Excel'}
                </Button>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.totalIncome')}</Typography>
                      <Typography variant="h5" color="success.main" fontWeight={700}>
                        {formatCurrency(monthlyReport.income, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.totalExpenses')}</Typography>
                      <Typography variant="h5" color="error.main" fontWeight={700}>
                        {formatCurrency(monthlyReport.expenses, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.balance')}</Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ color: (monthlyReport.income - monthlyReport.expenses) >= 0 ? 'success.main' : 'error.main' }}>
                        {formatCurrency(monthlyReport.income - monthlyReport.expenses, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>{t('reports.byCategory') || 'Expenses by Category'}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyReport.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                    <Bar dataKey="amount" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>{t('reports.year') || 'Year'}</InputLabel>
                  <Select value={selectedYear} label={t('reports.year') || 'Year'} onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={() => handleExportPDF('yearly')}
                  sx={{ mr: 1 }}
                >
                  {t('reports.exportPDF') || 'Export PDF'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => handleExportExcel('yearly')}
                >
                  {t('reports.exportExcel') || 'Export Excel'}
                </Button>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.totalIncome')}</Typography>
                      <Typography variant="h5" color="success.main" fontWeight={700}>
                        {formatCurrency(yearlyReport.totalIncome, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.totalExpenses')}</Typography>
                      <Typography variant="h5" color="error.main" fontWeight={700}>
                        {formatCurrency(yearlyReport.totalExpenses, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">{t('dashboard.balance')}</Typography>
                      <Typography variant="h5" fontWeight={700} sx={{ color: (yearlyReport.totalIncome - yearlyReport.totalExpenses) >= 0 ? 'success.main' : 'error.main' }}>
                        {formatCurrency(yearlyReport.totalIncome - yearlyReport.totalExpenses, currency)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>{t('reports.monthlyBreakdown') || 'Monthly Breakdown'}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={yearlyReport.monthlyBreakdown.map((m, i) => ({ month: i + 1, income: m.income, expenses: m.expenses }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4caf50" name={t('dashboard.totalIncome')} />
                    <Line type="monotone" dataKey="expenses" stroke="#f50057" name={t('dashboard.totalExpenses')} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {tabValue === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('reports.periodComparison') || 'Period Comparison'}</Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Period 1</InputLabel>
                  <Select
                    value={`${comparisonPeriod1.year}-${comparisonPeriod1.month}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number);
                      setComparisonPeriod1({ year, month });
                    }}
                  >
                    {years.flatMap((year) =>
                      months.map((month) => (
                        <MenuItem key={`${year}-${month}`} value={`${year}-${month}`}>
                          {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Period 2</InputLabel>
                  <Select
                    value={`${comparisonPeriod2.year}-${comparisonPeriod2.month}`}
                    onChange={(e) => {
                      const [year, month] = e.target.value.split('-').map(Number);
                      setComparisonPeriod2({ year, month });
                    }}
                  >
                    {years.flatMap((year) =>
                      months.map((month) => (
                        <MenuItem key={`${year}-${month}`} value={`${year}-${month}`}>
                          {new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>{t('reports.metric') || 'Metric'}</strong></TableCell>
                    <TableCell align="right"><strong>Period 1</strong></TableCell>
                    <TableCell align="right"><strong>Period 2</strong></TableCell>
                    <TableCell align="right"><strong>{t('reports.change') || 'Change'}</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('dashboard.totalIncome')}</TableCell>
                    <TableCell align="right">{formatCurrency(comparison.period1.income, currency)}</TableCell>
                    <TableCell align="right">{formatCurrency(comparison.period2.income, currency)}</TableCell>
                    <TableCell align="right" sx={{ color: comparison.incomeChange >= 0 ? 'success.main' : 'error.main' }}>
                      {comparison.incomeChange >= 0 ? '+' : ''}{formatCurrency(comparison.incomeChange, currency)} ({comparison.incomeChangePercent.toFixed(1)}%)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('dashboard.totalExpenses')}</TableCell>
                    <TableCell align="right">{formatCurrency(comparison.period1.expenses, currency)}</TableCell>
                    <TableCell align="right">{formatCurrency(comparison.period2.expenses, currency)}</TableCell>
                    <TableCell align="right" sx={{ color: comparison.expenseChange <= 0 ? 'success.main' : 'error.main' }}>
                      {comparison.expenseChange >= 0 ? '+' : ''}{formatCurrency(comparison.expenseChange, currency)} ({comparison.expenseChangePercent.toFixed(1)}%)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {tabValue === 3 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('reports.financialProjection') || '6-Month Financial Projection'}</Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number | undefined) => formatCurrency(value || 0, currency)} />
                <Legend />
                <Line type="monotone" dataKey="projectedIncome" stroke="#4caf50" name={t('reports.projectedIncome') || 'Projected Income'} />
                <Line type="monotone" dataKey="projectedExpenses" stroke="#f50057" name={t('reports.projectedExpenses') || 'Projected Expenses'} />
                <Line type="monotone" dataKey="projectedBalance" stroke="#1976d2" name={t('reports.projectedBalance') || 'Projected Balance'} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Advanced Analytics Tab */}
      {tabValue === 4 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('reports.advancedAnalytics') || 'Advanced Analytics'}</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {t('reports.spendingTrends') || 'Spending Trends'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('reports.trendsDescription') || 'Analyze your spending patterns over time to identify trends and opportunities for savings.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {t('reports.categoryInsights') || 'Category Insights'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('reports.insightsDescription') || 'Deep dive into category spending with detailed breakdowns and recommendations.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {t('reports.financialHealth') || 'Financial Health Score'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('reports.healthDescription') || 'Get a comprehensive score of your financial health based on multiple factors.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {t('reports.predictiveAnalysis') || 'Predictive Analysis'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('reports.predictiveDescription') || 'AI-powered predictions for future spending and income patterns.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default function ProtectedReports() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <ReportsPage />
      </AppLayout>
    </ProtectedRoute>
  );
}
