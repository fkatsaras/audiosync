import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TopBar.css';
import Button from '../Buttons/Button';
import { AiFillHome } from 'react-icons/ai';
import { HiSearch } from 'react-icons/hi';
import DropDown from '../DropDown/DropDown';
import defaultPfp from '../../assets/images/default_profile_picture.svg'
import { useUser } from '../../context/UserContext';
import Input from '../Input/Input';


const TopBar: React.FC = () => {

    const user = useUser();

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null); // Ref for detecting clicks outside
    const navigate = useNavigate();

    /**
     *  Search 
     * 
     */
    const [searchType, setSearchType] = useState<'artists' | 'songs'>('artists');
    const [query, setQuery] = useState<string>('');

    const handleSearchSubmit = (searchType: 'artists' | 'songs') => {
        if (query.trim()) {
            navigate(`/search?q=${query}&type=${searchType}`);
        }
    };

    /**
     * Profile buttons
     *   
     */ 
    
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
          body: JSON.stringify({ username: user?.username }),
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
            <div className="top-bar">
                <Button className="home-button">
                    <Link to='/home'>
                        <AiFillHome size={24} />
                    </Link>
                </Button>   {/* TODO: Integrate the link component inside the button component */}
                <div className='search-controls'>
                    <div className='search-input-wrapper'>
                      <div className='search-icon'><HiSearch /></div>
                      <Input
                          id=''
                          type='text'
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder='Search for artists, songs...'
                          className='search-input'
                      />
                    </div>
                    <div className="search-buttons">
                        <Button
                            className='search-button'
                            onClick={() => {
                                setSearchType('artists');
                                handleSearchSubmit('artists');
                            }}
                        >
                            Artists
                        </Button>
                        <Button
                            className='search-button'
                            onClick={() => {
                                setSearchType('songs');
                                handleSearchSubmit('songs');
                            }}
                        >
                            Songs
                        </Button>
                    </div>
                </div>
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
                    ref={dropdownRef}
                    options={dropdownOptions}
                    onOptionSelect={handleDropdownSelect}
                    className="profile-dropdown"
                  />
                )}
            </div>
    )
}

export default TopBar;