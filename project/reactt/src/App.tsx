// import React from 'react';
// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import Home from './components/home';



function App() {
  const [chatData, setChatData] = useState('');
  const [viewCart, setViewCart] = useState(true);

  useEffect(() => {
    const ipAddress = '10.12.14.1'; // Hedef IP adresini buraya girin
    const url = `http://${ipAddress}:80/chat`; // ChatController endpointi
    console.log("useEffect");
    axios.get(url)
      .then(response => setChatData(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <p>Chat Data: {chatData}</p>fadsf
      <Home login = {false} setViewCart = {setViewCart} />
    </div>
  );
}

export default App;
