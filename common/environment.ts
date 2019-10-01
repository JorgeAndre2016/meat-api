
/**
 * Const usada para definir variáveis com valores de uso padrão na API
 */

export const environment = {
    // caso não sejá informado a porta como parâmetro a default será ativada '3000'
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || 'mongodb://localhost/meat-api' },
    security: { saltRounds: process.env.SALT_ROUNDS || 10 }
}