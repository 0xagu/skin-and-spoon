import './bootstrap';
import store from './store/store';
import { Provider } from "react-redux";
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

    if (!pages[`./Pages/${name}.jsx`]) {
      console.error(`Page not found: ./Pages/${name}.jsx`);
    }

    return pages[`./Pages/${name}.jsx`]?.default;
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <App {...props} />
            </LocalizationProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    );
  },
});