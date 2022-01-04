const WEATHER = {
    base_url:window.location.origin,
    init: () => {
        console.log(WEATHER.base_url);
    },
    fetchWeather:(address_value,callback_function) => 
    {
        fetch(`${WEATHER.base_url}/fetch-weather?address=${address_value}`)
        .then(res => res.json())
        .then((response) => {
            callback_function(response)
        })
    }
}

const weather_form  = document.querySelector('form')
const input = document.querySelector('input')

weather_form.addEventListener('submit', (e) => {
    e.preventDefault()
    if(!input.value){
        document.getElementById('location').classList.add('invalid-error')
        document.getElementById('location_error').classList.add('invalid-feedback');
        document.getElementById('location_error').innerHTML = 'Please provide location name.'
        return 
    }else{
        document.getElementById('location').classList.remove('invalid-error')
        document.getElementById('location_error').classList.remove('invalid-feedback')
        document.getElementById('location_error').innerHTML = ''
    }
    
    document.getElementById('success_message').innerHTML = 'Loading.....'
    
    WEATHER.fetchWeather(input.value,(response) => {
        
        document.getElementById('form_error').style.display = 'none'
        if (response.status) {
            console.log(response);
            let html = `
                <p>
                    <span>${response.forecast}</span>
                </p>
            `
            document.getElementById('success_message').innerHTML = html
        }else{
            document.getElementById('success_message').innerHTML = ''
            document.getElementById('form_error').style.display = 'block'
            document.getElementById('form_error').innerHTML = response.message
        }
    })
})