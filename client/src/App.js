import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { useState } from 'react'; // Add this
import io from 'socket.io-client'; // Add this
import Chat from './pages/chat';


const socket = io.connect(process.env.REACT_APP_SERVER_PATH); // Add this -- our server will run on port 4000, so we connect to it from here


function App() {

  const [username, setUsername] = useState(''); // Add this
  const [room, setRoom] = useState(''); // Add this
  const PATH = process.env.REACT_APP_BASE_PATH

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path={`${PATH}/`} element={<Home
            username={username} // Add this
            setUsername={setUsername} // Add this
            room={room} // Add this
            setRoom={setRoom} // Add this
            socket={socket} // Add this
          />} />
          <Route
            path={`${PATH}/chat`}
            element={<Chat username={username} room={room} socket={socket} setUsername={setUsername} setRoom={setRoom} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
