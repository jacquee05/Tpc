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
  const [modalModo, setModalModo] = useState('register')
  const [modalMensaje, setModalMensaje] = useState('')

  const abrirModal = (modo = 'register', mensaje = '') => {
    setModalModo(modo)
    setModalMensaje(mensaje)
    setModalAbierto(true)
  }

  return (
    <Router>
      <Header onLoginClick={() => abrirModal()} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prestacion/:id" element={<Prestacion onLoginClick={() => abrirModal()} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reportes" element={<Posts />} />
        <Route path="/me" element={<Me />} />
        <Route path="/settings" element={<AccountSetting onPasswordChanged={() => abrirModal('login', 'Contraseña actualizada. Iniciá sesión con tu nueva contraseña.')} />} />
      </Routes>

      <Footer />

      <MibaModal
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        modoInicial={modalModo}
        mensajeInicial={modalMensaje}
      />
    </Router>
  )
}
