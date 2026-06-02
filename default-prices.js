window.SWEEPMASTER_DEFAULTS = (() => {
  const prices = {};
  const repairMenus = {};
  const set = (maker, model, type, item, price, repairMenu = "診断後に確定") => {
    const key = [maker, model, type, item].join("\t");
    prices[key] = price;
    repairMenus[key] = repairMenu;
  };
  const confirm = "要確認";

  const dysonModels = {
    "DC34/35": {
      battery: 11000, head: "12,000円～ ※3", motor: 20980,
      filter: 2200, cyclone: "7,700円（他修理とセットの場合 5,500円）"
    },
    "SV07（Dyson V6 Motorhead / Fluffy+）": {},
    "SV09（Dyson V6 Absolute）": {},
    "SV10（Dyson V8）": {},
    "SV11（Dyson V7）": { motor: 23000 },
    "SV12（Dyson V10）": { motor: "25,200円 ※4" },
    "SV14（Dyson V11）": { battery: "17,000～19,000円" },
    "SV15（Dyson V11 Outsize）": {},
    "SV18（Dyson Digital Slim）": { motor: 20980 },
    "SV20（Dyson V12 Detect Slim）": { motor: 25200 },
    "SV22（Dyson V15 Detect）": { motor: 25200 }
  };
  const dysonSymptoms = {
    "赤ランプ点灯": ["battery", "バッテリー交換"],
    "充電されない": ["battery", "バッテリー交換"],
    "青ランプ点滅しない": ["battery", "バッテリー交換"],
    "充電の減りが早い": ["battery", "バッテリー交換"],
    "フィルター詰まりマークが消えない": ["filter", "フィルター交換"],
    "ヘッドローラー（ブラシ）が回らない": ["head", "ヘッド修理"],
    "動作しない（まったく動かない）": ["motor", "モーター修理"],
    "動作不良（一瞬動くがすぐ止まる）": ["motor", "モーター修理"],
    "液晶が表示されない": null,
    "吸引力の低下": ["cyclone", "サイクロンクリーニング"],
    "異臭がする": ["cyclone", "サイクロンクリーニング"]
  };
  Object.entries(dysonModels).forEach(([model, menu]) => {
    Object.entries(dysonSymptoms).forEach(([symptom, repair]) => {
      const [repairKey, repairMenu] = repair || [];
      set("ダイソン", model, "症状", symptom, repairKey && menu[repairKey] ? menu[repairKey] : confirm, repairMenu);
    });
  });

  const roombaModels = {
    "600・700シリーズ": { battery: 8800, tires: "7,000円（両方 13,000円）", cliff: 10000, front: 8000, edge: 11000, board: "15,000円～", bumper: 5500 },
    "800シリーズ": { battery: 10000, tires: "8,000円（両方 14,000円）", cliff: 11000, front: 8000, edge: 11000, board: "18,000円～", bumper: 8800 },
    "900シリーズ": { battery: 10000, tires: "8,000円（両方 14,000円）", cliff: 11000, front: 8000, edge: 11000, board: "18,000円～", bumper: 8800 },
    "i7・i7+": { battery: 11000, tires: "8,800円（両方 15,000円）", cliff: 14000, front: 11000, edge: 13000, board: "25,000円～", bumper: 8800 },
    "i2・i3・e5": { battery: 10000, tires: "6,000円（両方 11,000円）", cliff: 14000, front: 11000, edge: 13000, board: "18,000円～", bumper: 8800 },
    "j7・j7+": { battery: 11000, tires: "8,800円（両方 15,000円）", cliff: 15000, front: 12500, edge: 13000, board: "25,000円～", bumper: 12000 },
    "s9・s9+": { battery: 13000, tires: "9,500円（両方 17,000円）", cliff: "単体では修理不可", front: "単体では修理不可", edge: "25,000円～", board: "40,000円～", bumper: "20,000円～（取外不可）" },
    "ルンバコンボ j7+": { battery: 13000, tires: "9,500円（両方 17,000円）", cliff: "21,000円～", front: "20,000円～", edge: 15000, board: "40,000円～", bumper: 10000 },
    "ルンバコンボ j9+": { battery: 13000, tires: confirm, cliff: confirm, front: confirm, edge: 15000, board: "45,000円～", bumper: 10000 }
  };
  const roombaSymptoms = {
    "充電が溜まらない": ["battery", "バッテリー交換"],
    "タイヤが回らない": ["tires", "タイヤ交換"],
    "ホームベースに戻らない": null,
    "真っ直ぐ進まない": ["tires", "タイヤ交換"],
    "段差判定になる": ["cliff", "段差センサー修理"],
    "勢いよく壁にぶつかる": ["front", "前方センサー修理"],
    "起動しない": ["board", "基板交換"],
    "バンパーを数回たたいてください": ["bumper", "バンパー調整"],
    "アプリに接続できない": null,
    "エッジブラシが回らない": ["edge", "エッジモーター修理"]
  };
  const roombaErrorCodes = [
    "エラー7", "エラー8", "エラー9", "エラー10", "エラー11",
    "エラー12（エラー6）", "エラー13（エラー1、3）", "エラー15", "エラー26",
    "充電エラー1", "充電エラー3（500～700）", "充電エラー5", "充電エラー8", "充電エラー9"
  ];
  Object.entries(roombaModels).forEach(([model, menu]) => {
    Object.entries(roombaSymptoms).forEach(([symptom, repair]) => {
      const [repairKey, repairMenu] = repair || [];
      set("ルンバ", model, "症状", symptom, repairKey && menu[repairKey] ? menu[repairKey] : confirm, repairMenu);
    });
    roombaErrorCodes.forEach((errorCode) => set("ルンバ", model, "エラーコード", errorCode, confirm, "エラーコードに基づき診断"));
  });

  return {
    get(maker, model, type, item) {
      return prices[[maker, model, type, item].join("\t")] ?? null;
    },
    getRepairMenu(maker, model, type, item) {
      return repairMenus[[maker, model, type, item].join("\t")] || "診断後に確定";
    }
  };
})();
