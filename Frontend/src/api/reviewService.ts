import axiosInstance from './axiosInstance';

export interface Review {
  reviewID: string;
  productID: string;
  customerID: string;
  customerName?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NewReview {
  productID: string;
  customerID: string;
  rating: number;
  comment: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Get all reviews for a specific product
export const getProductReviews = async (productID: string): Promise<Review[]> => {
  const response = await axiosInstance.get(`/reviews/product/${productID}`);
  return response.data;
};

// Get review statistics for a product
export const getProductReviewStats = async (productID: string): Promise<ReviewStats> => {
  const reviews = await getProductReviews(productID);
  
  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = ratingSum / totalReviews;

  const ratingDistribution = reviews.reduce((dist, review) => {
    dist[review.rating as keyof typeof dist]++;
    return dist;
  }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    totalReviews,
    ratingDistribution
  };
};

// Create a new review
export const createReview = async (review: NewReview): Promise<Review> => {
  const response = await axiosInstance.post('/reviews/create', review);
  return response.data;
};

// Get reviews by customer
export const getCustomerReviews = async (customerID: string): Promise<Review[]> => {
  const response = await axiosInstance.get(`/reviews/customer/${customerID}`);
  return response.data;
};

// Update a review
export const updateReview = async (review: Review): Promise<Review> => {
  const response = await axiosInstance.post('/reviews/update', review);
  return response.data;
};

// Delete a review
export const deleteReview = async (reviewID: string): Promise<void> => {
  await axiosInstance.delete(`/reviews/delete/${reviewID}`);
};

// Get all reviews
export const getAllReviews = async (): Promise<Review[]> => {
  const response = await axiosInstance.get('/reviews/all');
  return response.data;
};