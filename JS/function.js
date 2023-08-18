export function findExistingContainer(x, y) {
    const elements = document.elementsFromPoint(x, y);
    const fileContainers = Array.from(fileContainer.getElementsByClassName('file-container'));
    return elements.find(element => fileContainers.includes(element));
}

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