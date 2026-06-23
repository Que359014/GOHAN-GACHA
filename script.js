/* =========================================================
   ごはんガチャ - 動き（ロジック）
   ボタンを押したら何が起きるか、をこのファイルで管理します
   ========================================================= */

/* メニュー一覧。
   1品 = [絵文字, 名前, ひとことコメント, タグ] という配列。
   ここに行を足したり消したりするだけで、出てくる料理を増減できます。 */
const MEALS = [
  ["🍛","カレーライス","ルーをたっぷり。間違いない安心感。","がっつり"],
  ["🍜","ラーメン","スープを飲み干す覚悟で。","がっつり"],
  ["🍣","お寿司","今日くらい贅沢してもいい。","ごほうび"],
  ["🍕","ピザ","半分こも、独り占めも自由。","シェア向き"],
  ["🍔","ハンバーガー","かぶりつく幸せ。","がっつり"],
  ["🍝","パスタ","茹でて和えるだけ、なのに様になる。","おうち"],
  ["🥟","餃子","ごはんともビールとも踊れる。","おかず"],
  ["🍙","おにぎり","シンプルでも、握れば立派な一食。","かるめ"],
  ["🍲","お鍋","野菜もタンパク質も一気に。","ヘルシー"],
  ["🍱","手作り弁当","詰めるのが楽しい日もある。","おうち"],
  ["🌮","タコス","スパイスで気分は南国。","ちょい冒険"],
  ["🍢","おでん","じんわり温まりたい日に。","ほっこり"],
  ["🥘","パエリア","フライパンひとつで主役級。","ちょい豪華"],
  ["🍤","天ぷら","揚げたてのサクッを家で。","ごほうび"],
  ["🥗","サラダボウル","軽く済ませたい日の正解。","ヘルシー"],
  ["🍳","オムライス","ふわとろに挑戦する夜。","おうち"],
  ["🌯","ブリトー","片手で食べられる満足感。","かるめ"],
  ["🍛","ハヤシライス","カレーじゃない気分の時に。","おうち"],
  ["🍜","うどん","つるっと、やさしい味で。","かるめ"],
  ["🥩","ステーキ","自分へのお疲れさま。","ごほうび"],
  ["🍗","唐揚げ","何個でもいけてしまう。","がっつり"],
  ["🫕","チーズフォンデュ","とろける時間を楽しむ。","シェア向き"],
  ["🍚","親子丼","卵とろとろ、これで勝負。","おうち"],
  ["🥪","サンドイッチ","挟めば何でもごちそう。","かるめ"],
  ["🍚","ビビンバ","混ぜるほどおいしくなる。","ヘルシー"],
  ["🍤","エビチリ","ピリッと食欲スイッチ。","おかず"],
  ["🌭","ホットドッグ","気軽な日のごちそう。","かるめ"],
  ["🥡","中華丼","あんかけで温まる野菜たっぷり。","おうち"],
  ["🍲","豚汁定食","これさえあれば満たされる。","ほっこり"],
  ["🍕","マルゲリータ","シンプルが一番むずかしくて旨い。","ごほうび"]
];

/* カプセルの色のパレット */
const CAP_COLORS = ["#FF5757","#FFC93C","#36C5A6","#5B8DEF","#FF8FB1","#A66CFF","#FF9F45"];

/* ドーム内に浮かぶカプセルを並べる（座標を決め打ちで配置） */
const dome = document.getElementById('dome');
const spots = [[28,40],[80,26],[132,38],[178,58],[44,84],[96,72],[150,86],[24,110],[112,112],[170,104]];
spots.forEach((p, i) => {
  const c = document.createElement('div');
  c.className = 'cap';
  c.style.left = p[0] + 'px';
  c.style.top  = p[1] + 'px';
  c.style.background = CAP_COLORS[i % CAP_COLORS.length];
  c.style.animationDelay = (i * 0.25) + 's';
  dome.appendChild(c);
});

