'use client';

import Image from 'next/image';

export default function Announcements() {
  const announcements = [
    { image: '/images/announcement1.jpg', text: 'New Community Project Launch' },
    { image: '/images/announcement2.jpg', text: 'Upcoming Workshop Series' },
    { image: '/images/announcement3.jpg', text: 'Success Story: Rural Development' },
    { image: '/images/announcement4.jpg', text: 'Partnership Announcement' },
  ];

  return (
    <div className="bg-[#4B0082] py-4 overflow-hidden">
      <div className="announcement-scroll">
        <div className="content flex items-center space-x-8">
          {[...announcements, ...announcements].map((announcement, index) => (
            <div key={index} className="flex items-center space-x-2 px-4">
              <div className="relative w-12 h-12">
                <Image
                  src={announcement.image}
                  alt={announcement.text}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="text-[#FFD700] font-medium">{announcement.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}