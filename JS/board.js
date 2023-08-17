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
    const files = e.dataTransfer.files;
    const x = e.clientX - board.offsetLeft; // ドロップされた位置のX座標
    const y = e.clientY - board.offsetTop;  // ドロップされた位置のY座標
    handleDroppedFiles2(files, x, y);
}, false);

function handleDroppedFiles(files) {
    for (const file of files) {
        console.log("Dropped file:", file.name);

        // ファイルのアイコンを生成して表示
        const icon = document.createElement("div");
        icon.classList.add("file-icon");
        icon.textContent = file.name;
        board.appendChild(icon);
    }
}

// 保持するためのコンテナを作成
const filesContainer = document.createElement('div');
filesContainer.classList.add('files-container');
board.appendChild(filesContainer);

function handleDroppedFiles2(files, x, y) {
    for (const file of files) {
        previewFile(file, x, y);
    }
}

function previewFile(file) {
    var fr = new FileReader();
    fr.onload = function () {
        var fileContainer = document.createElement('div');
        fileContainer.classList.add('file-container');

        // リサイズハンドルを追加
        var resizeHandle = document.createElement('div');
        resizeHandle.classList.add('resize-handle');
        fileContainer.appendChild(resizeHandle);

        if (file.type.startsWith('image/')) {
            // 画像ファイルの場合
            var container = document.createElement('div');
            container.style.width = '50%';
            container.style.height = 'auto';
            container.style.overflow = 'auto';

            var img = document.createElement('img');
            img.setAttribute('src', fr.result);
            img.style.width = '100%';
            img.style.height = 'auto';

            container.appendChild(img);
            fileContainer.appendChild(container);
        } else if (file.type === 'application/pdf') {
            // PDFファイルの場合
            var pdfEmbed = document.createElement('embed');
            pdfEmbed.setAttribute('src', fr.result);
            pdfEmbed.setAttribute('type', 'application/pdf');
            pdfEmbed.setAttribute('width', '100%');
            pdfEmbed.setAttribute('height', '500px');
            fileContainer.appendChild(pdfEmbed);
        } else {
            // その他のファイル形式の場合
            var unsupportedMsg = document.createElement('p');
            unsupportedMsg.textContent = 'Unsupported file type: ' + file.type;
            fileContainer.appendChild(unsupportedMsg);
        }

        filesContainer.appendChild(fileContainer);
    };
    fr.readAsDataURL(file);
}

const resizeHandle = document.querySelector('.resize-handle');
const imageContainer = document.querySelector('.image-container');
const image = imageContainer.querySelector('img');

let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    const startX = e.clientX;
    const startY = e.clientY;

    const startWidth = parseFloat(getComputedStyle(imageContainer).width);
    const startHeight = parseFloat(getComputedStyle(imageContainer).height);

    const mouseMoveHandler = (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        imageContainer.style.width = startWidth + deltaX + 'px';
        imageContainer.style.height = startHeight + deltaY + 'px';
    };

    const mouseUpHandler = () => {
        isResizing = false;
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('mouseup', mouseUpHandler);
});