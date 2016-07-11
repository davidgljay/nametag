import React from 'react';
import style from '../../../styles/Utils/Navbar.css';

const Navbar = (props) => {
  let login;
  if (props.userAuth) {
    login = <a className='navbar-link' onClick={props.unAuth}>Log out</a>;
  } else {
    login = <a className='navbar-link' href='#'>Log In</a>;
  }

  return <nav className='navbar navbar-default'>
      <a className='navbar-brand' href='#'>Nametag</a>
      <ul className='nav navbar-nav pull-right'>
        <li>
          <a href='#'>
            Home
          <span className='sr-only active'>(current)</span>
          </a>
        </li>
        <li>
          <a href='#'>Profile</a>
        </li>
        <li>
          <a href='#'>About</a>
        </li>
        <li>
          {login}
        </li>
      </ul>
    </nav>;
};

export default Navbar;
