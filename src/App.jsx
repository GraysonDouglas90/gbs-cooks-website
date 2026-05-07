import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, Download, Play, Image as ImageIcon, FileText, ArrowLeft, Calendar, Linkedin, ExternalLink, Wrench, Users, Warehouse, Search } from 'lucide-react';
import Admin from './Admin.jsx';
import { supabase } from './supabase';

const productCategories = [
  { id: 'cooking', name: 'Cooking Equipment', icon: '\ud83d\udd25', description: 'Ranges, ovens, broilers, fryers, griddles, steamers', brandIds: ['americanRange', 'pizzaMaster', 'ultrafryer', 'angelopo', 'accutemp'] },
  { id: 'refrigeration', name: 'Refrigeration & Ice', icon: '\u2744\ufe0f', description: 'Ice machines, blast chillers, freezers', brandIds: ['itv', 'fagor', 'afinox'] },
  { id: 'food-prep', name: 'Food Preparation', icon: '\ud83d\udd2a', description: 'Slicers, grinders, vacuum sealers', brandIds: ['meatico', 'minipack'] },
  { id: 'beverage', name: 'Beverage', icon: '\ud83c\udf7a', description: 'Juicers, draught systems', brandIds: ['zummo', 'chillrite'] },
  { id: 'warewash', name: 'Warewashing & Sanitation', icon: '\ud83e\uddfc', description: 'Pan washers, glass polishers, cutlery dryers, oil filtration', brandIds: ['somengil', 'campus', 'frijado'] },
  { id: 'storage', name: 'Storage & Transport', icon: '\ud83d\udce6', description: 'Racks, shelving, transport', brandIds: ['winholt'] }
];

const provinces = [
  { name: 'British Columbia', abbr: 'BC', companies: 15, techs: 75, warehouse: true },
  { name: 'Alberta', abbr: 'AB', companies: 12, techs: 60, warehouse: true },
  { name: 'Saskatchewan', abbr: 'SK', companies: 7, techs: 35, warehouse: false },
  { name: 'Manitoba', abbr: 'MB', companies: 7, techs: 35, warehouse: false },
  { name: 'Ontario', abbr: 'ON', companies: 35, techs: 175, warehouse: true },
  { name: 'Quebec', abbr: 'QC', companies: 22, techs: 110, warehouse: true },
  { name: 'New Brunswick', abbr: 'NB', companies: 8, techs: 40, warehouse: false },
  { name: 'Nova Scotia', abbr: 'NS', companies: 7, techs: 35, warehouse: false },
  { name: 'Prince Edward Island', abbr: 'PEI', companies: 5, techs: 25, warehouse: false },
  { name: 'Newfoundland', abbr: 'NL', companies: 5, techs: 25, warehouse: false }
];

const clientLogos = ['Client 1','Client 2','Client 3','Client 4','Client 5','Client 6','Client 7','Client 8','Client 9','Client 10'];

