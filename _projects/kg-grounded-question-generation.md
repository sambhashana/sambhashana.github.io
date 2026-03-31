---
layout: page
title: KG-Grounded QA for Sanskrit
description: Question generation and QA dataset construction from Sanskrit and Ayurveda knowledge graphs
img:
importance: 6
category: research
tags: [Knowledge Graphs, Sanskrit, Ayurveda]
related_publications: false
---

Building question answering resources from classical Indian knowledge, grounded in an annotated Sanskrit and Ayurveda knowledge graph. The project has two components.

**Question Generation** develops an automated pipeline that transforms verified knowledge graph triples into natural, domain-faithful Hindi questions for learning, retrieval, and assessment. The work explored LLM-based approaches with ontology-aware prompting before converging on template-based generation for better grammatical precision and terminology preservation.

**QA Dataset Construction** builds a structured question-answer dataset from *Bhavaprakasha Nighantu*, preserving domain-critical terminology (*Rasa*, *Guna*, *Virya*, *Vipaka*) so the resulting dataset is faithful to the source material and useful for downstream NLP and educational applications.

Future directions include multi-hop question generation over the graph and tighter integration with graph-based retrieval.

**Team:** Triyansh Agrawal, Mudit Guraria
