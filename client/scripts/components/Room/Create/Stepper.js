import React from 'react'
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper'

const display = window.innerWidth < 650 ? {display: 'none'} : {}
const CreateRoomStepper = (props) => <Stepper
  activeStep={props.stepIndex}
  orientation='horizontal'
  style={display}>
  <Step>
    <StepLabel>Choose a topic</StepLabel>
  </Step>
  <Step>
    <StepLabel>Find an image</StepLabel>
  </Step>
  <Step>
    <StepLabel>Build your nametag</StepLabel>
  </Step>
  <Step>
    <StepLabel>Set the norms</StepLabel>
  </Step>
</Stepper>

export default CreateRoomStepper
