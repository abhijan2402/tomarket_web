import React, { useState } from 'react';
import './BottomTabBar.css'

const BottomTabBar = () => {
  const [activeTab, setActiveTab] = useState('Home'); // Default active tab

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="bottom-tab-bar">
      <div className={`tab-item ${activeTab === 'Home' ? 'active' : ''}`} onClick={() => handleTabClick('Home')}>
        <i className="bi bi-house tab-icon"></i>
        <p>Home</p>
      </div>

      <div className={`tab-item ${activeTab === 'Earn' ? 'active' : ''}`} onClick={() => handleTabClick('Earn')}>
        <i className="bi bi-currency-dollar tab-icon"></i>
        <p>Earn</p>
      </div>

      <div className={`tab-item ${activeTab === 'Frens' ? 'active' : ''}`} onClick={() => handleTabClick('Frens')}>
        <i className="bi bi-people tab-icon"></i>
        <p>Frens</p>
      </div>

      <div className={`tab-item ${activeTab === 'Wallet' ? 'active' : ''}`} onClick={() => handleTabClick('Wallet')}>
        <i className="bi bi-wallet tab-icon"></i>
        <p>Wallet</p>
      </div>
    </div>
  );
};

export default BottomTabBar;
