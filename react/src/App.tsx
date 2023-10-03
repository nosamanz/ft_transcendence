// import React, {useState, useEffect} from 'react';
// import './App.css';
// import Navbar from './component/Navbar';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Chat from './pages/Chat';
// import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom";


// function App() {
//   const [user, setUser] = useState(null);
//   return (
//     <BrowserRouter>
//     <div className='body'>
//         <Navbar user = {user}/>
//         <Routes>
//           {
//             user ? (
//               <Route path='/' element = {<Home setUser={setUser}/>} />
//               // <Route path='/chat' element={<Chat user={user} />}
//               ) : (
//                 <Route path='/' element = {<Login setUser = {setUser}/>} />
//             )
//           }
//         </Routes>
//     </div>
//     </BrowserRouter>
//   );
// }

// export default App;

import React, {useState, useEffect} from 'react';
import './App.css';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
// import Chat from './pages/Chat';
import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom";


function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
    <div className='body'>
        <Navbar user = {user}/>
        <Routes>
              <Route index element = {<Home />} />
              <Route path='/home' element = {<Home />} />
              <Route path='/login' element = {<Login />} />
              {/* <Route path='/chat' element = {<Chat />} /> */}
              {/* // <Route path='/chat' element={<Chat user={user} />} */}
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
