/**
 * Gravatar image loader.
 * For each <img data-gravatar="..."> on the page, uses the pre-computed MD5
 * hash (generated at build time by Jekyll) to set the Gravatar image src.
 * Falls back to the mystery-person silhouette if no Gravatar is registered.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img[data-gravatar]').forEach(function (img) {
      var hash = (img.dataset.gravatar || '').trim();
      if (hash) {
        img.src = 'https://www.gravatar.com/avatar/' + hash + '?s=200&d=mp';
      }
    });
  });
})();
