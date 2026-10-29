"use strict";

// Update the footer year automatically.
document.getElementById("year").textContent = new Date().getFullYear();

// Dark/light theme toggle.
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

try {
  if (localStorage.getItem("portfolio-theme") === "light") {
    root.dataset.theme = "light";
  }
} catch (error) {
  // Theme switching still works if browser storage is unavailable.
}

function updateThemeButton() {
  const isLight = root.dataset.theme === "light";
  themeToggle.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme",
  );
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
  const isLight = root.dataset.theme !== "light";

  if (isLight) {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }

  try {
    localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  } catch (error) {
    // Continue without saving the preference.
  }

  updateThemeButton();
});

// Mobile navigation menu.
const menuToggle = document.getElementById("menuToggle");
const navlinks = document.getElementById("navlinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navlinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

navlinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navlinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

// Reveal content when sections enter the screen.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Mouse-controlled 3D effect on the hero illustration.
const artScene = document.getElementById("artScene");

if (window.matchMedia("(pointer: fine)").matches) {
  artScene.addEventListener("mousemove", (event) => {
    const rect = artScene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    artScene.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg)`;
  });

  artScene.addEventListener("mouseleave", () => {
    artScene.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

// Rotate the short description beside the hero heading.
const typedRole = document.getElementById("typedRole");
const roles = [
  "digital experiences.",
  "AI-powered ideas.",
  "creative web apps.",
  "data-driven solutions.",
];

let roleIndex = 0;

if (typedRole) {
  window.setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;

    typedRole.animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(7px)" },
      ],
      { duration: 180, fill: "forwards" },
    ).onfinish = () => {
      typedRole.textContent = roles[roleIndex];

      typedRole.animate(
        [
          { opacity: 0, transform: "translateY(-7px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 250, fill: "forwards" },
      );
    };
  }, 2600);
}

// Show the back-to-top button after scrolling.
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 500);
});

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Contact form: prepares an email in the visitor's email application.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const message = String(formData.get("message")).trim();

  if (message.length < 10) {
    formStatus.textContent = "Please enter at least 10 characters.";
    return;
  }

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\n${message}`,
  );

  formStatus.textContent = "Opening your email application…";

  window.location.href = `mailto:baranis2772007@gmail.com?subject=${subject}&body=${body}`;
});
