const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const dayData = require(__dirname +'/date.js');
const _ = require("lodash");


const app = express();
app.set('view engine' , 'ejs')

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Mongoose Conncetion
mongoose.connect("mongodb+srv://nagalakshmibutti:Test-123@cluster0.uzldl.mongodb.net/todolistDB",{useNewUrlParser:true, useUnifiedTopology: true});

//Creating New schema

const itemSchema= {
    name : String
}

//Connecting Table to DataBase

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name:"Hello welcome"
});

const item2 = new Item({
    name:"Let's start"
});
const item3 = new Item({
    name:"Add the items"
});

const defaultItemList = [item1,item2,item3];


//Creating DataBase for CustomLists
const listSchema = {
    name:String,
    listName:[itemSchema]
}
//Creating Table for CustomLists
const List = mongoose.model("List",listSchema);

//Localhost:3000
app.get("/" , function(req,res){
    //let day = dayData();
    //Accessing database items
        Item.find({}, function(err, foundItems){
            if (foundItems.length === 0){
                Item.insertMany(defaultItemList, function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Succesfully added");
                    }
                });
                res.redirect("/");
        }else{
                 res.render("list", {listName:"Today", NewItem:foundItems});
            }
    });
});
//Desgining Customized List
app.get("/:customListName", function(req,res){
    const customListName =_.capitalize(req.params.customListName);
    console.log(customListName);
    //Checking requested param existing or not 
    List.findOne({name:customListName}, function(err , foundListName){
        if(!err){
            if(!foundListName){
                //Creating DataBase for the customList
                        const list = new List({
                        name : customListName,
                        listName : defaultItemList
                        });
                list.save();
                res.redirect("/"+ customListName);
            }else{
                //Show Existing List
            res.render("list",{listName:foundListName.name, NewItem:foundListName.listName});
            }
        }
    });
});
//Deleting Item which are Added in Mongo Dabase
app.post("/delete", function(req,res){
    const CheckedItem = req.body.checkBox;
    const ListName = req.body.listName;
    if(ListName === "Today"){
        Item.findByIdAndRemove(CheckedItem,function(err){
            if(!err){
                console.log("Successfully Deleted From" + Listname);
                res.redirect("/");
            }
            else{
                console.log(err)
            }
        });
    }else(
        List.findOneAndUpdate({name: ListName},{$pull: {listName: {_id: CheckedItem}}}, function(err, foundList){
            if(!err){
                res.redirect("/"+ ListName);
                console.log("Successfully Deleted From" + ListName);
            }
            else{
               console.log(err) 
            }
        })
    )
   
});
// Form 
app.post("/",function(req,res){
   const  itemName = req.body.NewItem;
   const ReqlistName = req.body.list;
   const item = new Item(
       {
           name: itemName
       }
   );
   if(ReqlistName  === "Today"){
    item.save();
    res.redirect("/");
   }else{
       List.findOne({name: ReqlistName}, function(err , foundList){
           //console.log(foundList);
           foundList.listName.push(item);
           foundList.save();
           res.redirect("/" + ReqlistName )
       });
   }
  
});

let port = process.env.PORT;
if (port == null || port == ""){
    port = 3000;
}

app.listen(port, function(){
 console.log("server has started on port 3000");
});