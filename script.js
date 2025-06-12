// DOMContentLoadedイベントでページの読み込みが完了した後に処理を実行
document.addEventListener('DOMContentLoaded', function() {
    // HTML要素の取得
    const appContainer = document.getElementById('app-container');
    const startButton = document.getElementById('start-button');
    const backgroundMusic = document.getElementById('background-music');

    // 初期表示コンテンツの定義
    function renderInitialScreen() {
        const animatedTitle = 'School Park'; // アニメーションタイトル（例）
        appContainer.innerHTML = `
            <h1 class="animated-title">${animatedTitle}</h1>
            <p>ようこそ、ひみつのおあそびばへ！</p>
            <button id="start-button" class="action-button">いってきま〜す！</button>
        `;
        // innerHTMLの更新後、startButtonを再取得する必要がある
        // DOM要素が再構築されるため、古いstartButtonの参照は無効になる
        const newStartButton = document.getElementById('start-button');
        if (newStartButton) {
            newStartButton.addEventListener('click', function() {
                if (backgroundMusic) {
                    // BGMの再生を試みる
                    // まずミュート状態で再生を開始し、成功後にミュートを解除する
                    backgroundMusic.muted = true; // BGMをミュートにする
                    const playPromise = backgroundMusic.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            backgroundMusic.muted = false; // 再生が成功したらミュート解除
                            console.log("BGMの再生を開始しました。");
                            showActivitySelection(); // 画面遷移
                        }).catch(error => {
                            console.error("BGMの再生に失敗しました。", error);
                            // ブラウザの自動再生制限でエラーが出た場合にユーザーに通知する (デバッグ用)
                            // alert("音楽を再生できませんでした。ブラウザの自動再生制限かもしれません。");
                        });
                    }
                } else {
                    console.warn("backgroundMusic要素が見つかりません。index.htmlのid='background-music'を確認してください。");
                    // alert("音楽を再生できませんでした。");
                }
            });
        }
    }

    // アクティビティ選択画面への遷移（仮の関数）
    function showActivitySelection() {
        // ここにアクティビティ選択画面のコンテンツを生成する処理を記述
        // 例: appContainer.innerHTML = '<h2>アクティビティを選ぼう！</h2><p>...</p>';
        console.log("アクティビティ選択画面に遷移しました。"); // デバッグ用
        // 必要に応じて戻るボタンなどもここに追加
    }

    // ページの初期表示
    renderInitialScreen();
});