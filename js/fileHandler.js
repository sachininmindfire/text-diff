function chooseFile(side) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.js,.css,.html,.md';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                document.getElementById(`${side}Text`).value = content;
                document.getElementById(`${side}FileName`).value = file.name;
                
                // Save to localStorage
                localStorage.setItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}Text`, content);
                localStorage.setItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}FileName`, file.name);
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
}

function saveText(side) {
    const textArea = document.getElementById(`${side}Text`);
    const content = textArea.value;
    const suggestedName = document.getElementById(`${side}FileName`).value || 'untitled.txt';

    // Create blob for the content
    const blob = new Blob([content], { type: 'text/plain' });

    // Create a link with download attribute
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = suggestedName; // This triggers "Save As" dialog with suggested filename
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    }, 0);

    // Save to localStorage for last state
    localStorage.setItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}Text`, content);
    localStorage.setItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}FileName`, suggestedName);
}

function loadText(fileName, side) {
    const savedText = localStorage.getItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}Text`);
    if (savedText) {
        document.getElementById(`${side}Text`).value = savedText;
    }
    const savedFileName = localStorage.getItem(`last${side.charAt(0).toUpperCase() + side.slice(1)}FileName`);
    if (savedFileName) {
        document.getElementById(`${side}FileName`).value = savedFileName;
    }
}