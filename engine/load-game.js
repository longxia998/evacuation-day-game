(() => {
  const gameScripts = [
  "engine/mobile-share.js",
  "engine/part-01.js",
  "engine/part-02.js",
  "engine/part-03.js",
  "engine/part-04.js",
  "engine/part-05.js",
  [
    "engine/part-06.js.chunk-01.bin",
    "engine/part-06.js.chunk-02.bin",
    "engine/part-06.js.chunk-03.bin",
    "engine/part-06.js.chunk-04.bin",
    "engine/part-06.js.chunk-05.bin",
    "engine/part-06.js.chunk-06.bin",
    "engine/part-06.js.chunk-07.bin",
    "engine/part-06.js.chunk-08.bin",
    "engine/part-06.js.chunk-09.bin"
  ],
  "engine/part-07.js",
  [
    "engine/part-08.js.chunk-01.bin"
  ],
  [
    "engine/part-09.js.chunk-01.bin",
    "engine/part-09.js.chunk-02.bin",
    "engine/part-09.js.chunk-03.bin",
    "engine/part-09.js.chunk-04.bin",
    "engine/part-09.js.chunk-05.bin",
    "engine/part-09.js.chunk-06.bin",
    "engine/part-09.js.chunk-07.bin",
    "engine/part-09.js.chunk-08.bin"
  ],
  "engine/part-10.js",
  [
    "engine/part-11.js.chunk-01.bin",
    "engine/part-11.js.chunk-02.bin"
  ]
];

  async function download(path) {
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await fetch(path);
        if (!response.ok) throw Error(`${path}: HTTP ${response.status}`);
        return await response.arrayBuffer();
      } catch (error) {
        if (attempt === 1) throw error;
      }
    }
  }

  function runScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.onload = () => resolve();
      script.onerror = () => reject(Error(`Could not load ${source}`));
      document.head.append(script);
    });
  }

  async function unpack(parts) {
    const compressed = new Blob(parts);
    if (typeof DecompressionStream === 'function') {
      const contents = compressed.stream().pipeThrough(new DecompressionStream('gzip'));
      return await new Response(contents).arrayBuffer();
    }
    if (!globalThis.fflate) await runScript('engine/fflate.js');
    return globalThis.fflate.gunzipSync(new Uint8Array(await compressed.arrayBuffer()));
  }

  async function launch() {
    const prepared = gameScripts.map((entry) => {
      if (typeof entry === 'string') return entry;
      return Promise.all(entry.map(download)).then((parts) => ({ parts }), (error) => ({ error }));
    });
    for (const entry of prepared) {
      if (typeof entry === 'string') {
        await runScript(entry);
        continue;
      }
      const { parts, error } = await entry;
      if (error) throw error;
      const raw = await unpack(parts);
      const url = URL.createObjectURL(new Blob([raw], { type: 'text/javascript' }));
      try {
        await runScript(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    }
  }

  launch().catch((error) => {
    document.querySelector('#boot-msg').textContent = '游戏文件加载失败，请刷新页面重试';
    console.error(error);
  });
})();
