// Páginas
import Home from './components/pages/Home'
import NewItem from "./components/pages/NewItem"
import Stock from "./components/pages/Stock"
import Item from "./components/pages/Item"
import NavBar from "./components/layout/NavBar"
import Container from "./components/layout/Container"
import Footer from "./components/layout/Footer"
import Checkout from './components/pages/Checkout'
// Bibliotecas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <NavBar />
      <Container customClass="min-height">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/newitem" element={<NewItem />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Container>
      <Footer />
    </Router>
  )
}

export default App
