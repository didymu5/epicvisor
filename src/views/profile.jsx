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
                    <ul>
                        {this.props.users.map(function(user) {
                            return <li>{user.first_name} {user.last_name}</li>
                        } )}
                    </ul>
                </body>
            </html>
        );
    }
});


module.exports = Component;