import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './views/pages/authentication/login';
import { ThemeProvider, createTheme } from '@mui/material';
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
            <Route index element={<Login />}/>
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
