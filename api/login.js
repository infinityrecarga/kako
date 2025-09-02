export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { phone, code } = req.body;

    const response = await fetch('https://api.kako.live/api/v1/login/phone/submit', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'accept-language': 'pt',
        'x-app-devicetype': 'android',
        'x-app-version': '1.15.2',
        'x-app-bundleid': 'live.kako.global',
        'x-app-channelid': 'google',
        'x-app-buildid': '24bbabf0',
        'x-app-lang': 'pt',
        'x-app-lang-excludes': 'en,es',
        'x-app-deviceid': 'a5247afb-4d54-4867-b6ab-637496a78cf1',
        'x-app-timezone': 'America/Sao_Paulo',
        'x-app-country': 'BR',
        'x-app-devicename': 'Motorola moto g(8)',
        'content-type': 'application/json; charset=UTF-8',
        'accept-encoding': 'gzip',
        'user-agent': 'okhttp/4.12.0'
      },
      body: JSON.stringify({
        phone: phone,
        password: "335112d1r7y",
        code: code,
        scene: 0
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
