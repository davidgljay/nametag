import React from 'react';
import style from '../../../styles/Utils/Navbar.css';

const Navbar = (props) => {
  let login;
  if (props.userAuth) {
    login = <a className="nav-link" onClick={props.unAuth}>Log out</a>;
  } else {
    login = <a className="nav-link" href="#">Log In</a>;
  }

  return <nav className={style.navbar}>
      <a className={style.navbrand} href="#">Nametag</a>
      <ul className={style.navlist}>
        <li>
          <a href="#">
            Home
          <span className={style.sronly}>(current)</span>
          </a>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          {login}
        </li>
      </ul>
    </nav>;
};

export default Navbar;
