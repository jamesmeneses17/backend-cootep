export async function swaggerUsers(){
    const swaggerUser = process.env.SWAGGER_USER || '';
    const swaggerPassword = process.env.SWAGGER_PASSWORD || '';
    return { swaggerUser, swaggerPassword };
}
