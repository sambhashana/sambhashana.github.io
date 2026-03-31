---
layout: page
title: team
permalink: /team/
description: The people behind the research.
nav: true
nav_order: 3
---

<style>
  .team-section { margin-bottom: 2.8rem; }

  .team-section-title {
    font-size: 1.35rem;
    font-weight: 600;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.45rem;
    margin-bottom: 1.2rem;
  }

  .team-grid-1col { display: flex; flex-direction: column; gap: 1rem; }
  .team-grid-2col {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  @media (max-width: 768px) {
    .team-grid-2col { grid-template-columns: 1fr; }
  }

  .team-card {
    display: flex;
    align-items: flex-start;
    gap: 1.1rem;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 1.1rem 1.2rem;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s ease;
  }
  .team-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.09); }

  .team-card img {
    width: 90px;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .team-card-body { flex: 1; min-width: 0; }

  .team-card-body h4 {
    font-size: 1.05rem;
    font-weight: 600;
    margin: 0 0 0.15rem 0;
  }

  .team-card-role {
    font-size: 0.85rem;
    font-weight: 400;
    opacity: 0.65;
    margin: 0 0 0.1rem 0;
  }

  .team-card-meta {
    font-size: 0.82rem;
    opacity: 0.5;
    margin: 0 0 0.3rem 0;
  }

  .team-card-project {
    font-size: 0.82rem;
    opacity: 0.55;
    margin: 0;
    font-weight: 400;
  }

  .team-card-links {
    margin-top: 0.4rem;
    font-size: 1.5rem;
  }

  .team-card-links a {
    margin-right: 0.25rem;
    opacity: 0.75;
  }

  .team-card-links a:hover { opacity: 1; }
</style>

<!-- FACULTY -->
<div class="team-section">
  <div class="team-section-title">Faculty</div>
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
  <div class="team-section-title">PhD Students</div>
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
  <div class="team-section-title">Master Students</div>
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
  <div class="team-section-title">Undergraduate Students</div>
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
  <div class="team-section-title">Interns</div>
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
  <div class="team-section-title">Former Members</div>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.88rem;">
    <thead>
      <tr style="border-bottom: 1px solid #ddd;">
        <th style="text-align: left; padding: 0.3rem 0.6rem 0.3rem 0;">Name</th>
        <th style="text-align: left; padding: 0.3rem 0.6rem;">Programme</th>
        <th style="text-align: left; padding: 0.3rem 0 0.3rem 0.6rem;">Period</th>
      </tr>
    </thead>
    <tbody>
      {% for member in site.data.team.past %}
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 0.3rem 0.6rem 0.3rem 0;">
          {% if member.website and member.website != "" %}
            <a href="{{ member.website }}" target="_blank">{{ member.name }}</a>
          {% else %}
            {{ member.name }}
          {% endif %}
        </td>
        <td style="padding: 0.3rem 0.6rem; opacity: 0.65;">{{ member.programme }}</td>
        <td style="padding: 0.3rem 0 0.3rem 0.6rem; opacity: 0.5;">{{ member.period }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
{% endif %}

<script src="{{ '/assets/js/gravatar.js' | relative_url }}"></script>
