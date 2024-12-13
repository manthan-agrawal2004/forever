import React from 'react'
import { Routes,Route} from 'react-router-dom'
import Open from './pages/Open.jsx';
import Cart from './pages/Cart.jsx'
import About from './pages/About.jsx'
import Collection from './pages/Collection.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Orders from './pages/Orders.jsx'
import Product from './pages/Product.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import SearchBar from './components/SearchBar.jsx';
import Verif from './pages/Verif.jsx'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  return (
    <div className='px-4 sm:px-[5vm] md:px-[7vw] lg:px[9vw]'>
      <ToastContainer/>
      <Navbar/>
      <SearchBar/>
      <Routes>
        <Route path='/' element={<Open/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/collection' element={<Collection/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/orders' element={<Orders/>}></Route>
        <Route path="/product/:productId" element={<Product />} />
        <Route path='/place-order' element={<PlaceOrder/>}></Route>
        <Route path='/verify' element={<Verif/>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App