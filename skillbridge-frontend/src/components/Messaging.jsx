import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "./Navbar";
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from "../services/api";
import { IconMessageCircle, IconInbox, IconHand, IconSend } from "./Icons";
import "./Messaging.css";

function Messaging() {
    const [searchParams] = useSearchParams();
    const initialUserId = searchParams.get("userId");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const pollRef = useRef(null);

    // Load conversations
    useEffect(() => {
        if (!user?.id) return;
        setLoading(true);
        getConversations(user.id)
            .then((convos) => {
                setConversations(convos);
                if (initialUserId) {
                    const match = convos.find((c) => c.otherUserId === Number(initialUserId));
                    if (match) {
                        setActiveChat(match);
                    } else {
                        setActiveChat({
                            otherUserId: Number(initialUserId),
                            otherUserName: "User",
                            otherUserRole: "",
                            lastMessage: "",
                            lastTimestamp: null,
                            unreadCount: 0,
                        });
                    }
                }
            })
            .catch(() => setConversations([]))
            .finally(() => setLoading(false));
    }, [user?.id]);

    // Load messages when active chat changes
    useEffect(() => {
        if (!activeChat || !user?.id) return;
        loadMessages();
        markMessagesAsRead(activeChat.otherUserId, user.id).catch(() => {});

        pollRef.current = setInterval(() => {
            loadMessages();
        }, 3000);

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [activeChat?.otherUserId]);

    const loadMessages = () => {
        if (!activeChat || !user?.id) return;
        getMessages(user.id, activeChat.otherUserId)
            .then(setMessages)
            .catch(() => {});
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeChat || sending) return;
        setSending(true);
        try {
            await sendMessage(user.id, activeChat.otherUserId, newMsg.trim());
            setNewMsg("");
            loadMessages();
            getConversations(user.id).then(setConversations).catch(() => {});
        } catch {
            // ignore
        } finally {
            setSending(false);
        }
    };

    const handleSelectConvo = (convo) => {
        setActiveChat(convo);
        markMessagesAsRead(convo.otherUserId, user.id).catch(() => {});
        setConversations((prev) =>
            prev.map((c) =>
                c.otherUserId === convo.otherUserId ? { ...c, unreadCount: 0 } : c
            )
        );
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return "now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return date.toLocaleDateString();
    };

    const formatMsgTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    if (!user) {
        return (
            <div className="dashboard-page">
                <Navbar />
                <div className="msg-login-prompt">
                    <p>Please log in to use messaging.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Navbar />
            <div className="msg-container">
                {/* Conversation List */}
                <div className="msg-sidebar">
                    <div className="msg-sidebar-header">
                        <h3><IconMessageCircle size={18} style={{ marginRight: 6 }} /> Messages</h3>
                    </div>

                    <div className="msg-convo-list">
                        {loading ? (
                            <p className="msg-empty">Loading…</p>
                        ) : conversations.length === 0 ? (
                            <div className="msg-empty-state">
                                <span className="msg-empty-icon"><IconInbox size={36} /></span>
                                <p>No conversations yet</p>
                                <p className="msg-empty-hint">
                                    Start a conversation by messaging an NGO from opportunities
                                </p>
                            </div>
                        ) : (
                            conversations.map((convo) => (
                                <div
                                    key={convo.otherUserId}
                                    className={`msg-convo-item ${activeChat?.otherUserId === convo.otherUserId ? "active" : ""}`}
                                    onClick={() => handleSelectConvo(convo)}
                                >
                                    <div className="msg-convo-avatar">
                                        {(convo.otherUserName || "U").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="msg-convo-info">
                                        <div className="msg-convo-top">
                                            <span className="msg-convo-name">{convo.otherUserName}</span>
                                            <span className="msg-convo-time">{formatTime(convo.lastTimestamp)}</span>
                                        </div>
                                        <p className="msg-convo-preview">
                                            {convo.lastMessage?.slice(0, 50) || "No messages"}
                                            {convo.lastMessage?.length > 50 ? "…" : ""}
                                        </p>
                                    </div>
                                    {convo.unreadCount > 0 && (
                                        <span className="msg-convo-badge">{convo.unreadCount}</span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="msg-chat-area">
                    {!activeChat ? (
                        <div className="msg-no-chat">
                            <span className="msg-no-chat-icon"><IconMessageCircle size={48} /></span>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    ) : (
                        <>
                            <div className="msg-chat-header">
                                <div className="msg-chat-avatar">
                                    {(activeChat.otherUserName || "U").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4>{activeChat.otherUserName}</h4>
                                    {activeChat.otherUserRole && (
                                        <span className="msg-chat-role">
                                            {activeChat.otherUserRole === "ngo" ? "Organization" : "Volunteer"}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="msg-messages">
                                {messages.length === 0 ? (
                                    <div className="msg-start-convo">
                                        <p><IconHand size={20} style={{ marginRight: 6 }} /> Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`msg-bubble-wrap ${msg.sender?.id === user.id ? "sent" : "received"}`}
                                        >
                                            <div className="msg-bubble">
                                                <p>{msg.content}</p>
                                                <span className="msg-time">{formatMsgTime(msg.timestamp)}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="msg-input-area" onSubmit={handleSend}>
                                <input
                                    className="msg-input"
                                    placeholder="Type a message…"
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="msg-send-btn"
                                    disabled={!newMsg.trim() || sending}
                                >
                                    {sending ? "…" : <><IconSend size={16} style={{ marginRight: 4 }} /> Send</>}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messaging;
