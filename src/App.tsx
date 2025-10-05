import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Homepage } from './pages/Homepage'
import { Browse } from './pages/Browse'
import { Auth } from './pages/Auth'
import { ProductDetail } from './pages/ProductDetail'
import { Checkout } from './pages/Checkout'
import { OrderSuccess } from './pages/OrderSuccess'
import { Orders } from './pages/Orders'
import { Wishlist } from './pages/Wishlist'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </Router>
  )
}

export default App
