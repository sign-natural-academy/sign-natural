// import { useState } from 'react'
// import './App.css'
// import { Footer } from './components/Footer'
// import Homepage from './components/Homepage'
// import Navbar from './components/Navbar'


// function App() {

//   return (
//     <>
//     <Homepage/>
//     <Footer/>
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import  {Footer}  from './components/Footer';
import Login  from './components/pages/Login';
import Signup from './components/pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

