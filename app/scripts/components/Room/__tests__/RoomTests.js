import React from 'react'
import Room from '../Room'
import renderer from 'react-test-renderer'

describe('Room component', () => {
  it('should load the room on componentDidMount', () => {
    const component = renderer.create(<Room id="123" />)
    let tree = component.toJSON()
    console.log(tree)
  })
  it('should load the user nametag and make it available via context')
})
