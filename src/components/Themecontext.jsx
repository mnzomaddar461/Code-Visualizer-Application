import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (isDark) {
      // Dark mode — body থেকে light-mode সরাও
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = '#060913';
      document.body.style.color = '#e2e8f0';
      localStorage.setItem('theme', 'dark');
    } else {
      // Light mode — body তে light-mode যোগ করো
      document.body.classList.add('light-mode');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);