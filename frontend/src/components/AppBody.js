import React, { Component } from 'react'
import { Grid, Segment, Dimmer, Loader, Image } from 'semantic-ui-react'
import AppMenu from './AppMenu'
import Sales from './Sales'
import Financial from './Financial'
import Products from './Products'
import Error from './Error'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

class AppBody extends Component {
  render() {
    const { theme, lang, permissions, loadingBar } = this.props
    return (
      <Grid columns={2}>
        <Grid.Column floated='left' stretched width={3} style = {{padding:'20px 0px 20px 0px',}}>
          <AppMenu theme = {theme} lang = {lang}/>
        </Grid.Column>
        <Grid.Column stretched width={13} style = {{padding:'20px 0px 20px 0px',}}>
          <Switch>
            <Route exact path='/'>
              <Redirect to = '/sales/new' />
            </Route>
            <Route path='/sales' render ={() =>{
                return (
                  permissions.includes('CREATE_ORDER') && permissions.includes('SEARCH_PRODUCTS_BY_ID')
                  ?<Sales theme = {theme} lang = {lang}/>
                  :<Error message = "Sorry You Have No Authorization To View This Page" />
                  );
                }
              }
            />
            <Route path='/financial' render ={() =>{
                return (
                  permissions.includes('GET_MONTH_SALES') || permissions.includes('GET_PERIOD_SALES') || permissions.includes('GET_TODAY_SALES')
                  ?<Financial theme = {theme} lang = {lang}/>
                  :<Error message = "Sorry You Have No Authorization To View This Page" />
                  );
                }
              }
            />
            <Route path='/products' render ={() =>{
                return (
                  permissions.includes('CREATE_NEW_PRODUCT') || permissions.includes('GET_ALL_PRODUCTS')
                  ? <Products theme = {theme} lang = {lang}/>
                  : <Error message = "Sorry You Have No Authorization To View This Page" />
                  );
                }
              }
            />
            <Route path='*' render ={() =>{
                if (loadingBar) {
                  return (
                    <Segment style = {{width:'100%', height:'100%'}}>
                      <Dimmer active style = {{width:'100%'}}>
                        <Loader indeterminate  style = {{width:'100%'}}>Checking User Authorization</Loader>
                      </Dimmer>
                      <Image src='/shopn.jpg' style = {{width:'100%'}}/>
                    </Segment>
                  );
                }
                return (
                  <Error message = "Sorry You Have No Authorization To View This Page" />
                  );
                }
              }
            />
          </Switch>

        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = ({authedUser, loadingBar}) => {
  const permissions = authedUser.permissions.map((permission) => permission.name)
  return {
    loadingBar: loadingBar.default === 1? true : false,
    permissions: authedUser? permissions:[],
  };
}

export default connect(mapStateToProps)(AppBody)
