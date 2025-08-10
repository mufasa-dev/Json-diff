export let obj2 = {
  name: "MyApplication", // alterado: antes era "MyApp"
  version: 1.1, // alterado: antes era 1.0
  settings: {
    theme: "light", // alterado: antes era "dark"
    languages: ["en", "pt"], // removido: "es"
    notifications: true // adicionado
  },
  metadata: {
    createdAt: "2025-08-09T10:00:00Z",
    tags: ["example", "typescript", "production"] // alterado: "test" -> "production"
  },
  features: {
    login: true
    // removido: register
  },
  analytics: { // adicionado
    enabled: true,
    provider: "Google Analytics"
  }
}
