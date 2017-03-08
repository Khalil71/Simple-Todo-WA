var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to the DB

mongoose.connect('mongodb://test:test@ds123370.mlab.com:23370/todo');

//create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

//create the model
var Todo = mongoose.model('Todo', todoSchema);
//adding one item in the DB (test)
/*var itemOne = Todo({item: 'buy flowers'}).save(function(err){
  if(err) throw err;
  console.log('item saved');
});*/


//var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'win cup'}]
var urlencodedParser = bodyParser.urlencoded({ extended: false })

module.exports = function(app){

app.get('/todo', function(req, res){
  //get data from mongodb and pass it to the view
  Todo.find({}, function(err, data){
    if(err) throw err;
    res.render('todo', {todos: data});
  });
});

app.post('/todo', urlencodedParser, function(req, res){
  //get data from the view and add it to mongodb
  var newTodo = Todo(req.body).save(function(err, data){
    if(err) throw err;
    res.json(data);
  })
});

app.delete('/todo/:item', function(req, res){
  //delete the requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
    if(err) throw err;
    res.json(data);
  });
  /*data = data.filter(function(todo){
    return todo.item.replace(/ /g, '-') !== req.params.item;
  });
  res.json(data);
  */
});
};
