export async function getGigaChatAccessToken(
   clientId: string,
   clientSecret: string,
   scope: 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' = 'GIGACHAT_API_PERS'
): Promise<string> {
   const basic = Buffer.from(`${clientId}:${clientSecret}`, 'ascii').toString('base64');
   const rquid = crypto.randomUUID();

   const res = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
      method: 'POST',
      headers: {
         Authorization: `Basic ${basic}`,
         RqUID: rquid,
         'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `scope=${encodeURIComponent(scope)}`,
   });

   if (!res.ok) {
      const text = await res.text();
      throw new Error(`OAuth HTTP ${res.status}: ${text}`);
   }

   const data = await res.json();
   if (!data?.access_token) throw new Error('Нет access_token в ответе OAuth');
   return data.access_token as string;
}