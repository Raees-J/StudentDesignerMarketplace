export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  sizes?: string[]
  colors?: string[]
  features?: string[]
}

export const products: Product[] = [
  // Apparel
  {
    id: '1',
    name: 'University Logo T-Shirt',
    description: 'Premium cotton t-shirt with embroidered university logo. Perfect for students and alumni.',
    price: 299,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
    category: 'apparel',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Grey', 'Maroon'],
    features: ['100% Cotton', 'Pre-shrunk', 'Machine Washable']
  },
  {
    id: '2',
    name: 'University Hoodie',
    description: 'Comfortable fleece hoodie with university branding. Ideal for cooler weather.',
    price: 599,
    image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
    category: 'apparel',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Grey', 'Black'],
    features: ['80% Cotton 20% Polyester', 'Kangaroo Pocket', 'Drawstring Hood']
  },
  {
    id: '3',
    name: 'University Baseball Cap',
    description: 'Adjustable baseball cap with embroidered university logo.',
    price: 199,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg',
    category: 'apparel',
    inStock: true,
    colors: ['Navy', 'White', 'Black'],
    features: ['Adjustable Strap', 'Curved Brim', 'Breathable Fabric']
  },
  {
    id: '4',
    name: 'University Polo Shirt',
    description: 'Professional polo shirt perfect for university events and casual wear.',
    price: 399,
    image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg',
    category: 'apparel',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Light Blue'],
    features: ['Moisture Wicking', 'Collar Stay', 'Side Vents']
  },

  // Furniture/Chairs
  {
    id: '5',
    name: 'Ergonomic Study Chair',
    description: 'Comfortable ergonomic chair designed for long study sessions.',
    price: 2499,
    image: 'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg',
    category: 'furniture',
    inStock: true,
    colors: ['Black', 'Grey', 'Blue'],
    features: ['Lumbar Support', 'Adjustable Height', 'Swivel Base', '5-Year Warranty']
  },
  {
    id: '6',
    name: 'Lecture Hall Chair',
    description: 'Stackable chair perfect for events and lectures.',
    price: 899,
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg',
    category: 'furniture',
    inStock: true,
    colors: ['Blue', 'Red', 'Grey'],
    features: ['Stackable Design', 'Durable Frame', 'Easy to Clean']
  },
  {
    id: '7',
    name: 'Executive Office Chair',
    description: 'Premium leather office chair for administrative use.',
    price: 4999,
    image: 'https://images.pexels.com/photos/586763/pexels-photo-586763.jpeg',
    category: 'furniture',
    inStock: true,
    colors: ['Black', 'Brown'],
    features: ['Genuine Leather', 'High Back', 'Pneumatic Height Adjustment']
  },

  // Tents/Outdoor
  {
    id: '8',
    name: 'University Event Tent 3x3m',
    description: 'Professional pop-up tent for university events and outdoor activities.',
    price: 1899,
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg',
    category: 'outdoor',
    inStock: true,
    colors: ['White', 'Blue', 'Red'],
    features: ['Waterproof', 'UV Protection', 'Easy Setup', 'Carrying Bag Included']
  },
  {
    id: '9',
    name: 'Camping Tent 4-Person',
    description: 'Durable camping tent perfect for university outdoor programs.',
    price: 1299,
    image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg',
    category: 'outdoor',
    inStock: true,
    colors: ['Green', 'Orange', 'Blue'],
    features: ['Sleeps 4', 'Waterproof', 'Ventilation Windows', 'Ground Tarp Included']
  },
  {
    id: '10',
    name: 'Market Stall Tent 6x3m',
    description: 'Large commercial tent for university market days and fairs.',
    price: 3499,
    image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg',
    category: 'outdoor',
    inStock: true,
    colors: ['White', 'Blue'],
    features: ['Heavy Duty Frame', 'Sidewalls Included', 'Professional Grade', 'Wind Resistant']
  },

  // Accessories
  {
    id: '11',
    name: 'University Laptop Bag',
    description: 'Padded laptop bag with university branding.',
    price: 699,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
    features: ['Fits 15" Laptop', 'Multiple Compartments', 'Shoulder Strap']
  },
  {
    id: '12',
    name: 'University Water Bottle',
    description: 'Stainless steel water bottle with university logo.',
    price: 249,
    image: 'https://images.pexels.com/photos/3766230/pexels-photo-3766230.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Silver', 'Blue', 'Black'],
    features: ['500ml Capacity', 'Insulated', 'Leak Proof', 'BPA Free']
  }
]

export const categories = [
  { id: 'apparel', name: 'Apparel', description: 'T-shirts, hoodies, caps and more' },
  { id: 'furniture', name: 'Furniture', description: 'Chairs and office furniture' },
  { id: 'outdoor', name: 'Outdoor', description: 'Tents and outdoor equipment' },
  { id: 'accessories', name: 'Accessories', description: 'Bags, bottles and accessories' }
]
