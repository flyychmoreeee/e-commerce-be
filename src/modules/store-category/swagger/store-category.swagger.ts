export const CREATE_STORE_CATEGORY_RESPONSE = {
  status: 201,
  description:
    'The store category has been successfully created.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category created',
      data: {
        id: 1,
        name: 'Store Category 1',
        description:
          'Store Category 1 Description',
      },
    },
  },
};

export const GET_ALL_STORE_CATEGORIES_RESPONSE = {
  status: 200,
  description:
    'The store categories have been successfully retrieved.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store categories retrieved',
      data: [
        {
          id: 1,
          name: 'Store Category 1',
          description:
            'Store Category 1 Description',
        },
      ],
    },
  },
};

export const GET_STORE_CATEGORY_BY_ID_RESPONSE = {
  status: 200,
  description:
    'The store category has been successfully retrieved.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category retrieved',
      data: {
        id: 1,
        name: 'Store Category 1',
        description:
          'Store Category 1 Description',
      },
    },
  },
};

export const UPDATE_STORE_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The store category has been successfully updated.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category updated',
      data: {
        id: 1,
        name: 'Store Category 1',
        description:
          'Store Category 1 Description',
      },
    },
  },
};

export const DELETE_STORE_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The store category has been successfully deleted.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category deleted',
    },
  },
};

export const UNACTIVE_STORE_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The store category has been successfully unactive.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category unactive',
    },
  },
};

export const ACTIVATED_STORE_CATEGORY_RESPONSE = {
  status: 200,
  description:
    'The store category has been successfully activated.',
  schema: {
    example: {
      success: true,
      code: '2002',
      message: 'Store category activated',
    },
  },
};
