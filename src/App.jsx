import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, Phone, Mail, Download, Play, Image as ImageIcon, FileText, ArrowLeft, Calendar, Linkedin, ExternalLink, Wrench, Users, Warehouse, Search, Filter } from 'lucide-react';
import Admin from './Admin.jsx';

const productData = {
  americanRange: [
    { model: "ARHD-12", name: "Heavy Duty Range", description: '12" Hot Top with Standard Oven', category: "Ranges", fullDescription: "Professional heavy-duty range designed for high-volume commercial kitchens.", specifications: { dimensions: '36"W x 36"D x 56"H', power: "Natural Gas or LP Gas", btu: "30,000 BTU/hr top, 35,000 BTU/hr oven", weight: "450 lbs" }, features: ["Heavy-duty cast iron top grates", "Standing pilot ignition system", "Stainless steel front and sides", "Removable crumb tray"], videoUrl: true, images: [{ alt: "Front view" }, { alt: "Hot top surface" }, { alt: "Oven interior" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.4 MB" }] },
    { model: "AROB-6", name: "Onion Bun Toaster", description: "6 Bun Capacity", category: "Specialty", fullDescription: "Specialized toasting equipment for high-volume operations.", specifications: { dimensions: '18"W x 20"D x 14"H', power: "120V, 15 Amps", capacity: "6 buns per cycle", weight: "45 lbs" }, features: ["Adjustable browning control", "Easy-to-clean crumb tray", "Commercial-grade heating elements"], images: [{ alt: "AROB-6 Bun Toaster" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.2 MB" }] },
    { model: "ARRG-24", name: "Radiant Broiler", description: '24" Gas Charbroiler', category: "Broilers", fullDescription: "Commercial gas charbroiler with radiant heat design.", specifications: { dimensions: '24"W x 32"D x 15"H', power: "Natural Gas or LP Gas", btu: "80,000 BTU/hr", weight: "180 lbs" }, features: ["Radiant heat technology", "Adjustable cast iron grates", "Removable grease drawer"], videoUrl: true, images: [{ alt: "Broiler front" }, { alt: "Grates detail" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.1 MB" }] }
  ],
  itv: [
    { model: "SPIKA-NG110", name: "Spika Ice Maker", description: "110 lbs/day Nugget Ice", category: "Ice Machines", fullDescription: "Compact nugget ice maker producing up to 110 pounds per day.", specifications: { dimensions: '22"W x 26"D x 35"H', power: "115V, 60Hz", production: "110 lbs/24 hours", storage: "22 lbs" }, features: ["Soft nugget ice", "Air-cooled condenser", "Self-contained design"], videoUrl: true, images: [{ alt: "Spika ice maker" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.9 MB" }] },
    { model: "DELTA-NG250", name: "Delta Ice Maker", description: "250 lbs/day Nugget Ice", category: "Ice Machines", fullDescription: "High-capacity nugget ice maker for demanding commercial applications.", specifications: { dimensions: '30"W x 28"D x 38"H', power: "115V, 60Hz", production: "250 lbs/24 hours", storage: "80 lbs" }, features: ["High daily production", "Large storage capacity", "Energy efficient"], images: [{ alt: "Delta ice maker" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.0 MB" }] }
  ],
  meatico: [
    { model: "ME-32", name: "Meat Grinder", description: "#32 Heavy Duty Grinder", category: "Grinders", fullDescription: "Industrial-grade meat grinder for butcher shops and processing.", specifications: { dimensions: '24"W x 18"D x 20"H', power: "220V, 3-phase", capacity: "800-1000 lbs/hour", motor: "3 HP" }, features: ["#32 grinding head", "Stainless steel construction", "Forward and reverse"], videoUrl: true, images: [{ alt: "ME-32 Grinder" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.5 MB" }] }
  ],
  minipack: [
    { model: "MVS-31X", name: "Vacuum Sealer", description: "31cm Seal Bar", category: "Vacuum Sealers", fullDescription: "Professional vacuum sealer with 31cm seal bar.", specifications: { dimensions: '19"W x 18"D x 14"H', power: "115V, 60Hz", sealBar: "31 cm", pumpCapacity: "20 m\u00b3/hr" }, features: ["Digital control panel", "Adjustable vacuum levels", "Double seal option"], images: [{ alt: "MVS-31X Sealer" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.3 MB" }] }
  ],
  pizzaMaster: [
    { model: "PM-451ED", name: "Pizza Oven", description: "4+4 Deck Electric", category: "Pizza Ovens", fullDescription: "Professional electric deck pizza oven.", specifications: { dimensions: '43"W x 43"D x 77"H', power: "208-240V, 3-phase", chambers: "2 chambers", temperature: "Up to 932\u00b0F" }, features: ["Stone deck surface", "Individual chamber controls", "Digital temperature display", "Steam injection"], videoUrl: true, images: [{ alt: "PM-451ED" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.7 MB" }] }
  ],
  ultrafryer: [
    { model: "B-E17-14", name: "Electric Fryer", description: "17lb Capacity", category: "Fryers", fullDescription: "Commercial electric fryer with 17-pound oil capacity.", specifications: { dimensions: '15.5"W x 29"D x 42"H', power: "208V or 240V, 3-phase", capacity: "17 lbs oil", output: "40-50 lbs/hour" }, features: ["Solid-state controls", "Built-in filtration", "Cool-zone design"], videoUrl: true, images: [{ alt: "B-E17-14 Fryer" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.6 MB" }] }
  ],
  zummo: [
    { model: "Z1", name: "Z1 Nature", description: "Entry-Level Countertop Juicer", category: "Juicers", fullDescription: "The most compact commercial juicer in the Zummo range. Designed for low-to-medium volume operations.", specifications: { dimensions: '10.6"W x 14.9"D x 28.3"H', power: "115V, 60Hz", production: "8 fruits/minute", fruitSize: "45-85mm", weight: "44 lbs" }, features: ["Patented vertical squeezing", "Compact countertop design", "Automatic fruit feed", "Easy disassembly for cleaning"], images: [{ alt: "Z1 Nature" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.2 MB" }] },
    { model: "Z06", name: "Z06 Nature", description: "Compact Commercial Juicer", category: "Juicers", fullDescription: "Versatile compact commercial juicer for medium-volume operations.", specifications: { dimensions: '14.1"W x 17.1"D x 27.5"H', power: "115V, 60Hz", production: "10 fruits/minute", fruitSize: "50-85mm", weight: "57 lbs" }, features: ["Handles multiple citrus sizes", "Automatic feed system", "Low waste extraction"], images: [{ alt: "Z06 Nature" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.3 MB" }] },
    { model: "Z14", name: "Z14 Self-Service", description: "Self-Service Commercial Juicer", category: "Juicers", fullDescription: "Flagship self-service juicer for high-traffic environments. One button operation.", specifications: { dimensions: '17.9"W x 18.7"D x 30.5"H', power: "115V, 60Hz", production: "22 fruits/minute", fruitSize: "60-90mm", weight: "88 lbs" }, features: ["Self-service one-button operation", "22 fruits/minute", "Automatic gravity feeder", "NSF certified"], videoUrl: true, images: [{ alt: "Z14 Self-Service" }, { alt: "Z14 in buffet" }, { alt: "Juice output" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.6 MB" }, { name: "Installation Guide", type: "PDF", size: "1.2 MB" }] },
    { model: "Z14-CL", name: "Z14 Contactless", description: "Contactless Self-Service Juicer", category: "Juicers", fullDescription: "Touchless operation with infrared sensor. Zero-touch hygiene.", specifications: { dimensions: '17.9"W x 18.7"D x 30.5"H', power: "115V, 60Hz", production: "22 fruits/minute", activation: "Infrared touchless" }, features: ["Contactless infrared activation", "Zero-touch hygiene", "22 fruits/minute", "NSF certified"], videoUrl: true, images: [{ alt: "Z14 Contactless" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.7 MB" }] },
    { model: "Z14-CS", name: "Z14 Cabinet Slim", description: "Self-Service Juicer with Slim Cabinet", category: "Juicers", fullDescription: "Z14 juicer with integrated slim refrigerated storage cabinet.", specifications: { dimensions: '17.9"W x 22"D x 63"H', power: "115V, 60Hz", production: "22 fruits/minute", storage: "Refrigerated cabinet" }, features: ["Integrated refrigerated cabinet", "Slim profile", "Self-service operation", "Professional freestanding design"], images: [{ alt: "Z14 Cabinet Slim" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.8 MB" }] },
    { model: "Z40", name: "Z40 Nature", description: "High-Volume Commercial Juicer", category: "Juicers", fullDescription: "High-volume juicer. Up to 40 fruits per minute for maximum throughput.", specifications: { dimensions: '19.6"W x 21.6"D x 31.8"H', power: "115V, 60Hz", production: "40 fruits/minute", weight: "110 lbs" }, features: ["Industry-leading 40 fruits/minute", "Heavy-duty continuous operation", "Patented vertical squeezing", "NSF certified"], videoUrl: true, images: [{ alt: "Z40 Nature" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.0 MB" }] },
    { model: "Z40-ADV", name: "Z40 Advance", description: "Advanced High-Volume Juicer", category: "Juicers", fullDescription: "Advanced digital controls and improved extraction for premium juice operations.", specifications: { dimensions: '19.6"W x 21.6"D x 31.8"H', power: "115V, 60Hz", production: "40 fruits/minute", controls: "Digital programmable" }, features: ["Advanced digital controls", "Programmable fruit settings", "Enhanced extraction", "40 fruits/minute"], videoUrl: true, images: [{ alt: "Z40 Advance" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.1 MB" }] },
    { model: "Z40-ADV-CAB", name: "Z40 Advance Cabinet", description: "Advanced Juicer with Cabinet", category: "Juicers", fullDescription: "Z40 Advance with integrated refrigeration cabinet. Complete juice station.", specifications: { dimensions: '22"W x 24"D x 67"H', power: "115V, 60Hz", production: "40 fruits/minute", storage: "Refrigerated cabinet" }, features: ["Z40 Advance + refrigerated cabinet", "Digital programmable controls", "Complete juice station", "40 fruits/minute"], images: [{ alt: "Z40 Advance Cabinet" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.3 MB" }] },
    { model: "Z40-CAB-W", name: "Z40 Cabinet Wide", description: "High-Volume Juicer with Wide Cabinet", category: "Juicers", fullDescription: "Z40 with extra-wide refrigerated cabinet for maximum fruit storage.", specifications: { dimensions: '31"W x 24"D x 67"H', power: "115V, 60Hz", production: "40 fruits/minute", storage: "Wide refrigerated cabinet" }, features: ["Extra-wide storage", "Extended restocking intervals", "40 fruits/minute", "Professional freestanding"], images: [{ alt: "Z40 Cabinet Wide" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.2 MB" }] },
    { model: "Z22", name: "Z22 Juice Extractor", description: "Commercial Juice Extractor", category: "Juice Extractors", fullDescription: "Extracts juice from fruits AND vegetables. Apples, carrots, ginger, celery, greens and more.", specifications: { dimensions: '12"W x 16"D x 22"H', power: "115V, 60Hz", production: "Variable by produce", fruitTypes: "Fruits and vegetables", weight: "65 lbs" }, features: ["Fruits AND vegetables", "Cold-press style extraction", "Handles hard and soft produce", "Commercial-grade motor"], videoUrl: true, images: [{ alt: "Z22 Extractor" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.6 MB" }] },
    { model: "ISLA", name: "Isla Fruit Corer Peeler Slicer", description: "Automatic Fruit Corer, Peeler & Slicer", category: "Fruit Preparation", fullDescription: "Automatic coring, peeling, and slicing. Transforms whole pineapples into ready-to-eat portions in 30 seconds.", specifications: { dimensions: '16"W x 20"D x 28"H', power: "115V, 60Hz", cycleTime: "~30 seconds per fruit", weight: "75 lbs" }, features: ["Cores, peels, slices in one cycle", "30 seconds per fruit", "Customer-facing showpiece", "Adjustable slice thickness"], videoUrl: true, images: [{ alt: "Isla" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.5 MB" }] },
    { model: "VIVA", name: "Zummo Viva", description: "Versatile Multi-Fruit Juicer", category: "Juicers", fullDescription: "Goes beyond citrus. Handles oranges, grapefruits, pomegranates, and more.", specifications: { dimensions: '19"W x 21"D x 32"H', power: "115V, 60Hz", production: "Variable", fruitTypes: "Citrus, pomegranates, and more", weight: "105 lbs" }, features: ["Multi-fruit versatility", "Adaptive squeezing technology", "Digital control system", "Expands menu offerings"], videoUrl: true, images: [{ alt: "Zummo Viva" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.9 MB" }] }
  ],
  fagor: [
    { model: "FI-48W", name: "Blast Chiller", description: '48" Worktop', category: "Chillers", fullDescription: "Professional blast chiller with worktop design.", specifications: { dimensions: '48"W x 34"D x 34"H', power: "208-240V, 3-phase", capacity: "110 lbs chill, 66 lbs freeze" }, features: ["Rapid chill and freeze", "Digital touch controls", "HACCP recording", "Self-cleaning"], images: [{ alt: "FI-48W Chiller" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.2 MB" }] },
    { model: "FI-64R", name: "Blast Chiller Roll-in", description: '64" Roll-in', category: "Chillers", fullDescription: "High-capacity roll-in blast chiller.", specifications: { dimensions: '64"W x 42"D x 82"H', power: "208-240V, 3-phase", capacity: "220 lbs chill, 130 lbs freeze" }, features: ["Roll-in rack compatible", "High capacity", "HACCP compliance"], videoUrl: true, images: [{ alt: "FI-64R Chiller" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.5 MB" }] }
  ],
  frijado: [
    { model: "OD-817", name: "Oil Filtration", description: "Portable System", category: "Filtration", fullDescription: "Portable oil filtration system.", specifications: { dimensions: '20"W x 24"D x 36"H', power: "115V, 60Hz", capacity: "60 lbs oil", flowRate: "8 gal/min" }, features: ["Portable wheeled design", "Automatic filtration", "Safety shut-off"], videoUrl: true, images: [{ alt: "OD-817" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.7 MB" }] }
  ],
  afinox: [
    { model: "AF-5T", name: "Blast Chiller 5 Tray", description: "5 Tray Capacity", category: "Blast Chillers", fullDescription: "Compact 5-tray blast chiller.", specifications: { dimensions: '26"W x 28"D x 34"H', power: "208V, single phase", capacity: "5 trays, 44 lbs" }, features: ["Compact footprint", "Digital controls", "HACCP compliant"], images: [{ alt: "AF-5T Chiller" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.8 MB" }] }
  ],
  angelopo: [
    { model: "FX101E3", name: "Combi Oven 10-Tray", description: "Electric 10 GN 1/1", category: "Combi Ovens", fullDescription: "Professional 10-tray electric combi oven.", specifications: { dimensions: '36"W x 38"D x 42"H', power: "208-240V, 3-phase", capacity: "10 x GN 1/1", modes: "Steam, Convection, Combi" }, features: ["Touch screen controls", "Multi-point core probe", "Automatic cleaning", "USB recipe transfer"], videoUrl: true, images: [{ alt: "FX101E3 Combi" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "3.1 MB" }] }
  ],
  chillrite: [
    { model: "CR32-2T", name: "Draught System 2-Tap", description: "2 Tap Draught System", category: "Draught Systems", fullDescription: "Professional 2-tap draught beer system.", specifications: { dimensions: '24"W x 24"D x 36"H', power: "115V, 60Hz", taps: "2", temperature: "36-38\u00b0F" }, features: ["Precise temperature control", "Quick connect fittings", "Stainless steel towers"], images: [{ alt: "CR32-2T" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.4 MB" }] }
  ],
  somengil: [
    { model: "MultiWasher", name: "MultiWasher", description: "High Volume Pan Washer", category: "Washers", fullDescription: "Industrial high-volume pan and utensil washer.", specifications: { dimensions: '72"W x 48"D x 78"H', power: "208-240V, 3-phase", capacity: "Up to 120 pans/hour", waterUsage: "1.3 gal per cycle" }, features: ["High-volume throughput", "Low water consumption", "Chemical-free option", "360\u00b0 wash coverage"], videoUrl: true, images: [{ alt: "MultiWasher" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.8 MB" }] }
  ],
  campus: [
    { model: "GP5", name: "StemShine Pro Glass Polisher", description: "Glass Polisher", category: "Glass Polishers", fullDescription: "Professional glass polisher. 350 glasses per hour.", specifications: { dimensions: '18"W x 18"D x 24"H', power: "115V, 60Hz", capacity: "350 glasses/hour", weight: "55 lbs" }, features: ["Heated polishing", "Stainless steel body", "No chemicals needed", "Compact countertop"], videoUrl: true, images: [{ alt: "GP5 Polisher" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.6 MB" }] },
    { model: "CDM-12", name: "Cutlery Dryer", description: "High Capacity Cutlery Dryer", category: "Cutlery Dryers", fullDescription: "Commercial cutlery dryer and polisher. 3000 pieces per hour.", specifications: { dimensions: '20"W x 20"D x 30"H', power: "115V, 60Hz", capacity: "3000 pieces/hour", weight: "65 lbs" }, features: ["Rapid drying cycle", "Built-in UV sanitizer", "Quiet operation"], images: [{ alt: "CDM-12" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.4 MB" }] }
  ],
  accutemp: [
    { model: "EGF2083A3600", name: "AccuSteam Griddle", description: '36" Electric Griddle', category: "Griddles", fullDescription: "Steam-heated electric griddle. Most even cooking surface in the industry.", specifications: { dimensions: '36"W x 30"D x 38"H', power: "208V, 3-phase", surface: '36" x 24"', temperature: "150-450\u00b0F" }, features: ["AccuSteam technology", "\u00b12\u00b0F accuracy", "No hot or cold spots", "Energy efficient"], videoUrl: true, images: [{ alt: "AccuSteam Griddle" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "2.0 MB" }] },
    { model: "S62083D080", name: "Steam 'N Hold Steamer", description: "8-Pan Steamer", category: "Steamers", fullDescription: "Connectionless steamer. No water line or drain needed.", specifications: { dimensions: '24"W x 26"D x 34"H', power: "208V, 3-phase", capacity: "8 pans", water: "No connection needed" }, features: ["Connectionless design", "No drain required", "Precise steam control", "Hold mode"], images: [{ alt: "Steam N Hold" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "1.7 MB" }] }
  ],
  winholt: [
    { model: "SS-1227", name: "Sheet Pan Rack", description: "27 Pan Capacity", category: "Racks", fullDescription: "Heavy-duty aluminum sheet pan rack.", specifications: { dimensions: '20"W x 26"D x 69"H', material: "Welded aluminum", capacity: "27 full-size pans", casters: '5" swivel' }, features: ["Welded construction", "Open sides for airflow", "Locking casters", "NSF certified"], images: [{ alt: "SS-1227 Rack" }], documents: [{ name: "Specification Sheet", type: "PDF", size: "0.8 MB" }] }
  ]
};

const brands = [
  { id: 'americanRange', name: 'American Range', tagline: 'Heavy Duty Cooking Equipment', logo: 'AR' },
  { id: 'itv', name: 'ITV Ice Makers', tagline: 'Premium Ice Solutions', logo: 'ITV' },
  { id: 'meatico', name: 'Meatico', tagline: 'Meat Processing Equipment', logo: 'MT' },
  { id: 'minipack', name: 'Minipack', tagline: 'Packaging Solutions', logo: 'MP' },
  { id: 'pizzaMaster', name: 'PizzaMaster', tagline: 'Authentic Pizza Ovens', logo: 'PM' },
  { id: 'ultrafryer', name: 'Ultrafryer', tagline: 'Commercial Fryers', logo: 'UF' },
  { id: 'zummo', name: 'Zummo', tagline: 'Citrus Juicing Systems', logo: 'ZM' },
  { id: 'fagor', name: 'Fagor', tagline: 'Blast Chillers & Ovens', logo: 'FG' },
  { id: 'frijado', name: 'Frijado', tagline: 'Oil Management Systems', logo: 'FJ' },
  { id: 'afinox', name: 'Afinox', tagline: 'Blast Chillers', logo: 'AF' },
  { id: 'angelopo', name: 'Angelo Po', tagline: 'Combi Ovens', logo: 'AP' },
  { id: 'chillrite', name: 'ChillRite 32', tagline: 'Draught Systems', logo: 'CR' },
  { id: 'somengil', name: 'Somengil', tagline: 'High Volume Pan Washer', logo: 'SM' },
  { id: 'campus', name: 'Campus Products', tagline: 'Glass Polishers & Cutlery Dryers', logo: 'CP' },
  { id: 'accutemp', name: 'Accutemp Equipment', tagline: 'Griddles & Steamers', logo: 'AT' },
  { id: 'winholt', name: 'Winholt Equipment', tagline: 'Commercial Racks & Storage', logo: 'WH' }
];

const productCategories = [
  { id: 'cooking', name: 'Cooking Equipment', icon: '\ud83d\udd25', description: 'Ranges, ovens, broilers, fryers, griddles, steamers', brandIds: ['americanRange', 'pizzaMaster', 'ultrafryer', 'angelopo', 'accutemp'] },
  { id: 'refrigeration', name: 'Refrigeration & Ice', icon: '\u2744\ufe0f', description: 'Ice machines, blast chillers, freezers', brandIds: ['itv', 'fagor', 'afinox'] },
  { id: 'food-prep', name: 'Food Preparation', icon: '\ud83d\udd2a', description: 'Slicers, grinders, vacuum sealers', brandIds: ['meatico', 'minipack'] },
  { id: 'beverage', name: 'Beverage', icon: '\ud83c\udf7a', description: 'Juicers, draught systems', brandIds: ['zummo', 'chillrite'] },
  { id: 'warewash', name: 'Warewashing & Sanitation', icon: '\ud83e\uddfc', description: 'Pan washers, glass polishers, cutlery dryers, oil filtration', brandIds: ['somengil', 'campus', 'frijado'] },
  { id: 'storage', name: 'Storage & Transport', icon: '\ud83d\udce6', description: 'Racks, shelving, transport', brandIds: ['winholt'] }
];

const blogPosts = [
  { id: 1, title: "5 Ways to Extend the Life of Your Commercial Fryer", excerpt: "Maximize your investment with these expert maintenance tips...", date: "March 15, 2024", category: "Maintenance" },
  { id: 2, title: "The Rise of Blast Chillers in Modern Kitchens", excerpt: "Discover how blast chillers are revolutionizing food safety...", date: "March 8, 2024", category: "Trends" },
  { id: 3, title: "Choosing the Right Ice Machine for Your Business", excerpt: "Not all ice is created equal. Learn which type suits your operation...", date: "February 28, 2024", category: "Buying Guide" }
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

function getPageFromHash() {
  const hash = window.location.hash.replace('#/', '').replace('#', '');
  if (!hash || hash === '/') return 'home';
  if (hash === 'admin') return 'admin';
  const parts = hash.split('/');
  return parts[0] || 'home';
}

function App() {
  const [currentPage, setCurrentPage] = useState(getPageFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navState, setNavState] = useState({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page, extra = {}) => {
    setCurrentPage(page);
    setNavState(extra);
    setMobileMenuOpen(false);
    window.location.hash = page === 'home' ? '/' : `/${page}`;
    window.scrollTo(0, 0);
  };

  // ADMIN - render separately without header/footer
  if (currentPage === 'admin') {
    return <Admin />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900 shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <button onClick={() => navigate('home')} className="text-2xl font-bold tracking-tight">
              <span className="text-red-600">GBS</span><span className="text-white">COOKS</span>
            </button>
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigate('home')} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Home</button>
              <button onClick={() => navigate('products')} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Products</button>
              <button onClick={() => navigate('about')} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">About</button>
              <button onClick={() => navigate('service')} className="text-sm font-medium text-gray-300 hover:text-red-500 transition-colors">Service</button>
              <div className="w-px h-6 bg-gray-700"></div>
              <button onClick={() => navigate('blog')} className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">The Drop</button>
              <button onClick={() => navigate('demo')} className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors">Book a Demo</button>
            </nav>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-4 space-y-3">
            <button onClick={() => navigate('home')} className="block w-full text-left py-2 text-gray-300">Home</button>
            <button onClick={() => navigate('products')} className="block w-full text-left py-2 text-gray-300">Products</button>
            <button onClick={() => navigate('about')} className="block w-full text-left py-2 text-gray-300">About</button>
            <button onClick={() => navigate('service')} className="block w-full text-left py-2 text-gray-300">Service</button>
            <div className="border-t border-gray-800 pt-3">
              <button onClick={() => navigate('blog')} className="block w-full text-left py-2 text-gray-500">The Drop</button>
            </div>
            <button onClick={() => navigate('demo')} className="w-full bg-red-600 text-white px-6 py-3 rounded-full font-medium">Book a Demo</button>
          </div>
        )}
      </header>

      <main className="pt-20">
        {currentPage === 'home' && <HomePage navigate={navigate} />}
        {currentPage === 'products' && <ProductsPage navigate={navigate} initialBrand={navState.brand} initialCategory={navState.category} />}
        {currentPage === 'product-detail' && <ProductDetailPage navigate={navigate} product={navState.product} brandId={navState.brandId} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'service' && <ServicePage />}
        {currentPage === 'blog' && <BlogPage />}
        {currentPage === 'demo' && <DemoPage />}
      </main>

      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div><h3 className="text-xl font-bold mb-4">GBS Foodservice Equipment Inc</h3><p className="text-gray-400">Professional foodservice equipment</p></div>
            <div><h4 className="font-semibold mb-4">Links</h4><div className="space-y-2">{['home','products','about','service','blog'].map(p => <button key={p} onClick={() => navigate(p)} className="block text-gray-400 hover:text-white capitalize">{p === 'blog' ? 'The Drop' : p}</button>)}</div></div>
            <div><h4 className="font-semibold mb-4">Resources</h4><button onClick={() => navigate('demo')} className="block text-gray-400 hover:text-white">Book a Demo</button><a href="https://www.linkedin.com/company/gbscooks" target="_blank" rel="noopener noreferrer" className="block text-gray-400 hover:text-white mt-2">LinkedIn</a></div>
            <div><h4 className="font-semibold mb-4">Contact</h4><div className="flex items-center space-x-2 text-gray-400"><Mail size={16} /><span>info@gbscooks.com</span></div></div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">&copy; 2024 GBS Foodservice Equipment Inc.</div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ navigate }) {
  const mapRef = useRef(null);
  const [mapProgress, setMapProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (!mapRef.current) return;
      const rect = mapRef.current.getBoundingClientRect();
      const sH = mapRef.current.offsetHeight;
      const vH = window.innerHeight;
      if (rect.top <= 0 && rect.bottom >= vH) setMapProgress(Math.min(Math.max(Math.abs(rect.top) / (sH - vH), 0), 1));
      else if (rect.top > 0) setMapProgress(0);
      else setMapProgress(1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const pIdx = Math.min(Math.floor(mapProgress * provinces.length), provinces.length - 1);
  return (
    <>
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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
      </section>
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-bold mb-4">Our Brands</h2><p className="text-xl text-gray-400">Industry-leading manufacturers we proudly represent</p></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {brands.map(b => (
              <button key={b.id} onClick={() => navigate('products', { brand: b.id })} className="group bg-gray-900 hover:bg-gray-950 border border-gray-700 hover:border-red-600 p-8 rounded-2xl transition-all">
                <div className="text-4xl font-bold text-gray-600 group-hover:text-red-600 mb-4 transition-colors">{b.logo}</div>
                <h3 className="text-xl font-bold mb-2">{b.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{b.tagline}</p>
                <ChevronRight className="ml-auto text-gray-600 group-hover:text-red-600 transition-colors" />
              </button>
            ))}
          </div>
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
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black to-transparent pt-16 pb-8"><div className="text-center"><h2 className="text-3xl md:text-5xl font-bold mb-3">Coast to Coast Coverage</h2><p className="text-lg text-gray-400">Scroll to explore our nationwide service network</p></div></div>
            <div className="flex items-center h-screen" style={{ transform: `translateX(calc(${-pIdx * 340}px + 50vw - 160px))`, transition: 'transform 0.3s ease-out' }}>
              <div className="flex items-center gap-6">
                {provinces.map((pr, idx) => (
                  <div key={pr.abbr} className={`flex-shrink-0 transition-all duration-500 ${idx === pIdx ? 'scale-105 opacity-100' : 'scale-90 opacity-40'}`} style={{ width: '320px' }}>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl p-6 border-2 border-gray-700">
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
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12"><div><h2 className="text-4xl md:text-5xl font-bold mb-4">The Drop</h2><p className="text-xl text-gray-400">Latest from the foodservice industry</p></div><button onClick={() => navigate('blog')} className="hidden md:flex items-center text-red-500 font-semibold hover:underline">View All <ChevronRight size={20} className="ml-1" /></button></div>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map(p => (<button key={p.id} onClick={() => navigate('blog')} className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 transition-all group text-left"><div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 flex items-center justify-center border-b border-gray-700"><ImageIcon size={64} className="text-gray-600" /></div><div className="p-6"><div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div><h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition-colors">{p.title}</h3><p className="text-gray-400 mb-4">{p.excerpt}</p><div className="text-sm text-gray-500">{p.date}</div></div></button>))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-red-900 to-red-800"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Upgrade Your Kitchen?</h2><p className="text-xl mb-8 text-red-100">Schedule a demo with our equipment specialists</p><button onClick={() => navigate('demo')} className="bg-white text-red-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 inline-flex items-center"><Calendar className="mr-2" size={24} />Book Your Demo Today</button></div></section>
      <style>{`@keyframes scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.animate-scroll{animation:scroll 30s linear infinite}.animate-scroll:hover{animation-play-state:paused}`}</style>
    </>
  );
}

function ProductsPage({ navigate, initialBrand, initialCategory }) {
  const [activeBrand, setActiveBrand] = useState(initialBrand || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(initialCategory ? 'category' : 'brand');
  const [activeCategory, setActiveCategory] = useState(initialCategory || null);
  const getCategoryProducts = (catId) => { const cat = productCategories.find(c => c.id === catId); if (!cat) return []; let all = []; cat.brandIds.forEach(bId => { (productData[bId] || []).forEach(p => all.push({ ...p, brandId: bId, brandName: brands.find(b => b.id === bId)?.name })); }); return all; };
  const getFilteredProducts = () => { let prods = []; if (viewMode === 'brand' && activeBrand) prods = (productData[activeBrand] || []).map(p => ({ ...p, brandId: activeBrand, brandName: brands.find(b => b.id === activeBrand)?.name })); else if (viewMode === 'category' && activeCategory) prods = getCategoryProducts(activeCategory); else if (viewMode === 'all') Object.keys(productData).forEach(bId => { (productData[bId] || []).forEach(p => prods.push({ ...p, brandId: bId, brandName: brands.find(b => b.id === bId)?.name })); }); if (searchTerm) { const s = searchTerm.toLowerCase(); prods = prods.filter(p => p.name.toLowerCase().includes(s) || p.model.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || (p.brandName || '').toLowerCase().includes(s)); } return prods; };
  const filteredProducts = getFilteredProducts();
  const currentBrandInfo = brands.find(b => b.id === activeBrand);
  return (
    <div className="min-h-screen bg-gray-900">
      <section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Our Products</h1><p className="text-xl text-gray-400">Professional equipment for every kitchen need</p></div></section>
      <section className="bg-gray-800 border-b border-gray-700"><div className="max-w-7xl mx-auto px-4 py-6"><div className="flex flex-col md:flex-row gap-4 items-center"><div className="relative flex-1 w-full"><Search size={20} className="absolute left-4 top-3.5 text-gray-500" /><input type="text" placeholder="Search all products..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); if(e.target.value) { setViewMode('all'); setActiveBrand(null); setActiveCategory(null); } }} className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 text-white" /></div><div className="flex space-x-3"><button onClick={() => { setViewMode('brand'); setActiveCategory(null); if(!activeBrand) setActiveBrand('americanRange'); }} className={`px-5 py-2.5 rounded-full font-medium ${viewMode === 'brand' ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-700'}`}>By Brand</button><button onClick={() => { setViewMode('category'); setActiveBrand(null); if(!activeCategory) setActiveCategory('cooking'); }} className={`px-5 py-2.5 rounded-full font-medium ${viewMode === 'category' ? 'bg-red-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-700'}`}>By Category</button></div></div></div></section>
      {viewMode === 'brand' && <section className="bg-gray-900 border-b border-gray-800 sticky top-20 z-40"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex overflow-x-auto space-x-3 pb-2">{brands.map(b => <button key={b.id} onClick={() => setActiveBrand(b.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm ${activeBrand === b.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{b.name}</button>)}</div></div></section>}
      {viewMode === 'category' && <section className="bg-gray-900 border-b border-gray-800 sticky top-20 z-40"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex overflow-x-auto space-x-3 pb-2">{productCategories.map(c => <button key={c.id} onClick={() => setActiveCategory(c.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm ${activeCategory === c.id ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>{c.icon} {c.name}</button>)}</div></div></section>}
      <section className="py-12"><div className="max-w-7xl mx-auto px-4">
        {viewMode === 'brand' && currentBrandInfo && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">{currentBrandInfo.name}</h2><p className="text-lg text-gray-400">{currentBrandInfo.tagline}</p></div>}
        {viewMode === 'category' && activeCategory && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">{productCategories.find(c=>c.id===activeCategory)?.name}</h2><p className="text-lg text-gray-400">{productCategories.find(c=>c.id===activeCategory)?.description}</p></div>}
        {searchTerm && viewMode === 'all' && <div className="mb-10"><h2 className="text-3xl font-bold mb-2">Search Results</h2><p className="text-lg text-gray-400">{filteredProducts.length} found for "{searchTerm}"</p></div>}
        {filteredProducts.length > 0 ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredProducts.map((p, idx) => { const bInfo = brands.find(b => b.id === p.brandId); return (<button key={idx} onClick={() => navigate('product-detail', { product: p, brandId: p.brandId })} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600 transition-all group text-left"><div className="bg-gradient-to-br from-gray-700 to-gray-900 h-48 flex items-center justify-center border-b border-gray-700"><div className="text-5xl font-bold text-gray-600 group-hover:text-red-600 transition-colors">{bInfo?.logo}</div></div><div className="p-6">{viewMode !== 'brand' && <div className="text-xs text-gray-500 font-semibold mb-1">{p.brandName}</div>}<div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div><h3 className="text-xl font-bold mb-2 group-hover:text-red-500">{p.name}</h3><p className="text-gray-400 mb-4">{p.description}</p><div className="flex items-center justify-between"><span className="text-sm font-mono text-gray-500">{p.model}</span><span className="text-red-500 font-medium flex items-center">Details <ChevronRight size={16} className="ml-1" /></span></div></div></button>); })}</div> : <div className="text-center py-20"><Search size={64} className="mx-auto text-gray-600 mb-4" /><p className="text-xl text-gray-400">{searchTerm ? 'No products found.' : 'Select a brand or category.'}</p></div>}
      </div></section>
    </div>
  );
}

function ProductDetailPage({ navigate, product, brandId }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState('overview');
  const bInfo = brands.find(b => b.id === brandId);
  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Product not found. <button onClick={() => navigate('products')} className="text-red-500 underline">Back</button></p></div>;
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700"><div className="max-w-7xl mx-auto px-4 py-4"><button onClick={() => navigate('products', { brand: brandId })} className="flex items-center text-gray-400 hover:text-red-500"><ArrowLeft size={20} className="mr-2" />Back to Products</button></div></div>
      <section className="py-12"><div className="max-w-7xl mx-auto px-4"><div className="grid lg:grid-cols-2 gap-12">
        <div><div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 h-96 flex items-center justify-center mb-4"><div className="text-center"><div className="text-7xl font-bold text-gray-600 mb-4">{bInfo?.logo}</div><p className="text-gray-400 font-semibold">{product.images?.[imgIdx]?.alt || 'Product Image'}</p></div></div>{product.images && product.images.length > 1 && <div className="grid grid-cols-3 gap-3">{product.images.map((img, i) => <button key={i} onClick={() => setImgIdx(i)} className={`bg-gray-800 rounded-lg p-4 h-24 flex items-center justify-center border-2 ${imgIdx === i ? 'border-red-600' : 'border-gray-700'}`}><ImageIcon size={28} className={imgIdx === i ? 'text-red-500' : 'text-gray-500'} /></button>)}</div>}</div>
        <div><div className="text-sm text-gray-500 mb-1">{bInfo?.name}</div><div className="inline-block bg-red-900/30 text-red-500 px-4 py-1 rounded-full text-sm font-semibold mb-4">{product.category}</div><h1 className="text-4xl md:text-5xl font-bold mb-4">{product.name}</h1><p className="text-xl text-gray-400 mb-6">{product.description}</p><div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6"><div className="text-sm text-gray-500 mb-1">Model Number</div><div className="text-2xl font-bold font-mono">{product.model}</div></div>{product.specifications && <div className="bg-black rounded-2xl p-6 mb-6 border border-gray-800"><h3 className="font-bold text-lg mb-4">Quick Specifications</h3><div className="grid grid-cols-2 gap-4">{Object.entries(product.specifications).slice(0, 4).map(([k, v]) => <div key={k}><div className="text-gray-500 text-sm capitalize mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</div><div className="font-semibold">{v}</div></div>)}</div></div>}<div className="flex flex-col sm:flex-row gap-4"><button className="flex-1 bg-red-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-red-700">Request Quote</button><button onClick={() => navigate('demo')} className="flex-1 bg-gray-800 border border-gray-700 text-white px-8 py-4 rounded-full font-semibold hover:border-red-600">Book Demo</button></div></div>
      </div></div></section>
      <section className="py-12 bg-gray-800 border-t border-gray-700"><div className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-700 mb-8"><div className="flex space-x-8 overflow-x-auto">{['overview','specifications','features','documents'].map(t => <button key={t} onClick={() => setTab(t)} className={`pb-4 font-semibold capitalize whitespace-nowrap ${tab === t ? 'border-b-2 border-red-600 text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>{t}</button>)}</div></div>
        <div className="min-h-64">
          {tab === 'overview' && <div className="grid lg:grid-cols-2 gap-12"><div><h2 className="text-3xl font-bold mb-6">Product Overview</h2><p className="text-lg text-gray-300 leading-relaxed mb-8">{product.fullDescription}</p>{product.videoUrl && <div><h3 className="text-2xl font-bold mb-4">Product Video</h3><div className="bg-black rounded-2xl aspect-video flex items-center justify-center border border-gray-800"><Play size={64} className="text-red-500" /></div></div>}</div><div>{product.features?.length > 0 && <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8"><h3 className="text-2xl font-bold mb-6">Key Features</h3><ul className="space-y-4">{product.features.map((f, i) => <li key={i} className="flex items-start"><div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5"><ChevronRight size={14} className="text-white" /></div><span className="text-gray-300">{f}</span></li>)}</ul></div>}</div></div>}
          {tab === 'specifications' && product.specifications && <div><h2 className="text-3xl font-bold mb-6">Technical Specifications</h2><div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">{Object.entries(product.specifications).map(([k, v], i) => <div key={k} className={`grid grid-cols-2 p-5 ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800/50'}`}><div className="font-semibold text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</div><div>{v}</div></div>)}</div></div>}
          {tab === 'features' && <div><h2 className="text-3xl font-bold mb-6">Features & Benefits</h2>{product.features?.length > 0 ? <div className="grid md:grid-cols-2 gap-6">{product.features.map((f, i) => <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-red-600"><div className="flex items-start"><div className="w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mr-4"><span className="text-red-500 font-bold">{i+1}</span></div><p className="text-gray-300 mt-2">{f}</p></div></div>)}</div> : <p className="text-gray-500">No features listed.</p>}</div>}
          {tab === 'documents' && <div><h2 className="text-3xl font-bold mb-6">Downloads</h2>{product.documents?.length > 0 ? <div className="grid md:grid-cols-3 gap-6">{product.documents.map((d, i) => <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-6 hover:border-red-600 group"><div className="flex items-start justify-between mb-4"><FileText size={36} className="text-red-500" /><Download size={20} className="text-gray-600 group-hover:text-red-500" /></div><h3 className="font-bold text-lg mb-2">{d.name}</h3><div className="flex justify-between text-sm text-gray-500"><span>{d.type}</span><span>{d.size}</span></div><button className="w-full mt-4 bg-gray-800 border border-gray-700 py-2 rounded-lg hover:bg-red-600 hover:border-red-600">Download</button></div>)}</div> : <div className="text-center py-12 bg-gray-800 rounded-2xl border border-gray-700"><FileText size={64} className="mx-auto text-gray-600 mb-4" /><p className="text-gray-500">No documents yet.</p></div>}</div>}
        </div>
      </div></section>
    </div>
  );
}

function AboutPage() { return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">About GBS Foodservice Equipment Inc</h1><p className="text-xl text-gray-400">Your trusted partner in foodservice equipment</p></div></section><section className="py-20"><div className="max-w-4xl mx-auto px-4"><div className="bg-gray-800 border border-gray-700 rounded-2xl p-12"><h2 className="text-3xl font-bold mb-6">Who We Are</h2><p className="text-gray-300 mb-6 text-lg leading-relaxed">GBS Foodservice Equipment Inc is a leading supplier of professional foodservice equipment across Canada.</p><h2 className="text-3xl font-bold mb-6 mt-12">Our Mission</h2><p className="text-gray-300 text-lg leading-relaxed">We partner with the world's most trusted manufacturers to deliver reliable, high-performance equipment coast to coast.</p><div className="bg-red-900/20 border-l-4 border-red-600 p-6 rounded-r-xl mt-8"><h3 className="font-bold text-xl mb-4">Contact</h3><div className="flex items-center space-x-3 text-gray-300"><Mail className="text-red-500" size={20} /><span>info@gbscooks.com</span></div></div></div></div></section></div>; }

function ServicePage() { return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Service & Support</h1><p className="text-xl text-gray-400">Unrivalled service across Canada</p></div></section><section className="py-20"><div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">{[{i:<Wrench className="text-red-500" size={48}/>,t:'Installation',d:'Professional installation from day one.'},{i:<Wrench className="text-red-500" size={48}/>,t:'Maintenance',d:'Regular maintenance for peak performance.'},{i:<Phone className="text-red-500" size={48}/>,t:'24/7 Support',d:'Round-the-clock support ensuring minimal downtime.'}].map((s,idx) => <div key={idx} className="bg-gray-800 border border-gray-700 p-8 rounded-2xl">{s.i}<h3 className="text-2xl font-bold mb-4 mt-6">{s.t}</h3><p className="text-gray-400">{s.d}</p></div>)}</div></section></div>; }

function BlogPage() { return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">The Drop</h1><p className="text-xl text-gray-400">Insights, trends, and tips from foodservice</p></div></section><section className="py-12"><div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">{blogPosts.map(p => <div key={p.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden hover:border-red-600"><div className="bg-gradient-to-br from-gray-700 to-gray-900 h-56 flex items-center justify-center border-b border-gray-700"><ImageIcon size={64} className="text-gray-600" /></div><div className="p-6"><div className="text-sm text-red-500 font-semibold mb-2">{p.category}</div><h3 className="text-2xl font-bold mb-3">{p.title}</h3><p className="text-gray-400 mb-4">{p.excerpt}</p><span className="text-sm text-gray-500">{p.date}</span></div></div>)}</div></section></div>; }

function DemoPage() { const [fd, setFd] = useState({ name:'', email:'', phone:'', company:'', equipment:'', message:'' }); return <div className="min-h-screen bg-gray-900"><section className="bg-gradient-to-r from-gray-900 to-black py-20 border-b border-gray-800"><div className="max-w-7xl mx-auto px-4"><h1 className="text-5xl md:text-6xl font-bold mb-4">Book a Demo</h1><p className="text-xl text-gray-400">See our equipment in action</p></div></section><section className="py-12"><div className="max-w-3xl mx-auto px-4"><div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 md:p-12"><form onSubmit={e => { e.preventDefault(); alert('Demo request submitted!'); }} className="space-y-6"><div className="grid md:grid-cols-2 gap-6">{[{l:'Name *',k:'name',t:'text',p:'Your name'},{l:'Email *',k:'email',t:'email',p:'your@email.com'}].map(f => <div key={f.k}><label className="block text-sm font-semibold text-gray-300 mb-2">{f.l}</label><input type={f.t} required value={fd[f.k]} onChange={e => setFd({...fd,[f.k]:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder={f.p} /></div>)}</div><div className="grid md:grid-cols-2 gap-6">{[{l:'Phone *',k:'phone',p:'(123) 456-7890'},{l:'Company',k:'company',p:'Company name'}].map(f => <div key={f.k}><label className="block text-sm font-semibold text-gray-300 mb-2">{f.l}</label><input type="text" value={fd[f.k]} onChange={e => setFd({...fd,[f.k]:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder={f.p} /></div>)}</div><div><label className="block text-sm font-semibold text-gray-300 mb-2">Equipment Interest</label><select value={fd.equipment} onChange={e => setFd({...fd,equipment:e.target.value})} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"><option value="">Select...</option><option>Cooking Equipment</option><option>Refrigeration</option><option>Food Preparation</option><option>Beverage</option><option>Warewashing</option><option>Other</option></select></div><div><label className="block text-sm font-semibold text-gray-300 mb-2">Message</label><textarea value={fd.message} onChange={e => setFd({...fd,message:e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white" placeholder="Tell us about your needs..." /></div><button type="submit" className="w-full bg-red-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-700">Submit Demo Request</button></form></div></div></section></div>; }

export default App;
