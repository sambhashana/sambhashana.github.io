---
layout: page
title: join us
permalink: /join/
description: Interested in working with us?
nav: true
nav_order: 5
---


We are always looking for motivated students to join the Saṁbhāṣaṇa Research Group. We work on NLP, computational linguistics, knowledge graphs, and AI — with a focus on Indian and low-resource languages.

## Open Positions

**PhD Students** — We accept PhD students through the BITS Pilani admissions process. If you are interested in working with us, please apply through the official BITS PhD admissions portal and mention our group in your statement of purpose.

**Master Students** — BITS Master students interested in dissertation or project work with our group are welcome to reach out after reviewing our ongoing projects.

**Student Researchers** — BITS undergraduate and postgraduate students can join as student researchers (typically semester-long or year-long engagements). We expect a genuine interest in research and the ability to commit time consistently.

**Interns** — Students from other institutions interested in a research internship are also welcome to apply through the same process below.

## Research Areas

We are currently active in the following areas. Before applying, please go through the [[ research ]](/research/) page — familiarise yourself with our ongoing projects and identify areas that interest you.

- Large language models — evaluation, benchmarking, fine-tuning, explainability, and hallucination mitigation
- Knowledge graphs — construction, repair, and knowledge-graph-based question answering
- Computational linguistics for Indian languages — parsing, NER, GEC, and related tasks
- Information retrieval, RAG, and GraphRAG
- Creative text generation — poetry and constrained generation in Indian languages
- NLP-oriented tool building — annotation tools, agentic systems, and Python libraries

## What is Expected

- Curiosity and initiative — you should be able to read papers and ask questions independently
- Regular attendance at group meetings
- Clean, documented code and reproducible experiments
- Honest communication about progress and blockers

We also welcome students who come with their own ideas. If you have a research question or project in mind that aligns with our areas, feel free to propose it in your application.

## How to Apply

**Please read this page in full before applying.**

There are two steps — both are required:

**Step 1.** Fill out the application form:

<a href="https://forms.gle/PNtcR6qZGBPEKzYs6" target="_blank" class="btn btn-secondary rounded">
  <i class="fa-solid fa-arrow-up-right-from-square"></i> Fill out the Application Form
</a>

**Step 2.** Send an email to <a href="mailto:hrishikesh.rt@hyderabad.bits-pilani.ac.in">hrishikesh.rt@hyderabad.bits-pilani.ac.in</a> with:
- Subject: `[Application] <Your Name>`
- A brief note on why you want to work with us and which project area interests you
- Your CV attached

Please complete both steps, lest your application be overlooked.

## Group Community

The group uses a Discord server for day-to-day communication, announcements, and discussions. Accepted members will be added to the server.

<div id="discord-card" style="
  display: inline-flex; flex-direction: column; gap: 12px;
  background: #313338; color: #dbdee1; border-radius: 10px;
  padding: 16px 20px; width: 300px; font-family: sans-serif; font-size: 14px;
">
  <div style="display: flex; align-items: center; gap: 10px;">
    <img src="/assets/img/logo.color.notext.svg" alt="Saṁbhāṣaṇa" style="width:48px;height:48px;border-radius:50%;background:#fff;padding:4px;object-fit:contain;" />
    <div>
      <div style="font-weight: 700; font-size: 15px; color: #f2f3f5;">Saṁbhāṣaṇa</div>
      <div style="font-size: 12px; color: #949ba4;">Private Group Server</div>
    </div>
  </div>
  <div id="discord-members" style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <span style="font-size: 12px; color: #949ba4;">Loading members…</span>
  </div>
</div>

<script>
fetch('https://discord.com/api/guilds/1405232555443097733/widget.json')
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var container = document.getElementById('discord-members');
    var avatars = data.members.map(function(m) {
      return '<img src="' + m.avatar_url + '" title="' + m.username + '" style="width:32px;height:32px;border-radius:50%;border:2px solid #3b3d44;" />';
    }).join('');
    var count = '<span style="font-size:12px;color:#23a55a;font-weight:600;">● ' + data.presence_count + ' online</span>';
    container.innerHTML = '<div style="display:flex;gap:4px;align-items:center;">' + avatars + '</div>' + count;
  })
  .catch(function() {
    document.getElementById('discord-members').innerHTML = '<span style="font-size:12px;color:#949ba4;">Members online</span>';
  });
</script>
