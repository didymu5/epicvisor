// var React = require('react');
import React from 'react';

var Component = React.createClass({
    render: function () {

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                </head>
                <body>
                    <h1>Let's do this awesome thing</h1>
                </body>
                <a href='/oauth/linkedin'>
                    Register with Linkedin I guess?
                </a>
            </html>
        );
    }
});


module.exports = Component;