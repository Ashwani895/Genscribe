import { useState, useRef, useEffect } from "react";
import API from "../services/api";

function Dashboard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [mode, setMode] = useState("chat");
  const [tone, setTone] = useState("normal");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [language, setLanguage] = useState("English");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get("/ai/history");
      setHistory(res.data?.data || []);
    } catch (err) {
      console.log("History error:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const prompt = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "ai", content: "..." },
    ]);

    setLoading(true);

    try {
      const res = await API.post("/ai/generate", { prompt, mode, tone, language });
      const aiText = res.data?.response;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = aiText;
        return updated;
      });
    } catch (err) {
      console.log(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = "Error generating response.";
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleExport = () => {
    const text = history
      .map((item, i) => {
        return `Chat ${i + 1}\nUser: ${item.prompt}\nAI: ${item.response}\n----------------------`;
      })
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const modeIcons = {
    chat: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    write: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    code: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    summary: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };

  return (
    <div className="flex h-full overflow-hidden bg-gray-950">
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-[280px]" : "w-0"
        } transition-all duration-300 overflow-hidden bg-gray-900/70 backdrop-blur-xl border-r border-white/[0.06] text-white h-full flex flex-col`}
      >
        {/* LOGO AREA */}
        <div className="p-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              Gen<span className="text-indigo-400">Scribe</span>
            </span>
          </div>

          <button
            onClick={() => {
              setMessages([]);
              setActiveChat(null);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* MODE SELECTOR */}
        <div className="p-3 border-b border-white/[0.06]">
          <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium mb-2 px-1">
            Mode
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {["chat", "write", "code", "summary"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  mode === m
                    ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                {modeIcons[m]}
                <span className="capitalize">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* HISTORY */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
              History
            </p>
            <button
              onClick={handleExport}
              className="text-[11px] text-gray-500 hover:text-indigo-400 transition-colors"
              title="Export all chats"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          <div className="space-y-1">
            {history.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  setMessages([
                    { role: "user", content: item.prompt },
                    { role: "ai", content: item.response },
                  ]);
                  setActiveChat(item._id);
                }}
                className={`px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 truncate ${
                  activeChat === item._id
                    ? "bg-white/[0.08] text-white border border-white/[0.08]"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]"
                }`}
              >
                {item.prompt?.slice(0, 35)}...
              </div>
            ))}

            {history.length === 0 && (
              <p className="text-xs text-gray-600 text-center py-8">
                No conversations yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1 bg-gray-950">
        {/* TOP BAR */}
        <div className="h-14 border-b border-white/[0.06] flex items-center px-4 gap-3 bg-gray-950/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
              {modeIcons[mode]}
              <span className="text-xs font-medium text-gray-300 capitalize">{mode}</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <span className="text-xs text-gray-500">
              {messages.length > 0
                ? `${Math.floor(messages.length / 2)} message${Math.floor(messages.length / 2) !== 1 ? "s" : ""}`
                : "Start a conversation"}
            </span>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  How can I help you today?
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Ask me anything — write content, generate code, summarize text, or just chat.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-md shadow-lg shadow-indigo-600/10"
                      : "bg-white/[0.06] text-gray-200 border border-white/[0.06] rounded-bl-md"
                  }`}
                >
                  {msg.content === "..." ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="border-t border-white/[0.06] bg-gray-950/80 backdrop-blur-xl p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-2 focus-within:border-indigo-500/40 transition-all duration-200">
              {/* TONE SELECTOR */}
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="bg-white/[0.06] border border-white/[0.06] text-gray-300 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500/40 transition-all cursor-pointer appearance-none min-w-[110px]"
              >
                <option value="normal" className="bg-gray-900">Normal</option>
                <option value="funny" className="bg-gray-900">😂 Funny</option>
                <option value="rude" className="bg-gray-900">😡 Rude</option>
                <option value="romantic" className="bg-gray-900">❤️ Romantic</option>
                <option value="professional" className="bg-gray-900">🧠 Professional</option>
              </select>

              {/* TEXT INPUT */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 resize-none focus:outline-none py-2 px-1 max-h-32 min-h-[40px]"
                placeholder="Type your message..."
                style={{ height: "auto", overflow: "hidden" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                }}
              />
              <select
  value={language}
  onChange={(e) => setLanguage(e.target.value)}
  className="bg-gray-800 text-white px-3 py-2 rounded-lg outline-none"
>
  <option>English</option>
  <option>Spanish</option>
  <option>French</option>
  <option>German</option>
  <option>Italian</option>
  <option>Portuguese</option>
  <option>Dutch</option>
  <option>Russian</option>
  <option>Chinese (Simplified)</option>
  <option>Chinese (Traditional)</option>
  <option>Japanese</option>
  <option>Korean</option>
  <option>Arabic</option>
  <option>Hebrew</option>
  <option>Hindi</option>
</select>

              {/* SEND BUTTON */}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-md shadow-indigo-600/20 hover:shadow-indigo-500/30 disabled:shadow-none flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            <p className="text-[11px] text-gray-600 text-center mt-2">
              GenScribe AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
