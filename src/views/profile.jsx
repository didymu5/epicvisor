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
                            return <li>
                            <ul>
                            <li>{user.first_name} {user.last_name}</li>
                            <li>{user.public_url}</li>
                            <li>{user.summary}</li>
                            <li>{user.email_address}</li>
                            <li>{user.headline}</li>
                            <li>{user.industry}</li>
                            </ul>
                            </li>
                        } )}
                    </ul>
                </body>
            </html>
        );
    }
});


module.exports = Component;