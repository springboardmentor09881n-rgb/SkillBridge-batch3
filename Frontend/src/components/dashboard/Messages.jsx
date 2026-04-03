import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));
  const socketRef = useRef();

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Initialize Socket
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join_room", user.id || user._id);

    socketRef.current.on("receive_message", (data) => {
      // If the message belongs to the active chat, append it
      if (activeChat && (data.senderId === activeChat._id || data.receiverId === activeChat._id)) {
        setMessages((prev) => [...prev, data]);
      }
      // Reload conversations to update the latest message and unread status
      fetchConversations();
    });

    fetchConversations();

    return () => {
      socketRef.current.disconnect();
    };
  }, [user, navigate, activeChat]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/conversations/${user.id || user._id}`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${user.id || user._id}/${otherUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = (otherUser) => {
    setActiveChat(otherUser);
    fetchMessages(otherUser._id);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msgData = {
      senderId: user?.id || user?._id || "",
      receiverId: activeChat?._id || activeChat?.id || "",
      content: newMessage
    };

    if (!msgData.senderId || !msgData.receiverId) {
      alert("Error: Missing user IDs for chat. Please re-login.");
      return;
    }

    // Emit to socket
    socketRef.current.emit("send_message", msgData);

    // Save to DB
    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgData)
      });
      if (res.ok) {
        const savedMsg = await res.json();
        setMessages((prev) => [...prev, savedMsg]);
        setNewMessage("");
        scrollToBottom();
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const filteredConversations = conversations.filter(c => 
    c.otherUser.organizationName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.otherUser.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800 flex flex-col">
      {/* TOP NAVIGATION */}
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div className="flex items-center space-x-12">
          <h1 className="text-xl font-extrabold tracking-tight text-black cursor-pointer" onClick={() => navigate(user?.userType === 'organization' ? '/OrganizationDashboard' : '/VolunteerDashboard')}>
            SkillBridge
          </h1>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate(user?.userType === 'organization' ? '/OrganizationDashboard' : '/VolunteerDashboard')}>
              Dashboard
            </span>
            <span className="hover:text-black cursor-pointer transition-colors" onClick={() => navigate(user?.userType === 'organization' ? '/OrganizationDashboard/Opportunities' : '/VolunteerDashboard/Opportunities')}>
              Opportunities
            </span>
            <span className="text-black border-b-2 border-black pb-1 cursor-pointer">
              Messages
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-medium text-gray-700 capitalize">
            {user?.userType || "Volunteer"}
          </span>
          <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="flex-1 p-8 flex flex-col max-w-[1400px] mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Messages</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-1 w-full min-h-[600px] max-h-[800px]">
          
          {/* LEFT SIDEBAR - CONVERSATIONS PORTION */}
          <div className="w-[350px] border-r border-gray-200 flex flex-col bg-white shrink-0">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input 
                  type="text" 
                  placeholder="Search conversations.." 
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv, idx) => {
                const isActive = activeChat?._id === conv.otherUser._id;
                const displayName = conv.otherUser.organizationName || conv.otherUser.fullName;
                const displayType = conv.otherUser.userType === 'organization' ? 'Ngo' : 'Volunteer';
                
                return (
                  <div 
                    key={idx} 
                    onClick={() => startChat(conv.otherUser)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{displayName}</h4>
                        <span className="text-xs text-blue-600">{displayType}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(conv.latestMessage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {conv.latestMessage.content}
                    </p>
                  </div>
                );
              })}
              
              {filteredConversations.length === 0 && (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No conversations found
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE - CHAT INTERFACE */}
          <div className="flex-1 flex flex-col bg-gray-50/30">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10">
                  <div>
                    <h3 className="font-bold text-gray-900">{activeChat.organizationName || activeChat.fullName}</h3>
                    <p className="text-xs text-gray-500 capitalize">{activeChat.userType}</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 pt-8">
                  {messages.map((msg, idx) => {
                    const isMe = msg.senderId === user.id || msg.senderId === user._id || msg.senderId?._id === user.id || msg.senderId?._id === user._id;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div 
                          className={`max-w-[70%] p-4 rounded-xl text-sm leading-relaxed ${
                            isMe 
                              ? 'bg-blue-100/50 text-gray-800 rounded-tr-sm' 
                              : 'bg-gray-200/60 text-gray-800 rounded-tl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {new Date(msg.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <form onSubmit={sendMessage} className="flex gap-3">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      className="bg-blue-400 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      disabled={!newMessage.trim()}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
