import Image from 'next/image';
import React from 'react';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  profileImage: string; // Add profileImage property
}

const messages: Message[] = [
  { id: 1, sender: 'John Doe', content: 'Hello, how are you?', timestamp: '2023-10-01 10:00 AM', profileImage: 'https://randomuser.me/api/portraits/men/1.jpg' },
  { id: 2, sender: 'Jane Smith', content: 'Meeting at 3 PM', timestamp: '2023-10-01 11:00 AM', profileImage: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { id: 3, sender: 'Alice Johnson', content: 'Project update?', timestamp: '2023-10-01 12:00 PM', profileImage: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { id: 4, sender: 'Bob Brown', content: 'Lunch tomorrow?', timestamp: '2023-10-01 01:00 PM', profileImage: 'https://randomuser.me/api/portraits/men/4.jpg' },
];

export default function MessageList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Messages</h2>
      <ul className="space-y-3">
        {messages.map((message) => (
          <li key={message.id} className="border-b pb-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src={message.profileImage} alt={message.sender} width={32} height={32} className="rounded-full mr-2" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{message.sender}</span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{message.content}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-center">
        <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full hover:bg-blue-600">
          View All
        </button>
      </div>
    </div>
  );
}