import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AppResponse } from '../dto/api-response.dto';

/**
 * A decorator to document api created response model with out pagination
 * @param model Response Model
 * @param {boolean} isArray Is response model array
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiCreatedAppResponseWithModel = <TModel extends Type<any>>(model: TModel, isArray = false) => {
    return applyDecorators(
        ApiCreatedResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(AppResponse) },
                    {
                        properties: {
                            data: {
                                ...(isArray
                                    ? {
                                          type: 'array',
                                          items: {
                                              $ref: getSchemaPath(model)
                                          }
                                      }
                                    : {
                                          $ref: getSchemaPath(model)
                                      })
                            }
                        }
                    }
                ]
            }
        })
    );
};

/**
 * A decorator to document api ok response model with out pagination
 * @param model Response Model
 * @param {boolean} isArray Is response model array
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiOkAppResponseWithModel = <TModel extends Type<any>>(model: TModel, isArray = false) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(AppResponse) },
                    {
                        properties: {
                            data: {
                                ...(isArray
                                    ? {
                                          type: 'array',
                                          items: {
                                              $ref: getSchemaPath(model)
                                          }
                                      }
                                    : {
                                          $ref: getSchemaPath(model)
                                      })
                            }
                        }
                    }
                ]
            }
        })
    );
};

/**
 * A decorator to document api response model with pagination
 * @param model Response Model
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const ApiOkAppResponseWithPagination = <TModel extends Type<any>>(model: TModel) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(AppResponse) },
                    {
                        properties: {
                            data: {
                                properties: {
                                    page: {
                                        type: 'number',
                                        example: 1
                                    },
                                    limit: {
                                        type: 'number',
                                        example: 10
                                    },
                                    total: {
                                        type: 'number',
                                        example: 1
                                    },
                                    docs: {
                                        type: 'array',
                                        items: { $ref: getSchemaPath(model) }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        })
    );
};
