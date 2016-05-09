
var React = window.React = require('react'),
    ReactDOM = require("react-dom"),
    Room = require("./ui/Room"),
    mountNode = document.getElementById("app");

require('./config')

ReactDOM.render(<Room />, mountNode);

