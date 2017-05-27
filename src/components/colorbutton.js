import React from 'react';

const ColorButton = (props) =>{
  return (
    <div
      className='colorButton'
      id={props.color}
      onClick={props.handleClick}
      style={{ pointerEvents: props.disabled ? 'none' : 'auto' }}
    >
    </div>
  )
}

export default ColorButton;
