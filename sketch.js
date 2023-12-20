let captureGraphic;
let capture;
let qrCodeString = "";
let isQRCodeDetected = false;
let coneSize = 100;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  captureGraphic = createGraphics(640, 480);
  
  const constraints = {
    video: {
      facingMode: 'environment'
    }
  };
  capture = createCapture(constraints);
  capture.hide();
}

function draw() {
  // QRコードの情報を取得
  const code = getCodeFromCapture(capture, captureGraphic);
  if (code) {
    if (!isQRCodeDetected) {
      // QRコードが初めて検出された場合の処理
      isQRCodeDetected = true;

      // 先頭の数字を取得
      const rotationValue = parseInt(qrCodeString.match(/\d+/)[0]);

      // 200の値を取得
      const coneSizeValue = parseInt(qrCodeString.split(',')[1]);

      // 3D描画
      push();
      translate(-width / 2, -height / 2); // カメラ画面の左上に移動
      translate(width / 2, height / 2); // 画面中央に移動
      rotateZ(PI * rotationValue / 180); // 先頭の数字をrotateZの値として設定

      // 円錐の線を非表示にする
      noStroke();

      // 大きな円錐を画面中央に表示
      cone(coneSize,coneSizeValue );

      // 文字を表示
      displayTextTexture(qrCodeString.substring(qrCodeString.indexOf(',') + 1), 0, -120); // Y座標を少し上にずらす
      pop();
    }
  } else {
    isQRCodeDetected = false;
    // QRコードが検出されない場合はカメラ画面だけを表示
    image(capture, -width / 2, -height / 2, width, height);
  }
}

function getCodeFromCapture(cap, g) {
  g.clear(); // グラフィックスオブジェクトをクリア
  g.image(cap, 0, 0, cap.width, cap.height);
  const imgData = g.elt
    .getContext('2d')
    .getImageData(0, 0, cap.width, cap.height).data;

  const code = jsQR(imgData, cap.width, cap.height);
  if (code) {
    qrCodeString = code.data;
  }

  return code;
}

function displayTextTexture(text, x, y) {
  // テキストを描画したグラフィックスオブジェクトを作成
  const textGraphic = createGraphics(400, 200); // 大きなテクスチャ
  textGraphic.textSize(32); // 大きなフォントサイズ
  textGraphic.textAlign(CENTER);
  
  // テキストの色を黒に変更
  textGraphic.fill(0); // 0は黒を表します
  
  textGraphic.text(text, textGraphic.width / 2, textGraphic.height / 2);

  // テキストをテクスチャとして表示
  texture(textGraphic);
  translate(x, y);
  plane(textGraphic.width, textGraphic.height);
}
