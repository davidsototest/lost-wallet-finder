"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const checker_1 = require("./process/checker");
(0, checker_1.main)().catch((error) => {
    console.error("Error executing main function:", error);
});
