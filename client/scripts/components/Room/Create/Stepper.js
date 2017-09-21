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
    <StepLabel>Choose Welcome Prompt</StepLabel>
  </Step>
  <Step>
    <StepLabel>Set Conversation Norms</StepLabel>
  </Step>
  <Step>
    <StepLabel>Log In Or Register</StepLabel>
  </Step>
  <Step>
    <StepLabel>Introduce Yourself</StepLabel>
  </Step>
</Stepper>

export default CreateRoomStepper
