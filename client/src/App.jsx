import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import MibaModal from './components/MibaModal'

import Home from './pages/Home'
import Prestacion from './pages/Prestacion'

import Login from './components/Login'
import Register from './components/Register'
import Me from './components/Me'
import Posts from './components/Posts'
import AccountSetting from './components/AccountSetting'

export default function App() {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <Router>
      <Header onLoginClick={() => setModalAbierto(true)} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prestacion/:id" element={<Prestacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reportes" element={<Posts />} />
        <Route path="/me" element={<Me />} />
        <Route path="/settings" element={<AccountSetting />} />
      </Routes>

      <Footer />

      <MibaModal open={modalAbierto} onClose={() => setModalAbierto(false)} />
    </Router>
  )
}
