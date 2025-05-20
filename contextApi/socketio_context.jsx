import { createContext, useState, useRef, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./user_context";
import {SOCKET_SERVER} from '@env';

export const SocketioContext = createContext({})

export const SocketioProvider = ({children}) =>{
    const {publicUser, setPublicUser} = useContext(UserContext);
    const [connected, setConnected] = useState(false);
    const socketIO = useRef();
  
    const connectSocketIO = () => {
        if(!socketIO.current){
            socketIO.current = io(SOCKET_SERVER, {
                transports: ['websocket'], // Use WebSocket to avoid polling
                forceNew: true, // Ensures a new connection is created
                reconnection: true
            });

            socketIO.current.on('connect', () => {
                console.log('save socket to database:', socketIO.current.id);
                // Now it's safe to use socketIO.current.id
                socketIO.current.emit('connection', {
                    Socket_id: socketIO.current.id,
                    User: { User_id: 12 }
                });

                setConnected(true);
            });
            return socketIO.current
        };
        return socketIO.current
    }

    return(
        <SocketioContext.Provider value={{
            connectSocketIO,
            socket: socketIO.current,
            socketConnection: connected
            
        }}>
            {children}
        </SocketioContext.Provider>
    )
}

export const useSocketio = () => useContext(SocketioContext);
