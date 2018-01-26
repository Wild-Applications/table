//Authenticate Router
//Username and Password Login

//imports
var jwt = require('jsonwebtoken'),
Table = require('../models/table.schema.js'),
errors = require('../errors/errors.json');



//var jwt = require('jsonwebtoken');
//var tokenService = require('bleuapp-token-service').createTokenHandler('service.token', '50051');

var table = {};

table.getAll = function(call, callback){
  //protected route so verify token;
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback(errors['0001'],null);
    }
    Table.find({owner: token.sub}, function(err, resultTables){
      if(err){
        return callback(errors['0003'], null);
      }

      var results = [];
      resultTables.forEach(function(table){
        var formatted = {};
        formatted._id = table._id.toString();
        formatted.name = table.name;
        results[results.length] = formatted;
      });

      return callback(null, results);
    })
  });
}

table.get = function(call, callback){
  Table.findOne({_id: call.request._id}, function(err, table){
    if(err){
      return callback(errors['0003'], null);
    }

    if(table){
      var formatted = {};
      formatted._id = table._id.toString();
      formatted.name = table.name;
      formatted.owner = table.owner;
      return callback(null, formatted);
    }else{
      return callback(errors['0007'],null);
    }
  })
}

table.create = function(call, callback){
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback(errors['0001'],null);
    }
    //validation handled by database
    call.request.owner = token.sub;
    var newTable = new Table(call.request);
    newTable.save(function(err, result){
      if(err){
        return callback(errors['0004'],null);
      }
      return callback(null, {_id: result._id.toString()});
    });
  });
}

table.update = function(call, callback){
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback(errors['0001'],null);
    }

    Table.findOneAndUpdate({ _id: call.request._id}, call.request, function(err, tableReply){
      if(err){
        console.log(err);
        return callback(errors['0005'], null);
      }
      var tableToReturn = {};
      tableToReturn._id = tableReply._id.toString();
      return callback(null, tableToReturn);
    })
  });
}

table.delete = function(call, callback){
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback(errors['0001'],null);
    }
    Table.findByIdAndRemove(call.request._id, function(err, tableReply){
      if(err){
        return callback(errors['0006'], null);
      }

      return callback(null, {});
    })
  });
}

table.getOwner = function(call, callback){
  Table.findById(call.request._id, function(err, table){
    if(err){return callback(errors['0003'], null)}
    callback(null,{_id:table.owner})
  });
}


module.exports = table;
