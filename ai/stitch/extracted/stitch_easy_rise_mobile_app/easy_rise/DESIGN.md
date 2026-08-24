---
name: Easy Rise
colors:
  surface: '#faf8ff'
  surface-dim: '#d8d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fe'
  surface-container: '#ecedf8'
  surface-container-high: '#e6e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#424654'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#eff0fb'
  outline: '#727786'
  outline-variant: '#c2c6d7'
  surface-tint: '#0058cb'
  primary: '#0057c9'
  on-primary: '#ffffff'
  primary-container: '#1d6ff2'
  on-primary-container: '#ffffff'
  inverse-primary: '#b0c6ff'
  secondary: '#712edd'
  on-secondary: '#ffffff'
  secondary-container: '#8b4ef7'
  on-secondary-container: '#fffbff'
  tertiary: '#006c2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00883a'
  on-tertiary-container: '#fdfff8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00429c'
  secondary-fixed: '#ebddff'
  secondary-fixed-dim: '#d3bbff'
  on-secondary-fixed: '#250059'
  on-secondary-fixed-variant: '#5b00c5'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  headline-xl:
    fontFamily: Noto Sans Bengali
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 44px
  headline-lg:
    fontFamily: Noto Sans Bengali
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Noto Sans Bengali
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  body-main:
    fontFamily: Noto Sans Bengali
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-secondary:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  caption:
    fontFamily: Noto Sans Bengali
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-nav:
    fontFamily: Noto Sans Bengali
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-horizontal: 16px
  card-gap-v: 14px
  gutter: 16px
  internal-padding: 16px
  touch-target-min: 48px
---

## Brand & Style
The design system for this product is built around the concept of "Optimistic Professionalism." It targets the emerging freelancer market in Bangladesh, blending high-tech utility with an approachable, modern aesthetic. 

The visual style is **Modern Glassmorphism**. The UI should feel airy and layered, utilizing depth to separate complex business data into digestible, "floating" modules. It prioritizes clarity and focus, using vibrant color blobs and frosted surfaces to reduce cognitive load while maintaining an energetic, future-forward atmosphere.

## Colors
The palette is rooted in **Azure (#1D6FF2)** for primary actions and **Violet (#6D28D9)** for AI-integrated features, creating a distinct visual hierarchy between manual tasks and automated assistance. 

Backgrounds are not solid; they must consist of a soft light gradient with large, heavily blurred color blobs (Azure and Violet) positioned behind content cards to provide depth and "glow." The ink strategy uses a deep **Primary Ink (#0E1626)** for maximum legibility of Bangla script, while **Secondary Text (#64748B)** is reserved for Latin numerals and supporting metadata.

## Typography
This is a **Bangla-first** design system. All primary information, labels, and navigation must use **Noto Sans Bengali**. To maintain a clean, international professional standard, **Inter** is used exclusively for Latin numerals and secondary technical metadata.

**Numeral Rule:** Use Bangla digits (০, ১, ২, ৩...) for all user-facing numbers within the main flow. Use Inter (Latin) only for small-scale secondary tags or code-related data. Never drop below 13px for body text to ensure accessibility for a wide range of mobile devices.

## Layout & Spacing
The layout follows a fluid model with strict adherence to safe-area margins. 
- **Grid:** Use a single-column layout for mobile cards.
- **Vertical Rhythm:** Maintain a consistent 14px gap between stacked cards to allow the background color blobs to peek through, reinforcing the layered effect.
- **Internal Padding:** All cards and containers must use a 16px internal padding to ensure content doesn't feel cramped against the glass edges.
- **Touch Targets:** All interactive elements (buttons, nav items) must maintain a minimum height/width of 48px.

## Elevation & Depth
Elevation is achieved through the **Glassmorphism** effect rather than traditional heavy shadows.
- **Surface:** White at 92% opacity.
- **Backdrop Blur:** 20px to 30px depending on the complexity of the background blobs.
- **Highlight:** A 1px solid white border on the top and left edges of cards to simulate light hitting the edge of the "glass."
- **Shadow:** Use a very soft, diffused shadow (Blur 16px, Spread 0, Opacity 4%, Color #0E1626) to ground the cards against the animated background.

## Shapes
The shape language is friendly and approachable, favoring high-radius corners. 
- **Cards:** Use a 24px to 28px corner radius to evoke a premium, modern feel.
- **Buttons:** Use 12px for standard actions.
- **Navigation:** The center "Assistant" button is a perfect circle (Pill-shaped) to distinguish it from standard utility icons.

## Components

### Buttons
- **Primary:** Solid Azure (#1D6FF2) with white text. 
- **AI/Assistant:** Solid Violet (#6D28D9) with white text.
- **Secondary:** Frosted glass surface with Azure border and Azure text.

### Top Bar
- **Frosted Header:** Full width, fixed. Title (Bangla) aligned left in Headline-MD. 
- **Settings:** Gear icon in Secondary Text color (#64748B) positioned right.

### Bottom Navigation
- **Frosted Dock:** High blur, 5-item layout. 
- **Active State:** Primary color for icons/labels.
- **Center Item (Assistant):** A floating Violet (#6D28D9) circle with a white Sparkle icon and the label "সহায়ক".

### Cards & Lists
- **Frosted Card:** White 92% opacity, white top-left highlight.
- **List Item:** Subtle divider (#E2E8F0) with 16px internal padding. Left-aligned Bangla icon/label pairs.

### Form Inputs
- Backgrounds use Neutrals (#EDF3FF for general, #F3EFFF for AI-contextual inputs).
- Borders: 1px #E2E8F0, changing to #1D6FF2 on focus.