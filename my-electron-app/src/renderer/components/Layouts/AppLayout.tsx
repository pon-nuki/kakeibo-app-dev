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
import './AppLayout.css';

const drawerWidth = 160;

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
          classes={{ paper: 'drawer-paper' }}
        >
        <List className="menu-list">
          {[
            { path: '/', label: '家計簿' },
            { path: '/diary', label: '日記' },
            { path: '/budget', label: '予算設定' },
            { path: '/fixed-costs', label: '固定費設定' },
            { path: '/categories', label: 'カテゴリ設定' },
            { path: '/graphs', label: 'グラフで見る' },
            { path: '/settings', label: 'アプリ設定' },
          ].map((item) => {
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
