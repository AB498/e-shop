# Responsive Design System

This document outlines the responsive design system implemented in the e-shop project to ensure consistent and adaptable UI across all device sizes, with a focus on smaller text and more compact layouts on mobile devices.

## Core Principles

1. **Mobile-First Design**: Optimized for mobile with smaller text and compact spacing
2. **Fluid Typography**: Text sizes scale smoothly between mobile and desktop using CSS `clamp()` function
3. **Responsive Spacing**: Spacing values (margins, padding, gaps) adjust based on viewport size
4. **Flexible Layouts**: Components adapt their layout based on available space
5. **Component-Based Approach**: Reusable responsive components that maintain consistency

## CSS Variables

The system uses CSS custom properties (variables) defined in `globals.css` for responsive values:

### Spacing Variables (Mobile-Optimized)

```css
--space-xs: clamp(0.2rem, 0.15rem + 0.25vw, 0.5rem);
--space-sm: clamp(0.375rem, 0.3rem + 0.375vw, 0.75rem);
--space-md: clamp(0.625rem, 0.5rem + 0.625vw, 1.25rem);
--space-lg: clamp(0.875rem, 0.7rem + 0.875vw, 1.5rem);
--space-xl: clamp(1.25rem, 1rem + 1.25vw, 2.5rem);
--space-2xl: clamp(1.75rem, 1.4rem + 1.75vw, 3rem);
```

### Typography Variables (Smaller on Mobile)

```css
--text-xs: clamp(0.65rem, 0.6rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.75rem, 0.7rem + 0.25vw, 1rem);
--text-base: clamp(0.875rem, 0.8rem + 0.375vw, 1.125rem);
--text-lg: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);
--text-xl: clamp(1.125rem, 1rem + 0.625vw, 1.5rem);
--text-2xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.875rem);
--text-3xl: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
```

### Component Sizing (More Compact on Mobile)

```css
--card-width: clamp(260px, 100%, 350px);
--input-height: clamp(2.25rem, 2rem + 1.25vw, 3rem);
--button-height: clamp(2rem, 1.75rem + 1.25vw, 2.75rem);
--icon-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
--border-radius: clamp(0.25rem, 0.2rem + 0.25vw, 0.5rem);
--container-padding: clamp(0.75rem, 0.6rem + 0.75vw, 2rem);
```

## Utility Classes

### Responsive Text Classes (Smaller on Mobile)

```css
.text-responsive-xs { font-size: clamp(0.65rem, 0.6rem + 0.25vw, 0.875rem); }
.text-responsive { font-size: clamp(0.75rem, 0.7rem + 0.25vw, 1rem); }
.text-responsive-lg { font-size: clamp(0.875rem, 0.8rem + 0.375vw, 1.125rem); }
.text-responsive-xl { font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem); }
.text-responsive-2xl { font-size: clamp(1.125rem, 1rem + 0.625vw, 1.5rem); }
.text-responsive-3xl { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 1.875rem); }
.text-responsive-4xl { font-size: clamp(1.5rem, 1.3rem + 1vw, 2.25rem); }
```

### Fluid Spacing Classes (More Compact on Mobile)

```css
.fluid-p { padding: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-px { padding-left/right: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-py { padding-top/bottom: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-m { margin: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-mx { margin-left/right: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-my { margin-top/bottom: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-gap { gap: clamp(0.375rem, 0.25rem + 0.75vw, 1rem); }
.fluid-gap-sm { gap: clamp(0.25rem, 0.2rem + 0.5vw, 0.75rem); }
```

## Responsive Components

The system includes several reusable responsive components:

### ResponsiveContainer

A container component that adapts to different screen sizes with appropriate padding.

```jsx
<ResponsiveContainer size="content" fluid>
  {/* Content here */}
</ResponsiveContainer>
```

### ResponsiveText

A text component that automatically adjusts font size based on viewport.

```jsx
<ResponsiveText size="lg" as="h2">
  This is responsive heading
</ResponsiveText>
```

### Spacer

A component that adds responsive vertical or horizontal spacing.

```jsx
<Spacer size="md" axis="vertical" />
```

## Breakpoints

The system uses the following breakpoints:

- `xs`: 475px (Added custom breakpoint)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Best Practices

1. **Use CSS variables** for consistent spacing and sizing
2. **Prefer fluid units** (clamp, %, vh/vw) over fixed pixel values
3. **Test on multiple devices** to ensure proper scaling
4. **Use responsive utility components** for consistent spacing and typography
5. **Implement responsive images** with appropriate `sizes` attribute
6. **Use aspect-ratio** for maintaining proportions in responsive layouts
7. **Implement mobile-first approach** by designing for small screens first

## Implementation Examples

### Responsive Card

```jsx
<div className="responsive-card bg-white rounded-[10px] shadow-sm">
  {/* Card content */}
</div>
```

### Responsive Button

```jsx
<button className="responsive-button bg-[#006B51] text-white font-semibold rounded-full">
  Click Me
</button>
```

### Responsive Input

```jsx
<input className="responsive-input border border-gray-300" type="text" />
```
