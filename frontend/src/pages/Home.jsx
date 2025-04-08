import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <h1>Welcome to Home Page <Link to={'/signup'}><a href="">SignUp</a></Link></h1>
    </div>
  )
}

export default Home