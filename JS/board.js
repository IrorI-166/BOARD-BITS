const board = document.getElementById("board");

board.addEventListener('dragover', function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

board.addEventListener('dragleave', function (e) {
    e.stopPropagation();
    e.preventDefault();
}, false);

// ドロップされたときにどうなるかのイベントハンドラ
board.addEventListener('drop', function (e) {
    e.preventDefault();
    target = e.target;
    const files = e.dataTransfer.files;
    const x = e.clientX - board.getBoundingClientRect().left; // ドロップされた位置のX座標
    const y = e.clientY - board.getBoundingClientRect().top;  // ドロップされた位置のY座標

    if (isUpFile(target)) {
        previewFile(target, x, y);
    } else {
        handleDroppedFiles(files, x, y);
    }
}, false);

function isUpFile(tg) {
    const upFiles = document.querySelectorAll('.upFile');

    if (!upFiles.length) return false;

    for (const upFile of upFiles) {
        if (upFile == tg) return true;
    }
    return false;
}

function handleDroppedFiles(files, x, y) {
    for (const file of files) {
        previewFile(file, x, y);
    }
}

function findExistingContainer(file) {
    const containers = document.querySelectorAll('.upFile');
    var fr = new FileReader();
    fr.readAsDataURL(file);

    for (const container of containers) {
        const img = container.querySelector('img');
        if (img && img.getAttribute('src') === fr.result) {
            return true;
        }
    }

    return false;
}

function previewFile(file, x, y) {
    var fr = new FileReader();
    fr.onload = function () {

        if (file.type.startsWith('image/')) {
            // 画像ファイルの場合
            var container = document.createElement('div');
            container.id = "upFile"
            container.style.width = '30%';
            container.style.height = 'auto';
            container.style.overflow = 'auto';
            container.style.resize = 'both';
            container.style.position = 'absolute';
            container.style.left = x + 'px';
            container.style.top = y + 'px';

            var img = document.createElement('img');
            img.setAttribute('src', fr.result);
            img.style.width = '100%';
            img.style.height = 'auto';

            container.appendChild(img);
            board.appendChild(container);

            // ドラッグ可能に設定
            container.draggable = true;

            // 要素のドラッグ開始イベント定義
            container.addEventListener('dragstart', function (e) {
                handleDragStart(e);
            });
            // 要素のドラッグ中イベント定義
            container.addEventListener('drag', function (e) {
                handleDrag(e);
            });
            // 要素のドラッグ終了イベント定義
            container.addEventListener('dragend', function (e) {
                handleDragEnd();
            });
        } else if (file.type === 'application/pdf') {
            // PDFファイルの場合
            var pdfEmbed = document.createElement('embed');
            pdfEmbed.setAttribute('src', fr.result);
            pdfEmbed.setAttribute('type', 'application/pdf');
            pdfEmbed.setAttribute('width', '100%');
            pdfEmbed.setAttribute('height', '500px');
            pdfEmbed.style.position = 'absolute';
            pdfEmbed.style.left = x + 'px';
            pdfEmbed.style.top = y + 'px';

            board.appendChild(pdfEmbed);

            // プレビュー要素のdragstartイベントを阻止
            pdfEmbed.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        } else {
            // その他のファイル形式の場合
            var unsupportedMsg = document.createElement('p');
            unsupportedMsg.textContent = 'Unsupported file type: ' + file.type;
            unsupportedMsg.style.position = 'absolute';
            unsupportedMsg.style.left = x + 'px';
            unsupportedMsg.style.top = y + 'px';

            board.appendChild(unsupportedMsg);

            // プレビュー要素のdragstartイベントを阻止
            unsupportedMsg.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        }
    };
    fr.readAsDataURL(file);
}

let draggingElement = null;

// ドラッグスタート時の処理
function handleDragStart(e) {
    draggingElement = e.target;
    draggingElement.style.opacity = '0.5'; // ドラッグ中の要素を半透明にする
}

// ドラッグ中の処理
function handleDrag(e) {
    if (!draggingElement) return;

    const x = e.clientX;
    const y = e.clientY;

    // 移動中の要素の位置を更新
    draggingElement.style.left = x + 'px';
    draggingElement.style.top = y + 'px';
}

// ドラッグ終了時の処理
function handleDragEnd() {
    if (!draggingElement) return;

    draggingElement.style.opacity = '1'; // 元の不透明度に戻す
    draggingElement = null; // 移動中の要素をリセット
}