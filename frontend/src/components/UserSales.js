import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Segment, Item, Step, Statistic, Dimmer, Loader, Image } from 'semantic-ui-react'
import ReceiptView from './ReceiptView'
import { connect } from 'react-redux'

class UserSales extends Component {
  state = {
    orderId: '',
    totalIncome: 0,
    totalCost: 0,
    totalQuantity: 0,
    revenue: 0,
    message: ''
  }
  setOpen = (value) => {
    this.setState({
        orderId:value
      })
  }


  componentDidMount = async () =>{
    const { todaySales } = this.props
    let totalIncome = 0
    let totalQuantity = 0

    todaySales.map((item) => {
      totalIncome += item.total_price
      totalQuantity += item.qty
      return item;
    })
    return this.setState({
      todaySales,
      totalIncome,
      totalQuantity,
    })

  }

  render() {

    const { theme, lang, todaySales, loadingBar } = this.props
    const { orderId, totalIncome, totalQuantity } = this.state
    const myScript = {
      EN: {
        totalIncome : 'Total Income',
        totalCost : 'Total Cost',
        revenue : 'Revenue',
        totalItems : 'Total Items Sold',
        quantity : 'Quantity',
        totalPrice: 'Total Price',
        showReciept: 'Show Reciept',
        details: 'Orders Details',
        orderId: 'Order ID : ',
        btns:{
          edit: 'Edit',
          remove: 'Delete',
        }
      },
      AR: {
        totalIncome : 'اجمالي الدخل',
        totalCost : 'اجمالي التكلفة',
        revenue : 'العائد',
        totalItems : 'اجمالي عدد الاصناف',
        quantity : 'عدد الاصناف',
        totalPrice: 'اجمالي السعر',
        showReciept: 'اظهار الفاتورة',
        details: 'تفاصيل المبيعات',
        orderId: 'طلب رقم : ',
        btns:{
          edit: 'تعديل',
          remove: 'حذف',
        }
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
      <Segment.Group>
        <Segment inverted>
          <Statistic.Group inverted widths='two'>
            <Statistic>
              <Statistic.Value><Icon name='pound' size='tiny'/>{totalIncome}</Statistic.Value>
              <Statistic.Label>{myScript[lang].totalIncome}</Statistic.Label>
            </Statistic>

            <Statistic>
              <Statistic.Value>
                <Icon name='chart line' size='tiny'/>{totalQuantity}
              </Statistic.Value>
              <Statistic.Label>{myScript[lang].totalItems}</Statistic.Label>
            </Statistic>
          </Statistic.Group>
        </Segment>
        <Segment>
          <Header as = 'h1'>{myScript[lang].details}:</Header>
          {
            todaySales.map((order) => (
              <Item.Group key = {order.id}>
                <Item>
                  <Item.Content>
                    <Item.Header >{order.created_on}</Item.Header>
                    <Item.Meta>ID: {order.id}</Item.Meta>
                    <Item.Description>
                      <Step.Group widths={4} size='tiny'>
                        <Step>
                          <Icon name='numbered list' size='tiny' color = {theme} />
                          <Step.Content>
                            <Step.Title>{myScript[lang].quantity}</Step.Title>
                            <Step.Description>{order.qty}</Step.Description>
                          </Step.Content>
                        </Step>
                        <Step>
                          <Icon name='money bill alternate outline' size='tiny' color = {theme} />
                            <Step.Content>
                              <Step.Title>{myScript[lang].totalPrice}</Step.Title>
                              <Step.Description>{order.total_price}</Step.Description>
                            </Step.Content>
                        </Step>
                        <Step>
                          <Modal
                            closeIcon
                            open={orderId === order.id ? true : false}
                            trigger={
                              <Button icon='newspaper outline' color = {theme} label = {myScript[lang].showReciept} size='tiny' labelPosition='left'/>}
                            onClose={() => this.setOpen('')}
                            onOpen={() => this.setOpen(order.id)}
                          >
                            <Header icon='archive' content={myScript[lang].orderId+ order.id} />
                            <Modal.Content>
                              <ReceiptView
                                theme = {theme}
                                lang = {lang}
                                cartItems = {order.items}
                                total = {order.total_price}
                                totalQuantity = {order.qty}
                                handleEditQuantity = {this.handleEditQuantity}
                              />
                            </Modal.Content>
                          </Modal>
                        </Step>
                      </Step.Group>

                    </Item.Description>
                    <Item.Extra>

                    </Item.Extra>
                  </Item.Content>
                </Item>
              </Item.Group>
            ))
          }
        </Segment>
      </Segment.Group>

    )
  }
}

const mapStateToProps = ({orders, loadingBar}) => {
  return {
    loadingBar: loadingBar.default === 1? true : false,
    todaySales: orders.userTodaySales,
  };
}

export default connect(mapStateToProps)(UserSales)
