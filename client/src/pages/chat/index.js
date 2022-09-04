import styles from './styles.module.css';
import MessagesReceived from './messages';
import SendMessage from './send-message';
import RoomAndUsers from './room-and-users';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Chat = ({ username, room, socket, setUsername, setRoom }) => {
    
    const navigate = useNavigate();
    const PATH = process.env.REACT_APP_BASE_PATH

    useEffect(() => {    
        // connect fires when connected, also after reconnected
        socket.on('connect', () => {
            console.log('connect-------------');
            
            // automatically join the room
            if(username !== '' && room !== ''){
                console.log('connect with us');
                socket.emit('join_room', { username, room });
                toast.success("Connected again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }else{
                let _username = localStorage.getItem('username');
                let _room = localStorage.getItem('room');
                if(_username !== ''  && _room !==  ''){
                    console.log('connect with sl');
                    socket.emit('join_room', { username: _username, room: _room });
                    setRoom(_room);
                    setUsername(_username);
                    toast.success("Connected again.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }else{
                    // Redirect to home page
                    navigate(`${PATH}/`, { replace: true });
                }
            }
        });
        
        // Remove event listener on component unmount
        return () => {
            socket.off('connect');
        }

    }, [socket])

    return (
        <div className={styles.chatContainer}>
            <RoomAndUsers socket={socket} username={username} room={room} />
            <div>
                <MessagesReceived socket={socket} />
                <SendMessage socket={socket} username={username} room={room} />
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Chat;
