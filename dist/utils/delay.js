"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = void 0;
// función delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.delay = delay;
