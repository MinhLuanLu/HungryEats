import { createContext, useState, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "./user_context";
import {SOCKET_SERVER} from '@env';
import { config } from "../config";

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
            
            setConnected(true)
            socketIO.current.on('connect', () => {
                log.info('Connected to Socket.IO successfully.');
                log.info(`Socket ID: ${socketIO.current.id}`);

            // Emit connection event with user details
            socketIO.current.emit('connection', {
                Socket_id: socketIO.current.id,
                User: publicUser
            });

            socketIO.current.on('disconnect', () => {
                setConnected(false);
                console.log('Socket disconnected');
            });
            
            });

            return socketIO.current
        };
        return socketIO.current
    }

    const disconnectSocketIO = () => {
        socketIO.current?.disconnect();
        setConnected(false);
    };

    return(
        <SocketioContext.Provider value={{
            connectSocketIO,
            disconnectSocketIO,
            socket: socketIO.current,
            socketConnection: connected
            
        }}>
            {children}
        </SocketioContext.Provider>
    )
}

export const useSocketio = () => useContext(SocketioContext);
