// DOMContentLoadedイベントが発火したときに初期化処理を実行する
document.addEventListener('DOMContentLoaded', () => {
    // appContainer要素を取得
    const appContainer = document.getElementById('app-container');

    // クイズデータ（問題と答え）を配列で定義
    const quizItems = [
        { name: "りんご", image: "🍎", price: "100円くらい", hint: "おいしい赤い赤い赤いフルーツだよ" },
        { name: "えんぴつ", image: "✏️", price: "50円くらい", hint: "字を書いたり絵を描いたりするのに使うよ" },
        { name: "牛乳", image: "🥛", price: "200円くらい", hint: "背が伸びる、白い飲み物だよ" },
        { name: "ブロック", image: "🧱", price: "1000円くらい", hint: "いろいろな形を作れるおもちゃだよ" },
        { name: "消しゴム", image: " eraser", price: "30円くらい", hint: "鉛筆で書いた字を消せるよ" },
    ];

    let currentQuizIndex = 0; // 現在のクイズのインデックス

    // 各文字を<span>タグで囲むためのヘルパー関数
    function wrapTextInSpans(text) {
        return text.split('').map(char => {
            if (char === ' ') { // スペースはそのままにする
                return ' ';
            }
            return `<span class="drop-letter">${char}</span>`;
        }).join('');
    }

    // --- 画面表示関数 ---

    function showWelcomeScreen() {
        const schoolParkText = "School Park";
        const animatedTitle = wrapTextInSpans(schoolParkText);

        if (!appContainer) {
            console.error("Error: app-container not found. Cannot display welcome screen.");
            return;
        }

        appContainer.innerHTML = `
            <h1 class="animated-title">${animatedTitle}</h1>
            <p>ようこそ、ひみつのあそびばへ！</p> <button id="startButton" class="action-button">いってきま〜す！</button>
        `;
        
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', showActivitySelection);
        } else {
            console.error("Error: startButton not found.");
        }

        // アニメーションの遅延を各文字に適用する
        const letters = document.querySelectorAll('.drop-letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function showActivitySelection() {
        appContainer.innerHTML = `
            <h1>きょうはなにであそぶ？</h1>
            <button id="shopGameButton" class="action-button">おみせやさんごっこ</button>
            <button id="priceQuizButton" class="action-button">いくら？クイズ</button>
            <button id="pictureShiritoriButton" class="action-button">みんなでつなげ！絵しりとり</button>
            <button id="backToWelcome" class="back-button">最初の画面に戻る</button>
        `;

        document.getElementById('shopGameButton').addEventListener('click', showShopGame);
        document.getElementById('priceQuizButton').addEventListener('click', startPriceQuizGame);
        document.getElementById('pictureShiritoriButton').addEventListener('click', showPictureShiritoriRules);
        
        document.getElementById('backToWelcome').addEventListener('click', showWelcomeScreen);
    }

    function showShopGame() {
        appContainer.innerHTML = `
            <h2 id="game-title">🌿 おみせやさんごっこ 💰</h2>
            <div class="game-content">
                <p>身近な自然物をお金に見立てて、お店屋さんごっこをしよう！</p>
                <h3>準備するもの</h3>
                <ul>
                    <li>🍂 拾った葉っぱや小石（これがお金だよ！）</li>
                    <li>📦 お店屋さんの商品（ブロック、おもちゃ、絵本など、保育園にあるものでOK！）</li>
                    <li>🏷️ 商品の値札（画用紙や段ボールの切れ端に数字を書いてね！）</li>
                </ul>
                <h3>遊び方</h3>
                <ol>
                    <li>みんなで葉っぱや小石をたくさん集めよう！それがSchool Parkのお金になるよ。</li>
                    <li>お店屋さんとお客さんに分かれてね。（交代で両方やってみよう！）</li>
                    <li>お店屋さんは、商品に「これいくら？」って値札をつけよう。</li>
                    <li>お客さんは、集めたお金で好きなものを買ってね！</li>
                    <li>お店屋さんはお金を受け取って、お客さんは商品を受け取ったら、お買い物成功！</li>
                </ol>
                <p>💡 お金と物の交換、物の価値、お金を数える練習になるよ！</p>
            </div>
            <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
        `;
        document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
    }

    function startPriceQuizGame() {
        currentQuizIndex = 0; // クイズを最初から始める
        showPriceQuizQuestion();
    }

    function showPriceQuizQuestion() {
        if (currentQuizIndex >= quizItems.length) {
            // 全てのクイズが終わったら
            appContainer.innerHTML = `
                <h2 id="game-title">クイズおわり！またあそぼうね！</h2>
                <p>いろいろな物の値段を考えることができたかな？</p>
                <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
            `;
            document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
            return;
        }

        const item = quizItems[currentQuizIndex];
        appContainer.innerHTML = `
            <h2 id="game-title">これ、いくらかな？クイズ</h2>
            <div class="quiz-item-display">
                <span class="quiz-image">${item.image}</span>
                <p class="quiz-name">${item.name}</p>
            </div>
            <p class="quiz-instruction">これ、いくらくらいだと思う？</p>
            <button id="showAnswerButton" class="action-button">答えをみる！</button>
            <p id="answerDisplay" class="quiz-answer" style="display:none;">${item.name}はだいたい **${item.price}** だよ！</p>
            <p id="hintDisplay" class="quiz-hint" style="display:none;">ヒント：${item.hint}</p>

            <div class="quiz-navigation">
                <button id="prevQuizButton" class="back-button" style="${currentQuizIndex === 0 ? 'display:none;' : ''}">前の問題</button>
                <button id="nextQuizButton" class="action-button">次の問題</button>
            </div>
            <button id="backToSelectionFromQuiz" class="back-button">遊びを選ぶ画面に戻る</button>
        `;

        document.getElementById('showAnswerButton').addEventListener('click', function() {
            const answerElem = document.getElementById('answerDisplay');
            const hintElem = document.getElementById('hintDisplay');
            if (answerElem.style.display === 'none') {
                answerElem.style.display = 'block';
                hintElem.style.display = 'block';
                this.textContent = '答えをかくす';
            } else {
                answerElem.style.display = 'none';
                hintElem.style.display = 'none';
                this.textContent = '答えをみる！';
            }
        });

        document.getElementById('nextQuizButton').addEventListener('click', function() {
            currentQuizIndex++;
            showPriceQuizQuestion();
        });

        document.getElementById('prevQuizButton').addEventListener('click', function() {
            currentQuizIndex--;
            showPriceQuizQuestion();
        });

        document.getElementById('backToSelectionFromQuiz').addEventListener('click', showActivitySelection);
    }

    // 絵しりとりゲームのルール表示（アナログ版）
    function showPictureShiritoriRules() {
        appContainer.innerHTML = `
            <h2 id="game-title">みんなでつなげ！絵しりとり 🖼️🗣️</h2>
            <div class="game-content">
                <p class="game-points">みんなで力を合わせて、ながーいしりとりを作ろう！</p>

                <h3>🎨 準備するもの</h3>
                <ul>
                    <li>✨ **絵しりとりカード**（54枚作ったカードだよ！）
                        <ul class="sub-list">
                            <li>🍎 りんご、🥒 きゅうり、など、絵が書いてあるカード</li>
                            <li>事前に印刷して切り取ってね！</li>
                        </ul>
                    </li>
                </ul>

                <h3>💡 遊び方</h3>
                <ol>
                    <li>**みんなで輪になろう！** 🤝
                        <ul>
                            <li>最初に、お友達と先生とみんなで、大きな輪っかになって座ります。</li>
                        </ul>
                    </li>
                    <li>**最初のカードを置こう！** 🃏
                        <ul>
                            <li>先生が山札の中から、最初の一枚を選んで、輪の真ん中に置きます。</li>
                        </ul>
                    </li>
                    <li>**手札を配ろう！** 🖐️
                        <ul>
                            <li>残りの山札は、みんなに手札として配ります。</li>
                            <li>自分の手札にどんな絵があるか見てみよう！</li>
                        </ul>
                    </li>
                    <li>**順番につなげよう！** ↩️
                        <ul>
                            <li>順番に（時計回りに）、真ん中の絵に繋がる絵（最後の文字から始まる絵）を自分の手札から出してね。</li>
                            <li>カードを出したら、**「〇〇！」**って大きな声で、絵の言葉をみんなで発音しよう！</li>
                        </ul>
                    </li>
                    <li>**繋がる絵がないときは…？** 🤔
                        <ul>
                            <li>もし、自分の手札に繋がる絵がない場合は、「パス！」ってお休みだよ。次の人へ順番が回ります。</li>
                            </ul>
                        </li>
                    <li>**どこまで繋げられるかな？** 🏆
                        <ul>
                            <li>もし「ん」のカードが出たら、そこでしりとりはおしまい！</li>
                            <li>何枚まで長く繋げられたか、みんなで数えてみよう！</li>
                        </ul>
                    </li>
                </ol>

                <h3>✨ 目的・ねらい</h3>
                <ul class="game-hint-list">
                    <li>みんなで**楽しむ**こと！ 😊</li>
                    <li>みんなで**一つのことを共有**して、**達成感**を感じたり、**協力する気持ち**を育むこと！🤝</li>
                </ul>
            </div>
            <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
        `;
        document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
    }

    // 初期ロード時に最初の画面を表示
    showWelcomeScreen();
});
