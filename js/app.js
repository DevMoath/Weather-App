export default class App {
    constructor(page) {
        this.page  = page;
        this.icons = [];
    }

    renderHourlyData(data, currentDayWithHour, timezone) {
        this.page.tabContent.innerHTML = "";
        this.icons                     = [];
        for (let i = 0; i < data.length; i++) {
            let {time, temperature, summary, icon} = data[i];
            let day                                = moment.unix(time).tz(timezone).format("Do MMMM");
            let hour                               = moment.unix(time).tz(timezone).format("ha");
            let dayWithHour                        = moment.unix(time).tz(timezone).format("MMMM-Do-ha");

            let isActive = dayWithHour === currentDayWithHour ? "show active" : "";

            this.page.listTab.innerHTML += `
                <a class="btn text-dark rounded px-2 py-1 mx-1 ${isActive}" data-toggle="list" href="#${dayWithHour}">${hour}</a>`;

            this.page.tabContent.innerHTML += `
                <div class="tab-pane fade ${isActive}" id="${dayWithHour}">
                    <h2 class="text-center font-weight-bold">${day}</h2>
                    <h2 class="text-center mt-3">${summary}</h2>
                    <div class="position-relative">
                        <h1 class="text-center my-3">
                            <span class="temperature">${parseInt(temperature, 10)}</span>
                            <sup>&deg;</sup>
                        </h1>
                        <canvas class="mx-auto position-absolute ${icon}" width="180" height="180"></canvas>
                    </div>
                </div>`;
            this.icons.push(icon);
        }
    }

    renderDailyData(data, currentDay, timezone) {
        this.page.listDays.innerHTML = "";
        for (let i = 0; i < data.length; i++) {
            let {time, temperatureLow, temperatureHigh} = data[i];
            let day                                     = moment.unix(time).tz(timezone).format("dddd");
            let dayNumber                               = moment.unix(time).tz(timezone).format("Do MMMM");

            let element = document.createElement("li");
            element.classList.add("list-group-item", "text-dark", "bg-transparent", "border-0", "d-flex", "justify-content-between", "align-items-center", "py-2", "px-0", "mx-2");

            let isActive = currentDay === dayNumber ? "active" : "";

            element.innerHTML = `
                <span class="${isActive} rounded px-2">${day}</span>
                <span>
                    <i class="fas fa-caret-down text-primary"></i>
                    ${parseInt(temperatureLow, 10)}<sup>&deg;</sup>
                    <i class="fas fa-caret-up ml-3 text-danger"></i>
                    ${parseInt(temperatureHigh, 10)}<sup>&deg;</sup> 
                </span>
`;
            this.page.listDays.appendChild(element);
        }
    }

    renderIcons() {
        let skyCons = new Skycons({"color": "BLACK"});
        let set     = [...new Set(this.icons)];
        for (let i = 0; i < set.length; i++) {
            let elements = document.querySelectorAll(`.${set[i]}`);
            for (let j = 0; j < elements.length; j++) {
                skyCons.set(elements[j], set[i]);
            }
        }
        skyCons.play();
    }

    start(position, points) {
        let latitude, longitude;
        if (position) {
            latitude  = position.coords.latitude;
            longitude = position.coords.longitude;
        } else if (points) {
            latitude  = points.latitude;
            longitude = points.longitude;
        } else {
            latitude  = "24.7135517";
            longitude = "46.6752957";
        }

        const proxy = "https://cors-anywhere.herokuapp.com/";
        // let link    = new URL(window.location.href).searchParams.get('lang');
        let api_url = `${proxy}https://api.darksky.net/forecast/d657d01c54738e0edde2c8d212bbf6fc/${latitude},${longitude}`;

        let self = this;

        fetch(api_url)
            .then(response => response.json())
            .then(json => {
                let timezone           = json.timezone;
                let currentTime        = json.currently.time;
                let hourlyData         = json.hourly.data;
                let dailyData          = json.daily.data;
                let currentDay         = moment.unix(currentTime).tz(timezone).format("Do MMMM");
                let currentDayWithHour = moment.unix(currentTime).tz(timezone).format("MMMM-Do-ha");

                self.page.cityName.innerText = timezone.replace("_", " ");

                self.renderDailyData(dailyData, currentDay, timezone);
                self.renderHourlyData(hourlyData, currentDayWithHour, timezone);
                self.renderIcons();
                self.page.removeLoaders();
            })
            .catch(error => {console.error(error);});
    }

    catch(error) {
        this.page.failed.classList.add("show");
        this.start();
    }
}