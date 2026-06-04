import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vashavali-theme') || 'light';
  });

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vashavali-theme', theme);
  }, [theme]);

  // Fetch from Supabase on login
  useEffect(() => {
    if (user) {
      supabase.from('global_profiles')
        .select('theme_preference')
        .eq('auth_id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data && data.theme_preference && data.theme_preference !== theme) {
            setTheme(data.theme_preference);
          }
        });
    }
  }, [user]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (user) {
      await supabase.from('global_profiles')
        .update({ theme_preference: newTheme })
        .eq('auth_id', user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
