"use client";
import React, { useEffect, useState } from 'react';
import { FiTwitter, FiFacebook } from 'react-icons/fi';

interface ShareButtonsProps {
  title: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, className = '' }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) return null;

  return (
    <div className={className}>
      <p className="text-sm font-semibold text-gray-600 mb-2">この記事をシェアする:</p>
      <div className="flex gap-2">
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#1DA1F2] hover:bg-[#0c85d0] text-white p-2 rounded-full"
          aria-label="Twitterでシェア"
        >
          <FiTwitter size={18} />
        </a>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#1877F2] hover:bg-[#0c5ec7] text-white p-2 rounded-full"
          aria-label="Facebookでシェア"
        >
          <FiFacebook size={18} />
        </a>
      </div>
    </div>
  );
};

export default ShareButtons;
