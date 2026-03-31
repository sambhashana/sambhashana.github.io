---
layout: page
title: about
permalink: /
nav: false
nav_order: 1
hide_page_header: true
page_class: page-about
---

<div class="row">
    <div class="col-sm-8">
        <div class="about-hero">
            <img src="{{ '/assets/img/logo.color.notext.svg' | relative_url }}" alt="Sambhashana Logo" class="about-hero-logo">
            <h1 class="about-hero-title">saṁbhāṣaṇa research group</h1>
        </div>
        <p class="text-muted">headed by <a href="https://hrishikeshrt.github.io" target="_blank"><strong>Hrishikesh Terdalkar</strong></a></p>

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
                        <img src="{{ '/assets/img/group/group_photo_2.jpg' | relative_url }}" class="d-block w-100 about-carousel-image" alt="Group Photo">
                    </div>
                    <div class="carousel-item">
                        <img src="{{ '/assets/img/group/group_photo.jpg' | relative_url }}" class="d-block w-100 about-carousel-image" alt="Group Photo">
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

        <h2>selected publications</h2>
        <hr>
        <div class="publications publications-wide">
            {% bibliography --group_by none --query @*[selected=true]* %}
        </div>
        <p>see our <a href="{{ '/publications/' | relative_url }}">full list of publications</a>.</p>
    </div>

    <div class="col-sm-4">
        <h2 class="about-news-heading">news</h2>
        <div class="news-sidebar">
            {% if site.news != blank -%}
                {%- assign news = site.news | reverse -%}
                {% for item in news limit:6 %}
                    <div class="news-item mb-3">
                        <div class="about-news-date">
                            {{ item.date | date: "%b %d, %Y" }}
                        </div>
                        <div class="about-news-title">
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
        <a href="{{ '/news/' | relative_url }}" class="about-news-link">see all news →</a>

        <div class="mt-5 p-3 rounded about-join-card">
            <h4>join the team!</h4>
            <p class="small">We are looking for motivated PhD, Master, and undergraduate students.</p>
            <a href="{{ '/join/' | relative_url }}" class="btn btn-sm btn-outline-sambhashana-blue">More Info</a>
        </div>
    </div>
</div>
