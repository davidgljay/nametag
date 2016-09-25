import React from 'react'
import {logout} from '../../actions/UserActions'
import { Layout, Header, Navigation, Drawer } from 'react-mdl'

const Navbar = (props) => {
  const navigation = <Navigation>
      {
      props.user && props.user.id ?
        <a onClick={() => props.dispatch(logout())}>Log out</a>
        : <a href='#'>Log In</a>
      }
    </Navigation>
  return  <Layout fixedHeader={true}>
    <Header title="Nametag" style={{color: 'white'}}>
      {navigation}
    </Header>
    <Drawer title="Nametag">
      {navigation}
    </Drawer>
  </Layout>
}

export default Navbar
