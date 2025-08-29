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
    name: 'Dress with skirt',
    description: 'Premium cotton dress with stylish skirt. Perfect for students and alumni.',
    price: 299,
    image: '/assets/images/outfit 1.jpg',
    category: 'apparel',
    inStock: true,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Grey', 'Maroon'],
    features: ['100% Cotton', 'Pre-shrunk', 'Machine Washable']
  },
  {
    id: '2',
    name: 'Coat with hoodie',
    description: 'Comfortable fleece coat with attachable hoodie. Ideal for cooler weather.',
    price: 599,
    image: '/assets/images/outfit 2.jpg',
    category: 'apparel',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['brown', 'Grey', 'Black'],
    features: ['80% Cotton 20% Polyester', 'Kangaroo Pocket', 'Drawstring Hood']
  },
  {
    id: '3',
    name: 'Stylish outfit',
    description: 'Adjustable 2 piece .',
    price: 199,
    image: '/assets/images/outfit 3.jpg',
    category: 'apparel',
    inStock: true,
    colors: ['green', 'White', 'Black'],
    features: ['Adjustable Strap', 'Curved Brim', 'Breathable Fabric']
  },
  {
    id: '4',
    name: 'Bowtie and waistband',
    description: 'Essential add on to your suit or shirt.',
    price: 399,
    image: '/assets/images/bowtie.jpeg',
    category: 'apparel',
    inStock: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White', 'Light Blue'],
    features: ['Moisture Wicking', 'Collar Stay', 'Side Vents']
  },

  // Furniture
  {
    id: '5',
    name: 'Framed poster',
    description: 'Stylish arabic text poster/ artwork.',
    price: 2499,
    image: '/assets/images/poster.jpg',
    category: 'furniture',
    inStock: true,
    features: [ '5-Year Warranty']
  },
  {
    id: '6',
    name: 'Forge',
    description: 'hang all items from keys to bottles to coats.',
    price: 899,
    image: '/assets/images/wallHanger.png',
    category: 'furniture',
    inStock: true,
    colors: ['Blue', 'Red', 'Grey'],
    features: ['Stackable Design', 'Durable Frame', 'Easy to Clean']
  },
  {
    id: '7',
    name: 'Coffea machine ',
    description: 'ideal houshold product for everyday coffea.',
    price: 4999,
    image: '/assets/images/coffeaMach.jpg',
    category: 'furniture',
    inStock: true,
    colors: ['Black', 'Brown'],
  
  },

  // Tents/Outdoor
  {
    id: '8',
    name: 'watertank bag',
    description: 'Hikes, walks in the park, to even spring and marathons.Drink while working out .',
    price: 1899,
    image: '/assets/images/condo-3L.jpg',
    category: 'outdoor',
    inStock: true,
    features: ['Waterproof', 'UV Protection', 'Easy Setup', 'Carrying Bag Included']
  },
  

  // Accessories
  {
    id: '11',
    name: 'Laptop Bag',
    description: 'Padded laptop bag.',
    price: 699,
    image: '/assets/images/Brownbag.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
    features: ['Fits 15" Laptop', 'Multiple Compartments', 'Shoulder Strap']
  },
  {
    id: '12',
    name: 'duffle bag',
    description: 'Multiple compartment for everyday use.',
    price: 249,
    image: '/assets/images/ChocBag.jpeg',
    category: 'accessories',
    inStock: true,
  },
  {
    id: '13',
    name: 'University Diary',
    description: 'old school ook for your newst thoughts and designs.',
    price: 199,
    image: '/assets/images/Diary.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],

  },
  {
    id: '14',
    name: 'University Bag',
    description: 'Padded laptop bag with university branding.',
    price: 350,
    image: '/assets/images/DoublestBag.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
    },
  {
    id: '15',
    name: 'GreenBag',
    description: 'stylish and comfortable.',
    price: 699,
    image: '/assets/images/Greenbag.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
    features: ['Fits 15" Laptop', 'Multiple Compartments', 'Shoulder Strap']
  },
  {
    id: '16',
    name: ' handBag',
    description: 'easy use and carry.',
    price: 699,
    image: '/assets/images/handBag.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
     },
  {
    id: '17',
    name: 'headphones',
    description: 'listen to whatever you want to whenever you want to.',
    price: 250,
    image: '/assets/images/headphones.png',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
      },
  {
    id: '18',
    name: 'Lamp',
    description: 'studying in the dark to being able to use as a nightlight .',
    price: 299,
    image: '/assets/images/lamp.png',
    category: 'accessories',
    inStock: true,
     },
  {
    id: '19',
    name: 'Leather bag',
    description: 'Padded bag with classic design.',
    price: 699,
    image: '/assets/images/leatherBg.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
    features: [ 'Multiple Compartments', 'Shoulder Strap']
  },
  {
    id: '20',
    name: 'wallet',
    description: 'keep your student card, cash and other valuables in.',
    price: 99,
    image: '/assets/images/wallet.jpeg',
    category: 'accessories',
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
      },
  {
    id: '21',
    name: 'speaker',
    description: 'listen to podcast and music anywhere.',
    price: 499,
    image: '/assets/images/Speaker render 1.png',
    category: 'accessories',
    inStock: true,
     }


]

export const categories = [
  { id: 'apparel', name: 'Apparel', description: 'T-shirts, hoodies, caps and more' },
  { id: 'furniture', name: 'Furniture', description: 'Chairs and office furniture' },
  { id: 'outdoor', name: 'Outdoor', description: 'Tents and outdoor equipment' },
  { id: 'accessories', name: 'Accessories', description: 'Bags, bottles and accessories' }
]
