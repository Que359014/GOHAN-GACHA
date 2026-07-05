/* =========================================================
   ごはんガチャ - 動き（ロジック）
   ボタンを押したら何が起きるか、をこのファイルで管理します
   ========================================================= */

/* メニュー一覧。
   1品 = [絵文字, 名前, ひとことコメント, タグ, カロリー(kcal), 作り方] という配列。
   ここに行を足したり消したりするだけで、出てくる料理を増減できます。 */
const MEALS = [
  ["🍛","カレーライス","ルーをたっぷり。間違いない安心感。","がっつり",750,"玉ねぎ・にんじん・じゃがいも・肉を炒めて水を加えて煮込み、ルーを溶かしてご飯にかける。"],
  ["🍜","ラーメン","スープを飲み干す覚悟で。","がっつり",550,"麺を茹で、だしと調味料を合わせたスープに入れ、具材をのせる。"],
  ["🍣","お寿司","今日くらい贅沢してもいい。","ごほうび",500,"酢飯を作り、刺身や具材をのせるか巻いて仕上げる。"],
  ["🍕","ピザ","半分こも、独り占めも自由。","シェア向き",600,"生地にソースとチーズ・具材をのせて高温のオーブンで焼く。"],
  ["🍔","ハンバーガー","かぶりつく幸せ。","がっつり",500,"パティを焼き、バンズに野菜と一緒に挟む。"],
  ["🍝","パスタ","茹でて和えるだけ、なのに様になる。","おうち",650,"麺を茹で、ソースと絡めて仕上げる。"],
  ["🥟","餃子","ごはんともビールとも踊れる。","おかず",300,"具材を皮で包み、焼くか茹でて仕上げる。"],
  ["🍙","おにぎり","シンプルでも、握れば立派な一食。","かるめ",350,"温かいご飯に具を入れて握り、海苔を巻く。"],
  ["🍲","お鍋","野菜もタンパク質も一気に。","ヘルシー",400,"だしに野菜・肉・魚介を入れて煮込む。"],
  ["🍱","手作り弁当","詰めるのが楽しい日もある。","おうち",600,"おかずを数品作り、ご飯と一緒に詰める。"],
  ["🌮","タコス","スパイスで気分は南国。","ちょい冒険",450,"具材をスパイスで炒め、トルティーヤに包む。"],
  ["🍢","おでん","じんわり温まりたい日に。","ほっこり",250,"具材をだしでじっくり煮込む。"],
  ["🥘","パエリア","フライパンひとつで主役級。","ちょい豪華",650,"米と具材をフライパンで炒め、だしで炊き上げる。"],
  ["🍤","天ぷら","揚げたてのサクッを家で。","ごほうび",500,"具材に衣をつけて油で揚げる。"],
  ["🥗","サラダボウル","軽く済ませたい日の正解。","ヘルシー",350,"野菜や具材を切って盛り付け、ドレッシングをかける。"],
  ["🍳","オムライス","ふわとろに挑戦する夜。","おうち",700,"チキンライスを作り、薄焼き卵で包む。"],
  ["🌯","ブリトー","片手で食べられる満足感。","かるめ",550,"具材を炒めてトルティーヤで巻く。"],
  ["🍛","ハヤシライス","カレーじゃない気分の時に。","おうち",700,"玉ねぎと肉を炒めてデミグラスソースで煮込み、ご飯にかける。"],
  ["🍜","うどん","つるっと、やさしい味で。","かるめ",450,"麺を茹で、だしをかけて具をのせる。"],
  ["🥩","ステーキ","自分へのお疲れさま。","ごほうび",600,"肉を常温に戻し、強火で両面を焼いて休ませる。"],
  ["🍗","唐揚げ","何個でもいけてしまう。","がっつり",550,"鶏肉を下味に漬け、粉をまぶして油で揚げる。"],
  ["🫕","チーズフォンデュ","とろける時間を楽しむ。","シェア向き",600,"チーズを溶かし、具材をつけて食べる。"],
  ["🍚","親子丼","卵とろとろ、これで勝負。","おうち",650,"鶏肉と玉ねぎを煮て卵でとじ、ご飯にのせる。"],
  ["🥪","サンドイッチ","挟めば何でもごちそう。","かるめ",400,"パンに具材を挟んで仕上げる。"],
  ["🍚","ビビンバ","混ぜるほどおいしくなる。","ヘルシー",600,"ご飯にナムルや肉、卵をのせ、コチュジャンと混ぜる。"],
  ["🍤","エビチリ","ピリッと食欲スイッチ。","おかず",450,"エビを炒め、チリソースを絡める。"],
  ["🌭","ホットドッグ","気軽な日のごちそう。","かるめ",400,"ソーセージを焼き、パンに挟む。"],
  ["🥡","中華丼","あんかけで温まる野菜たっぷり。","おうち",600,"野菜や肉を炒めてとろみをつけ、ご飯にかける。"],
  ["🍲","豚汁定食","これさえあれば満たされる。","ほっこり",550,"豚肉と野菜を味噌汁仕立てで煮込む。"],
  ["🍕","マルゲリータ","シンプルが一番むずかしくて旨い。","ごほうび",650,"生地にトマトソース・モッツァレラ・バジルをのせて焼く。"]
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
const mealCal  = document.getElementById('mealCal');
const recipeBtn  = document.getElementById('recipeBtn');
const recipeText = document.getElementById('recipeText');
const againBtn = document.getElementById('againBtn');
const closeBtn = document.getElementById('closeBtn');
const countEl  = document.getElementById('count');
const todayCountEl = document.getElementById('todayCount');
const confetti = document.getElementById('confetti');

/* ───── 回数の保存（localStorage） ───── */

/* localStorage に書くときの「見出し」。他のサイトと混ざらないよう固有の名前にする。 */
const STORAGE_KEY = 'gohanGachaCount';

/* 今日の日付を "2026-07-04" の形の文字列で作る。
   PCのローカル時刻を使うので、あなたの生活の「日付が変わる瞬間」と一致します。 */
function todayStr(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0'); // 月は0始まりなので+1
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* 保存されている回数を読み出す。
   保存が無い or 日付が今日と違えば 0 を返す（＝日付が変わったらリセット）。 */
function loadCount(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return 0;                 // まだ一度も保存していない
  try {
    const data = JSON.parse(raw);     // 文字列を { date, count } に戻す
    return data.date === todayStr() ? data.count : 0;
  } catch {
    return 0;                         // 壊れたデータなら安全に0
  }
}

/* 今日の日付と一緒に回数を保存する。 */
function saveCount(count){
  const data = { date: todayStr(), count: count };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // オブジェクトは文字列にして保存
  
  //日付が変わったら記録リセット
  //localStorage.setItem('gohanGachaCount', JSON.stringify({date:'2026-07-05', count:0}))
}

/* 状態を覚えておく変数 */
let spinning = false;         // 回転中かどうか（連打防止）
let total    = loadCount();   // 本日の回数（起動時に保存分を復元）
let lastIdx  = -1;            // 直前に出た料理（連続を避けるため）

/* ページ上部の「本日◯回」表示を今の回数に合わせて更新する。 */
function updateTodayCount(){
  todayCountEl.textContent = total > 0 ? `本日 ${total} 回まわしました` : '';
}
updateTodayCount();  // 起動時に、復元した回数をすぐ表示

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
    mealCal.textContent  = '約 ' + m[4] + ' kcal';
    recipeText.textContent = m[5];
    recipeText.classList.remove('open');
    recipeBtn.textContent = '作り方を見る';

    total++;
    saveCount(total);   // 増えた回数を（今日の日付とともに）保存
    countEl.textContent = '本日 ' + total + ' 回目のガチャ';
    updateTodayCount(); // ページ上部の表示も更新

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

/* 「作り方を見る」ボタン：押すたびに表示・非表示を切り替える */
recipeBtn.addEventListener('click', () => {
  const opening = !recipeText.classList.contains('open');
  recipeText.classList.toggle('open', opening);
  recipeBtn.textContent = opening ? '作り方をとじる' : '作り方を見る';
});

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
