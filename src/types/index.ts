export interface User {
  id: string;
  name: string;
  role: 'citizen' | 'admin' | 'worker' | 'government';
  email: string;
  avatar?: string;
  password?: string;
  points?: number;
}

export interface Reward {
  id: string;
  userId: string;
  name: string;
  points: number;
  claimed: boolean;
  reason?: string;
  photoUrl?: string;
  latitude?: number;  // <-- This line was missing
  longitude?: number; // <-- This line was missing
  date?: string;
}

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }[];
  };
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export interface ChatRoom {
  id:string;
  name: string;
  type: 'zone' | 'general';
  participants: string[];
  lastMessage?: GroupChatMessage;
  unreadCount: number;
}

export interface GroupChatMessage {
  id: string;
  message: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'worker' | 'government';
  timestamp: string;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface RecycledProduct {
  id: string;
  name: string;
  price: number;
  seller: string;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export interface Worker {
  id: string;
  name: string;
  area: string;
  status: 'on-duty' | 'off-duty' | 'active';
  tasksCompleted: number;
  contact: string;
}

// Master type for the application's global state
export interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  weatherData: WeatherData | null;
  logout: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  rewards: Reward[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  products: RecycledProduct[];
  workers: Worker[];
  chatRooms: ChatRoom[];
  groupMessages: { [roomId: string]: GroupChatMessage[] };
  sendGroupMessage: (roomId: string, message: Omit<GroupChatMessage, 'id' | 'timestamp'>) => void;
  markRoomAsRead: (roomId: string) => void;
  addGroupChat: (groupName: string) => void;
}