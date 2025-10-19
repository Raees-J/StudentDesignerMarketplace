import { Filter, Grid, List, Search } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAllProducts } from '../api/productService'
import ProductCard from '../components/ProductCard'
import { categories, Product, products as staticProducts } from '../data/products'

const Products: React.FC = () => {
  const { category } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  // Add category filter state
  const [categoryFilter, setCategoryFilter] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await getAllProducts()
        setProducts(data)
      } catch (err) {
        console.warn('Backend not available, falling back to static data:', err)
        setProducts(staticProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo<Product[]>(() => {
    let filtered: Product[] = products;
    // Use categoryFilter for dropdown, fallback to URL param for deep links
    const effectiveCategory = categoryFilter || category || '';
    if (effectiveCategory) {
      filtered = filtered.filter((product: Product) =>
        product.category && product.category.trim().toLowerCase() === effectiveCategory.trim().toLowerCase()
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((product: Product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered = filtered.filter((product: Product) =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );
    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    return filtered;
  }, [products, category, categoryFilter, searchTerm, sortBy, priceRange]);

  const currentCategory = categories.find(cat => cat.id === category)

  return (
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {currentCategory ? currentCategory.name : 'All Products'}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              {currentCategory
                  ? currentCategory.description
                  : 'Browse our complete collection of university merchandise'
              }
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }}
              />
              <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Sort */}
              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                  style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              {/* View Mode */}
              <div style={{ display: 'flex', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>
                <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      padding: '0.5rem',
                      border: 'none',
                      backgroundColor: viewMode === 'grid' ? '#3b82f6' : 'transparent',
                      color: viewMode === 'grid' ? 'white' : '#6b7280',
                      borderRadius: '0.375rem 0 0 0.375rem',
                      cursor: 'pointer'
                    }}
                >
                  <Grid size={16} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '0.5rem',
                      border: 'none',
                      backgroundColor: viewMode === 'list' ? '#3b82f6' : 'transparent',
                      color: viewMode === 'list' ? 'white' : '#6b7280',
                      borderRadius: '0 0.375rem 0.375rem 0',
                      cursor: 'pointer'
                    }}
                >
                  <List size={16} />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Filter size={16} />
                Filters
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
              <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Filters
                </h3>

                <div className="grid md:grid-cols-3" style={{ gap: '1.5rem' }}>
                  {/* Price Range */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Price Range
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="input"
                          style={{ width: '100px' }}
                      />
                      <span>-</span>
                      <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="input"
                          style={{ width: '100px' }}
                      />
                    </div>
                  </div>

                  {/* Category Filter (if viewing all products) */}
                  {!category && (
                      <div>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                          Category
                        </label>
                        <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                          <option value="">All Categories</option>
                          {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                          ))}
                        </select>
                      </div>
                  )}

                  {/* Stock Filter */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem' }}>
                      Availability
                    </label>
                    <select className="input">
                      <option value="">All Items</option>
                      <option value="in-stock">In Stock Only</option>
                      <option value="out-of-stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
          )}

          {/* Results Count */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: '#6b7280' }}>
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid/List */}
          {filteredProducts.length > 0 ? (
              <div
                className="product-card-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(340px, 1fr))' : '1fr',
                  gap: '2.5rem',
                  justifyContent: 'center',
                  alignItems: 'stretch',
                  margin: '0 auto',
                  paddingBottom: '2rem',
                  minHeight: 400,
                  width: '100%',
                  maxWidth: '1400px',
                }}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
          ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#6b7280'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  No products found
                </h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
          )}
        </div>
      </div>
  )
}

export default Products
