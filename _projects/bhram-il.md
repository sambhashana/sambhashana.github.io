---
layout: page
title: Hallucination in Indian Languages
description: Benchmarking hallucination recognition and assessment across Indian languages (BHRAM-IL)
img:
importance: 1
category: research
tags: [LLMs, Evaluation, Indian Languages]
related_publications: true
---

LLMs hallucinate — but how often, and in what ways, when used in Indian languages? **BHRAM-IL** (Benchmark for Hallucination Recognition and Assessment in Multiple Indian Languages) is a comprehensive evaluation framework covering Hindi, Gujarati, Marathi, Odia, and English.

The benchmark comprises **38,598 curated questions** across nine task categories — including factual knowledge, mathematical reasoning, chronological ordering, named entity recognition, semantically incorrect prompts, and word ordering. We distinguish two failure modes: **language hallucination** (responding in the wrong language) and **factual hallucination** (responding in the correct language but with incorrect information).

We evaluated **13 leading open-weight LLMs** spanning general-purpose models (LLaMA 3.2, Mistral-NeMo, Qwen3), the Gemma3 family (270M–27B), Indic-centric models (Navarasa 2.0, Krutrim 2), and high-performance MoE models (GPT-OSS 20B/120B). Experiments compared English prompting vs. native-language prompting across all five languages.

Key findings:
- Native prompting substantially reduces language hallucinations, but does not improve — and often slightly degrades — factual accuracy
- Indic-centric models show better language stability but lag behind in complex reasoning tasks
- Model scale correlates with factual accuracy; Qwen3 8B shows exceptional parameter efficiency

The dataset, code, and leaderboard are open-sourced.

**Team:** Anudeep J, Omm Aditya Behera, Kirtan Bhojani (SEM 1), Aryan Dongare (SEM 1)

**Links:** [GitHub](https://github.com/sambhashana/BHRAM-IL/) · [Paper](https://aclanthology.org/2025.bhasha-1.9/) · [arXiv](https://arxiv.org/abs/2512.01852)

{% cite terdalkar-etal-2025-bhram %}
