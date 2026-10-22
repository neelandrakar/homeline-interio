/**
 * Grounded Knowledge Configuration for Homeline Interio
 * The AI consultant and application only state business-specific facts from this configuration.
 * Fabricated guarantees, certifications, awards, or exact prices are strictly prohibited.
 */

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  suitableFor: string[];
  keyDecisions: string[];
  imageUrl: string;
}

export const BUSINESS_CONFIG = {
  brandName: 'Homeline Interio',
  tagline: 'Spaces That Feel Like Home.',
  category: 'Residential Interior Design, Modular Kitchens, and Design Consultation',
  region: 'Kolkata and nearby areas (West Bengal, India)',
  popularLocalities: [
    'Garia',
    'Salt Lake (Bidhannagar)',
    'New Town / Rajarhat',
    'Ballygunge',
    'Behala',
    'South City / Prince Anwar Shah Road',
    'Jadavpur',
    'Tollygunge',
    'Alipore',
    'Kestopur',
    'Dum Dum',
    'EM Bypass corridor',
    'Howrah'
  ],
  developerNotice: 'Interactive concept demo crafted by Nats LAB. Project examples and illustrative content are for demonstration purposes.',
  
  // Contact details are strictly labelled provisional for demo unless confirmed by client
  contact: {
    status: 'provisional_demo',
    city: 'Kolkata, West Bengal, India',
    enquiryNotice: 'Enquiries submitted via this demo are stored securely in the demo database for review in the Admin Dashboard.',
  },

  // Approved Demo Service Categories
  services: [
    {
      id: 'full-home-interiors',
      name: 'Full Home Interiors',
      slug: 'full-home-interiors',
      shortDescription: 'Comprehensive interior design and execution for 2BHK, 3BHK, 4BHK apartments and independent residences.',
      fullDescription: 'An end-to-end interior solution that unifies false ceilings, electrical planning, custom cabinetry, flooring accents, paint palettes, and soft furnishings into a cohesive home.',
      suitableFor: [
        'Homeowners taking possession of new apartments',
        'Complete home renovations before moving in',
        'Clients seeking a unified design vision across all rooms'
      ],
      keyDecisions: [
        'Living and dining flow vs open-concept zoning',
        'Storage requirements for each family member',
        'Lighting schemes (ambient, task, and accent lighting)'
      ],
      imageUrl: '/images/service-full-home.jpg'
    },
    {
      id: 'modular-kitchens',
      name: 'Modular Kitchens',
      slug: 'modular-kitchens',
      shortDescription: 'Ergonomic, moisture-resistant, and high-storage kitchens designed for modern culinary needs.',
      fullDescription: 'Custom-configured modular kitchens featuring heavy-duty drawer systems, oil-and-spice pullouts, marine-grade plywood or HDHMR carcasses, premium acrylic/laminate finishes, and quartz or granite countertops.',
      suitableFor: [
        'Kitchen remodels in existing Kolkata residences',
        'Compact kitchen spaces requiring smart storage solutions',
        'Home chefs who need durable, easy-to-clean surfaces'
      ],
      keyDecisions: [
        'Layout geometry (L-shaped, Parallel, U-shaped, or Island)',
        'Storage hardware and soft-close drawer capacity',
        'Chimney ducting routes and appliance placement'
      ],
      imageUrl: '/images/service-modular-kitchen.jpg'
    },
    {
      id: 'living-room-design',
      name: 'Living Room Design',
      slug: 'living-room-design',
      shortDescription: 'Warm, welcoming living and dining spaces designed for family gatherings and effortless entertaining.',
      fullDescription: 'Thoughtful spatial planning for entertainment units, accent wall paneling, acoustic balance, ambient coving, comfortable sofa arrangements, and subtle display niches.',
      suitableFor: [
        'Families wanting an updated social space',
        'Apartments with combined living and dining layouts',
        'Hosting-focused households'
      ],
      keyDecisions: [
        'TV unit design and concealed cable management',
        'Accent wall textures (fluted panels, stone veneers, or warm veneers)',
        'Delineation between dining area and seating lounge'
      ],
      imageUrl: '/images/service-living-room.jpg'
    },
    {
      id: 'bedroom-interiors',
      name: 'Bedroom Interiors',
      slug: 'bedroom-interiors',
      shortDescription: 'Restful master and guest sanctuaries with built-in wardrobes, upholstered headboards, and mood lighting.',
      fullDescription: 'Serene bedroom environments prioritizing peaceful acoustics, ergonomic study/work corners, floor-to-ceiling wardrobes with loft storage, and layered warm lighting.',
      suitableFor: [
        'Master bedroom retreats',
        'Kids bedrooms with adaptable study desks',
        'Elderly-friendly bedrooms with uncluttered walkways'
      ],
      keyDecisions: [
        'Wardrobe door mechanism (sliding vs swing shutters)',
        'Headboard height, fabric texture, and side table integration',
        'Bedside reading light positions and two-way switches'
      ],
      imageUrl: '/images/service-bedroom.jpg'
    },
    {
      id: 'space-planning',
      name: 'Space Planning & Layout Consultation',
      slug: 'space-planning',
      shortDescription: 'Architectural space optimization and 2D/3D layout planning before buying furniture or civil work.',
      fullDescription: 'Expert spatial assessments to resolve awkward corners, optimize walking corridors, maximize natural ventilation, and ensure every square foot serves a purposeful function.',
      suitableFor: [
        'Compact 1BHK / 2BHK flats with tight room proportions',
        'Homeowners wanting guidance before purchasing expensive furniture',
        'Pre-possession architectural floor plan reviews'
      ],
      keyDecisions: [
        'Circulation clearances and furniture sizing constraints',
        'Storage versus open visual breathing room',
        'Multifunctional furniture selection'
      ],
      imageUrl: '/images/service-space-planning.jpg'
    },
    {
      id: 'renovation-consultation',
      name: 'Renovation Consultation',
      slug: 'renovation-consultation',
      shortDescription: 'Structured guidance for upgrading older Kolkata properties, bathroom makeovers, and civil reconfigurations.',
      fullDescription: 'Practical advice on civil alterations, structural safety checks, plumbing/electrical overhauls, damp proofing, and phased execution for older flats or family homes.',
      suitableFor: [
        'Heritage or established apartments (10-30 years old)',
        'Homeowners experiencing damp or outdated wiring/plumbing',
        'Phased room-by-room home revamps'
      ],
      keyDecisions: [
        'Retaining vs replacing existing flooring and doors',
        'Waterproofing and electrical load assessments',
        'Budget allocation across civil repairs vs aesthetic finishes'
      ],
      imageUrl: '/images/service-renovation.jpg'
    }
  ] as ServiceCategory[],

  // 3-Step Consultation Workflow
  consultationSteps: [
    {
      step: 1,
      title: 'Tell Us About Your Space',
      description: 'Share your property type, room requirements, approximate budget, and location in Kolkata through our website or AI assistant.'
    },
    {
      step: 2,
      title: 'Explore Design Possibilities',
      description: 'We review your spatial constraints, discuss style preferences, and draft layout concepts tailored to your daily routine.'
    },
    {
      step: 3,
      title: 'Detailed Consultation & Plan',
      description: 'Meet with our design team to finalize material selections, 3D visualizations, precise estimates, and an execution roadmap.'
    }
  ],

  // Grounded FAQs for the AI Assistant
  groundedFaqs: [
    {
      question: 'Where does Homeline Interio operate?',
      answer: 'Homeline Interio focuses on residential interior design in Kolkata and adjoining areas, including Garia, Salt Lake, New Town, Rajarhat, South City, Ballygunge, Behala, and surrounding neighborhoods.'
    },
    {
      question: 'How do project estimates and budgets work?',
      answer: 'Budgets depend entirely on room dimensions, choice of core materials (marine ply, HDHMR, BWR), hardware brands, and custom finishes. We discuss your comfortable budget range during consultation and customize specifications to match.'
    },
    {
      question: 'Can I design just one room, like a kitchen or living room?',
      answer: 'Yes. While full-home interiors are common, we also consult on focused spaces such as modular kitchens, living room accent redesigns, or master bedrooms.'
    },
    {
      question: 'What is the consultation process?',
      answer: 'You can submit your requirements here or chat with our design assistant. Our design coordinator will review your project brief, reach out via your preferred contact method (Phone or WhatsApp), and coordinate a dedicated consultation.'
    }
  ]
};
