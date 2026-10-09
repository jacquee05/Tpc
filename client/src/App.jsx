import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Me from './components/Me';
import Posts from './components/Posts';
import AccountSetting from './components/AccountSetting';

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/register">Registro</Link> | 
        <Link to="/reportes">Reportes</Link> | 
        <Link to="/me">Mi Perfil</Link>
        <Link to="/settings">Configuración</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reportes" element={<Posts />} />
        <Route path="/me" element={<Me />} />
        <Route path="/settings" element={<AccountSetting />} />
      </Routes>
    </Router>
  );
}