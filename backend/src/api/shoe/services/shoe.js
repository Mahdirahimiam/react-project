'use strict';

/**
 * shoe service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::shoe.shoe');
