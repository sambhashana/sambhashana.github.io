---
layout: course
title: Information Retrieval
description: >
  A comprehensive course on the principles, algorithms, and systems used to retrieve relevant information
  at scale, spanning classical lexical models, neural retrieval, Knowledge Graphs, and RAG systems.
instructor: Hrishikesh Terdalkar
year: 2026
term: Sem II
institution: BITS Pilani, Hyderabad Campus
course_id: CS F469
location: BITS Pilani, Hyderabad Campus
time: "Tue/Thu 11:00–12:00, Wed 14:00–15:00"
---

[Course Handout (PDF)](/assets/pdf/cs-f469-handout.pdf){: .btn .btn-sm .btn-outline-primary target="_blank"}

## Scope and Objectives

This course provides a comprehensive understanding of the principles, algorithms, and systems used to retrieve relevant information at scale. It spans the evolution of IR from classical lexical models and indexing techniques to modern neural retrieval and Retrieval-Augmented Generation (RAG) systems. Emphasis is placed on understanding retrieval as a pipeline — from text processing and indexing to ranking, evaluation, and system-level tradeoffs — while engaging with contemporary challenges such as dense retrieval, hybrid systems, responsible retrieval, multilingual access, and domain-specific retrieval.

Students are expected to develop both theoretical understanding and practical insight into building, analyzing, and evaluating modern search systems relevant to both industry and research.

## Learning Outcomes

Upon successful completion of the course, students should be able to:

- Explain the IR pipeline and its role in modern search systems
- Build efficient indexing and retrieval mechanisms for large text collections
- Apply exact-match, tolerant, and lexical ranking techniques for document retrieval
- Evaluate IR systems using standard test collections, metrics, and significance tests
- Use probabilistic, language-model, and learning-based approaches for ranking
- Apply neural and dense retrieval methods, including hybrid lexical-dense systems
- Design and analyze Retrieval-Augmented Generation (RAG) pipelines
- Incorporate structured and graph-based signals, including Knowledge Graphs and Web graphs, into retrieval systems
- Address multilingual, cross-lingual, and domain-specific retrieval challenges
- Recognize robustness, fairness, safety, and governance issues in retrieval systems

## Topics

- IR pipeline; text preprocessing; term statistics (Zipf, Heaps)
- Boolean retrieval; inverted index; phrase and proximity queries
- Tolerant matching: wildcards, edit distance, spelling correction
- Scalable indexing (BSBI/SPIMI); compression
- Ranking: TF-IDF, cosine similarity, BM25, language models
- Evaluation: precision/recall, MAP, nDCG
- Neural and dense retrieval; word and contextual embeddings
- Learning-to-Rank: pointwise, pairwise, listwise
- Cross-lingual and Indian language IR
- Knowledge Graphs for entity-centric and KG-aware retrieval
- Retrieval-Augmented Generation (RAG) and GraphRAG
- Web graphs: PageRank, HITS
- Responsible and robust retrieval: fairness, safety, governance

## Course Format

The course is conducted through lectures, hands-on programming assignments, a semester-long project, and student-led paper presentations. Lectures focus on core concepts, algorithms, and system design principles, while assignments and the project emphasize implementing and evaluating retrieval components and end-to-end pipelines. Students are also expected to engage with research literature and participate actively in discussions.

## Resources

**Textbook**
- Manning, Raghavan, Schütze. *Introduction to Information Retrieval*. Cambridge University Press, 2008. [Online](http://nlp.stanford.edu/IR-book/)

**References**
- Jurafsky & Martin. *Speech and Language Processing* (3rd ed. draft), 2025. [Online](https://web.stanford.edu/~jurafsky/slp3/)
- Croft, Metzler, Strohman. *Search Engines: Information Retrieval in Practice*. [Online](https://ciir.cs.umass.edu/irbook/)
- Baeza-Yates & Ribeiro-Neto. *Modern Information Retrieval*. Addison-Wesley.
- Kejriwal. *Domain-Specific Knowledge Graph Construction*. Springer.
- Mitra & Craswell. *An Introduction to Neural Information Retrieval*, 2018.

## Prerequisites

- Programming proficiency in Python
- Data Structures and Algorithms
- Basics of Machine Learning
