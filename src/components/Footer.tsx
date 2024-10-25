import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer>
      <p>&copy; All rights reserved Acktarius - {new Date().getFullYear()}</p>
    </footer>
  )
}

export default Footer