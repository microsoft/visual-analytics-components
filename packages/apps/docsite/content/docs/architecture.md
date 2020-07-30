---
title: Architecture
path: /documentation/architecture
order: 1
---

### Concerns of Data Visualization

<!--docs disable simple-->

Effective data visualization is a broad and ubiquitous concern across visual analytic applications. As data becomes ever richer, and as our analytic techniques grow in complexity, there is a growing need for visualization that can communicate data insights to people. It is often the case that simple data visualizations are the most effective at communicating information. But even with these simple data visualizations, there is a complex ecosystem of software and services, data providers and hardware form factors, competing user demands for simplicity and high-interactivity, the need to use these visualizations in a standalone context and in a visual analytics suite - and satisfying all of these competing demands requires multiple implementations of the same visualizations.

<!--docs enable simple-->

![The concerns of data visualization](/images/datavis-concerns.jpg)

Our team develops data visualizations and visual analytic applications that are designed to improve the workflow of data scientists we work with, and to give their techniques and insights to broader audiences at Microsoft and the open-source community as a whole. We have implemented data visualizations for web applications, native mobile applications, PowerBI dashboards, PowerPoint presentations, etc.. We have often found ourselves reimplementing a handful of common, useful visualizations for use in these various contexts. And in doing so we have asked ourselves: is this redundancy necessary?

The idea of **Disaggregated Visualization** is to decouple data visualization from their context, to treat them as independent components with a common set of concerns, and to design a system where we can use these visualization components to develop visual analytics applications that provide functionality that is emergent from the capabilities of these low-level components.

### Component-Based Design

Microsoft Visual Analytics Components treats data visualizations as independent components with a shared data-source. Because the components are independent, they can express their own data dependencies and scaling properties. This allows them to be used in a variety of contexts.

- Emergent behavior
- Shared data model
- Scalable across device form factors (Responsive Design)
- Scalable across interaction modes (Responsive Interaction)
