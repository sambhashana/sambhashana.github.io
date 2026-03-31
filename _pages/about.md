---
layout: page
title: about
permalink: /
nav: false
nav_order: 1
---

<style>
    .news-sidebar .news-title {
        color: #1C789B !important;
        text-decoration: none;
    }

    .news-sidebar .news-title:hover {
        color: #155d79 !important;
        text-decoration: underline;
    }
</style>

<div class="row">
    <div class="col-sm-8">
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
            <img src="{{ '/assets/img/logo.color.notext.svg' | relative_url }}" alt="Sambhashana Logo" style="height: 64px; width: auto;">
            <h1 style="margin: 0; font-size: 1.75rem;">Saṁbhāṣaṇa Research Group</h1>
        </div>
        <p>Headed by <a href="https://hrishikeshrt.github.io" target="_blank"><strong>Hrishikesh Terdalkar</strong></a></p>

        <p>
            We work on natural language processing and computational linguistics, with a focus on
            <strong>Indian languages</strong> — classical and low-resource languages. Our work spans
            building datasets, tools, and evaluation frameworks that are grounded in real linguistic
            structure.
        </p>

        <p>Active research areas include:</p>
        <ul>
            <li>Large language models — evaluation, explainability, and hallucination mitigation</li>
            <li>Knowledge graphs — construction, repair, and question answering</li>
            <li>Computational linguistics for Indian languages</li>
            <li>Information retrieval, RAG, and GraphRAG</li>
            <li>Creative text generation in Indian languages</li>
            <li>NLP-oriented tool building and agentic systems</li>
            <li>Sanskrit and classical language computing</li>
        </ul>

        <div class="mt-4">
            <div id="groupPhotoCarousel" class="carousel slide rounded z-depth-1" data-ride="carousel">
                <div class="carousel-inner rounded">
                    <div class="carousel-item active">
                        <img src="{{ '/assets/img/group/group_photo_2.jpg' | relative_url }}" class="d-block w-100" alt="Group Photo" style="object-fit: cover; max-height: 380px;">
                    </div>
                    <div class="carousel-item">
                        <img src="{{ '/assets/img/group/group_photo.jpg' | relative_url }}" class="d-block w-100" alt="Group Photo" style="object-fit: cover; max-height: 380px;">
                    </div>
                </div>
                <a class="carousel-control-prev" href="#groupPhotoCarousel" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#groupPhotoCarousel" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>
            <p class="caption mt-1">The group at BITS Pilani, Hyderabad Campus.</p>
        </div>

        <h3>Selected Publications</h3>
        <div class="publications">
            {% bibliography --query @*[featured=true]* %}
        </div>
        <p>See our <a href="{{ '/publications/' | relative_url }}">full list of publications</a>.</p>
        </div>

    <div class="col-sm-4">
        <h3 style="color: var(--global-theme-color);">News</h3>
        <div class="news-sidebar">
            {% if site.news != blank -%}
                {%- assign news = site.news | reverse -%}
                {% for item in news limit:6 %}
                    <div class="news-item mb-3">
                        <div style="font-size: 0.9rem; color: #888;">
                            {{ item.date | date: "%b %d, %Y" }}
                        </div>
                        <div style="font-weight: 500;">
                           {% if item.inline -%}
                              {{ item.content | remove: '<p>' | remove: '</p>' | emojify }}
                           {%- else -%}
                              <a class="news-title" href="{{ item.url | relative_url }}">{{ item.title }}</a>
                           {%- endif %}
                        </div>
                    </div>
                {% endfor %}
            {%- else -%}
                <p>No news so far...</p>
            {%- endif %}
        </div>
        <a href="{{ '/news/' | relative_url }}" style="font-size: 0.85rem;">See all news →</a>

        <div class="mt-5 p-3 rounded" style="background-color: #f8f9fa; border: 1px solid #ddd;">
            <h5>Join the Team!</h5>
            <p class="small">We are looking for motivated PhD, Master, and undergraduate students.</p>
            <a href="{{ '/join/' | relative_url }}" class="btn btn-sm btn-outline-primary">More Info</a>
        </div>
    </div>
</div>
