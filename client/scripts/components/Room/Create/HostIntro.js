import React, {PropTypes} from 'react'
import EditNametag from '../../Nametag/EditNametag'
import UserBadges from '../../Badge/UserBadges'
import TextField from 'material-ui/TextField'
import {grey, red} from '../../../../styles/colors'
import t from '../../../utils/i18n'

const HostIntro = ({
  mod,
  selectedBadges,
  addModBadge,
  removeModBadge,
  updateMod,
  me,
  error}) =>
    <div>
      <h2>{t('create_room.intro')}</h2>
      <div style={styles.helpText}>
        {t('create_room.intro_help')}
      </div>
      <TextField
        style={styles.textfield}
        inputStyle={styles.textFieldInput}
        value={mod.bio}
        id='bioField'
        multiLine
        errorText={error && error.bioError}
        onChange={(e) => updateMod(null, 'bio', e.target.value)}
        floatingLabelText={t('create_room.intro')} />
      <div style={{...styles.helpText, ...styles.nametagHelpText}}>
        {t('create_room.intro_custom')}
      </div>
      <div style={styles.error}>
        {error && error.imageError}
      </div>
      <div style={styles.editNametagContainer}>
        <div>
          <EditNametag
            error={error}
            nametagEdit={mod}
            addNametagEditBadge={addModBadge}
            requiredTemplates={selectedBadges.map(b => b.template.id)}
            removeNametagEditBadge={removeModBadge}
            updateNametagEdit={updateMod}
            me={me}
            roomId='new' />
          <div style={styles.userBadges}>
            <UserBadges
              badges={me.badges}
              selectedBadges={mod && mod.badges} />
          </div>
        </div>
      </div>
    </div>

const {object, arrayOf, shape, func, string} = PropTypes

HostIntro.proptypes = {
  mod: object.isRequired,
  selectedBadges: arrayOf(shape({template: shape({id: string.isRequired})})).isRequired,
  addModBadge: func.isRequired,
  removeModBadge: func.isRequired,
  updateMod: func.isRequired,
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
    margin: 10
  },
  textFieldInput: {
    width: '100%'
  },
  helpText: {
    color: grey,
    fontSize: 14
  },
  nametagHelpText: {
    marginTop: 40,
    marginBottom: 20
  },
  userBadges: {
    width: 270,
    display: 'flex',
    flexWrap: 'wrap',
    minHeight: 100,
    verticalAlign: 'top',
    padding: 5,
    margin: 5
  },
  userBadgeText: {
    fontStyle: 'italic',
    fontSize: 12,
    color: grey
  },
  editNametagContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  error: {
    color: red
  }
}
