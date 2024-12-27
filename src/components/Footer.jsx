import React from 'react'

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <p style={textStyle}>R. Adicondro Yusuf Hendratmo - 1301213152</p>
        <p style={textStyle}>Vioni Maryeta Gradiela - 1301210539</p>
        <p style={textStyle}>M Luthfi Aditya Gunandi – 1301213239</p>
      </div>
    </footer>
  )
}

const footerStyle = {
  backgroundColor: '#fff',
  color: '#000',
  textAlign: 'center',
  padding: '10px'
}

const footerContentStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px'
}

const textStyle = {
  margin: '0',
  fontSize: '14px'
}

export default Footer