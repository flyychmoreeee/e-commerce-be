export const CREATE_STORE_PRODUCT_RESPONSE = {
  status: 201,
  description:
    'Store product created successfully',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store Product created',
      data: {
        id: 3,
        storeId: 6,
        categoryId: 1,
        name: 'Product 2',
        slug: 'product-2',
        description: 'Description of the product',
        price: 100000,
        stock: 100,
        isActive: true,
        createdAt: '2025-04-25T16:49:48.019Z',
        updatedAt: '2025-04-25T16:49:48.019Z',
      },
    },
  },
};

export const GET_ALL_STORE_PRODUCTS_RESPONSE = {
  status: 200,
  description:
    'Store products retrieved successfully',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store products retrieved',
      data: [
        {
          id: 3,
          storeId: 6,
          categoryId: 1,
          name: 'Product 2',
          slug: 'product-2',
          description:
            'Description of the product',
          price: 100000,
          stock: 100,
          isActive: true,
          createdAt: '2025-04-25T16:49:48.019Z',
          updatedAt: '2025-04-25T16:49:48.019Z',
        },
        {
          id: 4,
          storeId: 6,
          categoryId: 1,
          name: 'Product 2',
          slug: 'product-2',
          description:
            'Description of the product',
          price: 100000,
          stock: 100,
          isActive: true,
          createdAt: '2025-04-25T16:49:48.019Z',
          updatedAt: '2025-04-25T16:49:48.019Z',
        },
      ],
    },
  },
};

export const GET_STORE_PRODUCT_BY_ID_RESPONSE = {
  status: 200,
  description:
    'Store product retrieved successfully',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store Product retrieved',
      data: {
        id: 3,
        storeId: 6,
        categoryId: 1,
        name: 'Product 2',
        slug: 'product-2',
        description: 'Description of the product',
        price: 100000,
        stock: 100,
        isActive: true,
        createdAt: '2025-04-25T16:49:48.019Z',
        updatedAt: '2025-04-25T16:49:48.019Z',
      },
    },
  },
};

export const UPDATE_STORE_PRODUCT_RESPONSE = {
  status: 200,
  description:
    'Store product updated successfully',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store Product updated',
      data: {
        id: 3,
        storeId: 6,
        categoryId: 1,
        name: 'Product 2',
        slug: 'product-2',
        description: 'Description of the product',
        price: 100000,
        stock: 100,
        isActive: true,
        createdAt: '2025-04-25T16:49:48.019Z',
        updatedAt: '2025-04-25T16:49:48.019Z',
      },
    },
  },
};

export const DELETE_STORE_PRODUCT_RESPONSE = {
  status: 200,
  description:
    'Store product deleted successfully',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store Product deleted',
      data: {
        id: 3,
        storeId: 6,
        categoryId: 1,
        name: 'Product 2',
      },
    },
  },
};

export const GET_STORE_PRODUCT_BY_STORE_ID_RESPONSE =
  {
    status: 200,
    description:
      'Store products retrieved successfully',
    schema: {
      example: {
        success: true,
        code: '2002',
        message: 'Store products retrieved',
        data: [
          {
            id: 3,
            storeId: 6,
            categoryId: 1,
            name: 'Product 2',
            slug: 'product-2',
            description:
              'Description of the product',
            price: 100000,
            stock: 100,
            isActive: true,
            createdAt: '2025-04-25T16:49:48.019Z',
            updatedAt: '2025-04-25T16:49:48.019Z',
          },
          {
            id: 4,
            storeId: 6,
            categoryId: 1,
            name: 'Product 2',
            slug: 'product-2',
            description:
              'Description of the product',
            price: 100000,
            stock: 100,
            isActive: true,
            createdAt: '2025-04-25T16:49:48.019Z',
            updatedAt: '2025-04-25T16:49:48.019Z',
          },
        ],
      },
    },
  };
