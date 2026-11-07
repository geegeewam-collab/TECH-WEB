(() => {
  "use strict";
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = form.querySelector('input[name="email"]');
      const honey = form.querySelector('input[name="website"]');
      const response = form.parentElement.querySelector("[data-newsletter-response]");
      const button = form.querySelector('button[type="submit"]');
      if (!email || !response || !button) return;
      if (!email.checkValidity()) {
        email.reportValidity();
        return;
      }
      const original = button.innerHTML;
      button.disabled = true;
      button.textContent = "Adding you…";
      response.textContent = "";
      try {
        const result = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.value.trim(), website: honey ? honey.value : "" })
        });
        const payload = await result.json().catch(() => ({}));
        if (!result.ok) throw new Error(payload.message || "We couldn't add you just now. Please try again.");
        response.textContent = payload.message || "You're on the list. Thanks for being here.";
        form.reset();
      } catch (error) {
        response.textContent = error.message || "Something went wrong. Please try again.";
      } finally {
        button.disabled = false;
        button.innerHTML = original;
      }
    });
  });
})();
