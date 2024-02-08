---
title: Schemas and Metamodels
aliases:
  - Schemas and Metamodels
  - Schemas
  - Metamodels
draft: true
tags:
  - research
---

> [!NOTE] About this Note
> This note contains explanations for some key concepts related to the [[current-projects#Trustworthy and Ethical Assurance|Trustworthy and Ethical Assurance project]], and will serve as the basis for research and also user guidance documentation.

## Schemas

A schema serves as a blueprint for organising and structuring data. It defines the shape and composition of data by specifying the types of data (e.g., `int`, `str`, `bool`), their relationships, and constraints (e.g., required fields, default values). Schemas are essential for ensuring the integrity, consistency, and usability of data across systems.

In data modelling, schemas help with:

1. **Validation:** Ensuring that data inputs or imports adhere to a predefined format, which is critical for preventing errors and maintaining data quality.
2. **Documentation:** Acting as a reference for developers and systems to understand the structure of data, making it easier to work with, maintain, and extend systems.
3. **Interoperability:** Facilitating data exchange between different systems by providing a common understanding of the data's format.

### Example: Online Library Data

Let's say we have a JSON object that represents information about books in an online library. The JSON data might look like this:

```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "publishedYear": 1925,
  "genres": ["fiction", "classic", "literature"],
  "available": true
}
```

To define a schema for this JSON data structure, we can use YAML (YAML Ain't Markup Language), which is a human-readable data serialisation standard. YAML is often used for configuration files and in scenarios where data readability by humans is a priority. 

```yml
type: object
properties:
  title:
    type: string
    description: The title of the book.
  author:
    type: string
    description: The author of the book.
  publishedYear:
    type: integer
    description: The year the book was published.
  genres:
    type: array
    items:
      type: string
    description: A list of genres applicable to the book.
  available:
    type: boolean
    description: Whether the book is available for borrowing.
required:
  - title
  - author
  - publishedYear
  - genres
  - available

```

This schema defines the structure and types of data expected for a book entry:

- **`type: object`** indicates that the data should be a JSON object.
- **`properties`** outlines the fields expected in the object, such as `title`, `author`, `publishedYear`, `genres`, and `available`, along with their data types (`string`, `integer`, `array`, `boolean`).
- Each property is further described, for instance, `genres` is an array of strings.
- The **`required`** field lists all properties that must be present in the data, ensuring completeness of important information.

By adhering to this schema, a library's database can ensure that all entries for books are complete, consistently formatted, and easily understood by both humans and machines.

## Metamodels

A **metamodel** takes the concept of a schema a step further. While a schema defines the structure of data within a specific context (like the format of a JSON object representing a book), a metamodel is essentially a schema for schemas. It defines the rules and constructs for creating schemas themselves. This might sound a bit abstract at first, but it's a powerful concept that enables more dynamic and flexible data modelling.

Metamodels are used to formalise the principles and rules that govern the structure, semantics, and constraints of schemas in a given domain (e.g. management of data within a group of libraries). They provide a higher level of abstraction, allowing for the definition, validation, and interpretation of schemas.

### Example: A Metamodel for Libraries

In the previous example, we defined a schema in YAML to structure data for books stored in JSON format. To understand metamodeling in this context, consider that the schema itself adheres to a set of rules or a structure that describes what elements (e.g., `type`, `properties`, `required`) can be included in a schema and how these elements are to be interpreted.

A metamodel for the previous YAML-defined schema would describe:

- **What constitutes a valid property type** (e.g., `string`, `integer`, `array`, `boolean`).
- **How arrays are structured and what they should contain** (e.g., arrays consist of items of a specified type).
- **Rules for defining required fields** and how they are enforced.

If we were to conceptualise a very simplified version of a metamodel for our YAML schema, it might look something like this (described abstractly):

- **Elements:** `type`, `properties`, `required`, `items`, `description`.
- **Rules:**
    - `type` can be `object`, `string`, `integer`, `array`, `boolean`.
    - `properties` is a map of named properties to their definitions.
    - Each property definition can include `type`, `items` (if `type` is `array`), and `description`.
    - `required` is a list of strings that correspond to names of properties.
    - If `type` is `array`, `items` must specify the type of items in the array.

In essence, the metamodel defines the allowable structure and syntax for schemas within the system. It ensures that any schema created (for books, magazines, DVDs, etc.) follows a consistent format and adheres to the same set of foundational rules. This level of abstraction is crucial in environments where schemas need to be dynamically generated, interpreted, or transformed according to the rules of the metamodel, ensuring that the system remains flexible yet consistent.

### Validation and Automation

Metamodels facilitate a more systematic approach to data modeling, allowing for the automation of schema validation, generation, and transformation tasks. They are foundational in model-driven engineering (MDE) and other methodologies that rely on abstract modelling and automatic code generation to manage complexity and enhance productivity in software development and data architecture projects.

