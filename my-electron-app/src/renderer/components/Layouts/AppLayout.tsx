// src/renderer/components/Layouts/AppLayout.tsx
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

const drawerWidth = 200;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

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
      >
        <List>
          {[
            { path: '/', label: '家計簿' },
            { path: '/diary', label: '日記' },
            { path: '/budget', label: '予算設定' },
            { path: '/fixed-costs', label: '固定費設定' },
            { path: '/categories', label: 'カテゴリ設定' },
            { path: '/settings', label: 'アプリ設定' },
          ].map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
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
