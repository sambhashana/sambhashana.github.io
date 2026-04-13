(function () {
  "use strict";

  function initTagFilter() {
    var filterBar = document.getElementById("project-tag-filter");
    var container = document.getElementById("projects-container");
    if (!filterBar || !container) return;

    // Collect all unique tags from project cards
    var cards = container.querySelectorAll(".project-card-wrapper[data-tags]");
    var tagSet = new Set();
    cards.forEach(function (card) {
      var raw = card.getAttribute("data-tags") || "";
      raw.split(",").forEach(function (t) {
        var tag = t.trim();
        if (tag) tagSet.add(tag);
      });
    });

    // Sort tags alphabetically and build buttons
    var tags = Array.from(tagSet).sort();
    tags.forEach(function (tag) {
      var btn = document.createElement("button");
      btn.className = "btn btn-sm tag-filter-btn";
      btn.setAttribute("data-tag", tag);
      btn.textContent = tag;
      filterBar.appendChild(btn);
    });

    // Filter logic
    function applyFilter(activeTag) {
      cards.forEach(function (card) {
        var cardTags = (card.getAttribute("data-tags") || "").split(",").map(function (t) { return t.trim(); });
        var show = activeTag === "all" || cardTags.indexOf(activeTag) !== -1;
        card.style.display = show ? "" : "none";
      });

      // Hide category headings when all cards in that section are hidden
      var rows = container.querySelectorAll(".row.row-cols-1");
      rows.forEach(function (row) {
        var heading = row.previousElementSibling;
        var visible = Array.from(row.querySelectorAll(".project-card-wrapper")).some(function (c) {
          return c.style.display !== "none";
        });
        if (heading && (heading.tagName === "H2")) {
          heading.style.display = visible ? "" : "none";
        }
      });
    }

    // Button click handler
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".tag-filter-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".tag-filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-tag"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTagFilter);
  } else {
    initTagFilter();
  }
})();
