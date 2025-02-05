import React from 'react';
import './ContentBar.css';
import { useUser } from '../../context/UserContext';

interface ContentBarProps {
  style?: React.CSSProperties; // Optional style prop
}

const ContentBar: React.FC<ContentBarProps> = ({ style }) => {
  
  const user = useUser();

  return (
    <div className='content-bar' style={style}>

    </div>
  );
};

export default ContentBar;
