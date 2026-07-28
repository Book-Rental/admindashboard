export interface BookImage {
    url: string;
    altText: string;
    _id: string;
}

export interface Category {
    _id: string;
    name: string;
}

export interface Book {
    _id: string;
    name: string;
    author: string;
    language: string;
    description: string;
    category: Category;
    coverImage?: string;
    images: BookImage[];
    rentalPricePerDay: number;
    rentalPricePerWeek: number;
    rentalPricePerMonth: number;
    purchasePrice: number;
    quantity: number;
    condition: string;
    listingType: string;
    availabilityStatus: string;
    availableForRent: boolean;
    availableForSale: boolean;
    status: string;
}

export interface BookResponse {
    status: string;
    message: string;
    data: {
        products: Book[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasMore: boolean;
    };
}