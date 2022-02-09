import React, { Component } from 'react'
import { Card, Button, Accordion, Icon, Message, List, Modal, Header, Form, Checkbox } from 'semantic-ui-react'
import { handleDeleteUser, handleEditUser } from '../actions/users'
import { connect } from 'react-redux'

class UserView extends Component {
  state = {
    activeIndex: 1,
    message: '',
    success: true,
    userId: '',
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    email: '',
    userPermissions: [],
    permissionsNames: [],
    prevLang: '',
    passwordView: false,
    passwordMatch: false,
    myScript: {
      EN: {
        username: 'Username',
        email: 'Email',
        password: 'Password Edit',
        permissions: 'Permissions',
        btns:{
          edit: 'Edit',
          remove: 'Remove',
        },
        userDetails: 'User Details',
        permissionsNames: {
          CREATE_NEW_USER: 'Create New User',
          DELETE_USER: 'Delete User',
          CREATE_NEW_PRODUCT: 'Create New Product',
          EDIT_PRODUCT: 'Edit Product',
          GET_ALL_PRODUCTS: 'Get All Products',
          SEARCH_PRODUCTS_BY_ID: 'Search Products By ID',
          SEARCH_PRODUCTS_BY_TERM: 'Search Products By Term',
          DELETE_PRODUCT: 'Delete Product',
          CREATE_ORDER: 'Create Order',
          GET_MONTH_SALES: 'Get Month Sales',
          GET_PERIOD_SALES: 'Get Period Sales',
          GET_TODAY_SALES: 'Get All Today Sales',
          GET_USER_TODAY_SALES: 'Get User Today Sales',
          DELETE_ORDER: 'Delete Order',
          EDIT_USER: 'Edit User',
          GET_ALL_USERS: 'Get All Users',
        },
        editUser:{
          oldPassword: 'Old Password',
          newPassword: 'New Password',
          confirmNewPassword: 'Confirm New Password',
        }
      },
      AR: {
        username: 'اسم المستخدم',
        email: 'الإميل',
        password: 'تعديل كلمة السر',
        permissions: 'الاذون',
        btns:{
          edit: 'تعديل',
          remove: 'حذف',
        },
        userDetails: 'بيانات المستخدم',
        permissionsNames: {
          CREATE_NEW_USER: 'انشاء مستخدم جديد',
          DELETE_USER: 'حذف مستخدم',
          CREATE_NEW_PRODUCT: 'انشاء منتج جديد',
          EDIT_PRODUCT: 'تعديل منتج',
          GET_ALL_PRODUCTS: 'استعراض جميع المنتجات',
          SEARCH_PRODUCTS_BY_ID: 'بحث المنتجات بالباركود',
          SEARCH_PRODUCTS_BY_TERM: 'بحث المنتجات بالاسم',
          DELETE_PRODUCT: 'حذف منتج',
          CREATE_ORDER: 'انشاء فاتورة جديدة',
          GET_MONTH_SALES: 'استعراض مبيعات الشهر',
          GET_PERIOD_SALES: 'استعراض مبيعات بالفترة',
          GET_TODAY_SALES: 'استعراض جميع مبيعات اليوم',
          GET_USER_TODAY_SALES: 'استعراض مبيعات المستخدم اليوم',
          DELETE_ORDER: 'حذف فاتورة',
          EDIT_USER: 'تعديل مستخدم',
          GET_ALL_USERS: 'استعراض جميع المستخدمين',
        },
        editUser:{
          oldPassword: 'كلمة السر القديمة',
          newPassword: 'كلمة السر الجديدة',
          confirmNewPassword: 'تأكيد كلمة السر الجديدة',
        }
      },

    },
  }

  setOpen = (value) => {
    this.setState({
        userId:value
      })
  }

  handleDetailsClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  handleFormData = async (e) => {
    e.preventDefault()
    const { name, value } = e.target
    if (name === 'username') {
      await this.setState({
        username : value,
      })
    }
    else if (name === 'email') {
      await this.setState({
        email : value
      })
    }
    else if (name === 'oldPassword') {
      await this.setState({
        oldPassword : value
      })
    }
    else if (name === 'newPassword') {
      await this.setState({
        newPassword : value
      })
    }
    else if (name === 'confirmNewPassword') {
      await this.setState({
        confirmNewPassword : value
      })
    }
    const {newPassword, confirmNewPassword} = this.state
    if (newPassword === confirmNewPassword) {
      await this.setState({
        passwordMatch : true
      })
    }
    else {
      await this.setState({
        formComplete : false
      })
    }

  }

