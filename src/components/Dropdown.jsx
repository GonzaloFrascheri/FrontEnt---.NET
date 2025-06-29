import React from 'react'
import { Dropdown } from 'react-bootstrap'

const DropdownComponent = ({
  items,
  selectedItemId,
  setSelectedItemId,
  tenantStyles,
}) => {
  return (
    <Dropdown>
          <Dropdown.Toggle
            style={{
              backgroundColor: tenantStyles.primaryColor,
              borderColor: tenantStyles.primaryColor,
              color: 'white'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = tenantStyles.secondaryColor;
              e.target.style.borderColor = tenantStyles.secondaryColor;
              e.target.style.color = '#333';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = tenantStyles.primaryColor;
              e.target.style.borderColor = tenantStyles.primaryColor;
              e.target.style.color = 'white';
            }}
          >
            {items.find(item => item.id === selectedItemId)?.label}
          </Dropdown.Toggle>
          <Dropdown.Menu
            style={{
              border: `2px solid ${tenantStyles.primaryColor}`,
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {items.map(item => (
              <Dropdown.Item
                key={item.id}
                value={item.id}
                onClick={() => {
                  setSelectedItemId(item.id)
                }}
                style={{
                  backgroundColor: selectedItemId === item.id ? tenantStyles.primaryColor : 'transparent',
                  color: selectedItemId === item.id ? 'white' : '#333',
                  fontWeight: selectedItemId === item.id ? 'bold' : 'normal',
                  position: 'relative',
                  padding: '10px 15px'
                }}
                onMouseOver={(e) => {
                  if (selectedItemId !== item.id) {
                    e.target.style.backgroundColor = `${tenantStyles.primaryColor}20`;
                    e.target.style.color = tenantStyles.primaryColor;
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedItemId !== item.id) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#333';
                  }
                }}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
  )
}

export default DropdownComponent
