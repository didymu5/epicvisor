var sequelize = require('..//models').sequelize;
var Session = require('../models/sessions');
var moment = require('moment');
return Session.update(
	{ status: 'expired'},
     {
     	where: {
     		status: 'pending',
            createdAt: {
            	$lte: moment().add(-2, 'days').toDate()
            }
     	}
     }
	)