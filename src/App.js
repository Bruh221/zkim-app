import Main from './Components/Pages/Main.js';
import Additionally from './Components/Pages/Additionally.js';
import Rating from './Components/Pages/Rating.js';
import Transfer from './Components/Pages/Transfer.js';
import History from './Components/Pages/History.js';
import Shop from './Components/Pages/Shop.js';
import Other from './Components/Pages/Other.js';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import bridge from '@vkontakte/vk-bridge';


window.params = window.location.search;
window.socket = io("https://vklightcoin.xyz", {
  transports: ['websocket'],
  query: {
    params: window.params
  }
})  

const App = props => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Main user={props.user} />} />
        <Route path="/additionally" element={<Additionally user={props.user} />} />
        <Route path="/other" element={<Other user={props.user} />} />
        <Route path="/rating" element={<Rating user={props.user}/>} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/history" element={<History />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>
    </BrowserRouter>
    )
  }

export default App;