  togglePasswordView = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        passwordView : !prevState.passwordView,
      };
    })
  }

  togglePermission = (e, {id, checked}) => {
    if (checked) {
      return this.setState((prevState) => {
        if (!prevState.userPermissions.includes(id)) {
          return {
            ...prevState,
            userPermissions: prevState.userPermissions.concat([id])
          };
        }
        else {
          return prevState;
        }

      });
    }
    else {
      return this.setState((prevState) => {
        if (prevState.userPermissions.includes(id)) {
          return {
            ...prevState,
            userPermissions: prevState.userPermissions.filter((permission) => permission !== id )
          };
        }
        else {
          return prevState
        }
      });
    }
  }

  handleUserEdit = (e) => {
    e.preventDefault()
    const {
      username,
      email,
      oldPassword,
      newPassword,
      confirmNewPassword,
      userPermissions
    } = this.state
    const { lang, user, dispatch } = this.props
    let message = ''
    if (username === '') {
      message = lang === 'EN' ? 'Username Can Not Be Empty' : 'يجب ادخال اسم المستخدم'
      return alert(message);
    }
    if (email === '') {
      message = lang === 'EN' ? 'Password Can Not Be Empty' : 'يجب ادخال الإميل'
      return alert(message);
    }
    if (oldPassword !== '' && newPassword !== '' && newPassword !== confirmNewPassword) {
      message = lang === 'EN' ? 'New Password & Confirmation Do Not Match' : 'كلمة السر الجديدة لا تطابق التاكيد لكلمة السر'
      return alert(message);
    }
    if (oldPassword === '' && (newPassword !== '' || confirmNewPassword !== '') ) {
      message = lang === 'EN' ? 'Old Password Must Not Be Empty To Change Password' : 'يجب كتابة كلة السر القديمة لتغيير كلمة السر'
      return alert(message);
    }

    const editedUser = {
      ...user,
      username,
      email,
      newPassword,
      oldPassword,
      userPermissions
    }
    return dispatch(handleEditUser(editedUser))
  }

  componentDidMount(){
   const { myScript } = this.state
   const { user, lang } = this.props
   let permissionsNames = []
   for (const permission in myScript[lang].permissionsNames) {
     permissionsNames.push({
       id: permission,
       name: myScript[lang].permissionsNames[permission],
     })
   }
   this.setState({
     username: user.username,
     email: user.email,
     userPermissions: user.permissions.map((permission) => permission.name),
     permissionsNames,
     prevLang: lang,
   })

 }
 componentDidUpdate(){
   const { lang } = this.props
   const { prevLang, myScript } = this.state
   if (prevLang !== lang ) {
     let permissionsNames = []
     for (const permission in myScript[lang].permissionsNames) {
       permissionsNames.push({
         id: permission,
         name: myScript[lang].permissionsNames[permission],
       })
     }
     return this.setState({
       permissionsNames,
       prevLang: lang,
     });
   }
 }

  render() {
    const { user, theme, lang, permissions, } = this.props
    const {
      activeIndex,
      message,
      success,
      userId,
      username,
      email,
      passwordView,
      oldPassword,
      newPassword,
      confirmNewPassword ,
      userPermissions,
      permissionsNames,
      passwordMatch,
      myScript
    } = this.state

    return (
      <Card color={theme}>
        {
          message !== '' &&
          <Message
            success = {success}
            warning = {!success}
            header={'success: ' + success}
            content= {message}
          />
        }
        <Card.Content>
          <Card.Header>
            <Icon name={user.id === 1 ? 'user secret' : 'user'} size='large' />
            {user.username}
          </Card.Header>
          <Card.Meta>{user.id} | {user.email}</Card.Meta>
        </Card.Content>
        <Card.Content>
        <Accordion>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleDetailsClick}
          >
            <Icon name='dropdown' />
            {myScript[lang].permissions}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <List divided relaxed>
              {
                userPermissions.map((permission) => {
                  return (
                    <List.Item key = { permission }>
                      <List.Icon name='dot circle outline' size='small' verticalAlign='middle' />
                      <List.Content>
                        <List.Header as={lang === 'EN' ? 'h6' : 'h5'}>{myScript[lang].permissionsNames[permission]}</List.Header>
                      </List.Content>
                    </List.Item>
                  );
                })
              }
            </List>
          </Accordion.Content>
        </Accordion>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            {
              permissions.includes('EDIT_USER')
              &&
              user.id !== 1
              &&
              <Modal
                closeIcon
                open={userId === user.id ? true : false}
                trigger={
                  <Button basic color='green'>
                    {myScript[lang].btns.edit}
                  </Button>
                }
                onClose={() => this.setOpen('')}
                onOpen={() => this.setOpen(user.id)}
              >
                <Header icon={user.id === 1 ? 'user secret' : 'user'} content={user.id + ' || ' + user.username} />
                <Modal.Content>
                  <Form>
                    <Form.Field>
                      <label>{myScript[lang].userDetails}</label>
                    </Form.Field>
                    <Form.Field>
                      <label>{myScript[lang].username}</label>
                      <input value = {username} name = 'username' onChange = {this.handleFormData}/>
                    </Form.Field>
                    <Form.Field>
                      <label>{myScript[lang].email}</label>
                      <input value = {email} name = 'email' onChange = {this.handleFormData}/>
                    </Form.Field>
                    <Form.Field>
                      <label>{myScript[lang].password} </label>
                    </Form.Field>
                    <Form.Input
                      label = {myScript[lang].editUser.oldPassword}
                      value = {oldPassword}
                      name = 'oldPassword'
                      onChange = {this.handleFormData}
                      type= {passwordView ? 'text' : 'password'}
                      action={{
                        color: passwordView ? 'grey' : 'black',
                        icon: passwordView ? 'eye slash outline' : 'eye',
                        onClick:this.togglePasswordView
                      }}
                    />
                    <Form.Input
                      label = {myScript[lang].editUser.newPassword}
                      icon= {passwordMatch ? 'thumbs up outline' : null}
                      iconPosition='left'
                      value = {newPassword}
                      name = 'newPassword'
                      onChange = {this.handleFormData}
                      type= {passwordView ? 'text' : 'password'}
                      action={{
                        color: passwordView ? 'grey' : 'black',
                        icon: passwordView ? 'eye slash outline' : 'eye',
                        onClick:this.togglePasswordView
                      }}
                    />
                    <Form.Input
                      label = {myScript[lang].editUser.confirmNewPassword}
                      icon= {passwordMatch ? 'thumbs up outline' : null}
                      iconPosition='left'
                      value = {confirmNewPassword}
                      name = 'confirmNewPassword'
                      onChange = {this.handleFormData}
                      type= {passwordView ? 'text' : 'password'}
                      action={{
                        color: passwordView ? 'grey' : 'black',
                        icon: passwordView ? 'eye slash outline' : 'eye',
                        onClick:this.togglePasswordView
                      }}
                    />
                    <Form.Field>
                      <label>{myScript[lang].permissions}</label>
                    </Form.Field>
                    {
                      permissionsNames.map((permission) => {
                        return (
                          <Form.Field key = {permission.id}>
                            <Checkbox
                            label= {permission.name}
                            checked= {userPermissions.includes(permission.id) ? true : false}
                            name= 'permissions'
                            onClick = {this.togglePermission}
                            id= {permission.id}
                            />
                          </Form.Field>
                        );
                      })
                    }
                    <br/>
                    <Button fluid color='green' onClick={this.handleUserEdit}>
                      <Icon name='edit' /> {myScript[lang].btns.edit}
                    </Button>
                  </Form>
                </Modal.Content>
              </Modal>
            }
            {
              permissions.includes('DELETE_USER')
              &&
              user.id !== 1
              &&
              <Button basic color='red' onClick = {() => this.handleRemoveUser(user.id)}>
                {myScript[lang].btns.remove}
              </Button>
            }
          </div>

        </Card.Content>
      </Card>

    )
  }
}

const mapStateToProps = ({authedUser}) => {
  const permissions = authedUser.permissions.map((permission) => permission.name)
  return {
    permissions: authedUser? permissions:[],
  };
}

export default connect(mapStateToProps)(UserView)
