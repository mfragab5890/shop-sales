import React, { Component } from 'react'
import { Button, Header, Icon, Modal, Segment, Item, Step, Statistic} from 'semantic-ui-react'
import { getTodayOrders } from '../utils/api'
import ReceiptView from './ReceiptView'

export default class SalesToday extends Component {
  state = {
    orderId: '',
    todaySales: []
  }
  setOpen = (value) => {
    this.setState({
        orderId:value
      })
  }

  handleEditQuantity = async (quantity, id) => {

  }

  componentDidMount = async () =>{
    const data = await getTodayOrders()
    const todaySales = data.orders
    let totalIncome = 0
    let totalCost = 0
    let totalQuantity = 0

    todaySales.map((item) => {
      totalIncome += item.total_price
      totalCost += item.total_cost
      totalQuantity += item.qty
      return item;
    })

    const revenue = totalIncome - totalCost

    await this.setState({
      todaySales,
      totalIncome,
      totalCost,
      totalQuantity,
      revenue
    })
  }
  render() {

    const { theme, lang } = this.props
    const { orderId, todaySales, totalIncome, totalCost, totalQuantity, revenue } = this.state
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
      }
    }
    return (
      <Segment.Group>
        <Segment inverted>
          <Statistic.Group inverted color={revenue > 0 ? 'green' : 'red' } widths='four'>
            <Statistic>
              <Statistic.Value><Icon name='pound' size='tiny'/>{totalIncome}</Statistic.Value>
              <Statistic.Label>{myScript[lang].totalIncome}</Statistic.Label>
            </Statistic>

            <Statistic>
              <Statistic.Value>
                <Icon name='pound' size='tiny'/>{totalCost}
              </Statistic.Value>
              <Statistic.Label>{myScript[lang].totalCost}</Statistic.Label>
            </Statistic>

            <Statistic>
              <Statistic.Value>
                <Icon name='pound' size='tiny'/>{revenue}
              </Statistic.Value>
              <Statistic.Label>{myScript[lang].revenue}</Statistic.Label>
            </Statistic>

            <Statistic>
              <Statistic.Value>
                <Icon name='gem' size='tiny'/>{totalQuantity}
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
                          <Icon name='money bill alternate' size='tiny' color = {theme} />
                            <Step.Content>
                              <Step.Title>{myScript[lang].totalCost}</Step.Title>
                              <Step.Description>{order.total_cost}</Step.Description>
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
                            <Header icon='archive' content='Archive Old Messages' />
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
                            <Modal.Actions>
                              <Button color='red' onClick={() => this.setOpen('')}>
                                <Icon name='remove' /> No
                              </Button>
                              <Button color='green' onClick={() => this.setOpen('')}>
                                <Icon name='checkmark' /> Yes
                              </Button>
                            </Modal.Actions>
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
