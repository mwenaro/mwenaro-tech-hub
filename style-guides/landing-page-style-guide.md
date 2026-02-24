# Mwenaro Landing Page Style Guide

This guide ensures visual consistency across all Mwenaro applications (Hub, Academy, Talent, Labs). Use these standards for all new landing page components and sections.

---

## 1. Standard Spacing & Scaling

### Section Paddings
| Type | Desktop Class | Mobile Class | Usage |
| :--- | :--- | :--- | :--- |
| **Hero Top** | `pt-40` | `pt-24` | Main landing hero sections |
| **Major Section** | `py-32` | `py-20` | Core content blocks |
| **Minor Section** | `py-24` | `py-16` | Informational or secondary blocks |
| **Container** | `max-w-7xl` | `px-6` | Global page alignment |

### Heading Scales
*   **Hero H1**: `text-6xl md:text-8xl font-black tracking-tight leading-[1.1]`
*   **Section H2**: `text-4xl md:text-5xl font-black mb-16 text-center`
*   **Sub-heading H3**: `text-2xl md:text-3xl font-bold mb-4`
*   **Card heading H4**: `text-xl font-bold mb-2`

---

## 2. Card Styles & Hover Effects

Standard cards should use the `.glass-card` class or high-contrast white backgrounds for premium feel.

### Standard Card (`.glass-card`)
*   **Radius**: `rounded-[2.5rem]` or `rounded-3xl`
*   **Padding**: `p-8` to `p-10`
*   **Hover Effect**: `hover:shadow-premium hover:border-primary/30 transition-all duration-500 hover:scale-[1.01]`

### Icon Containers
*   **Size**: `w-20 h-20`
*   **Radius**: `rounded-[2rem]` or `rounded-2xl`
*   **Animation**: `group-hover:scale-110 transition-transform duration-500`

---

## 3. Button Variants & CTA Rules

All buttons should use the `Button` component from `@mwenaro/ui`.

### Visual Rules
*   **Primary CTA**: `rounded-full px-10 shadow-lg bg-primary text-white`
*   **Secondary Link**: `rounded-full px-10 variant="outline"`
*   **Interactive Icon**: `group-hover:translate-x-1 transition-transform`

### Component Usage
```tsx
import { Button } from "@mwenaro/ui";

// Correct Link usage (fixed polymorphism)
<Button as="a" href="/academy" size="lg" className="rounded-full">
  Explore Academy
</Button>
```

---

## 4. Animation Classes

Use these classes from `globals.css` to add movement and interactivity.

| Class | Effect | Recommended Usage |
| :--- | :--- | :--- |
| `.animate-reveal` | Fades in and slides up | All hero text and core sections |
| `.animate-float` | Gentle vertical floating | Hero icons or floating visual assets |
| `[animation-delay:200ms]` | Staggered reveal | Sequence multiple `.animate-reveal` items |

---

## 5. Standard Colors

*   **Primary (Mwenaro Orange)**: `hsl(12 76% 57%)` -> `text-primary`, `bg-primary`
*   **Secondary (Professional Navy)**: `hsl(222 47% 22%)` -> `text-secondary`, `bg-secondary`
*   **Gradient**: `.gradient-text` (Orange to Light Orange)