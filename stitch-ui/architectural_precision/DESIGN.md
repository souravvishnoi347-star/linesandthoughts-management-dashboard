---
name: Architectural Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 280px
  sidebar-collapsed: 80px
---

## Brand & Style
The design system is engineered for the modern construction and ERP landscape, where industrial robustness meets digital sophistication. The brand personality is authoritative yet transparent, evoking a sense of structural integrity and forward-thinking management.

The visual direction employs **Glassmorphism** and **Minimalism** to manage complex data without visual fatigue. By utilizing deep charcoal surfaces against an expansive off-white canvas, the system creates a high-contrast environment that prioritizes legibility and focus. The aesthetic is "Technical Premium"—it feels as precise as a blueprint but as fluid as a modern SaaS platform.

## Colors
This design system utilizes a high-contrast layering strategy. The primary canvas is a crisp **Off-White (#f8fafc)**, providing a clean architectural base. 

- **Primary (Dark Slate):** Used for structural navigation elements like sidebars, headers, and primary actions.
- **Accents:** **Emerald Green** signals fiscal health and completion; **Amber** handles scheduling alerts and pending approvals; **Rose Red** is reserved strictly for over-budget warnings and critical errors.
- **Surface Strategy:** Dark elements use a secondary slate (#1e293b) to provide depth against the primary black, often treated with glassmorphic transparency.

## Typography
The system uses a dual-font strategy to balance character with utility. 
- **Plus Jakarta Sans** is the "architectural" font, used for large headings and display metrics. Its geometric terminals provide a modern, premium feel. 
- **Inter** is the "functional" font, used for all body text, data tables, and form inputs. It ensures maximum readability for dense ERP data.

Hierarchy is achieved through weight rather than just size. Primary headlines should be **Bold (700)** or **ExtraBold (800)** to stand out against the dark UI panels, while secondary labels use a muted Slate gray to recede.

## Layout & Spacing
The layout follows a **Fluid Grid** model with strict 8px incremental spacing. 

- **Desktop:** Features a persistent or collapsible sidebar on the left (Dark Slate). The main content area uses wide 24px margins to create a sense of "air" around complex data tables.
- **Mobile:** Transitions to a sleek bottom navigation bar for primary modules (Projects, Finances, Team, Profile). Forms and detail views are presented via **Bottom Sheets** to keep interaction within the natural reach of the thumb.
- **Data Density:** While the overall UI is airy, data tables utilize a "compact" vertical rhythm (8px padding) to maximize information visibility without scrolling.

## Elevation & Depth
Elevation is communicated through **Glassmorphism** and backdrop effects rather than traditional heavy shadows.

- **Level 1 (Surface):** The main Off-White background.
- **Level 2 (Panels):** White or Light Gray cards with a 1px subtle stroke (#e2e8f0) and no shadow.
- **Level 3 (Overlays):** Dark Slate panels (sidebars, modals) use a `backdrop-filter: blur(12px)` and 60-80% opacity. This allows background colors to subtly bleed through, creating a sophisticated, layered depth.
- **Shadows:** Only used for "floating" elements like FABs or active dropdowns. These should be long, soft, and low-opacity (e.g., `shadow-xl` with 5% alpha).

## Shapes
The shape language is "Soft Geometric." A standard **0.5rem (8px)** radius is applied to buttons, input fields, and cards. This provides a professional look that is more approachable than sharp corners but more serious than fully rounded pill shapes.

- **Large Surfaces:** Modals and large metric cards use `rounded-xl` (24px) to emphasize the containerized nature of the ERP data.
- **Status Indicators:** Small badges or chips use a full pill-shape to distinguish them from interactive buttons.

## Components

### Buttons & Inputs
- **Primary Action:** Dark Slate background with white text. High-contrast, bold weight.
- **Secondary Action:** Ghost style with a 1px border (#cbd5e1) and Inter Medium weight.
- **Inputs:** Focused state uses a 2px border of Primary Slate or Emerald Green (for success states).

### Metric Cards
Metric cards should feature a subtle background gradient (e.g., Primary Slate to a slightly lighter blue) to make them pop against the light background. Icons within these cards should use the accent colors (Emerald, Amber, Rose) to categorize the metric type at a glance.

### Data Tables
Tables are borderless. Rows are separated by a 1px hairline stroke (#f1f5f9). The header row is pinned and uses a light gray background (#f8fafc) with uppercase `label-sm` typography.

### Sidebars & Bottom Sheets
- **Sidebar:** Dark Slate background, 280px width. Active links use an Emerald Green left-border accent (4px) and a subtle glass-like highlight.
- **Bottom Sheets (Mobile):** Rounded top corners (24px). Triggered for all "New Project" or "Add Expense" entries to provide a focused, modal-like experience on smaller screens.