import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AppContextType, 
  User, 
  Reward, 
  WeatherData, 
  ChatRoom, 
  GroupChatMessage, 
  RecycledProduct, 
  Worker 
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Mock Data ---
const mockProducts: RecycledProduct[] = [
   {
    id: "1",
    name: 'Home Compost Bin',
    description: 'A compact and efficient bin for converting kitchen scraps into nutrient-rich compost for your garden.',
    price: 45.00,
    category: 'Gardening',
    image: 'https://images.unsplash.com/photo-1593113646773-69316954a275?q=80&w=2070&auto=format=fit=crop',
    rating: 4.8,
    seller: 'Eco Gardens'
  },
  {
    id: "2", // Changed to string
    name: 'Newspaper Pencils',
    description: 'A pack of 10 eco-friendly pencils made from tightly rolled recycled newspaper.',
    price: 5.99,
    category: 'Stationery',
    image: 'https://images.unsplash.com/photo-1599691418283-0471b63b4324?q=80&w=2070&auto=format&fit=crop',
    rating: 4.8,
    seller: 'GreenWrites'
  },
  {
    id: "3", // Changed to string
    name: 'Upcycled Denim Tote Bag',
    description: 'A fashionable and sturdy tote bag handcrafted from reclaimed denim jeans.',
    price: 25.50,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1599421493393-6851b2a606c4?q=80&w=1974&auto=format&fit=crop',
    rating: 4.7,
    seller: 'ReJean'
  },
  {
    id: "4", // Changed to string
    name: 'Recycled Glass Vases',
    description: 'Set of three beautiful vases, made from melted and reformed wine bottles.',
    price: 35.00,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1588691383431-419b6d080c85?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    seller: 'Glassworks'
  },
  {
    id: "5", // Changed to string
    name: 'Circuit Board Coasters',
    description: 'A unique set of 4 coasters made from reclaimed computer circuit boards.',
    price: 19.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop',
    rating: 4.6,
    seller: 'TechCycle'
  },
  {
    id: "6", // Changed to string
    name: 'Reclaimed Wood Coffee Table',
    description: 'A rustic coffee table built from salvaged barn wood, with industrial metal legs.',
    price: 220.00,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?q=80&w=1974&auto=format&fit=crop',
    rating: 4.8,
    seller: 'Rustic Revivals'
  },
  {
    id: "7", // Changed to string
    name: 'Recycled Paper Journal',
    description: 'A beautiful A5 journal with 200 pages of high-quality, 100% recycled paper.',
    price: 12.00,
    category: 'Stationery',
    image: 'https://images.unsplash.com/photo-1456735185994-338a05c1b415?q=80&w=2070&auto=format&fit=crop',
    rating: 4.7,
    seller: 'GreenWrites'
  },
  {
    id: "8", // Changed to string
    name: 'Tire Planter Pot',
    description: 'A large, durable planter for your garden, creatively repurposed from a vehicle tire.',
    price: 29.75,
    category: 'Decor',
    image: 'https://images.unsplash.com/photo-1619478147833-22924901f4a9?q=80&w=1964&auto=format&fit=crop',
    rating: 4.5,
    seller: 'Eco Gardens'
  }
];
const mockWorkers: Worker[] = [
  { id: 'w-1', name: 'John Smith', area: 'Zone A', status: 'on-duty', tasksCompleted: 15, contact: '+1-234-567-8901' },
  { id: 'w-2', name: 'Maria Garcia', area: 'Zone B', status: 'active', tasksCompleted: 23, contact: '+1-234-567-8902' }
];
const mockChatRooms: ChatRoom[] = [
  { id: 'room-1', name: 'Zone A Operations', type: 'zone', participants: ['w-1'], unreadCount: 0, lastMessage: { id: 'msg-1', message: 'Collection done', senderId: 'w-1', senderName: 'John', senderRole: 'worker', timestamp: new Date().toISOString(), type: 'text' }}
];
const mockGroupMessages: { [roomId: string]: GroupChatMessage[] } = {
  'room-1': [ { id: 'msg-1', message: 'Collection done', senderId: 'w-1', senderName: 'John', senderRole: 'worker', timestamp: new Date().toISOString(), type: 'text' } ]
};
// --- End Mock Data ---

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(mockChatRooms);
  const [groupMessages, setGroupMessages] = useState<{ [roomId: string]: GroupChatMessage[] }>(mockGroupMessages);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const fetchWeather = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/weather');
          if (!response.ok) throw new Error('Weather data fetch failed');
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.error("Could not fetch weather data:", error);
          setWeatherData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchWeather();
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    setWeatherData(null);
    setCurrentPage('dashboard');
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    const newReward = { ...reward, id: Date.now().toString() };
    setRewards(prev => [newReward, ...prev]);
    if (user && user.role === 'citizen') {
      // --- THIS IS THE FIX ---
      // We check that prevUser and prevUser.points are not undefined before adding.
      setUser(prevUser => 
        (prevUser && prevUser.points !== undefined) 
          ? { ...prevUser, points: prevUser.points + reward.points } 
          : prevUser
      );
      // ----------------------
    }
  };

  const sendGroupMessage = (roomId: string, message: Omit<GroupChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: GroupChatMessage = { ...message, id: Date.now().toString(), timestamp: new Date().toISOString() };
    setGroupMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] || []), newMessage] }));
    setChatRooms(prev => prev.map(room => room.id === roomId ? { ...room, lastMessage: newMessage } : room));
  };

  const markRoomAsRead = (roomId: string) => {
    setChatRooms(prev => prev.map(room => room.id === roomId ? { ...room, unreadCount: 0 } : room ));
  };

  const addGroupChat = (groupName: string) => {
    if (!groupName.trim()) return;
    const newChatRoom: ChatRoom = { id: `room-${Date.now()}`, name: groupName, type: 'general', participants: [], unreadCount: 0 };
    setChatRooms(prev => [...prev, newChatRoom]);
    setGroupMessages(prev => ({ ...prev, [newChatRoom.id]: [] }));
  };

  const value: AppContextType = {
    user, setUser, loading, weatherData, logout, currentPage, setCurrentPage,
    rewards, addReward, products: mockProducts, workers: mockWorkers,
    chatRooms, groupMessages, sendGroupMessage, markRoomAsRead, addGroupChat,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}