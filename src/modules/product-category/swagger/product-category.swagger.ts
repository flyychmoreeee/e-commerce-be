export const CREATE_PRODUCT_CATEGORY_RESPONSE = {
  status: 201,
  description:
    'The product category has been successfully created.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Product category created',
      data: {
        id: 1,
        name: 'Product Category 1',
        description:
          'Product Category 1 Description',
      },
    },
  },
};

export const GET_ALL_PRODUCT_CATEGORIES_RESPONSE =
  {
    status: 200,
    description:
      'The product categories have been successfully retrieved.',
    schema: {
      example: {
        success: true,
        code: '2002',
        message: 'Product categories fetched',
        data: [
          {
            id: 1,
            name: 'Product Category 1',
            description:
              'Product Category 1 Description',
          },
          {
            id: 2,
            name: 'Product Category 2',
            description:
              'Product Category 2 Description',
          },
        ],
      },
    },
  };

export const GET_PRODUCT_CATEGORY_BY_ID_RESPONSE =
  {
    status: 200,
    description:
      'The product category has been successfully retrieved.',
    schema: {
      example: {
        success: true,
        code: '2002',
        message: 'Product category fetched',
        data: {
          id: 1,
          name: 'Product Category 1',
          description:
            'Product Category 1 Description',
        },
      },
    },
  };

export const UPDATE_PRODUCT_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The product category has been successfully updated.',

  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Product category updated',
      data: {
        id: 1,
        name: 'Product Category 1',
        description:
          'Product Category 1 Description',
      },
    },
  },
};

export const DELETE_PRODUCT_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The product category has been successfully deleted.',

  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Product category deleted',
    },
  },
};

export const UNACTIVE_PRODUCT_CATEGORY_RESPONSE =
  {
    status: 200,
    description:
      'The product category has been successfully unactive.',
    schema: {
      example: {
        success: true,
        code: '2002',
        message: 'Product category unactive',
      },
    },
  };

export const ACTIVE_PRODUCT_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The product category has been successfully active.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Product category active',
    },
  },
};
