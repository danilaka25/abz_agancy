import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { onSubmit } from '../redux/actions/onSubmit'

class Users extends React.Component {
  constructor (props) {
    super(props)
    // CONST
    this.API =
      'https://frontend-test-assignment-api.abz.agency/api/v1/users?page=1&count='
    this.DEFAULT_QUERY = 6

    this.state = {
      hits: [],
      page: 0,
      reload: false,
      toDisplay: 6
    }

    this.loadMoreUsers = this.loadMoreUsers.bind(this)
  }

  componentDidUpdate (prevProps) {
    // console.log('this.props.formData.reload', this.props.formData.reload)
    if (prevProps.formData.reload === this.props.formData.reload) {
      return
    }

    if (this.props.formData.reload) {
      console.log('componentDidUpdate')

      this.setState(
        {
          // reload: true,
          toDisplay: 6
        },
        () => {
          this.getJson()
        }
      )
    } else {				
    //this.setState({ 
    //reload: false
    //})  
    }
  }

  getJson () {
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

  componentDidMount () {
    this.getJson()
  }

  loadMoreUsers () {
    this.setState({
      reload: false
    })

    this.props.onSubmit(false)

    //this.DEFAULT_QUERY = this.DEFAULT_QUERY + 6 ;

    this.setState(
      {
        toDisplay: this.state.toDisplay + 6
      },
      () => {
        this.getJson()
      }
    )

    const { page } = this.state
    const { pagetotal } = this.state
    // не вышли за количество страниц
    if (this.state.page >= this.state.pagetotal - 6) {
      var elem = document.querySelector('#more')
      elem.classList.add('btn-disable');
      elem.setAttribute('disabled', 'disabled')
    }
  }

  render () {
    //console.log("render Users");
    console.log('toDisplay', this.state.toDisplay)

    const { hits } = this.state

    return (
      <React.Fragment>
        <div className="users__list">
          {hits.map(hit => (
            <div className="users__item" id={hit.id} key={hit.id}>
              <div className="users__avatar" style={{ backgroundImage: `url(${hit.photo})`  }}>
              </div>
              <div className="users__description">
                <div className="users__name">{hit.name.slice(0, 45)}</div>
                <div className="users__position">{hit.position}</div>
                <div>{hit.email.slice(0, 15)}</div>
                <div>{hit.phone}</div>
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
  }),
  {
    onSubmit
  }
)(Users)

export default UsersContainer
