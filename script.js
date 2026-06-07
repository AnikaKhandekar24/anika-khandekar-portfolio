const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
const webLiftModal = document.querySelector("#weblift-contact-modal");
const webLiftForm = document.querySelector(".weblift-contact-form");
const webLiftFormStatus = document.querySelector(".weblift-form-status");
const openWebLiftModalButton = document.querySelector("[data-open-weblift-contact]");
const closeWebLiftModalButtons = document.querySelectorAll("[data-close-weblift-contact]");

// FormSubmit delivers WebLift inquiries to this address without exposing service keys.
// Change the email in this endpoint if the receiving address changes.
const WEBLIFT_FORM_ENDPOINT = "https://formsubmit.co/ajax/khandekar.anika24@gmail.com";

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

siteNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thank you. This form is ready to connect to an email or form service.";
    contactForm.reset();
  });
}

if (webLiftModal && webLiftForm && webLiftFormStatus && openWebLiftModalButton) {
  const closeWebLiftModal = () => {
    document.body.classList.remove("modal-open");
    webLiftModal.close();
  };

  openWebLiftModalButton.addEventListener("click", () => {
    webLiftFormStatus.textContent = "";
    webLiftFormStatus.classList.remove("error");
    webLiftModal.showModal();
    document.body.classList.add("modal-open");
  });

  closeWebLiftModalButtons.forEach((button) => {
    button.addEventListener("click", closeWebLiftModal);
  });

  webLiftModal.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
  });

  webLiftModal.addEventListener("click", (event) => {
    if (event.target === webLiftModal) {
      closeWebLiftModal();
    }
  });

  webLiftForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!webLiftForm.checkValidity()) {
      webLiftForm.reportValidity();
      return;
    }

    const submitButton = webLiftForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    webLiftFormStatus.textContent = "";
    webLiftFormStatus.classList.remove("error");

    try {
      const formData = new FormData(webLiftForm);
      const response = await fetch(WEBLIFT_FORM_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      webLiftForm.reset();
      webLiftFormStatus.textContent = "Thank you! I'll get back to you soon.";
    } catch (error) {
      webLiftFormStatus.textContent = "Sorry, your message could not be sent. Please try again or email me directly.";
      webLiftFormStatus.classList.add("error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}
