const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});
const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

if (localStorage.getItem("theme") === "dark") {
    htmlElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {
    if (htmlElement.getAttribute("data-theme") === "dark") {
        htmlElement.removeAttribute("data-theme");
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    } else {
        htmlElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    }
});
function showError(inputId, errorId, message) {
    document.getElementById(inputId).classList.add("input-error");
    document.getElementById(errorId).textContent = "❌ " + message;
}
function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove("input-error");
    document.getElementById(errorId).textContent = "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email);
}

const reservationForm = document.getElementById("reservationForm");

if (reservationForm) {
    reservationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;
        const guests = document.getElementById("guests").value;

        if (name === "") {
            showError("name", "nameError", "Please enter your name.");
            isValid = false;
        } else {
            clearError("name", "nameError");
        }

        if (!isValidEmail(email)) {
            showError("email", "emailError", "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError("email", "emailError");
        }

        if (phone.length < 7) {
            showError("phone", "phoneError", "Please enter a valid phone number.");
            isValid = false;
        } else {
            clearError("phone", "phoneError");
        }

        if (date === "") {
            showError("date", "dateError", "Please select a date.");
            isValid = false;
        } else {
            clearError("date", "dateError");
        }

        if (time === "") {
            showError("time", "timeError", "Please select a time.");
            isValid = false;
        } else {
            clearError("time", "timeError");
        }

        if (guests === "") {
            showError("guests", "guestsError", "Please select number of guests.");
            isValid = false;
        } else {
            clearError("guests", "guestsError");
        }

               if (isValid) {
            const reservationData = {
                name: name,
                email: email,
                phone: phone,
                date: date,
                time: time,
                guests: guests,
                message: document.getElementById("message").value.trim()
            };

            fetch("http://localhost:3000/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservationData)
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                   document.getElementById("reservationSuccess").textContent =
    "✅ Your reservation request has been received!";
                    reservationForm.reset();
                })
                .catch(function (error) {
                    document.getElementById("reservationSuccess").textContent =
                        "Something went wrong. Please try again.";
                    console.log(error);
                });
        } else {
            document.getElementById("reservationSuccess").textContent = "";
        }
    });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        const cname = document.getElementById("cname").value.trim();
        const cemail = document.getElementById("cemail").value.trim();
        const csubject = document.getElementById("csubject").value.trim();
        const cmessage = document.getElementById("cmessage").value.trim();

        if (cname === "") {
            showError("cname", "cnameError", "Please enter your name.");
            isValid = false;
        } else {
            clearError("cname", "cnameError");
        }

        if (!isValidEmail(cemail)) {
            showError("cemail", "cemailError", "Please enter a valid email address.");
            isValid = false;
        } else {
            clearError("cemail", "cemailError");
        }

        if (csubject === "") {
            showError("csubject", "csubjectError", "Please enter a subject.");
            isValid = false;
        } else {
            clearError("csubject", "csubjectError");
        }

        if (cmessage === "") {
            showError("cmessage", "cmessageError", "Please enter your message.");
            isValid = false;
        } else {
            clearError("cmessage", "cmessageError");
        }

               if (isValid) {
            const contactData = {
                name: cname,
                email: cemail,
                subject: csubject,
                message: cmessage
            };

            fetch("http://localhost:3000/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(contactData)
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    document.getElementById("contactSuccess").textContent =
    "✅ Your message has been sent successfully!";
                    contactForm.reset();
                })
                .catch(function (error) {
                    document.getElementById("contactSuccess").textContent =
                        "Something went wrong. Please try again.";
                    console.log(error);
                });
        } else {
            document.getElementById("contactSuccess").textContent = "";
        }
    });
}
const menuContainer = document.getElementById("menuContainer");

if (menuContainer) {
    fetch("http://localhost:3000/api/menu")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let html = "";

            data.forEach(function (category) {
                html += `<div class="menu-category">`;
                html += `<h2>${category.category}</h2>`;

                category.items.forEach(function (item) {
                    html += `
                        <div class="menu-item">
                            <div class="menu-item-info">
                                <h3>${item.name}</h3>
                                <p>${item.description}</p>
                            </div>
                            <span class="menu-price">$${item.price.toFixed(2)}</span>
                        </div>
                    `;
                });

                html += `</div>`;
            });

            menuContainer.innerHTML = html;
        })
        .catch(function (error) {
            menuContainer.innerHTML = "<p>Unable to load menu right now.</p>";
            console.log(error);
        });
}
function resetToEnglish() {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
        select.value = "en";
        select.dispatchEvent(new Event("change"));
    }
}
const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
const animatedSections = document.querySelectorAll(
    ".about-preview, .featured-dishes, .testimonials, .cta, .menu-category, .about-content, .about-values, .contact-wrapper"
);

const observer = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
            }
        });
    },
    { threshold: 0.15 }
);

animatedSections.forEach(function (section) {
    section.classList.add("scroll-fade");
    observer.observe(section);
});
const siteHeader = document.querySelector("header");

if (siteHeader) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    });
}
