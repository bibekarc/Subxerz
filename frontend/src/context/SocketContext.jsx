import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (user?._id) {
			const socket = io("http://localhost:5000", { // Ensure correct URL and port
				query: {
					userId: user._id,
				},
			});

			setSocket(socket);

			socket.on("connect", () => {
				console.log("Socket connected:", socket.id);
			});

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			socket.on("disconnect", () => {
				console.log("Socket disconnected");
			});

			return () => {
				socket.off("getOnlineUsers"); // Clean up specific event listeners
				socket.close(); // Ensure the socket is closed
			};
		}
	}, [user?._id]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
