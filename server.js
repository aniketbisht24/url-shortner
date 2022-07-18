const express= require('express');
const mongoonse = require('mongoose');
const ShortUrl = require('./modals/shortUrl')

const app = express();

const uri = "mongodb+srv://aniketbisht98:aniketbisht98@url-shortner.lbrxk.mongodb.net/?retryWrites=true&w=majority"

mongoonse.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then((result) => console.log("connected"
)).catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}))

app.listen(process.env.PORT || 8000);

app.get('/', async(req, res) => {
    const response = await ShortUrl.find();
    res.render('index', {shortUrls: response});

    // res.render('index', {shortUrls});
})

app.get('/:shortUrl', async (req, res) => {

    const {params: {shortUrl: requestUrl}} = requestUrl;

    const shortUrl = await ShortUrl.findOne({
        short: requestUrl
    })
    
    if (shortUrl == null){
        return res.sendStatus(404);
    }
    shortUrl.clicks++;
    shortUrl.save();

    res.redirect(shortUrl.full);
})
app.post('/shortUrls', async(req, res) => {
    const {body: {fullUrl}} = req;

    await ShortUrl.create({
        full: fullUrl
    })
    
    res.redirect('/');
})

