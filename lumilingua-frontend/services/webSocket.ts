import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCrmsWebSocketEndpoint } from "@/constants/configApi";

let stompClient: Client | null = null;

type MessageCallback = (message: string) => void;

export const connectSocket = async (
  id: string,
  onMessage?: MessageCallback
) => {

  try {

    // tránh tạo nhiều connection
    if (stompClient && stompClient.active) {
      console.log("WebSocket already connected");
      return;
    }

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("No token → skip websocket");
      return;
    }

    stompClient = new Client({

      webSocketFactory: () =>
        new SockJS(getCrmsWebSocketEndpoint()),

      connectHeaders: {
        Authorization: `Bearer ${token}`
      },

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      debug: () => {},

      onConnect: () => {

        console.log("WebSocket connected");

        stompClient?.subscribe(`/topic/contracts/${id}`, (msg: IMessage) => {

          const message = msg.body;

          console.log("WS message:", message);

          if (onMessage) {
            onMessage(message);
          }

        });

      },

      onStompError: (frame) => {

        console.log("Broker error:", frame.headers["message"]);
        console.log("Details:", frame.body);

      },

      onWebSocketError: (error) => {
        console.log("WebSocket error", error);
      }

    });

    stompClient.activate();

  } catch (error) {

    console.log("Socket connection error:", error);

  }

};


export const disconnectSocket = async () => {

  try {

    if (stompClient) {

      await stompClient.deactivate();

      console.log("WebSocket disconnected");

      stompClient = null;

    }

  } catch (error) {

    console.log("Socket disconnect error:", error);

  }

};