const jwt = require("jsonwebtoken");
const Idea = require('../models/idea.model');

module.exports = {

viewIdeas: (req, res) => {
    Idea.find()
    .populate("createdBy", "userName userEmail")
        .then((viewIdeas) => {
            res.json(viewIdeas)
            console.log("All great ideas!")
        })
        .catch((err) => {
            res.json(err)
            console.log("Something went wrong getting all ideas")
        });
},

createIdea: (req, res) => {

    const newIdeaObject = new Idea(req.body)

    const decodeJWT = jwt.decode(req.cookies.userToken, {
        complete: true
    })

    newIdeaObject.createdBy = decodeJWT.payload.id;

    newIdeaObject.save()
        .then((createIdea) => {
            res.json(createIdea);
            console.log("You created a post!")
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
            console.log('Something went wrong during creating the post');
        })
},

findIdeasByUser: (req, res) => {
    //confirm user is logged in
    if(req.jwtPayload.userName !==  req.params.userName){
        console.log("invalid user")
        User.findOne({userName: req.params.userName})
        .then((userNotLoggedIn)=> {
            Idea.find({createdBy: userNotLoggedIn._id})
                .populate("createdBy", "userName")
                .then((allIdeasFromUser) => {
                    console.log(allIdeasFromUser)
                    res.json(allIdeasFromUser)
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json(err)
            console.log("test")
        })
    }  else {
        console.log("user")
        console.log("req.jwtPayload.id:", req.jwtPayload.id)
        
        Idea.find({createdBy: req.jwtPayload.id})
            .populate("createdBy", "userName")
            .then((allIdeasFromUser) => {
                console.log(allIdeasFromUser)
                res.json(allIdeasFromUser)
                console.log("all ideas?")
            })
        .catch((err) => {
            console.log(err)
            res.status(400).json(err)
        })
    }
},

getLoggedInUser: (req, res)=>{

    // const decodedJWT = jwt.decode(req.cookies.usertoken,{
    //     complete: true
    // })

    User.findOne({_id: req.jwtpayload.id})
        .then((user)=>{
            console.log(user);
            res.json(user)
        })
        .catch((err)=>{
            console.log(err);
        })

},


deleteIdea: (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
    .then((deletedIdea) => {
        res.json(deletedIdea)
        console.log("Successfully deleted pet")
    })
        .catch((err) => {
            res.json(err)
            console.log("Did not Delete pet")
        })
    },

    updateIdea: (req, res) => {
        Idea.findOneAndUpdate({ _id: req.params.id },
            req.body,
            // { new: true, runValidators: true }
            )
            .then((updateIdea) => {
                res.json(updateIdea);
                console.log(updateIdea);
                console.log("Successfully updated pet")
            })
            .catch((err) => {
                console.log('Something went wrong during updateIdea');
                console.log(err);
                res.status(400).json(err);
            })
        }

}