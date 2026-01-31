import React from 'react'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-2 text-[14px] font-rubik mb-6">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-medium">/</span>}
          {item.link ? (
            <Link 
              to={item.link} 
              className="text-primary hover:text-primary-dark transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default Breadcrumbs
