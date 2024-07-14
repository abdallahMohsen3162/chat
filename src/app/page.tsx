"use client";

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import "../app/globals.css";

interface Message {
  msg: string;
  me: boolean;
}

/*

https://glitch.com/edit/#!/ballistic-hip-value?path=index.js%3A16%3A7

*/
export default function Home() {
  const [message, setMsg] = useState<string>("");
  const [coming, setComing] = useState<Message[]>([]);
  const socket = useRef<Socket | null>(null);
  
  useEffect(() => {
    socket.current = io("ws://ballistic-hip-value.glitch.me");

    
    socket.current.on("connect", () => {
      console.log("Connected: ", socket.current?.id);
    });
    
    socket.current.on("notification", (data) => {
      console.log(data);
      setComing(prevComing => [...prevComing, { msg: data, me: false }]);
    });
    
    return () => {
      socket.current?.disconnect();
    };
  }, []);
  
  const go = () => {
    if(!message){
      return
    }
    socket.current?.emit("send", message);
    coming.push({ msg: message, me: true });
    setMsg("");
  };
  
  
  return (
    <div className='container'>
      

      <div className="messages d-flex flex-column-reverse messages-box">
        {coming.map((el, idx) => (
          <div key={idx} className={`${el.me ? "me" : "them"}`}>
            {el.msg}{el.me ? " (me)" : ""}
          </div>
        ))}
      </div>

      <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMsg(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && go()}
      />

      <button onClick={go}>Send</button>
      </div>
    </div>
  );
}
