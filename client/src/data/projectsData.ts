import { ProjectConcept } from '../types';

export const INITIAL_PROJECTS: ProjectConcept[] = [
  {
    id: 'proj-01',
    slug: 'warm-contemporary-living',
    title: 'Warm Contemporary Living',
    category: 'Living Room',
    style: 'Warm Contemporary',
    description: 'An open-concept Kolkata living lounge featuring fluted oak paneling, concealed warm ambient LED cove lighting, and soft neutral linen upholstery.',
    imageUrl: '/images/warm-contemporary-living.jpg',
    imageAlt: 'Warm contemporary living room concept with wooden accents and warm lighting',
    featured: true,
    brief: 'Designed for a modern family apartment requiring a relaxing conversational area and streamlined entertainment center without visual clutter.',
    materials: ['Natural Oak Veneer', 'Fluted Charcoal Panels', 'Brushed Brass Metal Accents', 'Textured Linen Fabric'],
    colorPalette: [
      { name: 'Warm Ivory', hex: '#F7F5F0' },
      { name: 'Muted Oak', hex: '#8C6D53' },
      { name: 'Deep Charcoal', hex: '#242722' },
      { name: 'Soft Olive', hex: '#68745A' }
    ],
    layoutInspiration: 'L-shaped seating oriented towards natural balcony light with an integrated floating media console and concealed storage.',
    relatedSlugs: ['natural-wood-kitchen', 'calm-bedroom-retreat', 'compact-apartment-living']
  },
  {
    id: 'proj-02',
    slug: 'natural-wood-kitchen',
    title: 'Natural Wood & Stone Kitchen',
    category: 'Kitchen',
    style: 'Modern Organic',
    description: 'An ergonomic parallel modular kitchen featuring warm walnut laminates, matte black profile handles, and durable quartz countertop surfaces.',
    imageUrl: '/images/natural-wood-kitchen.jpg',
    imageAlt: 'Modern natural wood kitchen concept with stone countertop and pendant lamps',
    featured: true,
    brief: 'A balanced kitchen concept tailored for Indian cooking with specialized deep spice drawers, dedicated chimney duct casing, and easy-clean backsplash panels.',
    materials: ['BWR Marine Grade Core', 'Textured Walnut Laminate', 'Engineered Quartz Countertop', 'Soft-close Tandem Boxes'],
    colorPalette: [
      { name: 'Walnut Brown', hex: '#5B4433' },
      { name: 'Ivory Quartz', hex: '#EAE5DC' },
      { name: 'Matte Graphite', hex: '#3D413A' },
      { name: 'Sage Green', hex: '#8C9F80' }
    ],
    layoutInspiration: 'Golden triangle ergonomic layout with wet zone, prep counter, and cooking hob spaced for seamless movement.',
    relatedSlugs: ['warm-contemporary-living', 'ballygunge-full-home', 'compact-apartment-living']
  },
  {
    id: 'proj-03',
    slug: 'calm-bedroom-retreat',
    title: 'Calm Bedroom Retreat',
    category: 'Bedroom',
    style: 'Japandi & Minimalist',
    description: 'A tranquil master bedroom retreat with floor-to-ceiling tinted glass wardrobes, a floating walnut bed frame, and acoustic fabric wall panels.',
    imageUrl: '/images/calm-bedroom-retreat.jpg',
    imageAlt: 'Minimalist bedroom concept with cozy wooden headboard and layered warm lighting',
    featured: true,
    brief: 'Conceived to offer restorative rest away from Kolkata city bustle, blending Japanese minimalism with Scandinavian functional comfort.',
    materials: ['Bouclé Upholstery', 'Smoked Glass Shutters', 'Light Ash Wood', 'Brushed Bronze Reading Lights'],
    colorPalette: [
      { name: 'Alabaster White', hex: '#FBF9F5' },
      { name: 'Warm Taupe', hex: '#C2C1BA' },
      { name: 'Natural Ash', hex: '#CFB092' },
      { name: 'Forest Olive', hex: '#545E49' }
    ],
    layoutInspiration: 'Symmetrical bed placement facing soft sheer drapery with dedicated dress mirror vanity along the perimeter wall.',
    relatedSlugs: ['warm-contemporary-living', 'ballygunge-full-home', 'serene-guest-bedroom']
  },
  {
    id: 'proj-04',
    slug: 'compact-apartment-living',
    title: 'Compact 2BHK Urban Sanctuary',
    category: 'Compact Spaces',
    style: 'Space-Optimized Scandinavian',
    description: 'Smart multifunctional living and dining in a Garia 2BHK apartment, featuring foldable breakfast ledge and dual-purpose storage banquettes.',
    imageUrl: '/images/compact-apartment-living.jpg',
    imageAlt: 'Compact Scandinavian apartment interior concept with multipurpose furniture',
    featured: true,
    brief: 'A space-conscious concept proving that smaller floor plans can feel open, breezy, and effortlessly organized with custom carpentry.',
    materials: ['Birch Plywood', 'Matte White Acrylic', 'Rattan Weave Insets', 'Slimline Metal Frames'],
    colorPalette: [
      { name: 'Cloud White', hex: '#FFFFFF' },
      { name: 'Pale Birch', hex: '#E2CEB9' },
      { name: 'Charcoal Accent', hex: '#242722' },
      { name: 'Dusty Olive', hex: '#ADBCA2' }
    ],
    layoutInspiration: 'Combined dining and study nook tucked into window alcove with floor-to-ceiling vertical shelving.',
    relatedSlugs: ['natural-wood-kitchen', 'warm-contemporary-living', 'saltlake-compact-studio']
  },
  {
    id: 'proj-05',
    slug: 'ballygunge-full-home',
    title: 'The Ballygunge Residence Concept',
    category: 'Full Home',
    style: 'Transitional Modern',
    description: 'A 3BHK residence concept harmonizing heritage Calcutta architectural cues with clean contemporary millwork and refined brass details.',
    imageUrl: '/images/ballygunge-full-home.jpg',
    imageAlt: 'Spacious 3BHK full home interior design concept with curated artwork and high ceilings',
    featured: false,
    brief: 'An illustrative full-home design concept demonstrating seamless aesthetic transitions between living foyer, formal dining, modular kitchen, and three restful bedrooms.',
    materials: ['Italian Marble Flooring', 'Teak Wood Accents', 'Fluted Glass Partitions', 'Custom Lacquered Millwork'],
    colorPalette: [
      { name: 'Ivory Marble', hex: '#F0ECE4' },
      { name: 'Deep Walnut', hex: '#423226' },
      { name: 'Aged Brass', hex: '#CFB092' },
      { name: 'Forest Moss', hex: '#424B3A' }
    ],
    layoutInspiration: 'Grand entrance foyer flowing into split formal-informal living zones with dedicated pooja niche and concealed utility balcony.',
    relatedSlugs: ['warm-contemporary-living', 'natural-wood-kitchen', 'calm-bedroom-retreat']
  },
  {
    id: 'proj-06',
    slug: 'newtown-minimalist-kitchen',
    title: 'New Town Minimalist Island Kitchen',
    category: 'Kitchen',
    style: 'Ultra-Minimalist',
    description: 'Handleless flat-panel cabinetry in matte ceramic gray with an extended quartz breakfast island and integrated induction cooktop.',
    imageUrl: '/images/newtown-minimalist-kitchen.jpg',
    imageAlt: 'Minimalist kitchen island concept with sleek handleless cabinets',
    featured: false,
    brief: 'Designed for contemporary high-rise apartments in New Town, focusing on clean horizontal sightlines and hidden appliances.',
    materials: ['Anti-fingerprint Matte Laminate', 'KalingaStone Quartz', 'Anodized Black Aluminum Profiles', 'Integrated LED Strips'],
    colorPalette: [
      { name: 'Slate Gray', hex: '#545850' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Warm Charcoal', hex: '#242722' },
      { name: 'Olive Gray', hex: '#77776E' }
    ],
    layoutInspiration: 'L-shape with freestanding center island doubling as breakfast counter and secondary prep zone.',
    relatedSlugs: ['natural-wood-kitchen', 'compact-apartment-living', 'warm-contemporary-living']
  },
  {
    id: 'proj-07',
    slug: 'serene-guest-bedroom',
    title: 'Serene Guest Bedroom & Study',
    category: 'Bedroom',
    style: 'Modern Scandinavian',
    description: 'A versatile bedroom layout integrating an ergonomic work-from-home desk, daybed conversion, and recessed wardrobe storage.',
    imageUrl: '/images/serene-guest-bedroom.jpg',
    imageAlt: 'Guest bedroom concept with study table and soft natural lighting',
    featured: false,
    brief: 'A dual-function room concept solving the common need for a comfortable home office during weekdays and an inviting guest suite on weekends.',
    materials: ['Light Oak Melamine', 'Powder Coated Steel', 'Linen Blend Curtains', 'Sisal Rug'],
    colorPalette: [
      { name: 'Warm Canvas', hex: '#F7F5F0' },
      { name: 'Light Oak', hex: '#CFB092' },
      { name: 'Earthy Green', hex: '#68745A' },
      { name: 'Soft Gray', hex: '#9B9B93' }
    ],
    layoutInspiration: 'Desk positioned perpendicular to window for glare-free daytime video calls and task lighting.',
    relatedSlugs: ['calm-bedroom-retreat', 'compact-apartment-living', 'ballygunge-full-home']
  },
  {
    id: 'proj-08',
    slug: 'saltlake-compact-studio',
    title: 'Salt Lake Compact Studio Concept',
    category: 'Compact Spaces',
    style: 'Urban Japandi',
    description: 'A 550 sq.ft. compact apartment interior with sliding shoji-inspired fluted glass partitions and integrated perimeter storage.',
    imageUrl: '/images/saltlake-compact-studio.jpg',
    imageAlt: 'Studio apartment interior concept with sliding glass partition and clever storage',
    featured: false,
    brief: 'Demonstrating how studio spaces can provide distinct living, dining, and sleeping zones without erecting permanent opaque masonry walls.',
    materials: ['Fluted Glass', 'Ash Wood Framing', 'Microcement Wall Accent', 'Built-in Bed Storage Drawers'],
    colorPalette: [
      { name: 'Warm Bone', hex: '#EAE5DC' },
      { name: 'Ash Veneer', hex: '#B8906F' },
      { name: 'Deep Olive', hex: '#32392C' },
      { name: 'Natural Wool', hex: '#F0ECE4' }
    ],
    layoutInspiration: 'Sliding fluted room dividers that permit diffuse daylight to permeate while providing privacy when required.',
    relatedSlugs: ['compact-apartment-living', 'warm-contemporary-living', 'calm-bedroom-retreat']
  }
];
