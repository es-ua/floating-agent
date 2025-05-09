"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Read iframe URL from environment variable
  const iframeUrl = process.env.NEXT_PUBLIC_IFRAME_URL || "https://example.com";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { from: "user", text: input },
      { from: "bot", text: "(Demo) You said: " + input },
    ]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 text-lg font-bold text-center shadow">
        Floating Chat Widget
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow
              ${
                msg.from === "user"
                  ? "bg-blue-100 ml-auto text-right"
                  : "bg-white mr-auto text-left border"
              }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="flex gap-2 p-4 border-t bg-white"
        autoComplete="off"
      >
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
