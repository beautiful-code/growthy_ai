# Frontend Codebase Structure and Practices

## Overview

- **Goal:** Establish a clear, consistent structure and set of practices for developing and maintaining the frontend codebase.
- **Principle:** Each item (file, component, function) should have a single responsibility and purpose, enhancing the code's understandability, testability, and maintainability.

## Folder Structure

The project is organized into key directories, each serving a distinct role in the application's architecture:

### 1. Feature

- **Purpose:** Contains all elements specific to a feature of the application (e.g., user authentication, dashboard).
- **Structure:**
  - **Component:** UI components specific to this feature, focusing on a single visual element or function.
  - **Hook:** Custom React hooks encapsulating reusable logic for the feature.
  - **Models:** Definitions of data structures and types used by this feature.
  - **Queries:** API queries and data fetching logic for this feature.
  - **Chains:** AI Prompts related to the feature.
 
- Example features
- Guilds
- Growth Exercise

Approach 2
- Pages (Pure FE)
- Domain-Logic (Pure Buiz logic )

Example - Home Page
- Components
  - Home.tsx
  - ExercisesList.tsx
  - Exercise.tsx
- queries.ts
- Home.css
- utils.ts

- Common
  - Components
    - Sidebar.tsx

- Domain-Logic
  - Exercise.ts
    - Name
    - Author
  - 

### 2 Principles
- React Component is only for view, all non-view logic should be moved to a diff place and imported.
- 

### 3. Common

- **Purpose:** Contains reusable components and hooks not tied to specific features but used across the application, avoiding duplication and fostering consistency.
- **Structure:**
  - **Components:** Generic UI components like buttons, modals, form elements, and layout components, designed for flexibility and customization through props.
  - **Hooks:** Custom React hooks for logic applicable across the application, including managing global state, accessing context, or reusing logic like form validation or data fetching.


# Commands

- Running the project: `yarn dev`
- Building the project: `yarn build`
- Deploying the project: `firebase deploy`
