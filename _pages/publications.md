---
layout: page
permalink: /publications/
title: publications
description: Research publications by Hrishikesh Terdalkar and the Saṁbhāṣaṇa Research Group.


nav: true
nav_order: 1
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<div class="publications">

{% bibliography --query @*[group_work=true]* --group_by year --group_order descending %}

<div class="prior-work-divider">
  <span>Prior Work</span>
</div>

{% bibliography --query @*[group_work!=true]* --group_by year --group_order descending %}

</div>
