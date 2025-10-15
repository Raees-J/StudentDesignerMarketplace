import type { Product } from '../data/products';
import axiosInstance from './axiosInstance';

export interface NewProduct {
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    inStock?: boolean;
    sizes?: string[];
    colors?: string[];
    features?: string[];
}

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products/all');
    return response.data.map((p: any) => ({
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: p.category && p.category.trim() ? p.category : 'Uncategorized',
        inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
        sizes: p.sizes ? p.sizes.split(',').filter((s: string) => s.trim()) : [],
        colors: p.colors ? p.colors.split(',').filter((c: string) => c.trim()) : [],
        features: p.features ? p.features.split(',').filter((f: string) => f.trim()) : [],
    }));
};

export const createProduct = async (product: NewProduct): Promise<Product> => {
    const response = await axiosInstance.post('/products/create', {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.image,
        category: product.category,
        inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes.join(',') : '',
        colors: product.colors && product.colors.length > 0 ? product.colors.join(',') : '',
        features: product.features && product.features.length > 0 ? product.features.join(',') : '',
    });
    const p = response.data;
    return {
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: p.category || 'general',
        inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
        sizes: p.sizes ? p.sizes.split(',').filter((s: string) => s.trim()) : [],
        colors: p.colors ? p.colors.split(',').filter((c: string) => c.trim()) : [],
        features: p.features ? p.features.split(',').filter((f: string) => f.trim()) : [],
    };
};

export const updateProduct = async (product: Product): Promise<Product> => {
    const response = await axiosInstance.post('/products/update', {
        productID: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.image,
        category: product.category,
        inStock: typeof product.inStock === 'boolean' ? product.inStock : true,
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes.join(',') : '',
        colors: product.colors && product.colors.length > 0 ? product.colors.join(',') : '',
        features: product.features && product.features.length > 0 ? product.features.join(',') : '',
    });
    const p = response.data;
    return {
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: p.category && p.category.trim() ? p.category : 'Uncategorized',
        inStock: typeof p.inStock === 'boolean' ? p.inStock : true,
        sizes: p.sizes ? p.sizes.split(',').filter((s: string) => s.trim()) : [],
        colors: p.colors ? p.colors.split(',').filter((c: string) => c.trim()) : [],
        features: p.features ? p.features.split(',').filter((f: string) => f.trim()) : [],
    };
};

export const deleteProduct = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`/products/delete/${id}`);
    } catch (error: any) {
        console.error(`Error deleting product with ID ${id}:`, error);
        throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
};