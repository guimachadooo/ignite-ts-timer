import { Timer, Scroll } from 'phosphor-react';
import IgniteLogo from '../../assets/ignite-logo.svg'

import { HeaderContainer } from "./styles";
import { NavLink } from 'react-router-dom';

export function Header(){
  return (
    <HeaderContainer>
      <img src={IgniteLogo} alt="" />

      <nav>
        <NavLink to="/">
          <Timer size={24} />
        </NavLink>
        
        <NavLink to="/history">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}