class UI {
    constructor() {
        this.temperature_degree = document.getElementById('temperature_degree');
        this.temperature_unit = document.getElementById('temperature_unit');
        this.change_unit_button = document.getElementById('change_unit_button');
        this.PERMISSION_DENIED = document.getElementById('PERMISSION_DENIED');
        this.POSITION_UNAVAILABLE = document.getElementById('POSITION_UNAVAILABLE');
        this.TIMEOUT = document.getElementById('TIMEOUT');
        this.UNKNOWN_ERROR = document.getElementById('UNKNOWN_ERROR');
    }

    change_unit() {
        if(this.temperature_unit.innerText === 'C') {
            let toFahrenheit = (this.temperature_degree.innerText * 9/5) + 32;
            this.temperature_degree.innerText = parseInt(toFahrenheit, 10);
            this.temperature_unit.innerText = 'F';
        } else {
            let toCelsius = (this.temperature_degree.innerText - 32) * 5/9;
            this.temperature_degree.innerText = parseInt(toCelsius, 10);
            this.temperature_unit.innerText = 'C';
        }
    }

    start(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        const proxy = 'https://cors-anywhere.herokuapp.com/';
        let api_url;
        if(window.location.href.includes('AR')) {
            api_url = `${proxy}https://api.darksky.net/forecast/d657d01c54738e0edde2c8d212bbf6fc/${latitude},${longitude}?lang=ar`;
        } else {
            api_url = `${proxy}https://api.darksky.net/forecast/d657d01c54738e0edde2c8d212bbf6fc/${latitude},${longitude}`;
        }

        fetch(api_url)
            .then(response => response.json())
            .then(json => {
                const timezone = json.timezone;
                const {icon, summary, temperature} = json.currently;

                let city_name = document.getElementById('city_name');
                let temperature_degree = document.getElementById('temperature_degree');
                let weather_summary = document.getElementById('weather_summary');
                let page_loader = document.getElementById('page_loader');
                let page_content = document.getElementById('page_content');
                let icon_canvas = document.getElementById("icon");

                city_name.innerText = timezone.split('/')[1];
                temperature_degree.innerText = parseInt(temperature, 10);
                weather_summary.innerText = summary;

                let sky_cons = new Skycons({"color": "lightblue"});
                // you can add a canvas by it's ID...
                sky_cons.add(icon_canvas, icon);
                // start animation!
                sky_cons.play();

                page_loader.classList.add('d-none');
                page_content.classList.remove('d-none');
            })
            .catch(function(error) {
                console.log(error);
                document.getElementById('page_loader').classList.add('d-none');
                document.getElementById('UNKNOWN_ERROR').classList.remove('d-none');
            });
    }

    catch(error) {
        document.getElementById('page_loader').classList.add('d-none');
        switch(error.code) {
            case error.PERMISSION_DENIED:
                document.getElementById('PERMISSION_DENIED').classList.remove('d-none');
                break;
            case error.POSITION_UNAVAILABLE:
                document.getElementById('POSITION_UNAVAILABLE').classList.remove('d-none');
                break;
            case error.TIMEOUT:
                document.getElementById('TIMEOUT').classList.remove('d-none');
                break;
            case error.UNKNOWN_ERROR:
                document.getElementById('UNKNOWN_ERROR').classList.remove('d-none');
                break;
        }
    }
}

window.onload = function () {
    const ui = new UI();
    ui.change_unit_button.addEventListener('click', function () {
       ui.change_unit();
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    navigator.geolocation.getCurrentPosition(ui.start, ui.catch);
};