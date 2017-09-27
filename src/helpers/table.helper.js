//Authenticate Router
//Username and Password Login

//imports
var jwt = require('jsonwebtoken'),
Table = require('../models/table.schema.js');



//var jwt = require('jsonwebtoken');
//var tokenService = require('bleuapp-token-service').createTokenHandler('service.token', '50051');

var table = {};

table.getAll = function(call, callback){
  //protected route so verify token;
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback({message:err},null);
    }
    Table.find({ owner: token.sub}, function(err, resultTables){
      if(err){
        console.log(err);
        return callback({message:'err'}, null);
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
      console.log(err);
      return callback({message:'err'}, null);
    }

    if(table){
      console.log(table);
      var formatted = {};
      formatted._id = table._id.toString();
      formatted.name = table.name;
      formatted.owner = table.owner;
      return callback(null, formatted);
    }else{
      return callback({message:'Table could not be found'},null);
    }
  })
}

table.create = function(call, callback){
  //validation handled by database
  var newTable = new Table(call.request);
  newTable.save(function(err, result){
    if(err){
      console.log(err);
      return callback({message:'err'},null);
    }
    return callback(null, {_id: result._id.toString()});
  });
}

table.update = function(call, callback){
  jwt.verify(call.metadata.get('authorization')[0], process.env.JWT_SECRET, function(err, token){
    if(err){
      return callback({message:err},null);
    }

    Table.findOneAndUpdate({ _id: call.request._id}, call.request, function(err, tableReply){
      if(err){
        console.log(err);
        return callback({message:'err'}, null);
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
      return callback({message:err},null);
    }
console.log(call.request._id);
    Table.findByIdAndRemove(call.request._id, function(err, tableReply){
      if(err){
        console.log(err);

        return callback({message:'err'}, null);
      }

      return callback(null, {});
    })
  });
}

table.getOwner = function(call, callback){
  Table.findById(call.request._id, function(err, table){
    if(err){return callback(err, null)}
    callback(null,{_id:table.owner})
  });
}


module.exports = table;
