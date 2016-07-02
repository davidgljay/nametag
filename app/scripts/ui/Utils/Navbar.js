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
        <li className={style.navitem}>
          <a className={style.navlink} href="#">
            Home
          <span className={style.sronly}>(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Profile</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">About</a>
        </li>
        <li className="nav-item">
          {login}
        </li>
      </ul>
    </nav>;
};

export default Navbar;
