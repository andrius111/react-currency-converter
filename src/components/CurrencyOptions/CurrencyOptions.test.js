import React from 'react'
import ReactDOM from 'react-dom'

import CurrencyOptions from './CurrencyOptions'

describe('CurrencyOptions tests', () => {
  it('must render the component whitout errors', () => {
    const div = document.createElement('div')
    
    ReactDOM.render(<CurrencyOptions />, div)
    ReactDOM.unmountComponentAtNode(div)
  })
})