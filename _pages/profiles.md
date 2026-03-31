---
layout: page
title: team
permalink: /team/
description: the people behind the research
nav: true
nav_order: 2
page_class: page-team
---

<!-- FACULTY -->
<div class="team-section">
  <div class="team-section-title">faculty</div>
  <div class="team-grid-1col">
    {% for member in site.data.team.faculty %}
    <div class="team-card">
      <img src="https://placehold.co/200x200"
           {% if member.email and member.email != "" %}data-gravatar="{{ member.email | md5 }}"{% endif %}
           alt="{{ member.name }}">
      <div class="team-card-body">
        <h4>
          {% if member.website and member.website != "" %}
            <a href="{{ member.website }}" target="_blank">{{ member.name }}</a>
          {% else %}
            {{ member.name }}
          {% endif %}
        </h4>
        {% if member.role %}<p class="team-card-role">{{ member.role }}</p>{% endif %}
        {% if member.description %}<p class="team-card-project">{{ member.description }}</p>{% endif %}
        <div class="team-card-links">
          {% if member.scholar and member.scholar != "" %}
            <a href="https://scholar.google.com/citations?user={{ member.scholar }}" target="_blank"><i class="ai ai-google-scholar"></i></a>
          {% endif %}
          {% if member.orcid and member.orcid != "" %}
            <a href="https://orcid.org/{{ member.orcid }}" target="_blank"><i class="ai ai-orcid"></i></a>
          {% endif %}
          {% if member.linkedin and member.linkedin != "" %}
            <a href="https://linkedin.com/in/{{ member.linkedin }}" target="_blank"><i class="fab fa-linkedin"></i></a>
          {% endif %}
          {% if member.github and member.github != "" %}
            <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
          {% endif %}
          {% if member.email and member.email != "" %}
            <a href="mailto:{{ member.email }}"><i class="fas fa-envelope"></i></a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<!-- PHD STUDENTS -->
<div class="team-section">
  <div class="team-section-title">phd students</div>
  <div class="team-grid-2col">
    {% for member in site.data.team.phd %}
    <div class="team-card">
      <img src="https://placehold.co/200x200"
           {% if member.email and member.email != "" %}data-gravatar="{{ member.email | md5 }}"{% endif %}
           alt="{{ member.name }}">
      <div class="team-card-body">
        <h4>{{ member.name }}</h4>
        {% if member.project %}
          <p class="team-card-project">
            {%- assign _proj = site.projects | where: "title", member.project | first -%}
            {%- if _proj -%}<a href="{{ _proj.url | relative_url }}">{{ member.project }}</a>{%- else -%}{{ member.project }}{%- endif -%}
          </p>
        {% endif %}
        <div class="team-card-links">
          {% if member.github and member.github != "" %}
            <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<!-- MASTER STUDENTS -->
{% if site.data.team.masters %}
<div class="team-section">
  <div class="team-section-title">masters students</div>
  <div class="team-grid-2col">
    {% for member in site.data.team.masters %}
    <div class="team-card">
      <img src="https://placehold.co/200x200"
           {% if member.email and member.email != "" %}data-gravatar="{{ member.email | md5 }}"{% endif %}
           alt="{{ member.name }}">
      <div class="team-card-body">
        <h4>{{ member.name }}</h4>
        {% if member.project %}
          <p class="team-card-project">
            {%- assign _proj = site.projects | where: "title", member.project | first -%}
            {%- if _proj -%}<a href="{{ _proj.url | relative_url }}">{{ member.project }}</a>{%- else -%}{{ member.project }}{%- endif -%}
          </p>
        {% endif %}
        <div class="team-card-links">
          {% if member.github and member.github != "" %}
            <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% endif %}

