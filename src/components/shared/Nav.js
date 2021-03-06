import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const Nav = () => (
  <nav className='buttoins'>
    <Button
      variant="light">
      <NavLink to='/home'>Home</NavLink>
    </Button>
    <Button
      variant="light">
      <NavLink to='/foragers'>Foragers</NavLink>
    </Button>
    <Button
      variant="light">
      <NavLink to='/skills'>Skills</NavLink>
    </Button>
    <Button
      variant="light">
      <NavLink to='/forager-create'>Create Forager</NavLink>
    </Button>
    <Button
      variant="light">
      <NavLink to='/skill-create'>Create Skill</NavLink>
    </Button>
  </nav>
)

export default Nav
