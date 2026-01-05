import React from 'react';
import { useApp } from '../context/AppContext';
import { Gift } from 'lucide-react';
import { Reward } from '../types';

// Sample rewards data with the 'userId' property added
const availableRewards: Omit<Reward, 'claimed' | 'date'>[] = [
  { id: 'r1', userId: 'placeholder-user', name: 'Eco-Friendly Coffee Mug', points: 500 },
  { id: 'r2', userId: 'placeholder-user', name: 'Reusable Shopping Bag Set', points: 750 },
  { id: 'r3', userId: 'placeholder-user', name: '$5 Cafe Voucher', points: 1000 },
  { id: 'r4', userId: 'placeholder-user', name: 'Plant a Tree Donation', points: 1500 },
];

export function Rewards() {
  const { user, rewards, addReward } = useApp();

  const handleClaimReward = (reward: Omit<Reward, 'claimed' | 'date'>) => {
    if (user && user.points !== undefined && user.points >= reward.points) {
      const newReward: Omit<Reward, 'id'> = { 
        ...reward, 
        userId: user.id, // Use the real user's ID when claiming
        claimed: true, 
        date: new Date().toISOString() 
      };
      addReward(newReward); 
      alert(`You've successfully claimed: ${reward.name}!`);
    } else {
      alert("You don't have enough points to claim this reward.");
    }
  };

  const isClaimed = (rewardId: string) => {
    return rewards.some(claimedReward => claimedReward.id === rewardId && claimedReward.claimed);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Rewards Center</h2>
        <p className="text-gray-600 mt-2">Redeem your points for eco-friendly rewards!</p>
        <div className="mt-4 text-2xl font-semibold text-green-600">
          Your Points: {user?.points?.toLocaleString() || 0}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {availableRewards.map((reward) => (
          <div key={reward.id} className={`bg-white rounded-lg shadow-md p-6 flex flex-col justify-between ${isClaimed(reward.id) ? 'opacity-50' : ''}`}>
            <div>
              <Gift className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">{reward.name}</h3>
              <p className="text-lg font-bold text-green-600 mt-2">{reward.points.toLocaleString()} Points</p>
            </div>
            <button
              onClick={() => handleClaimReward(reward)}
              disabled={isClaimed(reward.id)}
              className="mt-6 w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
            >
              {isClaimed(reward.id) ? 'Claimed' : 'Claim Reward'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}