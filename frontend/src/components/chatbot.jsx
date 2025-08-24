import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, UploadCloud } from "lucide-react";
import ReactMarkdown from "react-markdown";
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Voice recognition setup
  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
  }

  const startListening = () => {
    if (!recognition) return;
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setListening(false);
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, model: "gpt-4o-mini" }),
      });

      const data = await res.json();
      const reply = data.response || "No response.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error connecting to server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // File upload handler
  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    // Add a temporary "Uploading..." message
    const tempMessage = { role: "assistant", content: "📄 Uploading file..." };
    setMessages((prev) => [...prev, tempMessage]);

    const res = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    // Remove the temporary message
    setMessages((prev) => prev.filter((msg) => msg !== tempMessage));

    // Display uploaded file and response from OpenAI
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `📄 **File uploaded:** ${data.fileName}` },
      { role: "assistant", content: data.response },
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "⚠️ File upload failed." },
    ]);
  } finally {
    // Reset file input so same file can be uploaded again
    e.target.value = null;
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="flex flex-col w-full max-w-[1400px] h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 font-bold text-lg flex items-center space-x-2">
          <img
            src="/chatbot.png"
            alt="Chatbot"
            className="w-6 h-6"
          />
          <span>AI Chatbot</span>
        </div>


        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-lg shadow-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white max-w-[70%]"
                    : "bg-white border border-gray-300 text-gray-900 max-w-[85%]"
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t flex gap-2 items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring focus:ring-blue-300"
            rows="1"
          />

          {/* Voice Input */}
          <button
            onClick={startListening}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center"
          >
            <Mic className={`w-5 h-5 ${listening ? "animate-pulse" : ""}`} />
          </button>

          {/* File Upload */}
          <label className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
            <input type="file" className="hidden" onChange={handleFileUpload} />
          </label>

          {/* Send Button */}
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center justify-center"
          >
            <Send className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
