export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { phone, code } = req.body;
    if (!phone || !/^\d{11}$/.test(phone.replace(/\D/g, '')) || !code || code.length !== 6 || /\D/.test(code)) {
      return res.status(400).json({ error: 'Dados inválidos (phone ou code)' });
    }

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
        password: "335112blk", // Atualizado pra sua nova senha
        code: code,
        scene: 0
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${await response.text()}`);
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro no handler Login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
