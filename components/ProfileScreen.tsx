
import React from 'react';
import BackIcon from './icons/BackIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface ProfileScreenProps {
  onBack: () => void;
}

const ProfileListItem: React.FC<{ icon: string; label: string; }> = ({ icon, label }) => (
    <button className="w-full flex items-center justify-between p-4 bg-[#1C1A33] rounded-lg mb-3 hover:bg-[#2a274d] transition-colors">
        <div className="flex items-center">
            <span className="text-2xl mr-4">{icon}</span>
            <span className="text-lg text-gray-200">{label}</span>
        </div>
        <ChevronRightIcon className="w-6 h-6 text-gray-500" />
    </button>
);


const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBack }) => {
  return (
    <div className="bg-[#0D0B1F] text-white flex flex-col h-full">
      <header className="p-4 flex items-center">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mx-auto -ml-10">Profile</h1>
      </header>

      <main className="flex-grow p-4 flex flex-col items-center">
        <div className="relative mb-4">
            <img 
                src="https://picsum.photos/120" 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-purple-500"
            />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/50 to-blue-600/50"></div>
        </div>
        <h2 className="text-2xl font-semibold">Surafel Lema</h2>
        <p className="text-gray-400 mt-1">1000 Free Credit</p>

        <div className="w-full mt-8">
            <ProfileListItem icon="💳" label="Top Up" />
            <ProfileListItem icon="⚙️" label="Settings" />
            <ProfileListItem icon="🔔" label="Notifications" />
            <ProfileListItem icon="🕒" label="History" />
            <ProfileListItem icon="❓" label="Support" />
            <ProfileListItem icon="➡️" label="Logout" />
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
