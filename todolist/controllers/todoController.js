var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//Connect to database
mongoose.connect('mongodb://Angellllok:SS123asdAS@ds147534.mlab.com:47534/mytodo');

//Create a schema
var todoSchema = new mongoose.Schema({
  item:String
})

var Todo = mongoose.model('Todo', todoSchema);
//var itemOne = Todo({item: 'buy flowers'}).save(function(err){
//  if (err) throw err;
//  console.log('item saved');
//});
//var data = [{item: 'take a snack'}, {item: 'read a book'}, {item: 'play game'}];
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app) {

app.get('/', function(req, res){
  //get data from mongodb
  Todo.find({}, function(err, data){
    if (err) throw err;
    res.render('todo', {todos: data});
  });
});

app.get('/todo',function(req,res){
  Todo.find({}).then(function(todo){
    res.send(todo);
  });
});
//GET object from FROM DB
app.get('/todo/:id',function(req,res){
  Todo.findById({_id: req.params.id}, req.body).then(function(todo){
    Todo.findOne({_id: req.params.id}).then(function(todo){
        res.send(todo);
    });
  });
});
//UPDATE A LIST FROM DB
app.put('/todo/:id',function(req,res,next){
  Todo.findByIdAndUpdate({_id: req.params.id}, req.body).then(function(){
    Todo.findOne({_id: req.params.id}).then(function(todo){
        res.send(todo);
    });
  });
});
app.post('/todo', urlencodedParser, function(req, res){
  //get data from the view and add it to mongodb
  var newTodo = Todo(req.body).save(function(err,data){
    if (err) throw err;
    res.json(data);
  });
});

app.delete('/todo/:item', function(req, res){
  //delete requested item from mongodb
  Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err,data){
    if (err) throw err;
    res.json(data);
  });
  });
  
};
