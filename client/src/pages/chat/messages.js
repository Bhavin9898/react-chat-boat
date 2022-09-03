import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';

const Messages = ({ socket }) => {

    const [messagesRecieved, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null); // Add this


    // Runs whenever a socket event is recieved from the server
    useEffect(() => {

        console.log('change in socket')

        socket.on('receive_message', (data) => {
            console.log(data, 'here ');
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username,
                    __createdtime__: data.__createdtime__,
                },
            ]);

        });

        // Remove event listener on component unmount
        return () => socket.off('receive_message');
        
    }, [socket]);

    // Scroll to the most recent message
    useEffect(() => {
        messagesColumnRef.current.scrollTop =
            messagesColumnRef.current.scrollHeight;
    }, [messagesRecieved]);

    // Add this
    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    // dd/mm/yyyy, hh:mm:ss 
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesRecieved.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className={styles.msgMeta}>
                            <br />{formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br />
                </div>
            ))}
        </div>
    );
};


export default Messages;
