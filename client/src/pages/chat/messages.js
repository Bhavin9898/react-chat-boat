import styles from './styles.module.css';
import { useState, useEffect, useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Messages = ({ socket }) => {

    const [messagesRecieved, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null); // Add this

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {

        console.log('change in socket', socket)

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

        socket.on('disconnect', () => {
            console.log('Disconnected');
            toast.error("Disconnected", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });

        // Remove event listener on component unmount
        return () => {
            socket.off('receive_message');
            socket.off('disconnect');
        }

    }, [socket]);

    // Scroll to the most recent message
    useEffect(() => {
        messagesColumnRef.current.scrollTop =
            messagesColumnRef.current.scrollHeight;
    }, [messagesRecieved]);

    // Add this
    // function sortMessagesByDate(messages) {
    //     return messages.sort(
    //         (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
    //     );
    // }

    // dd/mm/yyyy, hh:mm:ss 
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesRecieved.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{ display: 'flex' }}>
                        <span style={{ width: '62%' }} className={styles.msgMeta}>{msg.username}</span>
                        <span style={{ width: '120px' }} className={styles.msgMeta}>
                            {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                </div>
            ))}
        </div>
    );
};


export default Messages;
