import React from 'react'
import { connect } from 'react-redux'
import { onSubmit } from '../redux/actions/onSubmit'

import Modal from "./Modal";

class Form extends React.Component {
  constructor() {
    super()
    this.state = {
      fields: {},
      errors: {},
      serverResponse: {},
      selectedFile: {},
      formIsValid: '',
      token: '',
      popupIsVisible: false
    }

    this.handleChangeInput = this.handleChangeInput.bind(this)
    this.handleChangeFile = this.handleChangeFile.bind(this)
    this.submitUserForm = this.submitUserForm.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  handleChangeInput(e) {
    let fields = this.state.fields
    fields[e.target.name] = e.target.value
    this.setState({
      fields
    })
  }

  handleChangeFile(event) {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  handleCloseModal(e) {
    e.preventDefault()

    this.setState({
      popupIsVisible: false
    })

  }

  submitUserForm(e) {
    e.preventDefault()
    //e.target.reset();


     this.validateForm()
    // this.postUser()
    // if (this.validateForm()) {
    //   this.postUser()
    // }

     

     console.log(this.state.serverResponse)
  }

  validateForm() {
    let fields = this.state.fields
    let errors = {}
    let formIsValid = true
    let avatar = this.state.selectedFile

    if (typeof fields.positions === 'undefined') {
      formIsValid = false
      errors.positions = '*Please enter positions'
    }

    if (!fields.username) {
      formIsValid = false
      errors.username = '*Please enter your username.'
    }
    if (typeof fields.username !== 'undefined') {
      if (fields.username.length < 2 || fields.username.length > 60) {
        formIsValid = false
        errors.username = '*Please enter alphabet characters only.'
      }
    }
    if (!fields.email) {
      formIsValid = false
      errors.email = '*Please enter your email-ID.'
    }
    if (typeof fields.email !== 'undefined') {
      // regular expression for email validation
      var pattern = new RegExp(
        /^(('[\w-\s]+')|([\w-]+(?:\.[\w-]+)*)|('[\w-\s]+')([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      )
      if (!pattern.test(fields.email)) {
        formIsValid = false
        errors.email = '*Please enter valid email-ID.'
      }
    }
    if (!fields.mobile) {
      formIsValid = false
      errors.mobile = '*Please enter your mobile no.'
    }
    if (typeof fields.mobile !== 'undefined') {
      // if (!fields['mobile'].match(/^[0-9]{10}$/)) {
      // formIsValid = false;
      // errors['mobile'] = '*Please enter valid mobile no.';
      // }
    }

    if (avatar.size) {
      if (avatar.size >= 2000000) {
        formIsValid = false
        errors.password = 'To big photo.'
      }
      if (!(avatar.type === 'image/jpeg') && !(avatar.type === 'image/jpg')) {
        formIsValid = false
        errors.password = 'False format.'
      }

      var minwidth = '70'
      var minheight = '70'
      var _URL = window.URL || window.webkitURL
      var file = avatar
      var img = new Image()
      img.src = _URL.createObjectURL(file)

      async function f() {
        return new Promise(function(resolve, reject) {
          img.onload = function(x) {
            console.log(this.width)
            if (minwidth >= this.width && minheight >= this.height) {
              // 70
              formIsValid = false
              console.log('error')
              errors.password = 'To small wight or hight.'
            } else {
              console.log('no error')
              formIsValid = true
            }
            resolve('result')
          }
        })
      }

      f().then(response =>
        this.setState({
          errors: errors
        })
      )
    } else {
      formIsValid = false
      errors.password = '*Please enter Image'
    }

    this.setState({
      errors: errors,
      formIsValid: formIsValid
    })

    return formIsValid
  }

  getToken() {
    fetch('https://frontend-test-assignment-api.abz.agency/api/v1/token')
      .then(responseText => responseText.json())
      .then(response =>
        this.setState({
          token: response.token
        })
      )
  }

  getPositions = () => {
    fetch('https://frontend-test-assignment-api.abz.agency/api/v1/positions')
      .then(function(response) {
        return response.json()
      })
      .then(function(positionsObj) {
        return positionsObj.positions
      })
      .then(function(positionsList) {
        const select = document.getElementById('inputPosition')

        let soption = document.createElement('option')
        soption.value = ''
        soption.text = 'Select your position'
        soption.setAttribute('selected', true)
        soption.setAttribute('disabled', true)
        select.options.add(soption)

        let options = positionsList

        for (let key in options) {
          const option = document.createElement('option')
          option.value = options[key].id
          option.text = options[key].name
          select.options.add(option)
        }
      })
  }

  postUser() {
    //console.log(this.state.fields)
    const formData = new FormData()
    formData.append('position_id', this.state.fields.positions)
    formData.append('name', this.state.fields.username)
    formData.append('email', this.state.fields.email)
    formData.append('phone', this.state.fields.mobile)
    formData.append('photo', this.state.selectedFile)

    fetch('https://frontend-test-assignment-api.abz.agency/api/v1/users', {
        method: 'POST',
        body: formData,
        headers: {
          Token: this.state.token // get token with GET api/v1/token method
        }
      })
      .then(responseText => responseText.json())
      .then(data => {
       
        console.log(data)

         
        

        this.setState({
          serverResponse: data
        })

        // this.setState({
        //   popupIsVisible: true
        // })


       

        // if (data.success) {
        //   //
        // } else {
        //   // proccess server errors
        // }
      }
      )
      .then(data => {

        this.setState({
          popupIsVisible: true
        })


        this.props.onSubmit(Date.now().valueOf())

                

        //  if (this.state.serverResponse.success) {
                
        //         this.props.onSubmit(Date.now().valueOf())
        //         this.setState({
        //           fields: ''
        //         })
        // } 




      })

  
  }

  componentDidMount() {
    this.getToken()
    this.getPositions()
  }

  errorClass(error) {
    return typeof error === 'undefined' ? '' : 'has-error'
  }

  render() {

    //console.log(this.state.errors)

    return (
      <React.Fragment>
        <Modal show={this.state.popupIsVisible} onClose={this.handleCloseModal} content={this.state.serverResponse}></Modal>
        <form
          method="post"
          name="userRegistrationForm"
          onSubmit={this.submitUserForm}
          className="row"
        >
          <div
            className={`form_name ${this.errorClass(
              this.state.errors.username
            )}`}
          >
            <label> Name </label>
            <input
              type="text"
              name="username"
              value={this.state.fields.username}
              onChange={this.handleChangeInput}
              placeholder="Your name"
            />
            <div className="errorMsg"> {this.state.errors.username} </div>
            {/* {console.log(this.state.errors.username)} */}
          </div>
         
          <div
            className={`form_email ${this.errorClass(this.state.errors.email)}`}
          >
            <label> Email </label>
            <input
              type="text"
              name="email"
              value={this.state.fields.email}
              onChange={this.handleChangeInput}
              placeholder="Your email"
            />
            <div className="errorMsg"> {this.state.errors.mobile} </div>
          </div>
         
          <div
            className={`form_phone ${this.errorClass(this.state.errors.email)}`}
          >
            <label> Mobile </label>
            <input
              type="tel"
              name="mobile"
              value={this.state.fields.mobile}
              onChange={this.handleChangeInput}
              placeholder="+38 (___) ___ __ __"
            />
            <div className="errorMsg"> {this.state.errors.mobile} </div>
          </div>

          {/* <div className="form_position">
            <select
              id="inputPosition"
              name="positions"
              value={this.state.fields.positions}
              onChange={this.handleChangeInput}
            ></select>
            <div className="errorMsg"> {this.state.errors.positions} </div>
          </div> */}


          <div className="form_position">
            <label className="position_item">One
              <input type="radio" name="position" />
              <span className="checkmark"></span>
            </label>
            <label className="position_item">Two
              <input type="radio" name="position" />
              <span className="checkmark"></span>
            </label>
            <label className="position_item">Three
              <input type="radio" name="position" />
              <span className="checkmark"></span>
            </label>
            <label className="position_item">Four
              <input type="radio" name="position" />
              <span className="checkmark"></span>
            </label>
          </div>

          <div className="form_upload">
            <div className="inputfile-box">
              <div className="file-box">Upload your photo </div>
              <label className="file-button">
                Upload
                <input
                  type="file"
                  name="image"
                  value={this.state.avatar}
                  onChange={this.handleChangeFile}
                  className="inputfile"
                />
              </label>
            </div>
            <div className="errorMsg"> {this.state.errors.password} </div>
          </div>
          <input type="submit" className="btn btn-disable" value="Register" />
        </form>  
      </React.Fragment>
    )
  }
}

const FormContainer = connect(
  state => ({
    formData: state.formReducer
  }),
  {
    onSubmit
  }
)(Form)

export default FormContainer
