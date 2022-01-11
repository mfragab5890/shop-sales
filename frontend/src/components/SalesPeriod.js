import React, { Component, Fragment } from 'react'
import { Button, Header, Icon, Modal, Segment, Item, Step, Statistic, Message, Input, Grid} from 'semantic-ui-react'
import { getPeriodOrders } from '../utils/api'
import ReceiptView from './ReceiptView'
import { deleteOrder } from '../utils/api'

export default class SalesPeriod extends Component {
  state = {
    orderId: '',
    periodSales: [],
    totalCost:'',
    totalIncome: '',
    totalQuantity: '',
    revenue: '',
    message: '',
    today: '',
    periodFrom: '',
    periodTo: '',
    noResults: false
  }
  setOpen = (value) => {
    this.setState({
        orderId:value
      })
  }
  handleDateChange = (e) => {
    const { name, value } = e.target
    if (name === 'from') {
      return this.setState({
        periodFrom: value
      });
    }
    if (name === 'to') {
      return this.setState({
        periodTo: value
      });
    }

  }

  handleEditQuantity = async (quantity, id) => {

  }

  handleEditOrder = (orderId) => {
    console.log(orderId);
  }

  handleRemoveOrder = async (orderId) => {
    const { lang } = this.props
    const message = lang === 'EN'
      ? `Are You Sure You Want To Delete Order Number ${orderId}`
      : `هل انت متاكد انك تريد حذف عملية البيع رقم ${orderId}`
    if (window.confirm(message)) {
      await deleteOrder(orderId).then(res => {
        this.setState({
          message: res.message,
          orderId: ''
        })
        setTimeout(() => this.setState({
          message: ''
        }), 3000)
      })
    }
  }

  componentDidMount = async () =>{
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    const yyyy = today.getFullYear();
    if(dd<10){
      dd='0'+dd
    }
    if(mm<10){
      mm='0'+mm
    }
    today = yyyy+'-'+mm+'-'+dd;
    this.setState({
      today:today
    })

  }
  handleGetPeriodOrders = async() => {
    const { periodFrom, periodTo } = this.state
    if(periodFrom !== '' || periodTo !== ''){
      const data = await getPeriodOrders(periodFrom, periodTo)
      const periodSales = data.orders
      if (periodSales.length < 1) {
        return this.setState({
          noResults: true
        })
      }
      let totalIncome = 0
      let totalCost = 0
      let totalQuantity = 0
      periodSales.map((item) => {
        totalIncome += item.total_price
        totalCost += item.total_cost
        totalQuantity += item.qty
        return item;
      })

      const revenue = totalIncome - totalCost
      return   await this.setState({
          periodSales,
          totalIncome,
          totalCost,
          totalQuantity,
          revenue,
          noResults: false
        });
    }
  }
  render() {

    const { theme, lang } = this.props
    const {
      orderId,
      periodSales,
      totalIncome,
      totalCost,
      totalQuantity,
      revenue,
      message,
      today,
      periodFrom,
      periodTo,
      noResults
    } = this.state
    const myScript = {
      EN: {
        totalIncome : 'Total Income',
        totalCost : 'Total Cost',
        revenue : 'Revenue',
        totalItems : 'Total Items Sold',
        quantity : 'Quantity',
        totalPrice: 'Total Price',
        showReciept: 'Show Reciept',
        deleteReciept: 'Delete Reciept',
        details: 'Orders Details',
        orderId: 'Order ID : ',
        periodFrom: 'From',
        periodTo: 'To',
        noPeriod: {
          header: 'Please Select Your Deseired Period',
          message: 'In order to show the results you need to indicate your desired period use the first input "From" to indicate the starting period and the second input "To" which indicates the ending period'
        },
        noResults: {
          header: 'No Search Results',
          message: 'sorry the search period you selected has no saved orders in the database please try another period'
        },
        btns:{
          edit: 'Save Edit',
          remove: 'Delete',
          results: 'Show Results',
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
        deleteReciept: 'حذف الفاتورة',
        details: 'تفاصيل المبيعات',
        orderId: 'طلب رقم : ',
        periodFrom: 'من',
        periodTo: 'الى',
        noPeriod: {
          header: 'برجاء ادخال الفترة',
          message: 'يجب ادخال الفترة المحددة حيث المدخل "من" يحدد يوم البداية و المدخل "الى" يحدد يوم النهاية'
        },
        noResults: {
          header: 'عفوا لا يوجد مبيعات مسجلة للفترة المحددة',
          message: 'يرجى المحاولة مرة اخرى باستخدام فترة مختلة'
        },
        btns:{
          edit: ' حفظ التعديل',
          remove: 'حذف',
          results: 'اظهار النتائج',
        }
      }
    }

    return (
      <Segment.Group>
        <Segment inverted>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column floated='left' width={5}>
              <Input fluid inverted label = {myScript[lang].periodFrom} type = {'date'} max = {today} value = {periodFrom} name = 'from' onChange = {this.handleDateChange}/>
            </Grid.Column>
            <Grid.Column floated='right' width={5}>
              <Input fluid inverted label = {myScript[lang].periodTo} type = {'date'} max = {today} name = 'to' value= {periodTo} onChange = {this.handleDateChange}/>
            </Grid.Column>
            <Grid.Column floated='right' width={3}>
              <Button
              disabled = {periodFrom === '' || periodTo === ''}
              label = {myScript[lang].btns.results}
              icon = 'eye'
              positive
              onClick = {this.handleGetPeriodOrders}/>

            </Grid.Column>
          </Grid.Row>
        </Grid>
        </Segment>
        <br/>
        {
          periodSales.length >0
          ?(
            <Fragment>
              <Segment inverted>
                <Statistic.Group inverted color={revenue > 0 ? 'green' : 'red' } widths='four'>
                  <Statistic>
                    <Statistic.Value>
                      <Icon name='pound' size='tiny'/>{totalIncome}
                    </Statistic.Value>
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
                      <Icon name='pound' size='tiny'/>{revenue}<Icon name={revenue >=0? 'long arrow alternate up' : 'long arrow alternate down'} />
                    </Statistic.Value>
                    <Statistic.Label>{myScript[lang].revenue}</Statistic.Label>
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
                  message !== '' &&
                  <Message
                    success
                    header='success'
                    content= {message}
                  />
                }
                {
                  periodSales.map((order) => (
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
                                <Button
                                  icon='delete'
                                  color = {'red'}
                                  label = {myScript[lang].deleteReciept}
                                  size='small'
                                  labelPosition='right'
                                  onClick = {() => this.handleRemoveOrder(order.id)}
                                />
                                |
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
                                      orderId = {order.id}
                                      handleEditQuantity = {this.handleEditQuantity}
                                    />
                                  </Modal.Content>
                                  <Modal.Actions>
                                    <Button color='red' onClick={() => this.handleRemoveOrder(order.id)}>
                                      <Icon name='remove' /> {myScript[lang].btns.remove}
                                    </Button>
                                    <Button color={theme} onClick={() => this.handleEditOrder(order.id)}>
                                      <Icon name='edit' /> {myScript[lang].btns.edit}
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
            </Fragment>
          )
          : noResults
            ? (
                <Message warning>
                  <Message.Header>{myScript[lang].noResults.header}</Message.Header>
                  <p>
                    {myScript[lang].noResults.message}
                  </p>
                </Message>
              )
            : (
                <Message>
                  <Message.Header>{myScript[lang].noPeriod.header}</Message.Header>
                  <p>
                    {myScript[lang].noPeriod.message}
                  </p>
                </Message>
              )
        }

      </Segment.Group>

    )
  }
}
