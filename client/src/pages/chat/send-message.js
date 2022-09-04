import styles from './styles.module.css';
import React, { useState } from 'react';

const SendMessage = ({ socket, username, room }) => {

  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      if(message.trim() !== ''){
        console.log('send message..', socket, username, room, message);
        // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
        socket.emit('send_message', { username, room, message, __createdtime__ });
      }
      setMessage('');
    }
  };

  return (
    <div className={styles.sendMessageContainer}>
      <textarea
        className={styles.messageInput}
        placeholder='Type a Message'
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        onKeyPress={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            //setMessage(e.target.value)
            sendMessage()
            setTimeout(()=>e.target.selectionEnd = 0,0);

          }
        }}
      />
      <button className='btn btn-primary' style={{width: "20%"}} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default SendMessage;