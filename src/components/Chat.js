import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./../styles//Chat.css";

const socket = io("http://localhost:4000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("chatMessage", (msg) => {
      console.log("Message received:", msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && username.trim()) {
      const messageData = { sender: username, message: input };
      socket.emit("chatMessage", messageData);
      setInput("");
    }
  };

  const startChat = () => {
    console.log("Ашалеть");
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3400);
  };

  return (
    <div className="chat-container">
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          alignItems: "flex-start",
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Введите ваше имя"
          className="username-input"
        />
        <div onClick={startChat} className="start-button">
          Начать
        </div>
      </div>
      {show && <h3 style={{ color: "red" }}>Ашааалеть, переписки прочитали</h3>}
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение"
          className="chat-input"
        />
        <button type="submit" className="chat-button">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default Chat;
