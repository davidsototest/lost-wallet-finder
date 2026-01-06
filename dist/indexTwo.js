"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consultarWalletsVacias_1 = require("./utils/consultarWalletsVacias");
// consultar wallets vacias a ver si ingreso dinero
const run = async () => {
    await (0, consultarWalletsVacias_1.consultarWalletsVacias)();
};
run();
