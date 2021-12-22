import React, { Component } from 'react'
import { Segment, Image, Card, Button } from 'semantic-ui-react'

export default class ProductView extends Component {
  state = {

  }

  componentDidMount = () => {

  }

  render() {

    const { product, theme } = this.props
    const myScript = {}
    let image = product.image
                  .replace("b'", "data:image/jpg;base64,")
                  .slice(0, -1)
    return (
      <Card color={theme}>
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={image}
          />
          <Card.Header>{product.name}</Card.Header>
          <Card.Meta>{product.id}</Card.Meta>
          <Card.Description>
            {product.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='green'>
              Edit
            </Button>
            <Button basic color='red'>
              Delete
            </Button>
          </div>
        </Card.Content>
      </Card>

    )
  }
}