/* HTML内の要素を変数につかんでおく（C#のフィールドのようなもの） */
const machine  = document.getElementById('machine');
const knob     = document.getElementById('knob');
const drop     = document.getElementById('drop');
const spinBtn  = document.getElementById('spinBtn');
const overlay  = document.getElementById('overlay');
const burst    = document.getElementById('burst');
const mealName = document.getElementById('mealName');
const mealNote = document.getElementById('mealNote');
const mealTag  = document.getElementById('mealTag');
const againBtn = document.getElementById('againBtn');
const closeBtn = document.getElementById('closeBtn');
const countEl  = document.getElementById('count');
const confetti = document.getElementById('confetti');

/* 状態を覚えておく変数 */
let spinning = false;  // 回転中かどうか（連打防止）
let total    = 0;      // 本日の回数
let lastIdx  = -1;     // 直前に出た料理（連続を避けるため）

/* ランダムで1品選ぶ。直前と同じものは避ける。 */
function pick(){
  let i;
  do {
    i = Math.floor(Math.random() * MEALS.length);
  } while (MEALS.length > 1 && i === lastIdx);
  lastIdx = i;
  return i;
}

/* 紙吹雪を飛ばす演出 */
function fireConfetti(){
  const colors = ["#FF5757","#FFC93C","#36C5A6","#5B8DEF","#FF8FB1","#A66CFF"];
  for (let i = 0; i < 26; i++){
    const c = document.createElement('div');
    c.className = 'conf';
    c.style.background = colors[i % colors.length];
    if (i % 3 === 0) c.style.borderRadius = '50%';
    confetti.appendChild(c);

    const ang  = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 150;
    const dx   = Math.cos(ang) * dist;
    const dy   = Math.sin(ang) * dist - 40;
    const rot  = (Math.random() * 720 - 360) + 'deg';

    c.animate([
      { transform:'translate(0,0) rotate(0)', opacity:1 },
      { transform:`translate(${dx}px,${dy + 180}px) rotate(${rot})`, opacity:0 }
    ], { duration: 1100 + Math.random() * 400, easing:'cubic-bezier(.2,.6,.4,1)' });

    setTimeout(() => c.remove(), 1600);
  }
}

/* ガチャを回すメインの処理 */
function spin(){
  if (spinning) return;        // すでに回転中なら何もしない
  spinning = true;
  spinBtn.disabled = true;
  overlay.classList.remove('open');

  const idx = pick();
  const m = MEALS[idx];        // m = [絵文字, 名前, コメント, タグ]

  knob.classList.add('turn');
  machine.classList.add('shake');

  // 1) 少し遅れてカプセルが落ちてくる
  setTimeout(() => {
    drop.style.background = CAP_COLORS[Math.floor(Math.random() * CAP_COLORS.length)];
    drop.classList.remove('show');
    void drop.offsetWidth;     // アニメをやり直すためのおまじない
    drop.classList.add('show');
  }, 420);

  // 2) トレイで少し跳ねる
  setTimeout(() => { drop.classList.add('jiggle'); }, 1300);

  // 3) 結果を表示する
  setTimeout(() => {
    burst.textContent    = m[0];
    mealName.textContent = m[1];
    mealNote.textContent = m[2];
    mealTag.textContent  = '#' + m[3];

    total++;
    countEl.textContent = '本日 ' + total + ' 回目のガチャ';

    burst.style.animation = 'none';
    void burst.offsetWidth;
    burst.style.animation = '';

    overlay.classList.add('open');
    fireConfetti();

    // 後片付け
    knob.classList.remove('turn');
    machine.classList.remove('shake');
    drop.classList.remove('show', 'jiggle');
    drop.style.opacity = '0';

    spinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'もう一回まわす';
  }, 1850);
}

/* ボタンやクリックと処理を結びつける（イベント登録） */
spinBtn.addEventListener('click', spin);
againBtn.addEventListener('click', () => {
  overlay.classList.remove('open');
  setTimeout(spin, 180);
});
closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});
