import React from 'react';
import MyInput from '../UI/MyInput/MyInput';
import MyButton from '../UI/MyButton/MyButton';
import Search from '../../assets/icons8-search.svg'
import BellIcon from '../../assets/bell-icon.svg'
import Calendar from '../../assets/calendar-icon.svg'

const Header = () => {
    return (
        <div className="header container">
            <div className="header-logo">
                Dashboard
            </div>
            <form className='header-form'>
                <MyInput placeholder="Search your task here..."/>
                <MyButton><img src={Search} alt="search-icon" style={{width: 14, height: 14}}/></MyButton>
            </form>

            <div className="header-button">
                <MyButton><img src={BellIcon} alt='bell-icon' style={{width: 14, height: 14}}/></MyButton>
                <MyButton> <img src={Calendar} alt="calindar-icon" /> </MyButton>
            </div>

            <div className="header-data">
                <p>TuesDay</p>
                <span>23/03/2026</span>
            </div>
        </div>
    );
};

export default Header;