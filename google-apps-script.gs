const ADMIN_PASSWORD = "ここを管理用パスワードに変更";

function doGet(e) {
  const callback = String(e.parameter.callback || "callback").replace(/[^\w$.]/g, "");
  try {
    if (e.parameter.action !== "update") throw new Error("未対応の操作です。");
    if (e.parameter.password !== ADMIN_PASSWORD) throw new Error("管理パスワードが違います。");

    const row = Number(e.parameter.row);
    if (!Number.isInteger(row) || row < 2) throw new Error("行番号が不正です。");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const current = sheet.getRange(row, 1, 1, 4).getDisplayValues()[0];
    const expected = [e.parameter.maker, e.parameter.model, e.parameter.type, e.parameter.item];
    if (current.some((value, index) => value !== expected[index])) {
      throw new Error("料金表が更新されています。管理画面を再読み込みしてください。");
    }

    const price = String(e.parameter.price || "").replace(/[,円\s]/g, "");
    if (price && (!/^\d+$/.test(price) || Number(price) < 0)) throw new Error("金額は0以上の半角数字で入力してください。");
    sheet.getRange(row, 5).setValue(price ? Number(price) : "");
    return jsonp(callback, { ok: true });
  } catch (error) {
    return jsonp(callback, { ok: false, message: error.message });
  }
}

function jsonp(callback, data) {
  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(data)});`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
