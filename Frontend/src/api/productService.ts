import axiosInstance from './axiosInstance';
import type { Product } from '../data/products';

export interface NewProduct {
    name: string;
    description: string;
    price: number;
    image: string;
}

export const getAllProducts = async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products/all');
    return response.data.map((p: any) => ({
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: 'general',
        inStock: true,
    }));
};

export const createProduct = async (product: NewProduct): Promise<Product> => {
    const response = await axiosInstance.post('/products/create', {
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.image,
    });
    const p = response.data;
    return {
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: 'general',
        inStock: true,
    };
};

export const updateProduct = async (product: Product): Promise<Product> => {
    const response = await axiosInstance.post('/products/update', {
        productID: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.image,
    });
    const p = response.data;
    return {
        id: p.productID,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.imageUrl,
        category: 'general',
        inStock: true,
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