import React, { useState } from 'react';

import './CurrencyConverter.css';

import { 
  Container, 
  Navbar,
  Button, 
  Form, 
  Col, 
  Spinner,
  Alert,
  Modal
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

import CurrencyOptions from '../CurrencyOptions/CurrencyOptions'

function CurrencyConverter() {
  const FIXER_URL = 'http://data.fixer.io/api/latest?access_key=eba7130a5b2d720ce43eb5fcddd47cc3'
  
  const [quantity, setQuantity] = useState(1)
  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('BRL')
  const [showSpinner, setShowSpinner] = useState(false)
  const [validatedForm, setValidatedForm] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [conversionResult, setConversionResult] = useState('')
  const [showError, setShowError] = useState(false)
  
  function handleQuantity(event) {
    setQuantity(event.target.value)
  }

  function handleCurrencyFrom(event) {
    setCurrencyFrom(event.target.value)
  }

  function handleCurrencyTo(event) {
    setCurrencyTo(event.target.value)
  }

  function handleCloseModal(event) {
    setQuantity(1)
    setCurrencyFrom('USD')
    setCurrencyTo('BRL')
    setValidatedForm(false)
    setShowModal(false)
  }

  function getConversion(data) {
    if (!data || data.success !== true) {
      return false
    }

    const from = data.rates[currencyFrom]
    const to = data.rates[currencyTo]

    const conversion = (1 / from * to) * quantity

    return conversion.toFixed(2)
  }

  function error() {
    setShowError(true)
    setShowSpinner(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setValidatedForm(true)

    if (event.currentTarget.checkValidity() === true) {
      setShowSpinner(true)

      axios.get(FIXER_URL).then(result => {
        const conversion = getConversion(result.data)

        if (conversion === false) {
          return error()
        }

        setShowError(false)
        setConversionResult(`${quantity} ${currencyFrom} = ${conversion} ${currencyTo}`)
        setShowModal(true)
        setShowSpinner(false)
      }).catch(error => error())
    }
  }

  return (
    <React.Fragment>
      <Navbar 
        bg="primary" 
        variant="dark"
      >
        <Navbar.Brand>Currency Converter</Navbar.Brand>
      </Navbar>

      <Container style={{ marginTop: '2%' }}>
        <Alert variant="danger" show={ showError }>
          Ops... a error ocurred, please try again
        </Alert>

        <Form 
          onSubmit={ handleSubmit } 
          noValidate 
          validated={ validatedForm }
        >
          <Form.Row>
            <Col sm="3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control 
                type="number"
                value={ quantity }
                onChange={ handleQuantity }
                required
              />
            </Col>

            <Col sm="3">
              <Form.Label>From</Form.Label>
              <Form.Control as="select"
                value={ currencyFrom }
                onChange={ handleCurrencyFrom }
              >
                <CurrencyOptions />
              </Form.Control>
            </Col>

            <Col 
              sm="1" 
              className="text-center" 
              style={{ paddingTop: '35px' }}
            >
              <FontAwesomeIcon icon={ faAngleDoubleRight } />
            </Col>

            <Col sm="3">
              <Form.Label>To</Form.Label>
              <Form.Control 
                as="select"
                value={ currencyTo }
                onChange={ handleCurrencyTo }
              >
                <CurrencyOptions />
              </Form.Control>
            </Col>

            <Col 
              sm="2" 
              style={{ paddingTop: '32px' }}
            >
              <Button 
                type="submit" 
                variant="success" 
                data-testid="btn-conversion"
              >
                <span className={ showSpinner ? '' : 'hidden' }>
                  <Spinner animation="border" size="sm" /> 
                </span>

                <span className={ showSpinner ? 'hidden' : '' }>
                  Convert
                </span>
              </Button>
            </Col>
          </Form.Row>
        </Form>

        <Modal 
          show={ showModal } 
          onHide={ handleCloseModal } 
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Conversion Result
            </Modal.Title>
          </Modal.Header>

          <Modal.Body data-testid="modal">
            { conversionResult }
          </Modal.Body>

          <Modal.Footer>
            <Button 
              variant="success" 
              onClick={ handleCloseModal }
            >
              New Conversion
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </React.Fragment>
  );
}

export default CurrencyConverter;
