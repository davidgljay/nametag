import React, { Component, PropTypes } from 'react';
import moment from '../../../bower_components/moment/moment';

// TODO: This currently displays all user badges, as opposed to only the participant badges. A major violation of trust!

class Badge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  toggleExpanded() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    let badge;
    if (this.state.expanded) {
      badge = <div className="badgeExpanded">
            <span
              aria-hidden="true"
              className="glyphicon glyphicon-remove"
              onClick={this.toggleExpanded.bind(this)}>
            </span>
            <img className="icon" alt="icon" src={this.props.badge.icon_array[0]}/>
            <div className="name">{this.props.badge.name}</div>
            <div className="granter">Verified by: {this.props.badge.granter}</div>
            <div className="description">{this.props.badge.description_array[0]}</div>
            <hr/>
            <div className="notes">
              {this.props.badge.notes.map(function mapNotes(note) {
                return <div className="note" key={note.date}>
                    <div className="date">{moment(note.date).format('MMMM Do, YYYY')}: </div>
                    <div className="msg">{note.msg}</div>
                  </div>;
              })}
            </div>
          </div>;
    } else {
      badge = <div
        className="label label-pill badge"
        onClick={this.toggleExpanded.bind(this)}>
          {this.props.badge.name}
        </div>;
    }
    return badge;
  }
}

Badge.propTypes = {badge: PropTypes.object};

export default Badge;
