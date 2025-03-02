document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const compareBtn = document.getElementById('compareBtn');
    const toggleBtn = document.getElementById('toggleBtn');
    const clearBtn = document.getElementById('clearBtn');
    const leftText = document.getElementById('leftText');
    const rightText = document.getElementById('rightText');

    // Event Listeners
    clearBtn.addEventListener('click', () => {
        // Clear text areas
        leftText.value = '';
        rightText.value = '';
        
        // Clear filenames
        document.getElementById('leftFileName').value = '';
        document.getElementById('rightFileName').value = '';
        
        // Reset diff displays
        document.getElementById('leftDiff').style.display = 'none';
        document.getElementById('rightDiff').style.display = 'none';
        leftText.style.display = 'block';
        rightText.style.display = 'block';
        
        // Clear localStorage
        localStorage.removeItem('lastLeftText');
        localStorage.removeItem('lastRightText');
        localStorage.removeItem('lastLeftFileName');
        localStorage.removeItem('lastRightFileName');
    });

    compareBtn.addEventListener('click', () => {
        const leftContent = leftText.value;
        const rightContent = rightText.value;
        compareTexts(leftContent, rightContent);
    });

    toggleBtn.addEventListener('click', () => {
        // Get all elements
        const leftText = document.getElementById('leftText');
        const rightText = document.getElementById('rightText');
        const leftDiff = document.getElementById('leftDiff');
        const rightDiff = document.getElementById('rightDiff');
        const leftFileName = document.getElementById('leftFileName');
        const rightFileName = document.getElementById('rightFileName');

        // Reset diff displays
        leftDiff.style.display = 'none';
        rightDiff.style.display = 'none';
        leftText.style.display = 'block';
        rightText.style.display = 'block';

        // Swap text content
        const tempText = leftText.value;
        leftText.value = rightText.value;
        rightText.value = tempText;

        // Swap filenames
        const tempFileName = leftFileName.value;
        leftFileName.value = rightFileName.value;
        rightFileName.value = tempFileName;
    });

    // Auto-save feature
    let autoSaveTimeout;
    const autoSave = () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (document.getElementById('leftFileName').value) {
                saveText('left');
            }
            if (document.getElementById('rightFileName').value) {
                saveText('right');
            }
        }, 1000);
    };

    leftText.addEventListener('input', autoSave);
    rightText.addEventListener('input', autoSave);

    // Load last saved state
    loadLastState();
});

function loadLastState() {
    // Load the last used texts from localStorage if available
    const lastLeftText = localStorage.getItem('lastLeftText');
    const lastRightText = localStorage.getItem('lastRightText');
    const lastLeftFileName = localStorage.getItem('lastLeftFileName');
    const lastRightFileName = localStorage.getItem('lastRightFileName');

    if (lastLeftText) {
        document.getElementById('leftText').value = lastLeftText;
        document.getElementById('leftFileName').value = lastLeftFileName || '';
    }
    if (lastRightText) {
        document.getElementById('rightText').value = lastRightText;
        document.getElementById('rightFileName').value = lastRightFileName || '';
    }
}