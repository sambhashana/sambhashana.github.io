---
layout: page
title: Domain-specific Knowledge Graph Construction
description: Automated pipeline for constructing a legal knowledge graph from Right to Information Act documents (SEM 1, 2025–26)
img:
importance: 2
category: past
related_publications: false
---

The Right to Information Act is a complex legal document — dense, hierarchical, and cross-referencing. This project built an **automated pipeline** to transform RTI Act documents into a structured Neo4j knowledge graph, enabling citizens and legal professionals to query provisions in natural language without expertise in Cypher or legal terminology.

**Pipeline:** Documents are ingested via PDFPlumber (native PDFs) and Tesseract OCR (scanned documents). Named entity recognition and relation extraction are performed with spaCy, with the extracted structure mapped to **LKIF-Core** (Legal Knowledge Interchange Format), a 15-module OWL ontology for legal knowledge representation, managed via Owlready2.

**Entity validation:** To improve extraction quality, extracted entities are verified using a **majority-voting ensemble** of three LLMs — GPT-OSS, Deepseek V3.1-Terminus, and Kimi-k2 — before being committed to the graph.

This work established the foundational graph construction pipeline. The project continues in the current semester under the [Legal GraphRAG](/projects/legal-graphrag/) thread, extending it with a GraphRAG querying interface and multilingual support.

**Team:** Nayonika Shrivastava (SEM 1, 2025–26)
