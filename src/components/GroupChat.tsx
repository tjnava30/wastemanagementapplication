import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageCircle, ArrowLeft, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatRoom, GroupChatMessage } from '../types';

export function GroupChat() {
  const { user, chatRooms, groupMessages, sendGroupMessage, markRoomAsRead, addGroupChat } = useApp();
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [groupMessages, selectedRoom]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom || !user) return;
    sendGroupMessage(selectedRoom.id, {
      message: newMessage,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role === 'worker' ? 'worker' : 'supervisor',
      type: 'text'
    });
    setNewMessage('');
  };

  const handleCreateGroup = () => {
    addGroupChat(newGroupName);
    setNewGroupName('');
    setIsModalOpen(false);
  };

  const handleRoomSelect = (room: ChatRoom) => {
    setSelectedRoom(room);
    markRoomAsRead(room.id);
  };

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // --- THIS IS THE FIX ---
  // Get the messages for the selected room, or an empty array if none exist
  const currentMessages = selectedRoom ? groupMessages[selectedRoom.id] || [] : [];
  // --- END FIX ---
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-[75vh] flex bg-white rounded-xl shadow-lg border border-gray-200">
        <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${selectedRoom ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Groups</h2>
            {user?.role === 'government' && (
              <button onClick={() => setIsModalOpen(true)} className="p-2 text-green-600 hover:text-green-700" title="Add New Group">
                <PlusCircle size={24} />
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatRooms.map(room => (
              <div key={room.id} onClick={() => handleRoomSelect(room)} className={`p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100 ${selectedRoom?.id === room.id ? 'bg-green-50' : ''}`}>
                <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center"><Users className="text-gray-600" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900 truncate">{room.name}</p>
                    {room.unreadCount > 0 && <span className="bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{room.unreadCount}</span>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage?.message || 'No messages yet'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={`w-full md:w-2/3 flex flex-col ${selectedRoom ? 'flex' : 'hidden md:flex'}`}>
          {selectedRoom ? (
            <>
              <div className="p-4 border-b border-gray-200 flex items-center space-x-4">
                <button onClick={() => setSelectedRoom(null)} className="md:hidden p-2 text-gray-600"><ArrowLeft size={20} /></button>
                <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center"><Users className="text-gray-600" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500">{selectedRoom.participants.length} members</p>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col items-start gap-1 ${msg.senderId === user?.id ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${msg.senderId === user?.id ? 'order-2' : ''}`}>{msg.senderName}</span>
                    </div>
                    <div className={`max-w-md px-4 py-2 rounded-2xl ${msg.senderId === user?.id ? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user?.id ? 'text-green-200' : 'text-gray-500'}`}>{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 w-full px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" />
                <button onClick={handleSendMessage} className="bg-green-600 text-white rounded-full p-3 hover:bg-green-700 transition-colors"><Send size={18} /></button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageCircle size={48} className="mb-4" />
              <h3 className="text-lg font-semibold">Select a group to start chatting</h3>
              <p className="max-w-xs">Choose a conversation from the left panel to see the messages.</p>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-bold mb-4">Create a New Group</h3>
            <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Enter group name..." className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-green-500" />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleCreateGroup} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}