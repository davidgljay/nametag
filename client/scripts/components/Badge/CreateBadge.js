import React, {Component, PropTypes} from 'react'
import Badge from './Badge'
import TextField from 'material-ui/TextField'
import Navbar from '../Utils/Navbar'
import t from '../../utils/i18n'
import Toggle from 'material-ui/Toggle'
import CircularProgress from 'material-ui/CircularProgress'
import RaisedButton from 'material-ui/RaisedButton'

class CreateBadge extends Component {

  constructor (props) {
    super(props)

    this.state = {
      name: '',
      image: null,
      description: '',
      uploading: false,
      approvalRequired: true
    }

    this.updateBadge = (property, value) => {
      if (property === 'name') {
        this.setState({name: value.slice(0, 40)})
      } else {
        this.setState({[property]: value})
      }
    }

    this.onChooseImage = () => {
      this.setState({uploading: true})
    }

    this.onUploadImage = ({url}) => {
      this.updateBadge('image', url)
      this.setState({uploading: false})
    }

    this.onBadgeForChange = (val) => {
      this.setState({badgeFor: val})
    }

    this.createBadge = () => {
      const {data: {granter}, createBadge} = this.props
      const {name, image, description, approvalRequired} = this.state
      return createBadge({
        description,
        granter: granter.id,
        image,
        name,
        approvalRequired
      })
      .then(({data: {createTemplate: {id}}}) => {
        window.location = `/granters/${granter.urlCode}`
      })
    }

    this.toggleApproval = (e) => {
      e.preventDefault()
      this.setState({approvalRequired: !this.state.approvalRequired})
    }
  }

  componentDidMount () {
    if (!this.props.data.loading) {
      this.updateBadge('image', this.props.data.granter.image)
    }
  }

  componentDidUpdate (prevProps) {
    if (!this.props.data.loading && prevProps.data.loading) {
      this.updateBadge('image', this.props.data.granter.image)
    }
  }

  render () {
    const {name, image, description, approvalRequired} = this.state
    const {data: {me, loading, granter}, mini} = this.props

    if (loading) {
      return <CircularProgress />
    }

    return <div id='createBadge'>
      {
        !mini &&
        <Navbar
          me={me} />
      }
      <div style={styles.container}>
        {
          !mini &&
          <div>
            <h2>{t('badge.create_badge')}</h2>
            <div style={styles.description}>
              {t('badge.badge_desc', granter.name)}
            </div>
          </div>
        }
        <div style={styles.badgePreview}>
          <Badge
            badge={{
              template: {
                name,
                image,
                description,
                granter
              },
              id: 'new'
            }}
            draggable={false}
            expanded
            showIconUpload
            onUploadImage={this.onUploadImage} />
        </div>
        <TextField
          style={styles.textfield}
          value={name}
          onChange={(e) => this.updateBadge('name', e.target.value)}
          floatingLabelText={t('title')}
          />
        <div style={styles.counter}>{40 - name.length}</div><br />
        <div style={styles.description}>
          {t('badge.badge_example')}
        </div>
        <TextField
          style={styles.textfield}
          value={description}
          onChange={(e) => this.updateBadge('description', e.target.value)}
          floatingLabelText={t('description')}
          />
        <div style={styles.description}>
          {t('badge.badge_detail_desc')}
        </div>
        <Toggle
          label={t('badge.require_approval')}
          toggled={approvalRequired}
          style={styles.toggle}
          onToggle={this.toggleApproval} />
        <div style={styles.description}>
          {
            approvalRequired
            ? t('badge.req_approval_on')
            : t('badge.req_approval_off')
          }
        </div>
        <div style={styles.createButton}>
          <RaisedButton
            labelStyle={styles.buttonLabel}
            primary
            label={t('badge.create_badge')}
            onClick={this.createBadge} />
        </div>
      </div>
    </div>
  }
}

CreateBadge.propTypes = {
  data: PropTypes.shape({
    me: PropTypes.shape({}),
    granter: PropTypes.shape({}),
    loading: PropTypes.bool.isRequired
  }).isRequired,
  createBadge: PropTypes.func.isRequired
}

export default CreateBadge

const styles = {
  badgePreview: {
    lineHeight: '20px',
    width: 250
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column'
  },
  counter: {
    marginLeft: 280,
    fontSize: 12,
    color: '#008000'
  },
  description: {
    maxWidth: 290,
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic'
  },
  toggle: {
    width: 290,
    margin: '30px 0px 10px 0px'
  },
  textfield: {
    width: 290
  },
  createButton: {
    margin: 30
  },
  buttonLabel: {
    color: '#fff'
  }
}
