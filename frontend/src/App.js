import React from 'react'
import Login from './Login.js'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Home.js'
import Supplier from './Supplier.js'
import Order from './Order.js'
import Sview from './Sview.js'
import Sedit from './Sedit.js'







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/supplier' element={<Supplier/>}></Route>
        <Route path='/order' element={<Order/>}></Route>
        <Route path='/sview' element={<Sview/>}></Route>
        <Route path='/sedit' element={<Sedit/>}></Route>
        
      </Routes>
      
    </BrowserRouter>
  )
}

export default App