import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AppLayout.css';

const drawerWidth = 160;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    { path: '/', label: t('menu.home') },
    { path: '/diary', label: t('menu.diary') },
    { path: '/budget', label: t('menu.budget') },
    { path: '/fixed-costs', label: t('menu.fixedCosts') },
    { path: '/categories', label: t('menu.categories') },
    { path: '/graphs', label: t('menu.graphs') },
    { path: '/settings', label: t('menu.settings') },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* 左メニュー */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        classes={{ paper: 'drawer-paper' }}
      >
        <List className="menu-list">
          {menuItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  className={`menu-item ${isSelected ? 'selected' : ''}`}
                >
                  <ListItemText primary={item.label} className="menu-text" />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
