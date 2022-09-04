import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoomAndUsers = ({ socket, username, room }) => {

    const [roomUsers, setRoomUsers] = useState([]);
    const navigate = useNavigate();
    const PATH = process.env.REACT_APP_BASE_PATH

    useEffect(() => {
        socket.on('chatroom_users', (data) => {
            console.log(data);
            setRoomUsers(data);
        });

        return () => socket.off('chatroom_users');
    }, [socket]);

    const leaveRoom = () => {
        const __createdtime__ = Date.now();
        socket.emit('leave_room', { username, room, __createdtime__ });
        // Redirect to home page
        navigate(`${PATH}/`, { replace: true });
    };

    return (
        <div className={styles.roomAndUsersColumn}>
            <h2 className={styles.roomTitle}>{room}</h2>

            <div>
                <div className={styles.userBlock}>
                    <ul className={styles.usersList}>
                        <li><b>Users</b>: &nbsp;</li>
                        {roomUsers.map((user, i) => (
                            <li
                                style={{
                                    fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
                                }}
                                key={user.id}
                            >
                                {i + 1}. {user.username} &nbsp;
                            </li>
                        ))}
                    </ul>
                    <button className='btn btn-outline' style={{width: "20%", maxHeight:"41px"}} onClick={leaveRoom}>
                Leave
            </button>
                </div>

            </div>


        </div>
    );
};

export default RoomAndUsers;