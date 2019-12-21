import App from "./app.js";

export default class Page {
    constructor() {
        this.searchInput = document.getElementById("q");
        this.search_hint = document.getElementById("search_hint");
        this.cityName    = document.getElementById("city_name");
        this.listTab     = document.getElementById("list_tab");
        this.tabContent  = document.getElementById("tab_content");
        this.listDays    = document.getElementById("list_days");
        this.failed      = document.getElementById("failed");
        // this.lang         = document.getElementById('lang');
        this.app         = new App(this);
        this.data        = [];
    }

    removeLoaders() {
        let loaders = document.querySelectorAll(".loader");
        loaders.forEach(value => {
            value.remove();
        });
        this.searchInput.readOnly = false;
    }

    eventListeners() {
        this.searchInput.addEventListener("focus", () => {
            this.search_hint.classList.add("d-none");
        });
        this.searchInput.addEventListener("blur", () => {
            this.search_hint.classList.remove("d-none");
        });
        document.addEventListener("keydown", e => {
            if (this.searchInput === document.activeElement) {
                if (e.which === 27) {
                    e.preventDefault();
                    this.searchInput.blur();
                }
            }
        });
        document.addEventListener("keypress", e => {
            if (!(this.searchInput === document.activeElement)) {
                if (e.which === 47) {
                    e.preventDefault();
                    this.searchInput.focus();
                }
            }
        });

        let self = this;

        $.get("js/cities.json", function (data) {
            self.data = data;
            self.size = data.length;
            $("#q").typeahead({
                source: data,
                items: 5,
                menu: "<ul class=\"typeahead dropdown-menu\" role=\"listbox\"></ul>",
                item: "<li><a class=\"dropdown-item\" href=\"#\" role=\"option\"></a></li>",
                headerHtml: "<li class=\"dropdown-header\"></li>",
                headerDivider: "<li class=\"divider\" role=\"separator\"></li>",
                itemContentSelector: "a",
                minLength: 3
            });
        }, "json");

        let q           = $("#q");
        let currentCity = "";

        $(q).on("change", function (e) {
            if (e.target.value === currentCity || e.target.value === "") {
                return false;
            } else {
                currentCity = e.target.value;
                let latitude, longitude;

                for (let i = 0; i < self.size; i++) {
                    if (self.data[i].name === currentCity) {
                        latitude  = self.data[i].lat;
                        longitude = self.data[i].lng;
                        break;
                    }
                }
                if (longitude !== null && latitude !== null)
                    self.app.start(undefined, {latitude: latitude, longitude: longitude});
            }
        });

        // $(q).on("autocomplete.select", function (e, item) {
        //     console.log("autocomplete.select");
        //     console.log(e);
        //     console.log(item);
        // });
        //
        // $(q).on("autocomplete.freevalue", function (e, value) {
        //     console.log("autocomplete.freevalue");
        //     console.log(e);
        //     console.log(value);
        // });

        // let link           = new URL(window.location.href).searchParams.get('lang');
        // let {value, param} = link === 'ar' ? {value: 'English', param: "?lang=en"} : {value: 'عربي', param:
        // "?lang=ar"}; this.lang.innerText = value; this.lang.setAttribute('href', param);

        navigator.geolocation.getCurrentPosition(function (position) {
            self.app.start(position);
        }, function (error) {
            self.app.catch(error);
        });
    }
}