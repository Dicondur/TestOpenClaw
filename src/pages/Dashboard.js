import React from 'react';
import { Grid, Paper, Typography, Box, alpha, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Inventory, People, AttachMoney, 
  ShoppingCart, ArrowUpward, ArrowDownward
} from '@mui/icons-material';

const StatCard = ({ title, value, icon, color, trend, trendValue }) => {
  const theme = useTheme();
  const isPositive = trend === 'up';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        display: 'flex', 
        alignItems: 'center',
        gap: { xs: 1.5, sm: 2 },
        borderRadius: { xs: 2, sm: 4 },
        cursor: 'pointer',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
        },
      }}
    >
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        borderRadius: { xs: 2, sm: 3 }, 
        bgcolor: alpha(color, 0.15),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: { xs: 48, sm: 56 },
      }}>
        {React.cloneElement(icon, { sx: { fontSize: { xs: 24, sm: 32 }, color } })}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.7rem', sm: '0.875rem' } }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            {value}
          </Typography>
          {trendValue && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: isPositive ? '#10b981' : '#ef4444',
              fontSize: { xs: '0.7rem', sm: '0.875rem' },
              fontWeight: 600,
            }}>
              {isPositive ? <ArrowUpward sx={{ fontSize: { xs: 12, sm: 16 } }} /> : <ArrowDownward sx={{ fontSize: { xs: 12, sm: 16 } }} />}
              {trendValue}
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const stats = [
    { 
      title: "Total Revenue", 
      value: "$12,450", 
      icon: <AttachMoney />,
      color: "#10b981",
      trend: "up",
      trendValue: "+12.5%"
    },
    { 
      title: "Total Items", 
      value: "156", 
      icon: <Inventory />,
      color: "#6366f1",
      trend: "up",
      trendValue: "+8.2%"
    },
    { 
      title: "Active Users", 
      value: "89", 
      icon: <People />,
      color: "#f59e0b",
      trend: "down",
      trendValue: "-2.1%"
    },
    { 
      title: "Orders", 
      value: "234", 
      icon: <ShoppingCart />,
      color: "#ec4899",
      trend: "up",
      trendValue: "+15.3%"
    },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, mb: { xs: 2, sm: 3 }, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          📊 Dashboard
        </Typography>
      </motion.div>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={stat.title}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          </Grid>
        ))}
        
        {/* Activity Chart Card */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 4 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  📈 Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {['Day', 'Week', 'Month'].map((period) => (
                    <Box
                      key={period}
                      sx={{
                        px: { xs: 1.5, sm: 2 },
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        fontWeight: 500,
                        cursor: 'pointer',
                        bgcolor: period === 'Week' ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
                        color: period === 'Week' ? theme.palette.primary.main : 'text.secondary',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        }
                      }}
                    >
                      {period}
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Chart visualization */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: { xs: 0.5, sm: 1 }, height: { xs: 120, sm: 180 }, px: { xs: 1, sm: 2 } }}>
                {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80, 70].map((height, i) => (
                  <Box
                    key={i}
                    component={motion.div}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    sx={{
                      flex: 1,
                      borderRadius: { xs: 0.5, sm: 1 },
                      background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
                    }}
                  />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: { xs: 1, sm: 2 } }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                  <Typography key={day} variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                    {day}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Quick Info Card */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 2, sm: 4 }, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: { xs: 2, sm: 3 }, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                ℹ️ Quick Info
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
                {[
                  { title: 'System Status', value: 'Online', color: '#10b981' },
                  { title: 'API Latency', value: '24ms', color: '#6366f1' },
                  { title: 'Storage Used', value: '67%', color: '#f59e0b' },
                  { title: 'Last Backup', value: '2h ago', color: '#ec4899' },
                ].map((item) => (
                  <Box 
                    key={item.title}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      bgcolor: alpha(item.color, 0.08),
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600, 
                        color: item.color,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;