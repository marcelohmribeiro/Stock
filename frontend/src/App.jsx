import styles from './App.module.css'
// Páginas
import Home from './components/pages/Home'
import NewItem from "./components/pages/NewItem"
import Stock from "./components/pages/Stock"
import Item from "./components/pages/Item"
import NavBar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import Footer from "./components/layout/Footer"
import Checkout from './components/pages/Checkout'
import Login from './components/pages/auth/Login'
import Register from './components/pages/auth/Register'
import AdminDashboard from './components/pages/admin/AdminDashBoard'
import PrivateRoute from './components/context/PrivateRoute'
import { AuthProvider } from './components/context/AuthContext.jsx'
import PublicRoute from './components/context/PublicRoute.jsx'
import Notify from './components/layout/Notify'
// Bibliotecas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"


function App() {
  return (
    <AuthProvider>
      <Router>
        <Notify />
        <NavBar />
        <div className={styles.app}>
          <Container customClass="min-height">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route element={<PrivateRoute />}>
                <Route exact path="/" element={<Home />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path='/register' element={<Register />} />
                <Route path="/stock" element={<Stock />} />
                <Route path="/newitem" element={<NewItem />} />
                <Route path="/item/:id" element={<Item />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
            </Routes>
          </Container>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
