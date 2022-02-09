import React, { Component } from 'react'
import { Segment, Card, Input, Message, Header, Dimmer, Loader, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import UserView from './UserView'

class AllUsers extends Component {
  state = {
    searchTerm: '',
    loading: false,
    results: [],
    noResults: false,
    deleted: ''
  }

  onSearchTermChange = (e) => {
    const { value } = e.target
    if (value === '') {
      return this.setState((prevState) => {
              return {
                searchTerm: value,
                loading: false,
                typing: clearTimeout(prevState.typing),
                results: [],
                noResults: false,
              };
            })
    }
    this.setState((prevState) => {
      return {
        searchTerm: value,
        loading: true,
        typing: clearTimeout(prevState.typing)
      };
    })
    this.setState({
      typing: setTimeout(() => this.handleUsersSearch(value), 500)
    })
  }

  handleUsersSearch = async (searchTerm) => {
    if (searchTerm === '') {
      return await this.setState({
        loading: false,
        results: [],
        noResults: false
      });
    }
    const { users } = this.props
    const searchTermLow = searchTerm.toLowerCase()
    const results = users.filter((item) => {
      const username = item.username.toLowerCase()
      const email = item.email.toLowerCase()
      if (username.search(searchTermLow) >= 0 || email.search(searchTermLow) >= 0) {
        return true;
      }
      else {
        return false;
      }
    })
    if (results.length < 1) {
      return await this.setState({
        loading: false,
        results: [],
        noResults: true
      });
    }

    await this.setState({
      loading: false,
      results: results,
      noResults: false
    })
  }

  confirmDelete = (userId, message) => {
    this.setState({
      deleted: message + '-ID: ' + userId ,
    })
    setTimeout(() => this.setState({
      deleted: ''
    }), 3000)
  }

  render() {

    const { theme, lang, users, loadingBar } = this.props
    const { searchTerm, loading, results, noResults, deleted } = this.state
    const myScript = {
      EN: {
        header: 'Viewing All Users',
        results: 'Viewing Results for: ',
        noResults: {
          header: 'Sorry This Search Returned No Results',
          message: 'Please try again using diffrent search term'
        },
      },
      AR: {
        header: 'مشاهدة جميع المستخدمين',
        results: 'يتم عرض نتائج البحث لكلمة: ',
        noResults: {
          header: 'عفوا لا يوجد نتائج بحث',
          message: 'يرجى المحاولة مرة اخرى باستخدام كلمة بحث مختلفة'
        },
      }

    }
    if (loadingBar) {
      return (
        <Segment style = {{width:'100%', height:'100%'}}>
          <Dimmer active style = {{width:'100%'}}>
            <Loader indeterminate  style = {{width:'100%'}}>Checking User Authorization</Loader>
          </Dimmer>
          <Image src='/shopn.jpg' style = {{width:'100%'}}/>
        </Segment>
      )
    }
    return (
      <Segment>
        <Segment inverted>
          <Input
            icon='search'
            fluid
            inverted
            loading = {loading}
            value = {searchTerm}
            onChange = {this.onSearchTermChange}
            placeholder= {'Search'}
            floated = {'right'}
          />
          <Header>
            {!noResults && results.length<1 ? myScript[lang].header : `${myScript[lang].results}${searchTerm}`}
          </Header>
        </Segment>
        {
          deleted !== '' &&
          <Message success>
            <Message.Header>{deleted}</Message.Header>
          </Message>
        }
        {
          noResults
          ? (
            <Message warning>
              <Message.Header>{myScript[lang].noResults.header}</Message.Header>
              <p>
                {myScript[lang].noResults.message}
              </p>
            </Message>
          )
          : (
            <Card.Group centered>
              {
                results.length > 0
                ? results.map((user) =>
                    <UserView
                      key = {user.id}
                      user = {user}
                      theme = {theme}
                      lang = {lang}
                      confirmDelete = {this.confirmDelete}
                    />
                  )
                : users.map((user) =>
                    <UserView
                      key = {user.id}
                      user = {user}
                      theme = {theme}
                      lang = {lang}
                      confirmDelete = {this.confirmDelete}
                    />
                  )
              }
            </Card.Group>
          )
        }
      </Segment>
    )
  }
}

const mapStateToProps = ({loadingBar, users}) => {
  return {
    loadingBar: loadingBar.default === 1? true : false,
    users,
  };
}

export default connect(mapStateToProps)(AllUsers)
