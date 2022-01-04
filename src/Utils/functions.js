const request = require('postman-request')

const Weather = {
    base_url : 'http://api.weatherstack.com/',
    base_url_mapbox : 'https://api.mapbox.com/geocoding/v5/mapbox.places',
    api_access_key : '3b58303cb39832848b1971e5b9735198',
    api_access_key_mapbox : 'pk.eyJ1IjoicGFydmVzaDg2IiwiYSI6ImNreHVqZnRmMDFubTIydW12Y3RpZGZ0Z3QifQ.nGwqn1RCxH0cYSFFA4hhrg',
    default_location:'Nakodar',
    default_units:'m',
    init : (location_name=null) => 
    {
        Weather.default_location = (location_name) ? location_name : Weather.default_location; 
        // console.log(Weather.default_location);
        Weather.fetchLatLong(Weather.default_location,(location) => {
            console.log(location);
            Weather.fetchCurrentWeather(location)
        })
    },
    fetchCurrentWeather : ({ name,lat,long },callback_function) => {

        let url = `${Weather.base_url}current?access_key=${Weather.api_access_key}&query=${name}&lat=${lat}&long=${long}&units=${Weather.default_units}`
        request({
            url:url,
            json:true
        },(error,response) => 
        {
            if(!error)
            {
                if(!response.body.error){
                    const {temperature,feelslike} = response.body.current 
                    callback_function(null,{ 
                        status:true,
                        forecast:`Its currently ${temperature} degrees out there in ${name}.\n But It Feels like ${feelslike} degrees .`, 
                        place: name
                    }) 
                }else{
                    callback_function({
                        status:false,
                        message:response.body.error.info
                    },null)
                }
            }else{
                callback_function({
                    status:false,
                    message:error
                },null)
                
            }
        })
    },
    fetchLatLong :  (place,callback_function) => {

        let fetch_url = `${Weather.base_url_mapbox}/${encodeURIComponent(place)}.json?access_token=${Weather.api_access_key_mapbox}`
        
        request({
            url:fetch_url,
            json:true
        },(error,response) => 
        {
            if(!error){
                let current_response = response.body.features
                if(current_response.length > 0 )
                {
                    let location = {
                        name: current_response[0].place_name,
                        lat :current_response[0].center[1],
                        long : current_response[0].center[0]
                    }
                    callback_function(null,location)
                }else{
                    callback_function({
                        status:false,
                        message:'No location found. Please try with another search.'
                    },null)
                }
            }else{
                callback_function(error,null)
            }
        })
    
    }
}


module.exports = Weather