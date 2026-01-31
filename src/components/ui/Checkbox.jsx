import React from 'react'

const Checkbox = ({ label, checked = false, onChange }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-5 h-5 border-2 border-gray-light rounded-[4px] peer-checked:bg-primary peer-checked:border-primary transition-all group-hover:border-primary">
          {checked && (
            <svg className="w-full h-full text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          )}
        </div>
      </div>
      <span className="text-dark text-[14px] font-rubik font-normal group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  )
}

export default Checkbox
