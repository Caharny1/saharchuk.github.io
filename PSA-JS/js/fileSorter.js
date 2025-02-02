document.getElementById("select-folder").addEventListener("click", async () => {
    try {
        // Открываем выбор папки
        const directoryHandle = await window.showDirectoryPicker();
        const files = await getFilesFromDirectory(directoryHandle);
        handleFiles(files, directoryHandle);
    } catch (error) {
        console.error("Błąd przy wyborze folderu:", error);
    }
});

async function getFilesFromDirectory(directoryHandle) {
    let files = [];
    for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file") {
            files.push(entry);
        }
    }
    return files;
}

async function handleFiles(files, directoryHandle) {
    const fileList = document.getElementById("file-list");
    fileList.innerHTML = "";

    for (const fileHandle of files) {
        const category = getFileCategory(fileHandle.name);
        await moveFile(fileHandle, category, directoryHandle);

        const li = document.createElement("li");
        li.textContent = `${fileHandle.name} → ${category}`;
        fileList.appendChild(li);
    }
}

function getFileCategory(filename) {
    const extension = filename.split('.').pop().toLowerCase();

    const categories = {
        "Obrazy": ["png", "jpg", "jpeg", "gif", "bmp"],
        "Dokumenty": ["pdf", "doc", "docx", "xls", "xlsx", "txt"],
        "Filmy": ["mp4", "avi", "mkv", "mov"],
        "Muzyka": ["mp3", "wav", "flac"],
        "Archiwa": ["zip", "rar", "7z"]
    };

    for (let category in categories) {
        if (categories[category].includes(extension)) {
            return category;
        }
    }
    return "Inne";
}

async function moveFile(fileHandle, category, directoryHandle) {
    try {
        const categoryFolder = await directoryHandle.getDirectoryHandle(category, { create: true });
        const newFileHandle = await categoryFolder.getFileHandle(fileHandle.name, { create: true });

        const writable = await newFileHandle.createWritable();
        const fileData = await fileHandle.getFile();
        await writable.write(await fileData.arrayBuffer());
        await writable.close();
    } catch (error) {
        console.error("Błąd przy przenoszeniu pliku:", error);
    }
}
