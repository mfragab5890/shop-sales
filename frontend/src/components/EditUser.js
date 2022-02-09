import React, { Component } from 'react'
import { Form, Header, Modal, Image, Message, Dimmer, Loader } from 'semantic-ui-react'
import { connect } from 'react-redux'

class UserEdit extends Component {
  state = {
  }

  componentDidMount=async () => {

  }

  render() {
    const { user, lang, myScript } = this.props
     return (
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
    )
  }
}

export default connect()(UserEdit)
