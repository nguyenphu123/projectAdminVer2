import React from 'react'

import './statuscard.css'
import NumberFormat from 'react-number-format'

const StatusCard = props => {
  return (
    <div className='status-card'>
      <div className='status-card__icon'>
        <i className={props.icon}></i>
      </div>
      <div className='status-card__info'>
        <h4>
          <NumberFormat
            value={props.count}
            className='foo'
            displayType={'text'}
            thousandSeparator={true}
            prefix={''}
            renderText={(value, props) => <div {...props}>{value}</div>}
          />
        </h4>
        <span>{props.title}</span>
      </div>
    </div>
  )
}

export default StatusCard
