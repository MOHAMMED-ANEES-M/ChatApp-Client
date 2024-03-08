import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Login';
import SingnUp from './SignUp/SingnUp';
import UsersList from './Pages/UsersList/UsersList';
import Navbar from './Components/Navbar/Navbar';
import Profile from './Pages/Profile/Profile';
import { UserProvider } from './context/UserContext';
import Index from './Pages/Index';
import ChatPage from './Pages/ChatPage/ChatPage';
import ClientProfile from './Pages/ClientProfile/ClientProfile';

function App() {
  return (
    <div className="App">

    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<SingnUp />} />
          <Route path="login" element={<Login />} />
          <Route path="userslist" element={<UsersList />} >
            <Route index element={<Index />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chatpage/:clientId" element={<ChatPage />} />
            <Route path="clientprofile/:clientId" element={<ClientProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </UserProvider>

    </div>
  );
}

export default App;



//97d8c4