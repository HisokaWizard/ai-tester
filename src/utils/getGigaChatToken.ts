import { getGigaChatAccessToken } from './oauthGigaChat';

//# ПОЛУЧИТЬ accessToken из https://ngw.devices.sberbank.ru:9443/api/v2/oauth
async function main() {
   const clientId = process.env.GIGACHAT_CLIENT_ID;
   const clientSecret = process.env.GIGACHAT_CLIENT_SECRET;
   const scopeEnv = process.env.GIGACHAT_SCOPE as 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | undefined;
   const scope = scopeEnv ?? 'GIGACHAT_API_PERS';

   if (!clientId || !clientSecret) {
      console.error('Не заданы переменные окружения GIGACHAT_CLIENT_ID и/или GIGACHAT_CLIENT_SECRET');
      process.exit(1);
   }

   try {
      const token = await getGigaChatAccessToken(clientId, clientSecret, scope);
      console.log(token);
   } catch (err) {
      console.error('Ошибка при получении accessToken:', err instanceof Error ? err.message : err);
      process.exit(1);
   }
}

main();


