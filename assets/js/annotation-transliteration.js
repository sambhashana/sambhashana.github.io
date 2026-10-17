(() => {
  const dataUrl = document.currentScript.dataset.isoUrl;
  let dataPromise;

  const cards = new Map(
    [...document.querySelectorAll(".page-annotation section[lang]")].map((card) => [card.lang, card])
  );
  const languageLinks = document.querySelectorAll(".annotation-languages a");

  function selectLanguage(language) {
    if (!cards.has(language)) language = "en";
    cards.forEach((card, code) => { card.hidden = code !== language; });
    languageLinks.forEach((link) => {
      if (link.hash === `#${language}`) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  languageLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", link.hash);
      selectLanguage(link.hash.slice(1));
    });
  });
  window.addEventListener("hashchange", () => selectLanguage(location.hash.slice(1)));
  selectLanguage(location.hash.slice(1));

  function loadData() {
    if (!dataPromise) {
      dataPromise = fetch(dataUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Could not load ISO transliterations");
          return response.json();
        })
        .catch((error) => { dataPromise = undefined; throw error; });
    }
    return dataPromise;
  }

  document.querySelectorAll('.page-annotation section[lang]:not([lang="en"])').forEach((card) => {
    const language = card.lang;
    const originals = [];
    const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      if (walker.currentNode.textContent.trim()) {
        originals.push({ node: walker.currentNode, text: walker.currentNode.textContent });
      }
    }
    const button = document.createElement("button");
    button.type = "button";
    button.className = "transliteration-toggle";
    button.textContent = "ISO";
    button.title = "Show ISO 15919 transliteration";
    button.setAttribute("aria-label", button.title);
    button.setAttribute("aria-pressed", "false");
    card.prepend(button);
    let converted;
    let active = false;

    button.addEventListener("click", async () => {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      try {
        if (!active && !converted) {
          const data = await loadData();
          converted = originals.map(({ text }) => {
            const iso = data[language]?.[text.trim()];
            if (typeof iso !== "string") throw new Error(`Missing ISO text for ${language}; regenerate annotation-iso.json`);
            return text.replace(text.trim(), () => iso);
          });
        }
        active = !active;
        originals.forEach(({ node, text }, index) => { node.textContent = active ? converted[index] : text; });
        card.lang = active ? `${language}-Latn` : language;
        button.textContent = active ? "Original" : "ISO";
        button.setAttribute("aria-pressed", String(active));
        button.title = active ? "Show original script" : "Show ISO 15919 transliteration";
        button.setAttribute("aria-label", button.title);
      } catch (error) {
        button.textContent = "Retry ISO";
        button.title = "Transliteration is unavailable. Click to retry.";
        button.setAttribute("aria-label", button.title);
        console.error("Annotation transliteration failed:", error);
      } finally {
        button.disabled = false;
        button.removeAttribute("aria-busy");
      }
    });
  });
})();
