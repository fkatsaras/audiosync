import React, { useState, useRef, useEffect } from 'react';
import DropDown from '../DropDown/DropDown';
import Button from '../Buttons/Button';
import defaultPfp from '../../assets/images/default_profile_picture.svg'
import './ProfileBar.css';
import { useNavigate } from 'react-router-dom';

interface UserSessionProps {
  userId: string;
  username: string;
}

const ProfileBar: React.FC<UserSessionProps> = ({ userId, username }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for detecting clicks outside
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/v1/users/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleDropdownSelect = (value: string) => {
    if (value === 'logout') {
      handleLogout();
    }
    setDropdownVisible(false);
  };

  const dropdownOptions = [{ label: 'Logout', value: 'logout' }];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-bar" ref={dropdownRef}>
      <div className="profile-button" onClick={toggleDropdown}>
        <Button className="profile-btn">
          <img
            src={defaultPfp}
            alt="Profile"
            className="profile-image"
          />
        </Button>
      </div>
      {dropdownVisible && (
        <DropDown
          options={dropdownOptions}
          onOptionSelect={handleDropdownSelect}
          className="profile-dropdown"
        />
      )}
    </div>
  );
};

export default ProfileBar;
