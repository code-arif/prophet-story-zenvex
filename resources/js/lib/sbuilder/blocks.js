/**
 * S Builder — Block Registry
 * Block type definitions, defaults, and categories.
 */
import {
  Layout, LayoutGrid, Minus,
  Type, AlignLeft, FileText, Image, MousePointerClick,
  Sparkles, Square, Grid3x3, Code2, List,
  Quote, AlertCircle, Tag, Video, LayoutPanelLeft,
  BarChart3, MessageSquare, ChevronDown, Layers, Megaphone, GalleryHorizontal,
  LayoutList, FolderOpen, SlidersHorizontal,
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'layout', label: 'Layout' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'composite', label: 'Components' },
  { id: 'dynamic', label: 'Dynamic' },
  { id: 'advanced', label: 'Advanced' },
];

export const BLOCK_DEFS = {
  // ── Layout ────────────────────────────
  section: {
    label: 'Section',
    icon: Layout,
    category: 'layout',
    canHaveChildren: true,
    defaults: { bgType: 'none', paddingY: 'py-12', paddingX: 'px-4', maxWidth: 'max-w-5xl mx-auto' },
  },
  grid: {
    label: 'Grid',
    icon: LayoutGrid,
    category: 'layout',
    canHaveChildren: true,
    defaults: { cols: '2', gap: 'gap-4' },
  },
  columns: {
    label: 'Columns',
    icon: LayoutPanelLeft,
    category: 'layout',
    canHaveChildren: true,
    defaults: { gap: 'gap-6', align: 'items-start', paddingY: '', paddingX: '' },
  },
  spacer: {
    label: 'Spacer',
    icon: Minus,
    category: 'layout',
    defaults: { height: 'h-8' },
  },
  divider: {
    label: 'Divider',
    icon: Minus,
    category: 'layout',
    defaults: { color: 'border-[hsl(var(--border))]', margin: 'my-6' },
  },

  // ── Content ───────────────────────────
  heading: {
    label: 'Heading',
    icon: Type,
    category: 'content',
    defaults: {
      text: 'Heading Text', level: 'h2',
      size: 'text-3xl', weight: 'font-bold',
      align: 'text-left', color: '',
    },
  },
  paragraph: {
    label: 'Paragraph',
    icon: AlignLeft,
    category: 'content',
    defaults: {
      text: 'Enter your paragraph text here.',
      size: 'text-base', align: 'text-left',
      color: '', lineHeight: 'leading-relaxed',
    },
  },
  richtext: {
    label: 'Rich Text',
    icon: FileText,
    category: 'content',
    defaults: { html: '<p>Edit this rich text content…</p>' },
  },
  quote: {
    label: 'Quote',
    icon: Quote,
    category: 'content',
    defaults: {
      text: 'An inspiring quote goes here.',
      author: 'Author Name',
      borderColor: 'border-[hsl(var(--primary))]',
      bgColor: 'bg-[hsl(var(--muted))]',
      textSize: 'text-lg',
      padding: 'p-6', rounded: 'rounded-2xl',
    },
  },
  badge: {
    label: 'Badge',
    icon: Tag,
    category: 'content',
    defaults: {
      text: 'New Feature',
      variant: 'bg-primary text-primary-foreground',
      size: 'text-xs', padding: 'px-3 py-1',
      rounded: 'rounded-full', align: 'text-left',
    },
  },
  alert: {
    label: 'Alert',
    icon: AlertCircle,
    category: 'content',
    defaults: {
      message: 'This is an important alert message.',
      title: '',
      type: 'info',
      rounded: 'rounded-xl',
    },
  },
  button: {
    label: 'Button',
    icon: MousePointerClick,
    category: 'content',
    defaults: {
      text: 'Click Me', href: '#',
      variant: 'bg-primary text-primary-foreground',
      padding: 'px-6 py-3', rounded: 'rounded-xl',
      align: 'text-left', weight: 'font-medium',
    },
  },
  list: {
    label: 'List',
    icon: List,
    category: 'content',
    defaults: {
      items: ['List item one', 'List item two', 'List item three'],
      ordered: false, size: 'text-base', color: '', spacing: 'space-y-2',
    },
  },

  // ── Media ─────────────────────────────
  image: {
    label: 'Image',
    icon: Image,
    category: 'media',
    defaults: {
      src: '', alt: '',
      width: 'w-full', height: 'h-64',
      objectFit: 'object-cover', rounded: 'rounded-lg',
    },
  },
  video: {
    label: 'Video Embed',
    icon: Video,
    category: 'media',
    defaults: {
      url: '',
      aspectRatio: 'aspect-video',
      rounded: 'rounded-xl',
      caption: '',
    },
  },
  gallery: {
    label: 'Gallery',
    icon: GalleryHorizontal,
    category: 'media',
    defaults: {
      images: [
        { src: '', alt: '' },
        { src: '', alt: '' },
        { src: '', alt: '' },
      ],
      cols: 'grid-cols-3', gap: 'gap-3',
      height: 'h-40', objectFit: 'object-cover',
      rounded: 'rounded-lg',
    },
  },

  // ── Composite ─────────────────────────
  hero: {
    label: 'Hero Banner',
    icon: Sparkles,
    category: 'composite',
    defaults: {
      title: 'Hero Title',
      subtitle: 'Hero subtitle text goes here',
      btnText: '', btnHref: '#',
      bgType: 'color', bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
      paddingY: 'py-20', align: 'text-center',
    },
  },
  card: {
    label: 'Card',
    icon: Square,
    category: 'composite',
    defaults: {
      title: 'Card Title',
      body: 'Card description text goes here.',
      padding: 'p-6', rounded: 'rounded-2xl',
      shadow: 'shadow-sm', bgType: 'color', bgColor: 'bg-card',
      border: 'ring-1 ring-[hsl(var(--border))]',
    },
  },
  stats: {
    label: 'Stats',
    icon: BarChart3,
    category: 'composite',
    defaults: {
      items: [
        { value: '10K+', label: 'Users' },
        { value: '99%', label: 'Uptime' },
        { value: '50+', label: 'Countries' },
        { value: '24/7', label: 'Support' },
      ],
      cols: 'grid-cols-2',
      gap: 'gap-4',
      padding: 'p-4',
      valueSize: 'text-3xl',
      valueWeight: 'font-bold',
      valueColor: 'text-primary',
      labelSize: 'text-sm',
      labelColor: 'text-muted-foreground',
      cardBg: 'bg-card',
      cardRounded: 'rounded-xl',
      cardBorder: 'border border-border',
      align: 'text-center',
    },
  },
  testimonial: {
    label: 'Testimonial',
    icon: MessageSquare,
    category: 'composite',
    defaults: {
      quote: 'This product changed my life. Highly recommended!',
      name: 'John Doe',
      role: 'CEO, Company Inc.',
      avatar: '',
      bgType: 'color', bgColor: 'bg-card',
      padding: 'p-6', rounded: 'rounded-2xl',
      border: 'ring-1 ring-[hsl(var(--border))]',
    },
  },
  accordion: {
    label: 'Accordion',
    icon: ChevronDown,
    category: 'composite',
    defaults: {
      items: [
        { question: 'What is this about?', answer: 'This is the answer to the first question.' },
        { question: 'How does it work?', answer: 'Here is an explanation of how it works.' },
        { question: 'Is it free?', answer: 'Yes, the basic plan is completely free.' },
      ],
      bgColor: 'bg-card',
      rounded: 'rounded-xl',
      border: 'border border-border',
    },
  },
  tabs: {
    label: 'Tabs',
    icon: Layers,
    category: 'composite',
    defaults: {
      items: [
        { label: 'Tab One', content: 'Content for the first tab goes here.' },
        { label: 'Tab Two', content: 'Content for the second tab goes here.' },
        { label: 'Tab Three', content: 'Content for the third tab goes here.' },
      ],
      activeTab: 0,
      tabBg: 'bg-muted',
      activeBg: 'bg-background',
      contentBg: 'bg-card',
      rounded: 'rounded-xl',
    },
  },
  cta: {
    label: 'Call to Action',
    icon: Megaphone,
    category: 'composite',
    defaults: {
      title: 'Ready to Get Started?',
      subtitle: 'Join thousands of users today.',
      btnText: 'Get Started',
      btnHref: '#',
      btnVariant: 'bg-primary text-primary-foreground',
      secondBtnText: 'Learn More',
      secondBtnHref: '#',
      secondBtnVariant: 'bg-card text-foreground ring-1 ring-[hsl(var(--border))]',
      bgType: 'none',
      paddingY: 'py-16',
      align: 'text-center',
      rounded: '',
    },
  },
  featureGrid: {
    label: 'Feature Grid',
    icon: Grid3x3,
    category: 'composite',
    defaults: {
      items: [
        { icon: '📚', title: 'Feature 1', desc: 'Description text', href: '' },
        { icon: '⭐', title: 'Feature 2', desc: 'Description text', href: '' },
        { icon: '🎯', title: 'Feature 3', desc: 'Description text', href: '' },
        { icon: '💡', title: 'Feature 4', desc: 'Description text', href: '' },
      ],
      cols: 'grid-cols-2', gap: 'gap-3', padding: 'px-4',
      cardBg: 'bg-card', cardRounded: 'rounded-xl',
      cardPadding: 'p-4', cardBorder: 'border border-border',
      iconSize: 'text-2xl',
      iconBg: '',
      iconRounded: 'rounded-xl',
      iconPadding: 'p-2',
      iconColor: '',
    },
  },

  // ── Dynamic (loop/slider) ───────────────
  postLoop: {
    label: 'Post Loop',
    icon: LayoutList,
    category: 'dynamic',
    defaults: {
      postTypeId: '',
      categoryId: '',
      count: 6,
      orderBy: 'latest',
      cols: 'grid-cols-2',
      gap: 'gap-4',
      paginationType: 'pagination',
      showImage: true,
      showCategory: true,
      showDate: true,
      showExcerpt: false,
      cardBg: 'bg-card',
      cardRounded: 'rounded-xl',
      cardBorder: 'border border-border',
      cardPadding: 'p-4',
      imageHeight: 'h-40',
    },
  },
  categoryLoop: {
    label: 'Category Loop',
    icon: FolderOpen,
    category: 'dynamic',
    defaults: {
      taxonomyId: '',
      count: 8,
      cols: 'grid-cols-2',
      gap: 'gap-3',
      showCount: true,
      cardBg: 'bg-card',
      cardRounded: 'rounded-xl',
      cardBorder: 'border border-border',
      cardPadding: 'p-4',
    },
  },
  slider: {
    label: 'Slider',
    icon: SlidersHorizontal,
    category: 'dynamic',
    defaults: {
      source: 'manual',
      postTypeId: '',
      categoryId: '',
      count: 5,
      loop: false,
      autoplay: false,
      autoplayInterval: 5000,
      transitionDuration: 300,
      items: [
        { image: '', title: 'Slide One', desc: '', href: '' },
        { image: '', title: 'Slide Two', desc: '', href: '' },
        { image: '', title: 'Slide Three', desc: '', href: '' },
      ],
      height: 'h-64',
      rounded: 'rounded-xl',
      showDots: true,
      showArrows: false,
      objectFit: 'object-cover',
      titleColor: 'text-white',
    },
  },

  // ── Advanced ──────────────────────────
  html: {
    label: 'Custom HTML',
    icon: Code2,
    category: 'advanced',
    defaults: { code: '<div class="p-4"><p>Custom HTML here</p></div>' },
  },
};

/** Create a new block instance from a type key. */
export function createBlock(type) {
  const def = BLOCK_DEFS[type];
  if (!def) return null;
  const block = {
    id: Math.random().toString(36).slice(2, 9),
    type,
    props: structuredClone(def.defaults),
    responsive: { sm: '', md: '', lg: '' },
  };
  if (def.canHaveChildren) block.children = [];
  return block;
}
