import React from 'react'
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper'

const display = window.innerWidth < 650 ? {display: 'none'} : {}
const CreateRoomStepper = ({stepIndex, loggedIn}) => <Stepper
  activeStep={stepIndex}
  orientation='horizontal'
  style={display}>
  <Step>
    <StepLabel>Choose Welcome Prompt</StepLabel>
  </Step>
  <Step>
    <StepLabel>Set Conversation Norms</StepLabel>
  </Step>
  {
    loggedIn ? []
    : <Step>
      <StepLabel>Create Account</StepLabel>
    </Step>
  }
  <Step>
    <StepLabel>Introduce Yourself</StepLabel>
  </Step>
  <Step>
    <StepLabel>Done!</StepLabel>
  </Step>
</Stepper>

export default CreateRoomStepper
