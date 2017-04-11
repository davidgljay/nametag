import React, {PropTypes} from 'react'
import Badge from './Badge'
import IconButton from 'material-ui/IconButton'
import DefaultNametag from './BadgeDefaultNametag'
import FontIcon from 'material-ui/FontIcon'
import {grey} from '../../../styles/colors'
import {dateFormat} from '../Utils/DateFormat'

const BadgeTemplates = ({templates, granterCode, addNote}) => <div>
  {
    templates.map(template =>
      <div key={template.id}>
        <div style={styles.badgeTemplate}>
          <Badge
            jumbo
            badge={{
              template,
              id: 'template'
            }} />
          <IconButton
            style={styles.iconButton}
            iconStyle={styles.shareIcon}
            onTouchTap={() => { window.location = `/granters/${granterCode}/badges/${template.id}` }}>
            <FontIcon
              className='material-icons'>
              share
            </FontIcon>
          </IconButton>
          <div style={styles.headerText}>Granted {template.badges.length} times</div>
          <div style={styles.headerText}>Created on {dateFormat(template.createdAt)}</div>
        </div>
        <div style={styles.nametagsContainer}>
          {
            template.badges.map(({id, defaultNametag, notes}) =>
              <DefaultNametag
                key={id}
                id={id}
                addNote={addNote}
                defaultNametag={defaultNametag}
                notes={notes} />
            )
          }
        </div>
      </div>

    )
  }
</div>

const {shape, string, object, arrayOf, func} = PropTypes

BadgeTemplates.propTypes = {
  templates: arrayOf(shape({
    id: string.isRequired,
    name: string.isRequired,
    icon: string.isRequired,
    description: string.isRequired,
    badges: arrayOf(shape({
      id: string.isRequired,
      notes: arrayOf(shape({
        text: string.isRequired,
        date: string.isRequired
      })).isRequired,
      defaultNametag: object.isRequired
    })).isRequired
  })).isRequired,
  granterCode: string.isRequired,
  addNote: func.isRequired
}

export default BadgeTemplates

const styles={
  badgeTemplate: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20
  },
  headerText: {
    fontSize: 14,
    color: grey,
    fontStyle: 'italic',
    margin: '0px 10px'
  },
  nametagsContainer: {
    margin: 10,
    display: 'flex',
    alignItems: 'flex-start'
  },
  iconButton: {
    width: 'inherit',
    height: 'inherit',
    padding: 0
  },
  shareIcon: {
    fontSize: 22,
    color: grey
  }
}
