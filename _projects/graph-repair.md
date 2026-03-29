---
layout: page
title: Knowledge Graph Repair
description: LLM-driven agents for detecting and repairing inconsistencies in knowledge graphs
img:
importance: 2
category: research
related_publications: false
---

Knowledge graphs accumulate errors — missing relationships, constraint violations, outdated facts, and structural inconsistencies. Rather than relying on humans or hard-coded rules to fix them, we are building **agentic pipelines** where LLMs iteratively detect and repair graph inconsistencies in a closed loop.

The system is structured around four components: an **Inspector** that scans the graph and builds a repair queue, a **Loader** that retrieves focused subgraph context for each issue, an **Analyst** (LLM) that reasons about the inconsistency and generates a corrective Cypher query, and a **Surgeon** that applies the repair and logs the result. The loop continues until the repair queue is empty or an iteration limit is reached.

We handle two classes of inconsistency:
- **Property-based**: violations of attribute constraints (e.g., negative ages, date inversions)
- **Label/structural**: violations of schema rules (e.g., mutually exclusive labels, missing required relationships)

Early experiments used real-world datasets — a legal citation network and a protein-protein interaction network (STRING) — but both revealed a methodological challenge: without injected ground truth, LLM performance cannot be reliably measured. We pivoted to **abstract synthetic graphs** where anti-patterns are programmatically injected, enabling clean precision/recall evaluation.

This extends prior empirical work on single-turn LLM graph repair toward multi-step, tool-using agents capable of handling realistic repair scenarios at scale.

**Team:** Narendra Devireddy, Aadi Parakh, Tathagat Rath, Yash Vardhan Singh

**Related:** [LLM-Graph-Repair](https://github.com/hrishikeshrt/LLM-Graph-Repair/) · [GRADES-NDA @ SIGMOD/PODS '25](https://doi.org/10.1145/3735546.3735859)
