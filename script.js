document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app-container');

    if (!appContainer) {
        console.error("致命的なエラー: ID 'app-container' を持つ要素が見つかりませんでした。HTMLを確認してください。");
        return;
    }

    const originalQuizItems = [
        { name: "りんご", image: "🍎", price: "100円くらい", hint: "おいしい赤い赤い赤いフルーツだよ" },
        { name: "えんぴつ", image: "✏️", price: "50円くらい", hint: "字を書いたり絵を描いたりするのに使うよ" },
        { name: "牛乳", image: "🥛", price: "200円くらい", hint: "背が伸びる、白い飲み物だよ" },
        { name: "ブロック", image: "🧱", price: "1000円くらい", hint: "いろいろな形を作れるおもちゃだよ" },
        { name: "消しゴム", image: " eraser", price: "30円くらい", hint: "鉛筆で書いた字を消せるよ" },
        { name: "くるま", image: "🚗", price: "100万円くらい", hint: "これで遠くまでお出かけできるよ" },
        { name: "いえ", image: "🏠", price: "2000万円くらい", hint: "家族みんなで住む場所だよ" },
        { name: "サッカーボール", image: "⚽", price: "2000円くらい", hint: "足で蹴って遊ぶ丸いものだよ" },
        { name: "ほん", image: "📚", price: "1000円くらい", hint: "お話が書いてあって、読むと楽しいよ" }
    ];

    const englishQuizItems = [
        {
            japanese: "りんご",
            emoji: "🍎",
            correctAnswer: "apple",
            audioFile: "audio/apple.mp3",
            options: ["apple", "banana", "orange"]
        },
        {
            japanese: "バナナ",
            emoji: "🍌",
            correctAnswer: "banana",
            audioFile: "audio/banana.mp3",
            options: ["banana", "grape", "melon"]
        },
        {
            japanese: "いぬ",
            emoji: "🐶",
            correctAnswer: "dog",
            audioFile: "audio/dog.mp3",
            options: ["dog", "cat", "bird"]
        },
        {
            japanese: "ねこ",
            emoji: "🐱",
            correctAnswer: "cat",
            audioFile: "audio/cat.mp3",
            options: ["cat", "mouse", "fish"]
        },
        {
            japanese: "くるま",
            emoji: "🚗",
            correctAnswer: "car",
            audioFile: "audio/car.mp3",
            options: ["car", "bus", "train"]
        },
        {
            japanese: "お父さん",
            emoji: "👨",
            correctAnswer: "father",
            audioFile: "audio/father.mp3",
            options: ["father", "mother", "brother"]
        },
        {
            japanese: "お母さん",
            emoji: "👩",
            correctAnswer: "mother",
            audioFile: "audio/mother.mp3",
            options: ["mother", "father", "sister"]
        },
        {
            japanese: "先生",
            emoji: "👩‍🏫",
            correctAnswer: "teacher",
            audioFile: "audio/teacher.mp3",
            options: ["teacher", "student", "doctor"]
        },
        {
            japanese: "友達",
            emoji: "👫",
            correctAnswer: "friend",
            audioFile: "audio/friend.mp3",
            options: ["friend", "family", "neighbor"]
        },
        {
            japanese: "おはよう",
            emoji: "☀️",
            correctAnswer: "good morning",
            audioFile: "audio/good_morning.mp3",
            options: ["good morning", "good afternoon", "good night"]
        },
        {
            japanese: "おやすみ",
            emoji: "😴",
            correctAnswer: "good night",
            audioFile: "audio/good_night.mp3",
            options: ["good night", "good evening", "hello"]
        },
        {
            japanese: "ありがとう",
            emoji: "🙏",
            correctAnswer: "thank you",
            audioFile: "audio/thank_you.mp3",
            options: ["thank you", "please", "excuse me"]
        },
        {
            japanese: "どうしたの？",
            emoji: "❓",
            correctAnswer: "what's wrong",
            audioFile: "audio/whats_wrong.mp3",
            options: ["what's wrong", "how are you", "what's up"]
        }
    ];

    let currentQuizIndex = 0;
    let shuffledQuizItems = [];
    let currentEnglishQuizIndex = 0;
    let shuffledEnglishQuizItems = [];


    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function wrapTextInSpans(text) {
        return text.split('').map(char => {
            if (char === ' ') {
                return ' ';
            }
            return `<span class="drop-letter">${char}</span>`;
        }).join('');
    }

    function showWelcomeScreen() {
        const schoolParkText = "School Park";
        const animatedTitle = wrapTextInSpans(schoolParkText);

        appContainer.innerHTML = `
            <h1 class="animated-title">${animatedTitle}</h1>
            <img src="images/door.png" alt="扉の画像" class="door-image">
            <p>ようこそ、ひみつのあそびばへ！</p>
            <button id="goButton" class="action-button">とびらをあける</button>
        `;

        const goButton = document.getElementById('goButton');
        if (goButton) {
            goButton.addEventListener('click', function() {
                showActivitySelection();
            });
        } else {
            console.error("Error: goButton not found.");
        }

        const letters = document.querySelectorAll('.drop-letter');
        letters.forEach((letter, index) => {
            letter.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function showActivitySelection() {
        appContainer.innerHTML = `
            <h1>きょうはなにしてあそぶ？</h1>

            <div class="game-group">
                <h2>こどもが遊ぶゲーム</h2>
                <button id="priceQuizButton" class="action-button">いくら？クイズ</button>
                <button id="puzzleGameButton" class="action-button disabled-button" disabled>パズルゲーム (準備中)</button>
                <button id="englishGameButton" class="action-button">えいごであそぼ</button>
                <button id="coloringGameButton" class="action-button disabled-button" disabled>ぬりえ (準備中)</button>
            </div>

            <div class="game-group" style="margin-top: 30px;">
                <h2>こども向け遊び方説明</h2>
                <button id="shopGameButton" class="action-button">おみせやさんごっこ</button>
                <button id="pictureShiritoriButton" class="action-button">みんなでつなげ！絵しりとり</button>
            </div>

            <button id="backToWelcome" class="back-button" style="margin-top: 40px;">最初の画面に戻る</button>
        `;

        document.getElementById('shopGameButton').addEventListener('click', showShopGame);
        document.getElementById('priceQuizButton').addEventListener('click', startPriceQuizGame);
        document.getElementById('pictureShiritoriButton').addEventListener('click', showPictureShiritoriRules);

        const englishGameButton = document.getElementById('englishGameButton');
        englishGameButton.classList.remove('disabled-button');
        englishGameButton.removeAttribute('disabled');
        englishGameButton.addEventListener('click', startEnglishGame);

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
        currentQuizIndex = 0;
        shuffledQuizItems = shuffleArray([...originalQuizItems]);
        showPriceQuizQuestion();
    }

    function showPriceQuizQuestion() {
        if (currentQuizIndex >= shuffledQuizItems.length) {
            appContainer.innerHTML = `
                <h2 id="game-title">クイズおわり！またあそぼうね！</h2>
                <p>いろいろな物の値段を考えることができたかな？</p>
                <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
            `;
            document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
            return;
        }

        const item = shuffledQuizItems[currentQuizIndex];
        appContainer.innerHTML = `
            <h2 id="game-title">これ、いくらかな？クイズ</h2>
            <div class="quiz-item-display">
                <span class="quiz-image">${item.image}</span>
                <p class="quiz-name">${item.name}</p>
            </div>
            <p class="quiz-instruction">これ、いくらくらいだと思う？</p>
            <button id="showAnswerButton" class="action-button">答えをみる！</button>
            <p id="answerDisplay" class="quiz-answer" style="display:none;">${item.name}はだいたい ${item.price} だよ！</p>
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

    function showPictureShiritoriRules() {
        appContainer.innerHTML = `
            <h2 id="game-title">みんなでつなげ！絵しりとり 🖼️🗣️</h2>
            <div class="game-content">
                <p class="game-points">みんなで力を合わせて、ながーいしりとりを作ろう！</p>

                <h3>🎨 準備するもの</h3>
                <ul>
                    <li>✨ 絵しりとりカード（54枚作ったカードだよ！）
                        <ul class="sub-list">
                            <li>🍎 りんご、🥒 きゅうり、など、絵が書いてあるカード</li>
                            <li>事前に印刷して切り取ってね！</li>
                        </ul>
                    </li>
                </ul>

                <h3>💡 遊び方</h3>
                <ol>
                    <li>みんなで輪になろう！ 🤝
                        <ul>
                            <li>最初に、お友達と先生とみんなで、大きな輪っかになって座ります。</li>
                        </ul>
                    </li>
                    <li>最初のカードを置こう！ 🃏
                        <ul>
                            <li>先生が山札の中から、最初の一枚を選んで、輪の真ん中に置きます。</li>
                        </ul>
                    </li>
                    <li>手札を配ろう！ 🖐️
                        <ul>
                            <li>残りの山札は、みんなに手札として配ります。</li>
                            <li>自分の手札にどんな絵があるか見てみよう！</li>
                            </ul>
                        </li>
                    <li>順番につなげよう！ ↩️
                        <ul>
                            <li>順番に（時計回りに）、真ん中の絵に繋がる絵（最後の文字から始まる絵）を自分の手札から出してね。</li>
                            <li>カードを出したら、「〇〇！」って大きな声で、絵の言葉をみんなで発音しよう！</li>
                            </ul>
                        </li>
                    <li>繋がる絵がないときは…？ 🤔
                        <ul>
                            <li>もし、自分の手札に繋がる絵がない場合は、「パス！」ってお休みだよ。次の人へ順番が回ります。</li>
                            </ul>
                        </li>
                    <li>どこまで繋げられるかな？ 🏆
                        <ul>
                            <li>もし「ん」のカードが出たら、そこでしりとりはおしまい！</li>
                            <li>何枚まで長く繋げられたか、みんなで数えてみよう！</li>
                        </ul>
                    </li>
                </ol>

                <h3>✨ 目的・ねらい</h3>
                <ul class="game-hint-list">
                    <li>みんなで楽しむこと！ 😊</li>
                    <li>みんなで一つのことを共有して、達成感を感じたり、協力する気持ちを育むこと！🤝</li>
                </ul>
            </div>
            <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
        `;
        document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
    }


    function startEnglishGame() {
        currentEnglishQuizIndex = 0;
        shuffledEnglishQuizItems = shuffleArray([...englishQuizItems]);
        showEnglishQuizQuestion();
    }

    function showEnglishQuizQuestion() {
        if (currentEnglishQuizIndex >= shuffledEnglishQuizItems.length) {
            appContainer.innerHTML = `
                <h2 id="game-title">えいごであそぼ おしまい！</h2>
                <p>よくがんばったね！またあそぼうね！</p>
                <button id="backToSelection" class="back-button">遊びを選ぶ画面に戻る</button>
            `;
            document.getElementById('backToSelection').addEventListener('click', showActivitySelection);
            return;
        }

        const item = shuffledEnglishQuizItems[currentEnglishQuizIndex];
        const shuffledOptions = shuffleArray([...item.options]);

        let optionsHtml = '';
        shuffledOptions.forEach(option => {
            optionsHtml += `<button class="english-quiz-option-button" data-answer="${option}">${option}</button>`;
        });

        appContainer.innerHTML = `
            <h2 id="game-title">これ、英語でなんていうの？</h2>
            <div class="quiz-item-display">
                <p class="quiz-instruction">${item.japanese}</p>
                <span class="quiz-image">${item.emoji}</span>
            </div>
            <div class="english-options-container">
                ${optionsHtml}
            </div>
            <p id="englishFeedback" class="feedback-message"></p>

            <div class="quiz-navigation">
                <button id="prevEnglishQuizButton" class="back-button" style="${currentEnglishQuizIndex === 0 ? 'display:none;' : ''}">前の問題</button>
                <button id="nextEnglishQuizButton" class="action-button">次の問題</button>
            </div>
            <button id="backToSelectionFromEnglishQuiz" class="back-button">遊びを選ぶ画面に戻る</button>
        `;

        document.querySelectorAll('.english-quiz-option-button').forEach(button => {
            button.addEventListener('click', function() {
                const feedbackElem = document.getElementById('englishFeedback');

                // 不正解のスタイルが付いている場合は解除する（再挑戦用）
                this.classList.remove('wrong-answer');

                if (this.dataset.answer === item.correctAnswer) {
                    feedbackElem.textContent = 'せいかい！✨';
                    feedbackElem.style.color = 'green'; // 正解は緑色
                    playAudio(item.audioFile); // 正解の場合、音声を再生
                    // ここでボタンを無効化する処理は入れないため、何度でも押せる
                } else {
                    feedbackElem.textContent = 'ちがうよ！もういちど！';
                    feedbackElem.style.color = 'red'; // 不正解は赤色
                    this.classList.add('wrong-answer'); // 間違いのスタイルを追加
                }
            });
        });

        document.getElementById('nextEnglishQuizButton').addEventListener('click', function() {
            currentEnglishQuizIndex++;
            showEnglishQuizQuestion();
        });

        document.getElementById('prevEnglishQuizButton').addEventListener('click', function() {
            currentEnglishQuizIndex--;
            showEnglishQuizQuestion();
        });

        document.getElementById('backToSelectionFromEnglishQuiz').addEventListener('click', showActivitySelection);
    }

    // 音声再生用の関数
    function playAudio(src) {
        const audio = new Audio(src);
        audio.play().catch(e => console.error("音声の再生に失敗しました:", e));
    }

    // BGMのロジック
    const bgmAudio = new Audio('bgm.mp3'); // index.htmlと同じ階層を参照
    bgmAudio.loop = true; // ループ再生
    bgmAudio.preload = 'auto'; // 事前ロード

    // ユーザーインタラクションがあったときにBGMを再生
    // 自動再生ポリシーにより、ユーザーがクリックするまで音声は再生されないことが多い
    document.addEventListener('click', function startBGM() {
        bgmAudio.play()
            .then(() => console.log("BGM再生開始"))
            .catch(e => console.error("BGMの再生に失敗しました:", e));
        document.removeEventListener('click', startBGM); // 一度再生を試みたらイベントリスナーを削除
    }, { once: true }); // イベントリスナーを一度だけ実行するように設定

    showWelcomeScreen();
});