<!-- UNDERGRADUATE STUDENTS -->
<div class="team-section">
  <div class="team-section-title">undergraduate students</div>
  <div class="team-grid-2col">
    {% for member in site.data.team.students %}
    <div class="team-card">
      <img src="https://placehold.co/200x200"
           {% if member.email and member.email != "" %}data-gravatar="{{ member.email | md5 }}"{% endif %}
           alt="{{ member.name }}">
      <div class="team-card-body">
        <h4>{{ member.name }}</h4>
        {% if member.role %}<p class="team-card-role">{{ member.role }}</p>{% endif %}
        {% if member.batch or member.programme %}
          <p class="team-card-meta">
            {% if member.batch %}
              {%- assign site_month = site.time | date: '%-m' | plus: 0 -%}
              {%- if site_month >= 7 -%}
                {%- assign acad_start = site.time | date: '%Y' | plus: 0 -%}
              {%- else -%}
                {%- assign acad_start = site.time | date: '%Y' | minus: 1 -%}
              {%- endif -%}
              {%- assign yr = acad_start | minus: member.batch | plus: 1 -%}
              {%- if yr == 1 -%}1st Year
              {%- elsif yr == 2 -%}2nd Year
              {%- elsif yr == 3 -%}3rd Year
              {%- else -%}{{ yr }}th Year
              {%- endif -%}
            {% endif %}
            {% if member.batch and member.programme and member.programme != "" %} · {% endif %}
            {% if member.programme and member.programme != "" %}{{ member.programme }}{% endif %}
          </p>
        {% endif %}
        {% if member.project %}
          <p class="team-card-project">
            {%- assign _proj = site.projects | where: "title", member.project | first -%}
            {%- if _proj -%}<a href="{{ _proj.url | relative_url }}">{{ member.project }}</a>{%- else -%}{{ member.project }}{%- endif -%}
          </p>
        {% endif %}
        <div class="team-card-links">
          {% if member.github and member.github != "" %}
            <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>

<!-- INTERNS -->
{% if site.data.team.interns %}
<div class="team-section">
  <div class="team-section-title">interns</div>
  <div class="team-grid-2col">
    {% for member in site.data.team.interns %}
    <div class="team-card">
      <img src="https://placehold.co/200x200"
           {% if member.email and member.email != "" %}data-gravatar="{{ member.email | md5 }}"{% endif %}
           alt="{{ member.name }}">
      <div class="team-card-body">
        <h4>{{ member.name }}</h4>
        {% if member.affiliation %}
          <p class="team-card-role">{{ member.affiliation }}</p>
        {% endif %}
        {% if member.year or member.programme %}
          <p class="team-card-meta">
            {%- if member.year -%}
              {%- if member.year == 1 -%}1st Year
              {%- elsif member.year == 2 -%}2nd Year
              {%- elsif member.year == 3 -%}3rd Year
              {%- else -%}{{ member.year }}th Year
              {%- endif -%}
            {%- endif -%}
            {%- if member.year and member.programme %} · {% endif -%}
            {%- if member.programme %}{{ member.programme }}{%- endif -%}
          </p>
        {% endif %}
        {% if member.project %}
          <p class="team-card-project">
            {%- assign _proj = site.projects | where: "title", member.project | first -%}
            {%- if _proj -%}<a href="{{ _proj.url | relative_url }}">{{ member.project }}</a>{%- else -%}{{ member.project }}{%- endif -%}
          </p>
        {% endif %}
        <div class="team-card-links">
          {% if member.github and member.github != "" %}
            <a href="https://github.com/{{ member.github }}" target="_blank"><i class="fab fa-github"></i></a>
          {% endif %}
        </div>
      </div>
    </div>
    {% endfor %}
  </div>
</div>
{% endif %}

<!-- FORMER MEMBERS -->
{% if site.data.team.past %}
<div class="team-section">
  <div class="team-section-title">former members</div>
  <table class="former-members-table">
    <thead>
      <tr class="former-members-head-row">
        <th class="former-members-name-head">name</th>
        <th class="former-members-programme-head">programme</th>
        <th class="former-members-period-head">period</th>
      </tr>
    </thead>
    <tbody>
      {% for member in site.data.team.past %}
      <tr class="former-members-row">
        <td class="former-members-name">
          {% if member.website and member.website != "" %}
            <a href="{{ member.website }}" target="_blank">{{ member.name }}</a>
          {% else %}
            {{ member.name }}
          {% endif %}
        </td>
        <td class="former-members-programme">{{ member.programme }}</td>
        <td class="former-members-period">{{ member.period }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% endif %}

<script src="{{ '/assets/js/gravatar.js' | relative_url }}"></script>
