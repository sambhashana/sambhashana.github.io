// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-team",
          title: "team",
          description: "the people behind the research",
          section: "Navigation",
          handler: () => {
            window.location.href = "/team/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "research publications by Hrishikesh Terdalkar and the research group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-research",
          title: "research",
          description: "research projects and software tools developed by the group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "courses offered at BITS Pilani, Hyderabad Campus and other institutions",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-join-us",
          title: "join us",
          description: "interested in working with us?",
          section: "Navigation",
          handler: () => {
            window.location.href = "/join/";
          },
        },{id: "news-saṁbhāṣaṇa-research-group-established",
          title: 'Saṁbhāṣaṇa Research Group Established',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/group_creation/";
            },},{id: "news-graph-mining-with-llms-workshop",
          title: 'Graph Mining with LLMs Workshop',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/graph-mining-workshop/";
            },},{id: "news-hands-on-sessions-at-python-bootcamp",
          title: 'Hands-on Sessions at Python Bootcamp',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/python-bootcamp/";
            },},{id: "news-full-paper-bhram-il-accepted-at-bhasha-2025",
          title: 'Full paper BHRAM-IL Accepted at BHASHA 2025',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/bhram-il-acceptance/";
            },},{id: "news-co-organized-bhasha-2025-workshop-ijcnlp-aacl-2025",
          title: 'Co-organized BHASHA 2025 Workshop @ IJCNLP/AACL 2025',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/bhasha-workshop/";
            },},{id: "news-welcome-new-phd-students",
          title: 'Welcome, New PhD Students!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/new-phd-students/";
            },},{id: "news-csa-talk-indian-language-processing",
          title: 'CSA Talk: Indian Language Processing',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/csa-talk/";
            },},{id: "news-talks-at-gujarat-engineering-college-rajkot",
          title: 'Talks at Gujarat Engineering College, Rajkot',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/rajkot-talks/";
            },},{id: "news-talk-at-india-ai-summit-2026-pre-summit",
          title: 'Talk at India AI Summit 2026 Pre-Summit',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/presummit_talk/";
            },},{id: "news-guest-lecture-by-prof-arnab-bhattacharya",
          title: 'Guest Lecture by Prof. Arnab Bhattacharya',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/guest_lecture/";
            },},{id: "news-group-website-is-live",
          title: 'Group Website is Live!',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/website-live/";
            },},{id: "projects-antarlekhaka",
          title: 'Antarlekhaka',
          description: "A web-based tool for multi-task natural language annotation",
          section: "Projects",handler: () => {
              window.location.href = "/projects/antarlekhaka/";
            },},{id: "projects-hallucination-in-indian-languages",
          title: 'Hallucination in Indian Languages',
          description: "Benchmarking hallucination recognition and assessment across Indian languages (BHRAM-IL)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/bhram-il/";
            },},{id: "projects-agentic-graph-repair",
          title: 'Agentic Graph Repair',
          description: "LLM-driven agents for detecting and repairing inconsistencies in knowledge graphs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/graph-repair/";
            },},{id: "projects-jñānasaṅgraha",
          title: 'Jñānasaṅgraha',
          description: "A collection of computational applications for Sanskrit",
          section: "Projects",handler: () => {
              window.location.href = "/projects/jnanasangraha/";
            },},{id: "projects-kg-grounded-qa-for-sanskrit",
          title: 'KG-Grounded QA for Sanskrit',
          description: "Question generation and QA dataset construction from Sanskrit and Ayurveda knowledge graphs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/kg-grounded-question-generation/";
            },},{id: "projects-natural-language-interface-for-knowledge-graph-querying",
          title: 'Natural Language Interface for Knowledge Graph Querying',
          description: "LLM-based querying interface for Sangrahaka and Neo4j knowledge graphs (Sem I 2025-26)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/kg-querying-interface/";
            },},{id: "projects-legal-graphrag",
          title: 'Legal GraphRAG',
          description: "Knowledge graph construction and GraphRAG querying over Right to Information Act documents",
          section: "Projects",handler: () => {
              window.location.href = "/projects/legal-graphrag/";
            },},{id: "projects-mathematical-reasoning-in-llms",
          title: 'Mathematical Reasoning in LLMs',
          description: "Investigating where and why LLMs fail at mathematical reasoning, and whether targeted interventions improve reliability.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/llm-math/";
            },},{id: "projects-multi-turn-llm-evaluation",
          title: 'Multi-turn LLM Evaluation',
          description: "Evaluating LLM consistency, instruction retention, and reasoning quality across multi-turn interactions.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/llm-multiturn/";
            },},{id: "projects-security-and-robustness-in-llms",
          title: 'Security and Robustness in LLMs',
          description: "Probing LLMs for susceptibility to prompt injection, jailbreaks, and instruction-following failures.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/llm-security/";
            },},{id: "projects-explainability",
          title: 'Explainability',
          description: "Understanding what attention heads and layers causally contribute to LLM predictions",
          section: "Projects",handler: () => {
              window.location.href = "/projects/mechanistic-interpretability/";
            },},{id: "projects-multimodal-graphrag",
          title: 'Multimodal GraphRAG',
          description: "Graph-based retrieval-augmented generation connecting visual and textual content",
          section: "Projects",handler: () => {
              window.location.href = "/projects/multimodal-graphrag/";
            },},{id: "projects-new-faculty-seed-grant",
          title: 'New Faculty Seed Grant',
          description: "Intramural seed grant from BITS Pilani supporting early-stage research at the Saṁbhāṣaṇa Research Group",
          section: "Projects",handler: () => {
              window.location.href = "/projects/nfsg/";
            },},{id: "projects-constrained-creative-generation",
          title: 'Constrained Creative Generation',
          description: "Computational generation of poetry in Indian languages",
          section: "Projects",handler: () => {
              window.location.href = "/projects/poetry-generation/";
            },},{id: "projects-domain-specific-knowledge-graph-construction",
          title: 'Domain-specific Knowledge Graph Construction',
          description: "Automated pipeline for constructing a legal knowledge graph from Right to Information Act documents (SEM 1, 2025–26)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/rti-kg/";
            },},{id: "projects-saṅgrāhaka",
          title: 'Saṅgrāhaka',
          description: "A web-based platform for annotating and querying knowledge graphs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sangrahaka/";
            },},{id: "projects-sanskrit-nlp",
          title: 'Sanskrit NLP',
          description: "Language technologies for Sanskrit and classical Indian languages",
          section: "Projects",handler: () => {
              window.location.href = "/projects/sanskrit-nlp/";
            },},{id: "projects-grammar-error-correction",
          title: 'Grammar Error Correction',
          description: "GEC and word generation for Tamil (IndicGEC / IndicWG shared tasks)",
          section: "Projects",handler: () => {
              window.location.href = "/projects/tamil-gec/";
            },},{id: "projects-vaiyyākaraṇa",
          title: 'Vaiyyākaraṇa',
          description: "A Sanskrit grammar bot for Telegram",
          section: "Projects",handler: () => {
              window.location.href = "/projects/vaiyyakarana/";
            },},{id: "teachings-information-retrieval",
          title: 'Information Retrieval',
          description: "A comprehensive course on the principles, algorithms, and systems used to retrieve relevant information at scale, spanning classical lexical models, neural retrieval, Knowledge Graphs, and RAG systems.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/cs-f469-information-retrieval/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%68%72%69%73%68%69%6B%65%73%68.%72%74@%68%79%64%65%72%61%62%61%64.%62%69%74%73-%70%69%6C%61%6E%69.%61%63.%69%6E", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/sambhashana", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=k9aGwEgAAAAJ&hl=en", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
