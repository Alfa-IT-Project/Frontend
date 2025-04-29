import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route, UNSAFE_DataRouterStateContext} from 'react-router-dom'
import Dashboard from './Dashoard';
import Add_Delivery from './Add_Delivery';
import UpdateDelivery from './UpdateDelivery';
import Driverdashboard from './Driverdashboard';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Add_Delivery />} />
          <Route path="/driver" element={<Driverdashboard />} />
          <Route path="/update/:trackingID" element={<UpdateDelivery />} />
        </Routes >
      
      
      </BrowserRouter>
    </div>
  );
}

export default App;
