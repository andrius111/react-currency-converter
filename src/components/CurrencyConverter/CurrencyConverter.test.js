import React from 'react';
import ReactDOM from 'react-dom'

import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import axiosMock from 'axios'

import CurrencyConverter from './CurrencyConverter';

describe('CurrencyConverter tests', () => {
  it('renders CurrencyConverter', () => {
    const div = document.createElement('div')
  
    ReactDOM.render(<CurrencyConverter />, div)
    ReactDOM.unmountComponentAtNode(div)
  })

  it('must simulate a currency conversion', async () => {
    const { findByTestId, getByTestId } = render(<CurrencyConverter />)
    
    axiosMock.get.mockResolvedValueOnce({
      data: { success: true, rates: { BRL: 4.564292, USD: 1.101049 } }
    })

    fireEvent.click(getByTestId('btn-conversion'))

    const modal = await findByTestId('modal')

    expect(axiosMock.get).toHaveBeenCalledTimes(1)
    expect(modal).toHaveTextContent('1 USD = 4.15 BRL')
  })
})
