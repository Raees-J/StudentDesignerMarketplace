import { Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    createReview,
    getProductReviews,
    getProductReviewStats,
    NewReview,
    Review,
    ReviewStats
} from '../api/reviewService'
import { useAuth } from '../contexts/AuthContext'

interface ReviewSectionProps {
  productId: string
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { currentUser } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [showAddReview, setShowAddReview] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Load reviews and stats
  useEffect(() => {
    loadReviews()
  }, [productId])

  const loadReviews = async () => {
    try {
      setLoading(true)
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(productId),
        getProductReviewStats(productId)
      ])
      setReviews(reviewsData)
      setReviewStats(statsData)
    } catch (error) {
      console.error('Error loading reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || submitting) return

    try {
      setSubmitting(true)
      const reviewData: NewReview = {
        productID: productId,
        customerID: currentUser.id?.toString() || 'anonymous',
        rating: newReview.rating,
        comment: newReview.comment
      }

      await createReview(reviewData)
      
      // Reset form and reload reviews
      setNewReview({ rating: 5, comment: '' })
      setShowAddReview(false)
      loadReviews()
      
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating: React.FC<{ rating: number; size?: string | number; interactive?: boolean; onRatingChange?: (rating: number) => void }> = ({ 
    rating, 
    size = 16, 
    interactive = false, 
    onRatingChange 
  }) => {
    const starSize = size === 'large' ? 20 : typeof size === 'number' ? size : 16
    
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            fill={star <= rating ? '#fbbf24' : 'transparent'}
            color={star <= rating ? '#fbbf24' : '#d1d5db'}
            style={{ 
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.2s ease'
            }}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        Loading reviews...
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Reviews Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
          Reviews
        </h3>
        
        {reviewStats.totalReviews > 0 ? (
          <div style={{ display: 'flex', gap: '3rem', marginBottom: '2rem' }}>
            {/* Left side - Overall Rating */}
            <div style={{ flex: '0 0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: '700', color: '#1f2937' }}>
                  {reviewStats.averageRating.toFixed(1)}
                </span>
                <StarRating rating={Math.round(reviewStats.averageRating)} size="large" />
              </div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0' }}>
                {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Right side - Rating Distribution */}
            <div style={{ flex: '1', minWidth: '300px' }}>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]
                const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0
                
                return (
                  <div key={rating} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    marginBottom: '0.5rem' 
                  }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      minWidth: '8px',
                      textAlign: 'right'
                    }}>
                      {rating}
                    </span>
                    <Star 
                      size={16} 
                      style={{ color: '#fbbf24', fill: '#fbbf24' }}
                    />
                    <div style={{
                      flex: '1',
                      height: '8px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: '#10b981',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: '#6b7280',
                      minWidth: '20px'
                    }}>
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <StarRating rating={0} size="large" />
            </div>
            <p style={{ color: '#6b7280', margin: '0' }}>
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}

        {/* Write Review Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          {currentUser ? (
            <button
              onClick={() => setShowAddReview(!showAddReview)}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: showAddReview ? '#6b7280' : '#2563eb',
                color: 'white',
                border: '1px solid transparent',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = showAddReview ? '#4b5563' : '#1d4ed8'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = showAddReview ? '#6b7280' : '#2563eb'
              }}
            >
              {showAddReview ? 'Cancel Review' : 'Write Review'}
            </button>
          ) : (
            <div style={{
              padding: '1rem 2rem',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              Please log in to write a review
            </div>
          )}
        </div>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
            Write Your Review
          </h4>
          
          <form onSubmit={handleSubmitReview}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Rating
              </label>
              <StarRating
                rating={newReview.rating}
                size={24}
                interactive={true}
                onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                Comment
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={submitting || !newReview.comment.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: submitting || !newReview.comment.trim() ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: submitting || !newReview.comment.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowAddReview(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by Ratings */}
      {reviews.length > 0 && (
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '2rem',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Filter by Ratings
            </span>
            <button style={{
              fontSize: '0.75rem',
              color: '#6b7280',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Clear
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[5, 4, 3, 2, 1].map(rating => (
              <button
                key={rating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6'
                  e.currentTarget.style.borderColor = '#9ca3af'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.borderColor = '#d1d5db'
                }}
              >
                <span>{rating}</span>
                <Star size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List Header */}
      {reviews.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            1 to {Math.min(10, reviews.length)} of {reviews.length} Reviews
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sort by:</span>
            <select style={{
              padding: '0.25rem 0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer'
            }}>
              <option>Most Helpful</option>
              <option>Newest</option>
              <option>Oldest</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.reviewID}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              {/* Review Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <StarRating rating={review.rating} size={16} />
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {review.customerName || 'Anonymous'} - {formatDate(review.createdAt)}
                </span>
              </div>
              
              {/* Review Content */}
              <p style={{
                color: '#374151',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                margin: '0 0 1rem 0'
              }}>
                {review.comment}
              </p>

              {/* Review Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#374151'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  👍 Helpful (0)
                </button>
                <button
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
                >
                  Report Review
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#9ca3af',
            fontSize: '0.875rem'
          }}>
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewSection