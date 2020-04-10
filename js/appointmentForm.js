import { Navbar } from "../components/navbar/script.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";

const navOps = new Navbar();
setCartItemsCount();

class AppointmentFormUI {
    //get data about doctors
    async getData() {
        try {
            let responseDoctors = await fetch("../data/doctors.json", {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            let responseCountries = await fetch(
                "https://restcountries-v1.p.rapidapi.com/all", {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
                        "x-rapidapi-key": "f004cb53d4msh23a56366c5d1ab5p13f806jsn495f5fe7cbfa",
                    },
                }
            );

            if (responseDoctors.ok) {
                this.services = await responseDoctors.json();
            } else {
                throw new Error("Failed to fetch data about doctors");
            }

            if (responseCountries.ok) {
                this.countries = await responseCountries.json();
            } else {
                throw new Error("Failed to fetch data about countries");
            }
        } catch (err) {
            console.log(err);
        }
    }

    constructor() {
        this.getData().then(() => {
            console.log(this.countries);

            this.initializeSelectItems();
            this.initializeCountries();
        });
    }

    initializeSelectItems() {
        let select = document.querySelector("select#reqDoctor");

        this.services.forEach((service) => {
            service.doctors.forEach((doctor) => {
                let option = document.createElement("option");
                option.setAttribute(
                    "value",
                    `${String(doctor.name).split(" ")[0]}-${
            String(doctor.name).split(" ")[1]
          }-${doctor.function}`
                );

                option.textContent = `${String(doctor.name)}, ${doctor.function} `;
                select.appendChild(option);

                option.dataset.serviceName = String(service.serviceName)
                    .toLowerCase()
                    .replace(/ /g, "-");
            });
        });
        // console.log(this.doctors.doctors);
    }

    initializeCountries() {
        let select = document.querySelector("select#originCountry");

        this.countries.forEach((country) => {
            let option = document.createElement("option");
            option.value = country.name;
            option.textContent = country.name + "/ " + country.nativeName;

            select.appendChild(option);
        });
    }
}

const UI = new AppointmentFormUI();

let select = document.querySelector("select#reqService");
select.addEventListener("change", (event) => {
    let serviceId = event.currentTarget.value;
    let reqServiceDiv = document.querySelector(
        `.left div[data-service="${serviceId}"]`
    );
    console.log(serviceId);

    let otherServiceDivs = document.querySelectorAll(".left div[data-service]");

    // for (let div of otherServiceDivs) {
    //     if (div !== reqServiceDiv) {
    //         div.classList.remove("focused");
    //         console.log(div);
    //     }
    // }

    removeClassOnElementExcept(reqServiceDiv, "focused", otherServiceDivs);

    //we filter the doctors that correspond to the clicked div service
    let doctorOptions = document
        .querySelectorAll("select#reqDoctor option")
        .forEach((option) => {
            if (option.dataset.serviceName !== serviceId) {
                option.style.display = "none";
            } else {
                option.style.display = "block";
            }
        });

    reqServiceDiv.classList.add("focused");
});

let serviceDivs = document.querySelectorAll(".left div[data-service]");
serviceDivs.forEach((item) => {
    item.addEventListener("click", (event) => {
        //set the service in the input field, corresponding to the clicked div
        let service = event.currentTarget.dataset.service;

        let serviceSelect = document.querySelector("#reqService");
        serviceSelect.value = service;

        let reqOption = document.querySelector(
            `#reqDoctor option[data-service-name="${service}"]`
        );

        let otherServiceDivs = document.querySelectorAll(".left div[data-service]");
        event.currentTarget.classList.add("focused");

        // for (let div of otherServiceDivs) {
        //     if (div !== event.currentTarget) {
        //         div.classList.remove("focused");
        //         console.log(div);
        //     }
        // }

        removeClassOnElementExcept(
            event.currentTarget,
            "focused",
            otherServiceDivs
        );

        //we filter the doctors that correspond to the clicked div service
        let doctorOptions = document
            .querySelectorAll("select#reqDoctor option")
            .forEach((option) => {
                if (option.dataset.serviceName !== service) {
                    option.style.display = "none";
                } else {
                    option.style.display = "block";
                }
            });
    });
});

// ************
function removeClassOnElementExcept(
    elementToExcept,
    className = "",
    elementsToEvaluate = []
) {
    for (let el of elementsToEvaluate) {
        if (el !== elementToExcept) {
            el.classList.remove(String(className).toLowerCase().trim());
        }
    }
}