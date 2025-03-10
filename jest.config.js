module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.ts"], // Define onde os testes estarão
    collectCoverage: true, // Gera relatório de cobertura
    coverageDirectory: "coverage", // Pasta onde os relatórios serão salvos
    setupFiles: ["dotenv/config"], // Carregar variáveis de ambiente
  };
  