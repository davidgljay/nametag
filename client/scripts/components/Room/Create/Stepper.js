import React from 'react'
import {
  Step,
  Stepper,
  StepLabel
} from 'material-ui/Stepper'
import t from '../../../utils/i18n'

const display = window.innerWidth < 650 ? {display: 'none'} : {}
const CreateRoomStepper = ({stepIndex, loggedIn, hasGranters}) => <Stepper
  activeStep={stepIndex}
  orientation='horizontal'
  style={display}>
  <Step>
    <StepLabel>{t('create_room.stepper')[0]}</StepLabel>
  </Step>
  <Step>
    <StepLabel>{t('create_room.stepper')[1]}</StepLabel>
  </Step>
  {
    loggedIn ? []
    : <Step>
      <StepLabel>{t('create_room.stepper')[2]}</StepLabel>
    </Step>
  }
  <Step>
    <StepLabel>{t('create_room.stepper')[3]}</StepLabel>
  </Step>
  <Step>
    {
      hasGranters
      ? <StepLabel>Choose Calls To Action</StepLabel>
      : <StepLabel>{t('create_room.stepper')[4]}</StepLabel>
    }
  </Step>
  {
    hasGranters &&
    <Step>
      <StepLabel>{t('create_room.stepper')[4]}</StepLabel>
    </Step>
  }
</Stepper>

export default CreateRoomStepper
