import React from 'react'
import style from '../../../styles/Utils/Navbar.css'
import {logout} from '../../actions/UserActions'
import { Layout, Header, Navigation, Drawer } from 'react-mdl'

const Navbar = (props) => {
  return  <Layout fixedHeader={true}>
        <Header title="Nametag" style={{color: 'white'}}>
            <Navigation>
                {
                  props.user && props.user.id ?
                    <a onClick={() => props.dispatch(logout())}>Log out</a>
                    : <a href='#'>Log In</a>
                }
            </Navigation>
        </Header>
        <Drawer title="Nametag">
            <Navigation>
                <a href='#'>Profile</a>
                <a href='#'>About</a>
                {
                  props.user && props.user.id ?
                    <a onClick={() => props.dispatch(logout())}>Log out</a>
                    : <a href='#'>Log In</a>
                }
            </Navigation>
        </Drawer>
    </Layout>

}

export default Navbar
