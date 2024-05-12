import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import profile from '../../assets/images.png'
import io from 'socket.io-client';
import { IoSend } from 'react-icons/io5';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNewMessageContext, socket } from '../../context/ChatProvider'; 



const ChatPage = () => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { newMessageAlert, updateNewMessageAlert, lastSenderId, updateLastSenderId } = useNewMessageContext();
    const messagesEndRef = useRef(null);
    const navigate = useNavigate()

    const {clientId} = useParams()
    const location = useLocation();
    const clientData = location.state
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')  


    const handleSendMessage = () => {
        
        if (newMessage.trim() !== '') {
  
              const messageData = {
              room: `room_${userId}_${clientId}`, 
              role: 'User', 
              to: `room_${clientId}_${userId}`,
              message: newMessage, 
              customerId: userId,
              clientId:clientId, 
              createdAt: new Date()
              }
  
              socket.emit('sendMessage', messageData);
              console.log('sendMessage', messageData);
              setMessages(prevMessages => [...prevMessages, messageData]);
              setNewMessage('');
              console.log('messages', messages);
          }
        };

        const scrollToBottom = () => {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
          };
        
  
      useEffect(() => {
  
          if (!token) {
              return navigate('/login')
          }

          scrollToBottom()
          console.log('update', clientId, lastSenderId);
          if (clientId === lastSenderId) {
            updateNewMessageAlert(false);
          }
          
          console.log('chat');
          socket.connect()
          socket.emit('joinRoom', {room: `room_${userId}_${clientId}`, to: `room_${clientId}_${userId}`, hint: `${userId} connected` });
         
          socket.on('loadMessages', (data) => {
            console.log('load messages', data.messages);
            setMessages(data.messages);
          });

  
          socket.on('recieveMessage', (data) => {
            console.log('recieveMessage',data);
              setMessages(prevMessages => [...prevMessages, data]);
              updateNewMessageAlert(false);
              updateLastSenderId(data.customerId);
          });
      
          return () => {
            socket.off('loadMessages');
            socket.off('recieveMessage');
            socket.off('sendMessage');
            socket.disconnect()
          };
        }, [clientId, token, userId, navigate, newMessageAlert]);

  return (
    <div className='h-[100vh] fixed w-full sm:w-fit'>
        <div className='w-full flex items-center justify-between gap-3 sm:px-10 p-3 sm:p-5 h-14 sm:h-24' style={{backgroundColor: "rgb(60,109,121)"}}>
            <p className='text-white ps-10 sm:ps-0'>{clientData?.firstname} {clientData?.lastname}</p>
            {clientData?.image === undefined ? (
                <Link to={`/userslist/clientprofile/${clientId}`}><img src={profile} alt="User" className='w-7 h-7 sm:w-10 sm:h-10 rounded-full dark:bg-gray-500 object-cover ' /></Link>
            ) : (
                <Link to={`/userslist/clientprofile/${clientId}`}><img src={clientData.image} alt="User" className='w-7 h-7 sm:w-10 sm:h-10 rounded-full dark:bg-gray-500 object-cover ' /></Link>
            )}
        </div>

        <ScrollToBottom className='h-[75%] overflow-scroll p-5 bg-green-50 custom-scroll'>
        {messages.map((message, index) => (
          <div key={index} className={` text-white p-2 w-fit max-w-48 sm:max-w-60  md:max-w-64 lg:max-w-[45%] xl:max-w-[55%] min-w-20 lg:min-w-32  mt-2 break-all  ${message.customerId === clientId ? 'bg-regal-blue' : 'bg-regal-darkblue  ml-auto'}`}>
            <p>{message.message}</p>
            <p className='text-end text-xs'>
                { new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
        </ScrollToBottom>

      <div className='w-[97%] m-auto shadow border-2 flex gap-x-3 items-center'>
      <input
        className='min-[220px]:w-9/12 min-[320px]:w-[94%] py-3 ps-3 focus:outline-none'
        type="text"
        value={newMessage}
        placeholder="Type your message..."
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e)=>{e.key === 'Enter' && handleSendMessage()}}
        required
      />
      <button className='  text-white py-2 px-3 text-sm ' onClick={handleSendMessage}><IoSend className='w-5 h-5 text-regal-blue'/></button>
      </div>

    </div>
  )
}

export default ChatPage
