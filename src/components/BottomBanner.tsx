import React, { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const BottomBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bottom-banner">
      <div className="banner-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span>
          Feature brought to you by <a href="https://nodesandbits.com" target="_blank" rel="noopener noreferrer">Nodes And Bits</a>
        </span>
        {isExpanded ? <FaChevronDown /> : <FaChevronUp />}
      </div>
      {isExpanded && (
        <div className="banner-content">
          <div>
            <p>
              <a href="https://nodesandbits.com/home/contact/" target="_blank" rel="noopener noreferrer">Contact Us</a>
            </p>
            <p>
              More about&nbsp;<a href="https://conceal.network/" target="_blank" rel="noopener noreferrer">Conceal Network</a>
            </p>
             <p>
             Mining pools:&nbsp;<a href="https://pool.conceal.network/" target="_blank" rel="noopener noreferrer">Community Pool</a>&nbsp;-&nbsp;<a href="https://conceal.cedric-crispin.com/" target="_blank" rel="noopener noreferrer">Cedric-Crispin</a>&nbsp;-&nbsp;<a href="https://fastpool.xyz/ccx/" target="_blank" rel="noopener noreferrer">FastPool</a>&nbsp;-&nbsp;<a href="https://conceal.hashvault.pro/" target="_blank" rel="noopener noreferrer">HashVault</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBanner;