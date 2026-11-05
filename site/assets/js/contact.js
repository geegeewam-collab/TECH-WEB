(() => {
  "use strict";
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const response = document.querySelector("[data-form-response]");
  const config = window.GG_SITE_CONFIG || {};
  const submitButton = form.querySelector('button[type="submit"]');
  let lastDraft = "";

  const showResponse = (message, includeCopy = false) => {
    if (!response) return;
    response.replaceChildren();
    const text = document.createElement("span");
    text.textContent = message;
    response.appendChild(text);
    if (includeCopy) {
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.textContent = "Copy enquiry";
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(lastDraft);
          copyButton.textContent = "Copied";
        } catch {
          copyButton.textContent = "Select and copy the text below";
          const draft = document.createElement("textarea");
          draft.value = lastDraft;
          draft.readOnly = true;
          draft.style.cssText = "display:block;width:100%;min-height:120px;margin-top:12px;padding:10px;border:1px solid rgba(255,255,255,.2);border-radius:8px;background:#08090a;color:#fff";
          response.appendChild(draft);
          draft.focus();
          draft.select();
        }
      });
      response.appendChild(copyButton);
    }
    response.classList.add("is-visible");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const fields = [
      ["Name", data.get("name")],
      ["Email", data.get("email")],
      ["Company", data.get("company") || "Not provided"],
      ["Service", data.get("service")],
      ["Budget range", data.get("budget") || "Not specified"],
      ["Project details", data.get("message")]
    ];
    lastDraft = `GEEGEE TECH — PROJECT ENQUIRY\n\n${fields.map(([label, value]) => `${label}:\n${String(value || "").trim()}`).join("\n\n")}`;

    submitButton.disabled = true;
    submitButton.textContent = "Preparing enquiry…";

    try {
      if (config.formEndpoint && /^https:\/\//i.test(config.formEndpoint)) {
        const payload = Object.fromEntries(data.entries());
        const result = await fetch(config.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!result.ok) throw new Error("The form service did not accept the enquiry.");
        showResponse("Your enquiry has been submitted. The GEEGEE TECH team can follow up using the email you provided.");
        form.reset();
      } else if (config.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail)) {
        const subject = encodeURIComponent(`Project enquiry — ${data.get("name")}`);
        const body = encodeURIComponent(lastDraft);
        window.location.href = `mailto:${encodeURIComponent(config.contactEmail)}?subject=${subject}&body=${body}`;
        showResponse("Your email app should open with the enquiry prepared. Send the message there to complete the request.", true);
      } else {
        showResponse("The enquiry is ready, but the business email has not been configured yet. Add it in assets/js/config.js, or copy the enquiry and send it through your preferred channel.", true);
      }
    } catch (error) {
      showResponse(`${error.message || "The enquiry could not be sent."} Your details are preserved below so you can copy them and try another channel.`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Prepare enquiry <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>';
    }
  });
})();
