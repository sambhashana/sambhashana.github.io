---
layout: page
title: Legal GraphRAG
description: Knowledge graph construction and GraphRAG querying over Right to Information Act documents
img:
importance: 5
category: research
related_publications: false
---

Standard RAG retrieves flat document chunks. Legal text is deeply relational — provisions reference other provisions, exceptions modify rules, and jurisdiction hierarchies matter. We are building a **knowledge graph over RTI Act documents** that captures this structure, enabling GraphRAG queries that reason over relationships rather than just retrieving similar text.

The pipeline extracts named entities and relationships using NLP, maps them to a legal ontology (LKIF-Core), and stores the result in Neo4j. The querying layer allows citizens and professionals to ask complex legal questions in natural language without expertise in Cypher or legal terminology.

This project builds on the graph construction pipeline started in SEM 1 ([Legal Knowledge Graph Construction](/projects/rti-kg/)).

**Team:** Harshal Bhambhani, Rishabh Jangid
