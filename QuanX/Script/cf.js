const httpsUrl = "https://speed.cloudflare.com/meta";
$httpClient.get(httpsUrl, function(error, response, data) {
  if (error) {
    $done(null);
  } else {
    const jsonData = JSON.parse(data);
    const hostname = jsonData.hostname || "N/A";
    const clientIp = jsonData.clientIp || "N/A";
    const httpProtocol = jsonData.httpProtocol || "N/A";
    const asn = jsonData.asn || "N/A";
    const asOrganization = jsonData.asOrganization || "N/A";
    const colo = jsonData.colo || "N/A";
    const country = jsonData.country || "N/A";
    const city = jsonData.city || "N/A";
    const postalCode = jsonData.postalCode || "N/A";
    const latitude = jsonData.latitude || "N/A";
    const longitude = jsonData.longitude || "N/A";
    const emojis = ['🆘', '🈲', '⚠️', '🔞', '📵', '🚦', '🏖', '🖥', '📺', '🐧', '🐬', '🦉', '🍄', '⛳️', '🚴', '🤑', '👽', '🤖', '🎃', '👺', '👁', '🐶', '🐼', '🐌', '👥'];
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    function ValidCheck(para) {
      return para ? para : emojis[getRandomInt(emojis.length)];
    }
    const flags = new Map([
      ["AC", "🇦🇨"], ["AE", "🇦🇪"], ["AF", "🇦🇫"], ["AI", "🇦🇮"], ["AL", "🇦🇱"], ["AM", "🇦🇲"], ["AQ", "🇦🇶"], ["AR", "🇦🇷"], ["AS", "🇦🇸"], ["AT", "🇦🇹"], ["AU", "🇦🇺"], ["AW", "🇦🇼"], ["AX", "🇦🇽"], ["AZ", "🇦🇿"], ["BA", "🇧🇦"], ["BB", "🇧🇧"], ["BD", "🇧🇩"], ["BE", "🇧🇪"], ["BF", "🇧urkina Faso"], ["BG", "🇧ulgaria"], ["BH", "🇧ahrain"], ["BI", "🇧urundi"], ["BJ", "🇧enin"], ["BM", "🇧ermuda"], ["BN", "🇧runei"], ["BO", "🇧olivia"]
    ]);
    const flag = flags.get(country) || "🏳️";
    const result = {
      title: `IP: ${clientIp}`,
      content: `${flag} ${city}, ${country}\nISP: ${asOrganization}\nASN: ${asn}\nProtocol: ${httpProtocol}\nData Center: ${colo}`,
      icon: "globe.asia.australia.fill"
    };
    $done(result);
  }
});