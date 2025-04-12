import fs from "fs";
import Web3 from "web3";
import { ethers } from "ethers";
import { Wallet } from "ethers";

// Configura la URL de tu nodo Ethereum (por ejemplo, Infura)
const INFURA_URL = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";

// Inicializa Web3
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

async function isConnected(): Promise<boolean> {
  try {
    return await web3.eth.net.isListening();
  } catch (error) {
    return false;
  }
}

(async () => {
  if (!(await isConnected())) {
    console.error("Error: Unable to connect to the Ethereum node.");
    process.exit(1);
  }
})();

// Función para cargar las frases semilla desde "seeds.txt"
function loadSeeds(filePath = "../data/wallets-correctas.txt"): string[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: ${filePath} not found.`);
    process.exit(1);
  }
  const data = fs.readFileSync(filePath, { encoding: "utf-8" });
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// Función para comprobar el balance de una dirección
async function checkBalance(address: string): Promise<number | null> {
  try {
    const balanceWei = await web3.eth.getBalance(address);
    // Convierte de Wei a Ether y retorna como número
    return parseFloat(web3.utils.fromWei(balanceWei, "ether"));
  } catch (e) {
    console.error(`Error checking balance for ${address}: ${e}`);
    return null;
  }
}

// Función principal
async function main() {
  const seeds = loadSeeds();
  console.log(`Loaded ${seeds.length} seed phrases.`);
  const results: string[] = [];

  // Itera sobre cada frase semilla
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    try {
      // Genera la wallet a partir de la frase semilla usando ethers.js
      //   const wallet = ethers.Wallet.fromMnemonic(seed);
      const wallet = new Wallet(seed);
      console.log(wallet.address);

      const address = wallet.address;
      console.log(`[${i + 1}/${seeds.length}] Checking wallet: ${address}`);

      // Comprueba el saldo de la wallet
      const balance = await checkBalance(address);
      if (balance !== null && balance > 0) {
        console.log(`Wallet ${address} has a balance of ${balance} ETH.`);
        results.push(`${address} - ${balance} ETH (Seed: ${seed})`);
      } else {
        console.log(`Wallet ${address} has no balance.`);
      }
    } catch (e) {
      console.error(`Error with seed: ${seed}, ${e}`);
    }
  }

  // Guarda los resultados en results.txt
  if (results.length > 0) {
    fs.writeFileSync("results.txt", results.join("\n"), { encoding: "utf-8" });
    console.log("Results saved to results.txt");
  } else {
    console.log("No wallets with balance found.");
  }
}

// Ejecuta la función principal
main();

export { main };
