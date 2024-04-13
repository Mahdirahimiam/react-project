'use strict';

/**
 * all-star service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::all-star.all-star');
