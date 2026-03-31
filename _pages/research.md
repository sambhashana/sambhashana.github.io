---
layout: page
title: research
permalink: /research/
description: research projects and software tools developed by the group
nav: true
nav_order: 3
display_categories: [funded, research, past, tools]
horizontal: false
published: true
page_class: page-research
---

Our work spans Natural Language Processing, Knowledge Graphs, Information Retrieval, and Computational Linguistics — with a focus on Indian and low-resource languages. For a broader picture of research directions and student opportunities, see our <a href="/assets/pdf/interests.pdf" target="_blank" class="research-interests-link"><i class="fa-solid fa-file-pdf"></i>research interests</a>.

<!-- pages/research.md -->
<div class="projects">
{% if site.enable_project_categories and page.display_categories %}
  <!-- Display categorized projects -->
  {% for category in page.display_categories %}
  {% assign categorized_projects = site.projects | where: "category", category %}
  {% if categorized_projects.size > 0 %}
  <h2 id="{{ category }}" class="category">
    <a href="#{{ category }}">{{ category }}</a>
  </h2>
  {% assign sorted_projects = categorized_projects | sort: "importance" %}
  <!-- Generate cards for each project -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display projects without categories -->

{% assign sorted_projects = site.projects | sort: "importance" %}

  <!-- Generate cards for each project -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for project in sorted_projects %}
      {% include projects_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
