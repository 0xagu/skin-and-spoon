import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './views/pages/authentication/login';
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
