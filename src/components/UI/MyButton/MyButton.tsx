import React from 'react';
import classes from './MyButton.module.scss'

const MyButton = ({children}) => {
    return (
        <button className={classes.myButton} >
            {children}
        </button>
    );
};

export default MyButton;