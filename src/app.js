const path = require('path')
const express = require('express')
const hbs = require('hbs')

const {fetchLatLong,fetchCurrentWeather} = require('./Utils/functions.js')

const app = express()

const port = 3000

const publicDirectory = path.join(__dirname,'../public')

const partialsPath = path.join(__dirname,'../templates/partials')
const viewsPath = path.join(__dirname,'../templates/views')

app.use(express.static(publicDirectory))

// Set Up Handle bars for Views
app.set('view engine','hbs')
app.set('views',viewsPath)
// Set up Handle bars for Partials
hbs.registerPartials(partialsPath)


app.get('', (req, res) => {
    res.render('index',{
        title:'Home Page',
        data:'This is Some Dynamic Data'
    });
})

app.get('/help', (req, res) => {
    res.render('help',{
        title:'Help Page'
    });
})

app.get('/weather', (req, res) => {
    res.render('weather',{
        title:'Weather'
    })    
})

app.get('/fetch-weather', (req, res) => {
    if(!req.query.address)
    {
        return res.send({
            status:false,
            error:'Address Field is missing',
            errorMessage:'Address is Required to fetch The Weather'
        });
    }
    
    fetchLatLong(req.query.address,(error, location) => {
        if(!error)
        {
            fetchCurrentWeather(location,(error, response) => {
                if(!error){
                    return res.send(response)
                }else{
                    return res.send(error)
                }
            })
        }else{
            res.send(error)
        }
    })

})



app.get('*', (req,res) => {
    res.render('404',{
        title:'404 Page',
        errorMessage:'Page Not Found'
    })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})