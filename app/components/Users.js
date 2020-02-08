import React, { Fragment } from 'react'
import { connect } from 'react-redux'

class Users extends React.Component {
  constructor(props) {
    super(props)
   
    this.API = 'https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count='
    this.DEFAULT_QUERY = 6

    this.state = {
      hits: [],
      page: 0,
      reload: this.props.formData.reload,
      toDisplay: this.DEFAULT_QUERY
    }

    this.loadMoreUsers = this.loadMoreUsers.bind(this)
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.formData.reload === this.props.formData.reload) {
      return
    }

    if (this.props.formData.reload) {
      console.log('componentDidUpdate')

      this.setState(
        {
          toDisplay: this.DEFAULT_QUERY,
          page: 0
        },
        () => {
          this.getJson()
        }
      )
    }
  }

  getJson = () => {
    fetch(this.API + this.state.toDisplay)
      .then(response => response.json())
      .then(data =>
        this.setState({
          hits: data.users,
          page: data.count,
          pagetotal: data.total_users
        })
      )
  }

  componentDidMount = () => {
    this.getJson()
  }

  loadMoreUsers = () => {

    this.setState(
      {
        toDisplay: this.state.toDisplay + this.DEFAULT_QUERY
      },
      () => {
        this.getJson()
      }
    )

    const { page, pagetotal } = this.state
    if (this.state.page >= this.state.pagetotal - this.DEFAULT_QUERY) { // did not go beyond out
      var elem = document.querySelector('#more')
      elem.classList.add('btn-disable');
      elem.setAttribute('disabled', 'disabled')
    }
  }


  formatPhone = (phone) => {
    return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 ($2) $3-$4-$5")
  }

  

  render = () => {
    const { hits } = this.state
    return (
      <React.Fragment>
        <div className="users__list">
          {hits.map(hit => (
            <div className="users__item" id={hit.id} key={hit.id}>
              <div className="users__avatar" style={{ backgroundImage: `url(${hit.photo})` }}>
              </div>
              <div className="users__description">
                <div className="users__name">{hit.name.slice(0, 45)}</div>
                <div className="users__position">{hit.position}</div>
                <div className="users__email" data-toggle="tooltip" data-placement="bottom" title={hit.email}>{hit.email.slice(0, 15)}</div>
                <div className="users__phone">{this.formatPhone(hit.phone)}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="btn btn-transparent"
          id="more"
          onClick={this.loadMoreUsers}
        >
          Show more
        </button>
      </React.Fragment>
    )
  }
}

const UsersContainer = connect(
  state => ({
    formData: state.formReducer
  })
)(Users)

export default UsersContainer
