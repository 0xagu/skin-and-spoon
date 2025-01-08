import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './assets/scss/style.scss';
import { ThemeProvider, createTheme } from '@mui/material';

/** PAGES */
import Home from './views/pages/home';
import VerifyEmail from './views/pages/authentication/verifyEmail';
import Dashboard from './views/pages/dashboard';
import NotFound from './views/pages/notFound';

function App() {

  const theme = createTheme({
    components: {
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            // customized style here
            // overflow: 'hidden',
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
            <Route index element={<Home />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
