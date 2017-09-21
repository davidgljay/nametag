import React, {PropTypes} from 'react'
import EditNametag from '../../Nametag/EditNametag'
import UserBadges from '../../Badge/UserBadges'
import TextField from 'material-ui/TextField'
import {grey} from '../../../../styles/colors'

const HostIntro = ({
  nametagEdits,
  selectedBadges,
  addNametagEditBadge,
  removeNametagEditBadge,
  updateNametagEdit,
  me,
  error}) =>
    <div>
      <h3>Introduce Yourself</h3>
      <div style={styles.helpText}>
          Give participants a sense of who you are and why this topic matters to you.
      </div>
      <TextField
        style={styles.textfield}
        inputStyle={styles.textFieldInput}
        value={nametagEdits.new.bio}
        id='bioField'
        multiLine
        errorText={error && error.welcomeError}
        onChange={(e) => updateNametagEdit('bio', e.target.value)}
        floatingLabelText='Introduction' />
      <div style={styles.editNametagContainer}>
        <div>
          <EditNametag
            error={error}
            nametagEdit={nametagEdits.new}
            addNametagEditBadge={addNametagEditBadge}
            requiredTemplates={selectedBadges.map(b => b.template.id)}
            removeNametagEditBadge={removeNametagEditBadge}
            updateNametagEdit={updateNametagEdit}
            me={me}
            roomId='new' />
          <div style={styles.userBadges}>
            <UserBadges
              badges={me.badges}
              selectedBadges={nametagEdits.new && nametagEdits.new.badges} />
          </div>
        </div>
      </div>
    </div>

const {object, arrayOf, shape, func, string} = PropTypes

HostIntro.proptypes = {
  nametagEdits: shape({new: object.isRequired}).isRequired,
  selectedBadges: arrayOf(shape({template: shape({id: string.isRequired})})).isRequired,
  addNametagEditBadge: func.isRequired,
  removeNametagEditBadge: func.isRequired,
  updateNametagEdit: func.isRequired,
  me: object,
  error: object
}

export default HostIntro

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    width: 374,
    margin: '20px 20px 10px 10px'
  },
  textFieldInput: {
    width: '100%'
  },
  helpText: {
    color: grey,
    fontSize: 14,
    fontStyle: 'italic'
  }
}