// Real Canada map with recognizable province outlines
// Provinces positioned geographically with proper shapes
function CanadaMap({ progress, activeIndex }) {
  // More detailed province paths based on real geography
  // Viewbox is 1000x500, provinces positioned west to east
  const mapData = [
    { abbr: 'BC', idx: 0, path: "M40,120 L55,90 L50,70 L60,50 L55,35 L70,25 L85,30 L95,20 L110,25 L115,40 L120,30 L130,35 L128,50 L135,55 L130,70 L140,80 L138,95 L145,110 L155,120 L160,140 L155,165 L165,180 L158,200 L165,220 L155,240 L148,260 L135,275 L120,285 L105,280 L90,290 L75,280 L60,270 L50,255 L45,235 L40,215 L35,195 L30,175 L35,155 L40,140 Z", color: '#dc2626' },
    { abbr: 'AB', idx: 1, path: "M155,45 L230,45 L230,280 L155,280 L148,260 L155,240 L165,220 L155,200 L165,180 L155,165 L160,140 L155,120 L145,110 L138,95 L145,80 L140,65 L148,55 Z", color: '#dc2626' },
    { abbr: 'SK', idx: 2, path: "M230,45 L310,45 L310,280 L230,280 Z", color: '#dc2626' },
    { abbr: 'MB', idx: 3, path: "M310,45 L380,30 L395,45 L390,70 L400,90 L395,110 L385,130 L390,150 L400,170 L395,190 L385,210 L390,235 L385,260 L380,280 L310,280 Z", color: '#dc2626' },
    { abbr: 'ON', idx: 4, path: "M380,80 L400,60 L420,45 L445,35 L470,30 L500,25 L530,30 L550,45 L565,65 L570,90 L560,110 L565,130 L555,150 L545,165 L535,180 L540,200 L550,215 L545,235 L530,250 L510,260 L490,265 L465,270 L445,275 L420,280 L400,280 L385,260 L390,235 L395,210 L385,190 L395,170 L400,150 L390,130 L395,110 L400,90 Z", color: '#dc2626' },
    { abbr: 'QC', idx: 5, path: "M550,20 L580,15 L610,10 L640,15 L670,25 L700,20 L720,30 L735,50 L740,75 L730,95 L735,115 L725,135 L715,155 L720,175 L710,195 L700,210 L690,230 L680,245 L660,255 L640,260 L615,265 L590,270 L565,275 L545,270 L530,255 L540,235 L550,215 L545,195 L535,180 L545,165 L555,150 L565,130 L560,110 L570,90 L565,65 L555,50 Z", color: '#dc2626' },
    { abbr: 'NB', idx: 6, path: "M740,200 L755,185 L770,180 L785,185 L795,200 L790,218 L780,230 L765,235 L750,228 L740,215 Z", color: '#dc2626' },
    { abbr: 'NS', idx: 7, path: "M790,210 L810,195 L830,190 L850,195 L860,210 L855,225 L870,230 L875,245 L860,255 L840,250 L825,255 L810,248 L800,235 L790,225 Z", color: '#dc2626' },
    { abbr: 'PEI', idx: 8, path: "M805,178 L815,172 L830,170 L845,174 L850,182 L840,188 L825,190 L810,186 Z", color: '#dc2626' },
    { abbr: 'NL', idx: 9, path: "M850,60 L870,45 L890,40 L910,45 L925,60 L930,80 L935,100 L925,120 L930,140 L920,155 L905,165 L890,170 L875,165 L860,155 L855,135 L850,115 L845,95 L848,75 Z", color: '#dc2626' }
  ];

  // Journey line connecting province centers
  const centers = [
    { x: 100, y: 170 }, // BC
    { x: 192, y: 162 }, // AB
    { x: 270, y: 162 }, // SK
    { x: 350, y: 162 }, // MB
    { x: 475, y: 155 }, // ON
    { x: 640, y: 145 }, // QC
    { x: 765, y: 208 }, // NB
    { x: 835, y: 222 }, // NS
    { x: 828, y: 180 }, // PEI
    { x: 890, y: 108 }  // NL
  ];

  const journeyLine = centers.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');

  // Calculate how much of the journey line to show based on progress
  const activeCenter = centers[activeIndex];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <svg
        viewBox="0 0 1000 350"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${(0.5 - progress) * 40}%), -50%)`,
          transition: 'transform 0.4s ease-out',
          width: '160%',
          height: '100%',
          maxHeight: '80vh',
          opacity: 1
        }}
      >
        {/* Province shapes */}
        {mapData.map((prov) => {
          const isActive = prov.idx === activeIndex;
          return (
            <g key={prov.abbr}>
              {/* Glow effect for active province */}
              {isActive && (
                <path
                  d={prov.path}
                  fill="#dc2626"
                  opacity="0.15"
                  filter="url(#glow)"
                />
              )}
              <path
                d={prov.path}
                fill={isActive ? '#dc2626' : '#1f1f1f'}
                fillOpacity={isActive ? 0.35 : 0.15}
                stroke={isActive ? '#ef4444' : '#333'}
                strokeWidth={isActive ? 1.5 : 0.5}
                strokeOpacity={isActive ? 0.8 : 0.3}
                style={{ transition: 'all 0.6s ease' }}
              />
            </g>
          );
        })}

        {/* Journey dotted line */}
        <path
          d={journeyLine}
          fill="none"
          stroke="#555"
          strokeWidth="1"
          strokeDasharray="4,4"
          opacity="0.4"
        />

        {/* Active journey line (filled portion) */}
        <path
          d={centers.slice(0, activeIndex + 1).map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ')}
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          opacity="0.7"
          style={{ transition: 'all 0.4s ease' }}
        />

        {/* Province center dots */}
        {centers.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x} cy={c.y} r={i === activeIndex ? 6 : 3}
              fill={i <= activeIndex ? '#ef4444' : '#555'}
              opacity={i === activeIndex ? 1 : 0.6}
              style={{ transition: 'all 0.4s ease' }}
            />
            {i === activeIndex && (
              <circle cx={c.x} cy={c.y} r="12" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" from="8" to="18" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}

        {/* Glow filter */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}

function getPageFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (!hash || hash === '/') return { page: 'home' };
  if (hash === 'admin') return { page: 'admin' };
  if (hash.startsWith('product/')) {
    const parts = hash.split('/');
    return { page: 'product-detail', brandSlug: parts[1], productSlug: parts[2] };
  }
  return { page: hash.split('/')[0] || 'home' };
}

function slugify(text) {
  return (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function FormattedText({ text, className }) {
  if (!text) return null;
  const paragraphs = text.split(/\\n\\n|\n\n/).filter(p => p.trim());
  if (paragraphs.length <= 1) return <p className={className}>{text}</p>;
  return <div className={className}>{paragraphs.map((p, i) => <p key={i} className={i > 0 ? 'mt-4' : ''}>{p.trim()}</p>)}</div>;
}

// Hook to fetch brands from Supabase
function useBrands() {
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    supabase.from('brands').select('*').order('name').then(({ data }) => setBrands(data || []));
  }, []);
  return brands;
}

// Hook to fetch all products with related data
function useProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    supabase.from('products').select('*, product_images(*), product_documents(*), product_specs(*), product_features(*)').neq('published', false).order('name').then(({ data }) => setProducts(data || []));
  }, []);
  return products;
}

// Hook to fetch published blog posts
function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    supabase.from('blog_posts').select('*, blog_images(*)').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => setPosts(data || []));
  }, []);
  return posts;
}

// Hook to fetch site settings
function useSettings() {
  const [settings, setSettings] = useState({});
  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      const obj = {};
      (data || []).forEach(r => { obj[r.key] = r.value; });
      setSettings(obj);
    });
  }, []);
  return settings;
}

// Hook to fetch hero slides
function useHeroSlides() {
  const [slides, setSlides] = useState([]);
  useEffect(() => {
    supabase.from('hero_slides').select('*').eq('active', true).order('sort_order').then(({ data }) => setSlides(data || []));
  }, []);
  return slides;
}

function App() {
  const [route, setRoute] = useState(getPageFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navState, setNavState] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const brands = useBrands();
  const allProducts = useProducts();
  const blogPosts = useBlogPosts();
  const heroSlides = useHeroSlides();
  const settings = useSettings();

  const currentPage = route.page;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const h = () => setRoute(getPageFromHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const navigate = (page, extra = {}) => {
    setNavState(extra);
    setMobileMenuOpen(false);
    if (page === 'product-detail' && extra.product && extra.brandId) {
      const brand = brands.find(b => b.id === extra.brandId);
      const slug = slugify(extra.product.name);
      const brandSlug = slugify(brand?.name || extra.brandId);
      window.location.hash = `/product/${brandSlug}/${slug}`;
    } else {
      window.location.hash = page === 'home' ? '/' : `/${page}`;
    }
    window.scrollTo(0, 0);
  };

  // Find product by slug for direct URL access
  const findProductBySlug = () => {
    if (route.brandSlug && route.productSlug && allProducts.length > 0) {
      return allProducts.find(p => {
        const brand = brands.find(b => b.id === p.brand_id);
        return slugify(brand?.name || p.brand_id) === route.brandSlug && slugify(p.name) === route.productSlug;
      });
    }
    return null;
  };

  if (currentPage === 'admin') return <Admin />;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => navigate('home')} className="flex items-center">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.site_name || 'GBS'} style={{ maxHeight: '44px' }} className="object-contain" />
              ) : (
                <span className="text-xl font-bold tracking-tight"><span className="text-red-600">GBS</span> <span className="text-white text-sm font-medium">Foodservice Equipment Inc</span></span>
              )}
            </button>
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('home')} className="text-sm font-medium text-gray-300 hover:text-red-500">Home</button>
              <button onClick={() => navigate('products')} className="text-sm font-medium text-gray-300 hover:text-red-500">Products</button>
              <button onClick={() => navigate('about')} className="text-sm font-medium text-gray-300 hover:text-red-500">About</button>
              <button onClick={() => navigate('service')} className="text-sm font-medium text-gray-300 hover:text-red-500">Service</button>
              <div className="w-px h-6 bg-gray-700"></div>
              <button onClick={() => navigate('blog')} className="text-sm font-medium text-gray-500 hover:text-red-500">The Drop</button>
              <button onClick={() => navigate('demo')} className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700">Book a Demo</button>
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
            <button onClick={() => navigate('home')} className="block w-full text-left py-2 text-gray-300">Home</button>
            <button onClick={() => navigate('products')} className="block w-full text-left py-2 text-gray-300">Products</button>
            <button onClick={() => navigate('about')} className="block w-full text-left py-2 text-gray-300">About</button>
            <button onClick={() => navigate('service')} className="block w-full text-left py-2 text-gray-300">Service</button>
            <div className="border-t border-gray-800 pt-3"><button onClick={() => navigate('blog')} className="block w-full text-left py-2 text-gray-500">The Drop</button></div>
            <button onClick={() => navigate('demo')} className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-medium">Book a Demo</button>
          </div>
        )}
      </header>

      <main className="pt-20">
        {currentPage === 'home' && <HomePage navigate={navigate} brands={brands} blogPosts={blogPosts} heroSlides={heroSlides} />}
        {currentPage === 'products' && <ProductsPage navigate={navigate} brands={brands} allProducts={allProducts} initialBrand={navState.brand} initialCategory={navState.category} />}
        {currentPage === 'product-detail' && <ProductDetailPage navigate={navigate} brands={brands} product={navState.product || findProductBySlug()} brandId={navState.brandId} />}
        {currentPage === 'about' && <AboutPage settings={settings} brands={brands} />}
        {currentPage === 'service' && <ServicePage />}
        {currentPage === 'blog' && <BlogPage blogPosts={blogPosts} />}
        {currentPage === 'demo' && <DemoPage />}
      </main>

      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div><h3 className="text-xl font-bold mb-4">{settings.site_name || 'GBS Foodservice Equipment Inc'}</h3><p className="text-gray-400">Professional foodservice equipment</p></div>
            <div><h4 className="font-semibold mb-4">Links</h4><div className="space-y-2">{['home','products','about','service'].map(p => <button key={p} onClick={() => navigate(p)} className="block text-gray-400 hover:text-white capitalize">{p}</button>)}<button onClick={() => navigate('blog')} className="block text-gray-400 hover:text-white">The Drop</button></div></div>
            <div><h4 className="font-semibold mb-4">Resources</h4><button onClick={() => navigate('demo')} className="block text-gray-400 hover:text-white">Book a Demo</button><a href="https://www.linkedin.com/company/gbscooks" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white mt-2">LinkedIn</a></div>
            <div><h4 className="font-semibold mb-4">Contact</h4><div className="space-y-2 text-gray-400">{settings.contact_email && <div className="flex items-center space-x-2"><Mail size={16} /><span>{settings.contact_email}</span></div>}{settings.contact_phone && <div className="flex items-center space-x-2"><Phone size={16} /><span>{settings.contact_phone}</span></div>}</div></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">&copy; {new Date().getFullYear()} {settings.site_name || 'GBS Foodservice Equipment Inc'}. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ navigate, brands, blogPosts, heroSlides }) {
  const mapRef = useRef(null);
  const [mapProgress, setMapProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate slides
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    const h = () => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const sH = mapRef.current.offsetHeight, vH = window.innerHeight;
      if (rect.top <= 0 && rect.bottom >= vH) setMapProgress(Math.min(Math.max(Math.abs(rect.top) / (sH - vH), 0), 1));
      else if (rect.top > 0) setMapProgress(0);
      else setMapProgress(1);
    };
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  const pIdx = Math.min(Math.floor(mapProgress * provinces.length), provinces.length - 1);

  const activeSlide = heroSlides[currentSlide];

  return (
    <>
      {/* Hero Slideshow */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers for all slides */}
        {heroSlides.length > 0 ? (
          <>
            {heroSlides.map((slide, idx) => (
              <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                {slide.image_url ? (
                  <img src={slide.image_url} alt={slide.headline} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-red-950"></div>
                )}
              </div>
            ))}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight transition-opacity duration-500">{activeSlide?.headline || 'Premium Equipment, Unrivalled Support'}</h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto transition-opacity duration-500">{activeSlide?.subheadline || ''}</p>
              {activeSlide?.button_text && (
                <button onClick={() => navigate(activeSlide.button_link || 'products')} className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700">{activeSlide.button_text}</button>
              )}
            </div>
            {/* Slide indicators */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-3">
                {heroSlides.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentSlide(idx)} className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-red-600 w-8' : 'bg-white/50 hover:bg-white/70'}`} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950"></div>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Premium Equipment<br/>Unrivalled Support</h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">Canada's trusted partner for professional foodservice equipment. Proudly Canadian, delivering coast-to-coast service and expertise.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => navigate('products')} className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-red-700">Explore Equipment</button>
                <button onClick={() => navigate('demo')} className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100">Book a Demo</button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Brands from database */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12"><h2 className="text-4xl md:text-5xl font-bold mb-4">Our Brands</h2><p className="text-xl text-gray-400">Industry-leading manufacturers we proudly represent</p></div>
          {brands.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {brands.map(b => (
                <button key={b.id} onClick={() => navigate('products', { brand: b.id })} className="group relative overflow-hidden rounded-xl border border-gray-700 hover:border-red-600 transition-all" style={{ height: '120px' }}>
                  {/* Background */}
                  {b.image_url ? (
                    <>
                      <img src={b.image_url} alt={b.name} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/40 via-gray-900/80 to-gray-900/95"></div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
                      <div className="absolute top-3 left-4 text-6xl font-bold text-red-600/15 leading-none">{b.logo}</div>
                    </div>
                  )}
                  {/* Content */}
                  <div className="relative z-10 h-full flex items-center justify-between px-6">
                    <div>
                      <h3 className="text-xl font-bold mb-1 group-hover:text-red-400 transition-colors">{b.name}</h3>
                      <p className="text-sm text-gray-400">{b.tagline}</p>
                    </div>
                    <ChevronRight className="text-gray-600 group-hover:text-red-500 transition-colors flex-shrink-0" size={24} />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading brands...</p>
          )}
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose GBS Foodservice Equipment</h2></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          {[{n:'01',t:'Quality Equipment',d:'We source only from manufacturers known for reliability and performance.'},{n:'02',t:'Expert Support',d:'Decades of foodservice experience to help you select the right equipment.'},{n:'03',t:'Long-Term Partnership',d:"Service that extends beyond the initial sale."}].map(c => (
            <div key={c.n} className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-6"><div className="text-2xl font-bold text-red-500">{c.n}</div></div>
              <h3 className="text-2xl font-bold mb-4">{c.t}</h3><p className="text-gray-400">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={mapRef} className="relative bg-black" style={{ height: '250vh' }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="w-full">
            {/* Canada map background */}
            <CanadaMap progress={mapProgress} activeIndex={pIdx} />

            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black to-transparent pt-16 pb-8"><div className="text-center"><h2 className="text-3xl md:text-5xl font-bold mb-3">Coast to Coast Coverage</h2><p className="text-lg text-gray-400">Scroll to explore our nationwide service network</p></div></div>
            <div className="flex items-center h-screen relative z-10" style={{ transform: `translateX(calc(${-pIdx * 340}px + 50vw - 160px))`, transition: 'transform 0.3s ease-out' }}>
              <div className="flex items-center gap-6">
                {provinces.map((pr, idx) => (
                  <div key={pr.abbr} className={`flex-shrink-0 transition-all duration-500 ${idx === pIdx ? 'scale-105 opacity-100' : 'scale-90 opacity-40'}`} style={{ width: '320px' }}>
                    <div className="bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-700">
                      <div className="text-5xl font-bold text-red-600 mb-3 text-center">{pr.abbr}</div>
                      <h3 className="text-xl font-bold mb-4 text-center">{pr.name}</h3>
                      <div className="space-y-3 bg-gray-800/50 rounded-xl p-4">
                        <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Wrench size={18} className="text-red-500" /><span className="font-semibold text-sm">Service Companies</span></div><span className="text-xl font-bold text-red-500">{pr.companies}</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Users size={18} className="text-red-500" /><span className="font-semibold text-sm">Technicians</span></div><span className="text-xl font-bold text-red-500">{pr.techs}</span></div>
                        {pr.warehouse && <div className="flex items-center space-x-2 pt-2 border-t border-gray-700"><Warehouse size={18} className="text-green-500" /><span className="font-semibold text-sm">Warehouse & Parts</span></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-12 left-0 right-0 z-20"><div className="max-w-xl mx-auto px-4"><div className="bg-gray-800/50 rounded-full h-2 overflow-hidden"><div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${mapProgress * 100}%` }} /></div><div className="text-center mt-3 text-sm">{provinces[pIdx].name}</div></div></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2><p className="text-xl text-gray-400">Find exactly what your kitchen needs</p></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {productCategories.map(c => (<button key={c.id} onClick={() => navigate('products', { category: c.id })} className="group bg-gray-800 hover:bg-gray-950 border border-gray-700 hover:border-red-600 p-8 rounded-2xl transition-all text-left"><div className="text-5xl mb-4">{c.icon}</div><h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{c.name}</h3><p className="text-sm text-gray-400">{c.description}</p></button>))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8"><h3 className="text-3xl font-bold text-center">Trusted by Leading Operations</h3></div>
        <div className="relative"><div className="flex animate-scroll">{[...clientLogos,...clientLogos].map((l,i) => <div key={i} className="flex-shrink-0 mx-8 w-48 h-24 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-center"><span className="text-gray-500 font-semibold">{l}</span></div>)}</div></div>
      </section>

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <div className="flex items-center justify-center mb-4"><Linkedin className="text-blue-500 mr-3" size={40} /><h2 className="text-4xl md:text-5xl font-bold">Follow Our Journey</h2></div>
          <p className="text-xl text-gray-400 mb-6">Stay connected with the latest from GBS Foodservice Equipment</p>
          <a href="https://www.linkedin.com/company/gbscooks" target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-700">Visit Our LinkedIn <ExternalLink className="ml-2" size={20} /></a>
        </div>
      </section>

      {/* Blog from database */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12"><div><h2 className="text-4xl md:text-5xl font-bold mb-4">The Drop</h2><p className="text-xl text-gray-400">Latest from the foodservice industry</p></div><button onClick={() => navigate('blog')} className="hidden md:flex items-center text-red-500 font-semibold hover:underline">View All <ChevronRight size={20} className="ml-1" /></button></div>
          {blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map(p => (
                <button key={p.id} onClick={() => navigate('blog')} className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 transition-all group text-left">
                  {p.image_url ? <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover border-b border-gray-700" /> : <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center border-b border-gray-700"><ImageIcon size={64} className="text-gray-600" /></div>}
                  <div className="p-6">
                    <div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{p.title}</h3>
                    <p className="text-gray-400 mb-4">{p.excerpt}</p>
                    <div className="text-sm text-gray-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ''}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No blog posts yet. Add them in the admin panel.</p>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-red-900 to-red-800"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Kitchen?</h2><p className="text-xl mb-8 text-red-100">Schedule a demo with our equipment specialists</p><button onClick={() => navigate('demo')} className="bg-white text-red-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 inline-flex items-center"><Calendar className="mr-2" size={24} />Book Your Demo Today</button></div></section>

      <style>{`@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.animate-scroll{animation:scroll 30s linear infinite}.animate-scroll:hover{animation-play-state:paused}`}</style>
    </>
  );
}

function ProductsPage({ navigate, brands, allProducts, initialBrand, initialCategory }) {
  const [activeBrand, setActiveBrand] = useState(initialBrand || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(initialCategory ? 'category' : 'brand');
  const [activeCategory, setActiveCategory] = useState(initialCategory || null);
  const [activeSubFilter, setActiveSubFilter] = useState('all');

  // Get unique categories for the active brand
  const getBrandCategories = () => {
    if (!activeBrand) return [];
    const brandProducts = allProducts.filter(p => p.brand_id === activeBrand);
    const cats = [...new Set(brandProducts.map(p => p.category).filter(Boolean))];
    return cats.sort();
  };

  const brandCategories = getBrandCategories();

  // Reset sub-filter when brand changes
  useEffect(() => { setActiveSubFilter('all'); }, [activeBrand]);

  const getFilteredProducts = () => {
    let prods = [];
    if (viewMode === 'brand' && activeBrand) {
      prods = allProducts.filter(p => p.brand_id === activeBrand);
      if (activeSubFilter !== 'all') {
        prods = prods.filter(p => p.category === activeSubFilter);
      }
    } else if (viewMode === 'category' && activeCategory) {
      const cat = productCategories.find(c => c.id === activeCategory);
      if (cat) prods = allProducts.filter(p => cat.brandIds.includes(p.brand_id));
    } else if (viewMode === 'all') {
      prods = [...allProducts];
    }
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      prods = prods.filter(p => {
        const bName = brands.find(b => b.id === p.brand_id)?.name || '';
        return p.name.toLowerCase().includes(s) || p.model.toLowerCase().includes(s) || (p.category || '').toLowerCase().includes(s) || bName.toLowerCase().includes(s);
      });
    }
    return prods;
  };

  const filteredProducts = getFilteredProducts();
  const currentBrandInfo = brands.find(b => b.id === activeBrand);

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Our Products</h1><p className="text-xl text-gray-400">Professional equipment for every kitchen need</p></div></section>

      <section className="bg-gray-800 border-b border-gray-700"><div className="max-w-7xl mx-auto px-4 py-6"><div className="flex flex-col md:flex-row gap-4 items-center"><div className="relative flex-1 w-full"><Search size={20} className="absolute left-4 top-3.5 text-gray-500" /><input type="text" placeholder="Search all products..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); if(e.target.value) { setViewMode('all'); setActiveBrand(null); setActiveCategory(null); } }} className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-white" /></div><div className="flex space-x-3"><button onClick={() => { setViewMode('brand'); setActiveCategory(null); if(!activeBrand && brands.length) setActiveBrand(brands[0].id); }} className={`px-5 py-2.5 rounded-full font-medium ${viewMode === 'brand' ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-700'}`}>By Brand</button><button onClick={() => { setViewMode('category'); setActiveBrand(null); if(!activeCategory) setActiveCategory('cooking'); }} className={`px-5 py-2.5 rounded-full font-medium ${viewMode === 'category' ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-700'}`}>By Category</button></div></div></div></section>

      {viewMode === 'brand' && (
        <section className="bg-gray-900 border-b border-gray-800 sticky top-20 z-40"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex overflow-x-auto space-x-3 pb-2">{brands.map(b => <button key={b.id} onClick={() => setActiveBrand(b.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm ${activeBrand === b.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{b.name}</button>)}</div></div></section>
      )}

      {viewMode === 'category' && (
        <section className="bg-gray-900 border-b border-gray-800 sticky top-20 z-40"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex overflow-x-auto space-x-3 pb-2">{productCategories.map(c => <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm ${activeCategory === c.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{c.icon} {c.name}</button>)}</div></div></section>
      )}

      <section className="py-12"><div className="max-w-7xl mx-auto px-4">
        {viewMode === 'brand' && currentBrandInfo && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">{currentBrandInfo.name}</h2><p className="text-lg text-gray-400 mb-4">{currentBrandInfo.tagline}</p>{brandCategories.length > 1 && <div className="flex flex-wrap gap-2">{<button onClick={() => setActiveSubFilter('all')} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSubFilter === 'all' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'}`}>All ({allProducts.filter(p => p.brand_id === activeBrand).length})</button>}{brandCategories.map(cat => { const count = allProducts.filter(p => p.brand_id === activeBrand && p.category === cat).length; return <button key={cat} onClick={() => setActiveSubFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSubFilter === cat ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'}`}>{cat} ({count})</button>; })}</div>}</div>}
        {viewMode === 'category' && activeCategory && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">{productCategories.find(c=>c.id===activeCategory)?.name}</h2><p className="text-lg text-gray-400">{productCategories.find(c=>c.id===activeCategory)?.description}</p></div>}
        {searchTerm && viewMode === 'all' && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">Search Results</h2><p className="text-lg text-gray-400">{filteredProducts.length} found for "{searchTerm}"</p></div>}

        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => {
              const bInfo = brands.find(b => b.id === p.brand_id);
              const mainImage = p.product_images?.sort((a,b) => a.sort_order - b.sort_order)[0];
              return (
                <button key={p.id} onClick={() => navigate('product-detail', { product: p, brandId: p.brand_id })} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 transition-all group text-left">
                  {mainImage ? <div className="bg-white h-64 flex items-center justify-center border-b border-gray-700 p-4"><img src={mainImage.image_url} alt={mainImage.alt_text} className="max-w-full max-h-full object-contain" /></div> : <div className="bg-gradient-to-br from-gray-700 to-gray-900 h-64 flex items-center justify-center border-b border-gray-700"><div className="text-5xl font-bold text-gray-600 group-hover:text-red-600 transition-colors">{bInfo?.logo}</div></div>}
                  <div className="p-6">
                    {viewMode !== 'brand' && <div className="text-xs text-gray-500 font-semibold mb-1">{bInfo?.name}</div>}
                    <div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-500">{p.name}</h3>
                    <p className="text-gray-400 mb-4">{p.description}</p>
                    <div className="flex items-center justify-between"><span className="text-sm font-mono text-gray-500">{p.model}</span><span className="text-red-500 font-medium flex items-center">Details <ChevronRight size={16} className="ml-1" /></span></div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20"><Search size={64} className="mx-auto text-gray-600 mb-4" /><p className="text-xl text-gray-400">{searchTerm ? 'No products found.' : allProducts.length === 0 ? 'No products yet. Add them in the admin panel.' : 'Select a brand or category.'}</p></div>
        )}
      </div></section>
    </div>
  );
}

function ProductDetailPage({ navigate, brands, product, brandId }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState('overview');

  const bInfo = brands.find(b => b.id === (product?.brand_id || brandId));
  if (!product) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;

  const images = (product.product_images || []).sort((a,b) => a.sort_order - b.sort_order);
  const specs = product.product_specs || [];
  const features = (product.product_features || []).sort((a,b) => a.sort_order - b.sort_order);
  const docs = product.product_documents || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700"><div className="max-w-7xl mx-auto px-4 py-4"><button onClick={() => navigate('products', { brand: product.brand_id })} className="flex items-center text-gray-400 hover:text-red-500"><ArrowLeft size={20} className="mr-2" />Back to Products</button></div></div>

      <section className="py-12"><div className="max-w-7xl mx-auto px-4"><div className="grid lg:grid-cols-2 gap-12">
        <div>
          <div className="bg-white border border-gray-700 rounded-2xl overflow-hidden mb-4 h-96 flex items-center justify-center p-6">
            {images.length > 0 ? <img src={images[imgIdx]?.image_url} alt={images[imgIdx]?.alt_text} className="max-w-full max-h-full object-contain" /> : <div className="text-center"><div className="text-7xl font-bold text-gray-300 mb-4">{bInfo?.logo}</div><p className="text-gray-400">No images uploaded yet</p></div>}
          </div>
          {images.length > 1 && <div className="grid grid-cols-3 gap-3">{images.map((img, i) => <button key={img.id} onClick={() => setImgIdx(i)} className={`rounded-lg overflow-hidden h-24 border-2 bg-white flex items-center justify-center p-2 ${imgIdx === i ? 'border-red-600' : 'border-gray-700'}`}><img src={img.image_url} alt={img.alt_text} className="max-w-full max-h-full object-contain" /></button>)}</div>}
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-1">{bInfo?.name}</div>
          <div className="inline-block bg-red-900/30 text-red-500 px-4 py-1 rounded-full text-sm font-semibold mb-4">{product.category}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl text-gray-400 mb-6">{product.description}</p>
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"><div className="text-sm text-gray-500 mb-1">Model Number</div><div className="text-2xl font-bold font-mono">{product.model}</div></div>
          {specs.length > 0 && <div className="bg-black rounded-2xl p-6 mb-6 border border-gray-800"><h3 className="font-bold text-lg mb-4">Quick Specifications</h3><div className="grid grid-cols-2 gap-4">{specs.slice(0,4).map(s => <div key={s.id}><div className="text-gray-500 text-sm mb-1">{s.spec_name}</div><div className="font-semibold">{s.spec_value}</div></div>)}</div></div>}
          <div className="flex flex-col sm:flex-row gap-4"><button className="flex-1 bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700">Request Quote</button><button onClick={() => navigate('demo')} className="flex-1 bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-full font-semibold hover:border-red-600">Book Demo</button></div>
        </div>
      </div></div></section>

      <section className="py-12 bg-gray-800 border-t border-gray-700"><div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-700 mb-8"><div className="flex space-x-8 overflow-x-auto">{['overview','specifications','features','documents'].map(t => <button key={t} onClick={() => setTab(t)} className={`pb-4 font-semibold capitalize whitespace-nowrap ${tab === t ? 'border-b-2 border-red-600 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>)}</div></div>
        <div className="min-h-64">
          {tab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Product Overview</h2>
                <FormattedText text={product.full_description} className="text-lg text-gray-300 leading-relaxed mb-8" />
                {product.video_url && <div><h3 className="text-2xl font-bold mb-4">Product Video</h3><div className="rounded-2xl overflow-hidden aspect-video"><iframe src={product.video_url} className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div></div>}
              </div>
              <div>{features.length > 0 && <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h3 className="text-2xl font-bold mb-6">Key Features</h3><ul className="space-y-4">{features.map(f => <li key={f.id} className="flex items-start"><div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5"><ChevronRight size={14} className="text-white" /></div><span className="text-gray-300">{f.feature}</span></li>)}</ul></div>}</div>
            </div>
          )}
          {tab === 'specifications' && <div><h2 className="text-3xl font-bold mb-6">Technical Specifications</h2>{specs.length > 0 ? <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">{specs.map((s, i) => <div key={s.id} className={`grid grid-cols-2 p-5 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}`}><div className="font-semibold text-gray-400">{s.spec_name}</div><div>{s.spec_value}</div></div>)}</div> : <p className="text-gray-500">No specifications added yet.</p>}</div>}
          {tab === 'features' && <div><h2 className="text-3xl font-bold mb-6">Features & Benefits</h2>{features.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{features.map((f, i) => <div key={f.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-red-600"><div className="flex items-start"><div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4"><span className="text-red-500 font-bold">{i+1}</span></div><p className="text-gray-300 mt-2">{f.feature}</p></div></div>)}</div> : <p className="text-gray-500">No features listed yet.</p>}</div>}
          {tab === 'documents' && <div><h2 className="text-3xl font-bold mb-6">Downloads</h2>{docs.length > 0 ? <div className="grid md:grid-cols-3 gap-6">{docs.map(d => <div key={d.id} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-red-600 group"><div className="flex items-start justify-between mb-4"><FileText size={36} className="text-red-500" /><Download size={20} className="text-gray-600 group-hover:text-red-500" /></div><h3 className="font-bold text-lg mb-2">{d.name}</h3><div className="flex justify-between text-sm text-gray-500"><span>{d.file_type}</span><span>{d.file_size}</span></div><a href={d.file_url} target="_blank" rel="noopener noreferrer" className="block w-full mt-4 bg-gray-800 border border-gray-700 py-2 rounded-lg text-center hover:bg-red-600 hover:border-red-600">Download</a></div>)}</div> : <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700"><FileText size={64} className="mx-auto text-gray-600 mb-4" /><p className="text-gray-500">No documents uploaded yet.</p></div>}</div>}
        </div>
      </div></section>
    </div>
  );
}

function AboutPage({ settings, brands }) {
  const stats = [
    { num: settings.about_stat_1_number || '50+', label: settings.about_stat_1_label || 'Years in the Industry' },
    { num: settings.about_stat_2_number || '500+', label: settings.about_stat_2_label || 'Years Combined Experience' },
    { num: settings.about_stat_3_number || '10,000+', label: settings.about_stat_3_label || 'Kitchen Hours' },
    { num: settings.about_stat_4_number || '16', label: settings.about_stat_4_label || 'Global Manufacturing Partners' }
  ];

  const storyText = settings.about_story || '';
  const paragraphs = storyText.split(/\\n\\n|\n\n/).filter(p => p.trim());

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-red-950"></div>
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold text-lg mb-4 tracking-wider uppercase">Our Story</p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{settings.site_name || 'GBS Foodservice Equipment Inc'}</h1>
          <p className="text-xl md:text-2xl text-gray-300">{settings.about_hero_tagline || 'Your trusted partner in foodservice equipment'}</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-red-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className={`py-10 px-6 text-center ${i > 0 ? 'border-l border-red-600' : ''}`}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{s.num}</div>
                <div className="text-red-200 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative">
            {/* Decorative accent */}
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 via-red-600/50 to-transparent rounded-full"></div>
            
            <div className="pl-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-10">Built on experience.<br/>Driven by relationships.</h2>
              
              {paragraphs.length > 0 ? (
                <div className="space-y-6">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-lg text-gray-300 leading-relaxed">{p.trim()}</p>
                  ))}
                </div>
              ) : (
                <p className="text-lg text-gray-300 leading-relaxed">Add your company story in the admin panel under Settings.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values / Pillars */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What Sets Us Apart</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🔧', title: 'Kitchen People', desc: 'Our sales team has tens of thousands of hours of real kitchen experience. They\'ve worked the line and know what it takes to run a successful operation.' },
              { icon: '🌍', title: 'World-Class Partners', desc: 'We\'ve spent decades curating relationships with the world\'s leading equipment manufacturers. Every brand in our portfolio has earned its place.' },
              { icon: '🇨🇦', title: 'Proudly Canadian', desc: 'From Vancouver to St. John\'s, we deliver coast-to-coast coverage with local service partners, warehouses, and technical specialists across every province.' }
            ].map((v, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-2xl p-8 hover:border-red-600 transition-colors">
                <div className="text-4xl mb-6">{v.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{v.title}</h3>
                <p className="text-gray-400 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach - Timeline style */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Approach</h2>
          <div className="space-y-12">
            {[
              { step: '01', title: 'Listen', desc: 'We start by understanding your operation — your menu, your volume, your kitchen layout, and your goals. No two kitchens are the same.' },
              { step: '02', title: 'Recommend', desc: 'Our team draws on decades of hands-on experience to recommend equipment that fits your specific needs — not the most expensive option, the right one.' },
              { step: '03', title: 'Deliver', desc: 'From installation to training, we ensure your equipment is set up correctly and your team knows how to get the most out of it.' },
              { step: '04', title: 'Support', desc: 'Our relationship doesn\'t end at delivery. With coast-to-coast service coverage and dedicated support, we\'re here for the long haul.' }
            ].map((s, i) => (
              <div key={i} className="flex gap-8 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-500">{s.step}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands We Represent */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Manufacturing Partners</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Representing the finest names in global foodservice equipment</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {brands.map(b => (
              <div key={b.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5 text-center">
                {b.image_url ? (
                  <div className="h-12 flex items-center justify-center mb-3"><img src={b.image_url} alt={b.name} className="max-h-full max-w-full object-contain" /></div>
                ) : (
                  <div className="text-2xl font-bold text-gray-600 mb-3">{b.logo}</div>
                )}
                <div className="font-semibold text-sm">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-red-900 to-red-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Talk Equipment</h2>
          <p className="text-xl text-red-100 mb-8">Whether you're opening a new kitchen or upgrading an existing one, our team is ready to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={'mailto:' + (settings.contact_email || 'info@gbscooks.com')} className="bg-white text-red-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 inline-flex items-center justify-center"><Mail className="mr-2" size={24} />Email Us</a>
            {settings.contact_phone && <a href={'tel:' + settings.contact_phone} className="bg-red-700 text-white border border-red-500 px-8 py-4 rounded-full text-lg font-medium hover:bg-red-600 inline-flex items-center justify-center"><Phone className="mr-2" size={24} />Call Us</a>}
          </div>
        </div>
      </section>
    </div>
  );
}

function ServicePage() { return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Service & Support</h1><p className="text-xl text-gray-400">Unrivalled service across Canada</p></div></section><section className="py-20"><div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">{[{i:<Wrench className="text-red-500" size={48}/>,t:'Installation',d:'Professional installation from day one.'},{i:<Wrench className="text-red-500" size={48}/>,t:'Maintenance',d:'Regular maintenance for peak performance.'},{i:<Phone className="text-red-500" size={48}/>,t:'24/7 Support',d:'Round-the-clock support ensuring minimal downtime.'}].map((s,idx) => <div key={idx} className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">{s.i}<h3 className="text-2xl font-bold mb-4 mt-6">{s.t}</h3><p className="text-gray-400">{s.d}</p></div>)}</div></section></div>; }

function BlogPage({ blogPosts }) {
  const [selectedPost, setSelectedPost] = useState(null);

  if (selectedPost) {
    const post = selectedPost;
    const images = (post.blog_images || []).sort((a,b) => a.sort_order - b.sort_order);
    const paragraphs = (post.content || '').split(/\\n\\n|\n\n/).filter(p => p.trim());

    return (
      <div className="min-h-screen bg-gray-900">
        {/* Hero */}
        {post.hero_image_url ? (
          <section className="relative h-96 overflow-hidden">
            <img src={post.hero_image_url} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl mx-auto">
                <button onClick={() => setSelectedPost(null)} className="text-gray-300 hover:text-red-500 mb-4 flex items-center"><ArrowLeft size={20} className="mr-2" />Back to The Drop</button>
                <div className="text-sm text-red-500 font-semibold mb-2">{post.category}</div>
                <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>
                <p className="text-gray-400 mt-3">{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800">
            <div className="max-w-4xl mx-auto px-4">
              <button onClick={() => setSelectedPost(null)} className="text-gray-300 hover:text-red-500 mb-4 flex items-center"><ArrowLeft size={20} className="mr-2" />Back to The Drop</button>
              <div className="text-sm text-red-500 font-semibold mb-2">{post.category}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <p className="text-gray-400">{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4">
            {paragraphs.length > 0 ? (
              <div className="space-y-6">
                {paragraphs.map((p, i) => (
                  <React.Fragment key={i}>
                    <p className="text-lg text-gray-300 leading-relaxed">{p.trim()}</p>
                    {/* Insert an image after every 2-3 paragraphs */}
                    {images.length > 0 && i > 0 && i % 2 === 1 && images[Math.floor(i / 2)] && (
                      <div className="my-8 rounded-xl overflow-hidden">
                        <img src={images[Math.floor(i / 2)].image_url} alt={images[Math.floor(i / 2)].caption || ''} className="w-full rounded-xl" />
                        {images[Math.floor(i / 2)].caption && <p className="text-sm text-gray-500 mt-2 italic">{images[Math.floor(i / 2)].caption}</p>}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No content yet.</p>
            )}

            {/* Remaining images at the bottom */}
            {images.length > 0 && (
              <div className="mt-12 space-y-6">
                {images.filter((_, i) => i >= Math.floor(paragraphs.length / 2)).map(img => (
                  <div key={img.id} className="rounded-xl overflow-hidden">
                    <img src={img.image_url} alt={img.caption || ''} className="w-full rounded-xl" />
                    {img.caption && <p className="text-sm text-gray-500 mt-2 italic">{img.caption}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* PDF download */}
            {post.pdf_url && (
              <div className="mt-12 bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Download the full edition</h3>
                  <p className="text-gray-400 text-sm">Get The Drop as a PDF</p>
                </div>
                <a href={post.pdf_url} target="_blank" rel="noopener noreferrer" className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center"><Download size={20} className="mr-2" />Download PDF</a>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">The Drop</h1><p className="text-xl text-gray-400">Insights, trends, and tips from foodservice</p></div></section>
      <section className="py-12"><div className="max-w-7xl mx-auto px-4">
        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map(p => (
              <button key={p.id} onClick={() => setSelectedPost(p)} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 transition-all group text-left">
                {p.hero_image_url ? <img src={p.hero_image_url} alt={p.title} className="w-full h-56 object-cover border-b border-gray-700" /> : <div className="bg-gradient-to-br from-gray-700 to-gray-900 h-56 flex items-center justify-center border-b border-gray-700"><ImageIcon size={64} className="text-gray-600" /></div>}
                <div className="p-6">
                  <div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-red-500 transition-colors">{p.title}</h3>
                  <p className="text-gray-400 mb-4">{p.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{p.published_at ? new Date(p.published_at).toLocaleDateString() : ''}</span>
                    {p.pdf_url && <span className="text-xs text-blue-400">PDF available</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">No blog posts yet. Add them in the admin panel.</p>
        )}
      </div></section>
    </div>
  );
}

function DemoPage() { const [fd, setFd] = useState({ name:'', email:'', phone:'', company:'', equipment:'', message:'' }); return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Book a Demo</h1><p className="text-xl text-gray-400">See our equipment in action</p></div></section><section className="py-12"><div className="max-w-3xl mx-auto px-4"><div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12"><form onSubmit={e => { e.preventDefault(); alert('Demo request submitted!'); }} className="space-y-6"><div className="grid md:grid-cols-2 gap-6">{[{l:'Name *',k:'name',t:'text',p:'Your name'},{l:'Email *',k:'email',t:'email',p:'your@email.com'}].map(f => <div key={f.k}><label className="block text-sm font-semibold text-gray-300 mb-2">{f.l}</label><input type={f.t} required value={fd[f.k]} onChange={e => setFd({...fd,[f.k]:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder={f.p} /></div>)}</div><div className="grid md:grid-cols-2 gap-6">{[{l:'Phone *',k:'phone',p:'(123) 456-7890'},{l:'Company',k:'company',p:'Company name'}].map(f => <div key={f.k}><label className="block text-sm font-semibold text-gray-300 mb-2">{f.l}</label><input type="text" value={fd[f.k]} onChange={e => setFd({...fd,[f.k]:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder={f.p} /></div>)}</div><div><label className="block text-sm font-semibold text-gray-300 mb-2">Equipment Interest</label><select value={fd.equipment} onChange={e => setFd({...fd,equipment:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"><option value="">Select...</option><option>Cooking Equipment</option><option>Refrigeration</option><option>Food Preparation</option><option>Beverage</option><option>Warewashing</option><option>Other</option></select></div><div><label className="block text-sm font-semibold text-gray-300 mb-2">Message</label><textarea value={fd.message} onChange={e => setFd({...fd,message:e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder="Tell us about your needs..." /></div><button type="submit" className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700">Submit Demo Request</button></form></div></div></section></div>; }

export default App;
