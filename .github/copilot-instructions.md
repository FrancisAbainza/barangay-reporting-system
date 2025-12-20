# Development Rules for Barangay Reporting System

## General Guidelines

- Write clean, readable, and maintainable code.
- Prefer simple and explicit solutions over complex abstractions.
- Follow existing project structure and naming conventions.
- Do not introduce new libraries unless explicitly instructed.

## Project Structure & Modularity

- Keep the project highly modular.
- Split code into small, reusable components whenever possible.
- Each component should have a single responsibility.
- Avoid large, monolithic components.
- Shared logic must be extracted into reusable components or hooks.
- Screens should only compose components, not contain complex logic.
- Reusable UI elements must live in a shared components directory.
- Business logic should not be embedded directly inside UI components.

## UI / UX

- All components must be responsive and work across different screen sizes.
- Ensure accessibility (proper touch targets, readable text sizes, semantic components).
- Maintain consistent spacing, typography, and layout patterns across the app.
- Test components on multiple device sizes (small, medium, large screens).

## Styling

- Use **nativewind exclusively** for all styling.
- Do not use inline styles, `StyleSheet.create`, or other styling libraries.
- Use only color values defined in `src/constants/colors.ts`.
- Avoid hardcoded color values.

## Icons

- Use **Ionicons** for all icons.
- Do not mix icon libraries.

## Forms & Validation

- All forms must use:
  - **react-hook-form** for form state
  - **zod** for schema validation
- Do not implement custom validation logic outside Zod schemas.

## Code Consistency

- Use TypeScript strictly; avoid `any`.
- Keep components small and focused.
- Prefer functional components and hooks.
- Avoid changing existing logic unless explicitly requested.

## Platform

- Assume this is a React Native + Expo + TypeScript project.
- Optimize for mobile-first behavior.
