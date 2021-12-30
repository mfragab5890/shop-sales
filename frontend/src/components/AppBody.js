import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'
import AppMenu from './AppMenu'
import Sales from './Sales'
import Financial from './Financial'
import Products from './Products'
import Error from './Error'
import { Route, Switch, Redirect } from 'react-router-dom'

export default class AppBody extends Component {
  render() {
    const { theme, lang, products } = this.props
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
                  <Sales theme = {theme} lang = {lang}/>
                  );
                }
              }
              />
            <Route path='/financial' render ={() =>{
                  return (
                    <Financial theme = {theme} lang = {lang}/>
                    );
                  }
                }
              />
            <Route path='/products' render ={() =>{
                return (
                  <Products theme = {theme} lang = {lang} products = { products }/>
                  );
                }
              }
              />
            <Route path='*' render ={() =>{
                return (
                  <Error message = "Sorry This menue Page Doesn't exist" />
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
