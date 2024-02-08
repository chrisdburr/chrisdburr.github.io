---
title: TEA Case Schema
aliases:
  - TEA Schema
draft: true
tags:
  - research
---
Assurance cases are structured arguments, often used in safety-critical and security-critical industries, that aim to demonstrate that a system, product, or process meets certain requirements, typically related to safety, reliability, or security.

An assurance case consists of several key components:

- **Goal:** A top-level claim about a system that needs to be justified.
- **Strategy:** The approach taken to break down the goal claim into a set of lower-level property claims to help structure the argument into a subset of more specific arguments.
- **Property Claim**: A lower-level claim about either the system or the project to design, develop, and deploy the system, that needs to be evidenced.
- **Context:** Information that provides the background or conditions under which a claim is made.
- **Evidence:** Data, tests, or analyses that support the claim.
### Example Assurance Case

Let's define a simple assurance case in JSON format that includes a couple of goals, a strategy, some context, and evidence.

```json
{
  "TEA": {
    "id": "TEA-001",
    "title": "Explainability of AI System",
    "goal": {
      "id": "G-1",
      "description": "The behaviour and outputs of the AI system are explainable by trained professionals",
      "propertyClaims": [
        {
          "id": "P1",
          "type": "system",
          "description": "The AI system provides interfaces for querying and understanding model decisions.",
          "evidence": ["E1"],
          "children": [
            {
              "id": "P1.1",
              "type": "system",
              "description": "Interface allows for real-time querying of decisions.",
              "evidence": ["E1.1"]
            },
            {
              "id": "P1.2",
              "type": "system",
              "description": "Historical decision data is accessible and comprehensive.",
              "evidence": ["E1.2"]
            }
          ]
        },
        {
          "id": "P2",
          "type": "project",
          "description": "The development team includes roles focused on ensuring explainability.",
          "evidence": ["E2"]
        }
      ]
    },
    "strategies": [
      {
        "id": "S1",
        "description": "Demonstrate system's explainability through interface functionality and team expertise."
      }
    ],
    "contexts": [
      {
        "id": "C1",
        "description": "Explainability is considered a critical aspect of AI ethics."
      }
    ],
    "evidence": [
      {
        "id": "E1",
        "description": "Documentation of the query interfaces with examples."
      },
      {
        "id": "E1.1",
        "description": "Demo video of real-time querying feature."
      },
      {
        "id": "E1.2",
        "description": "Report on the comprehensiveness of historical decision data."
      },
      {
        "id": "E2",
        "description": "Roles and responsibilities document highlighting explainability experts."
      }
    ]
  }
}
```

### Schema for Assurance Case in YAML

Next, we define a schema in YAML that outlines the structure of an assurance case JSON file. This schema ensures that the JSON file adheres to the expected format and contains all necessary information.

```yaml
type: object
properties:
  TEA:
    type: object
    properties:
      id:
        type: string
        description: Unique identifier for the TEA case.
      title:
        type: string
        description: Title of the TEA case.
      goal:
        type: object
        properties:
          id:
            type: string
            pattern: "^G-[0-9]+$"
          description:
            type: string
          propertyClaims:
            type: array
            items:
              $ref: "#/definitions/propertyClaim"
        required:
          - id
          - description
          - propertyClaims
      strategies:
        type: array
        items:
          type: object
          properties:
            id:
              type: string
              pattern: "^S-[0-9]+(\\.[0-9]+)*$"
            description:
              type: string
      contexts:
        type: array
        items:
          type: object
          properties:
            id:
              type: string
              pattern: "^C-[0-9]+(\\.[0-9]+)*$"
            description:
              type: string
      evidence:
        type: array
        items:
          type: object
          properties:
            id:
              type: string
              pattern: "^E-[0-9]+(\\.[0-9]+)*$"
            description:
              type: string
    required:
      - id
      - title
      - goal
      - strategies
      - contexts
      - evidence
definitions:
  propertyClaim:
    type: object
    properties:
      id:
        type: string
        pattern: "^P-[0-9]+(\\.[0-9]+)*$"
      type:
        type: string
        enum: [system, project]
      description:
        type: string
      evidence:
        type: array
        items:
          type: string
          pattern: "^E-[0-9]+(\\.[0-9]+)*$"
      children:
        type: array
        items:
          $ref: "#/definitions/propertyClaim"
    required:
      - id
      - type
      - description
      - evidence
```

This YAML schema defines the expected structure of the assurance case, including the types and requirements for each component (goals, strategies, contexts, evidence). Each component must have an `id` and `description`, with goals additionally requiring a `strategy`, `context`, and list of `evidence` identifiers. This structured approach to defining assurance cases ensures clarity, consistency, and comprehensibility, facilitating their evaluation and review.