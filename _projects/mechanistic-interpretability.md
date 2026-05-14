---
layout: page
title: Explainability
description: Understanding what attention heads and layers causally contribute to LLM predictions
img:
importance: 6
category: research
tags: [LLMs, Evaluation]
related_publications: false
---

Can we understand *why* an LLM makes a specific prediction — not just correlate attention patterns with outputs, but identify what actually causes them? We investigate interpretability beyond attention heatmaps, which are correlational rather than causal.

**Logit Lens and Tuned Lens** project hidden state activations at each layer back into the vocabulary space, making it possible to visualize how a model's token prediction evolves as information propagates through layers. Tuned Lens trains a learned linear probe at each layer for better alignment with final predictions compared to the raw Logit Lens.

**Causal Head Gating (CHG)** goes further: soft gates are trained per attention head that can suppress or preserve each head's contribution to the output. By ablating individual heads and measuring task performance, we identify which heads are causally necessary vs. redundant.

Experiments on GPT-2 show that **Layer 11 (the final layer)** accounts for the dominant share of task-critical capacity; early layers (0–4) primarily encode syntactic structure; and approximately **86% of heads can be pruned** without meaningful performance loss, with importance following a bimodal distribution.

**Team:** Narendra Devireddy, Parv Goyal (SEM 1, 2025–26)
