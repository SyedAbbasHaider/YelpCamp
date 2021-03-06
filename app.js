const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const app = express();
const port = 3000;
const path = require('path');
const ejsMate = require('ejs-mate');
const { urlencoded } = require('express');


//Connecting to the locally hosted database, name of the db is yelp-camp
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database Connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


//to parse req.body 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

//home 
app.get('/', (req, res) => {
    res.render('home')
});

//show all camps on browser
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})  //redering means showing result on browser
});


//takes you to the new form
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})


//add a new campground
app.post('/campgrounds', async (req, res) => {
    //res.send(req.body)
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`) 
})


//in order to find info of single campground
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id)    //passing id using req.params.id
    res.render('campgrounds/show', {campground})
});


app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) =>{
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${(campground)._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(port, () => {
    console.log(`server running on port ${port}!`);
});