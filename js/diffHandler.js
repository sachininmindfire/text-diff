function findLCS(lines1, lines2) {
    const m = lines1.length;
    const n = lines2.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    const backtrack = Array(m + 1).fill().map(() => Array(n + 1).fill(''));

    // Fill the dp table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (lines1[i - 1] === lines2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
                backtrack[i][j] = 'diagonal';
            } else if (dp[i - 1][j] >= dp[i][j - 1]) {
                dp[i][j] = dp[i - 1][j];
                backtrack[i][j] = 'up';
            } else {
                dp[i][j] = dp[i][j - 1];
                backtrack[i][j] = 'left';
            }
        }
    }

    // Reconstruct the diff
    const diff = {
        matches: new Map(), // Maps indices between the two arrays
        deletions: new Set(),
        additions: new Set()
    };

    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (backtrack[i][j] === 'diagonal') {
            diff.matches.set(i - 1, j - 1);
            i--;
            j--;
        } else if (backtrack[i][j] === 'up') {
            diff.deletions.add(i - 1);
            i--;
        } else {
            diff.additions.add(j - 1);
            j--;
        }
    }

    while (i > 0) {
        diff.deletions.add(i - 1);
        i--;
    }
    while (j > 0) {
        diff.additions.add(j - 1);
        j--;
    }

    return diff;
}

function findInlineDiff(str1, str2) {
    const words1 = str1.split(/(\s+)/);
    const words2 = str2.split(/(\s+)/);
    return findLCS(words1, words2);
}

function compareTexts(leftText, rightText) {
    // Get DOM elements
    const leftTextArea = document.getElementById('leftText');
    const rightTextArea = document.getElementById('rightText');
    const leftDiffDisplay = document.getElementById('leftDiff');
    const rightDiffDisplay = document.getElementById('rightDiff');

    // Hide textareas and show diff displays
    leftTextArea.style.display = 'none';
    rightTextArea.style.display = 'none';
    leftDiffDisplay.style.display = 'block';
    rightDiffDisplay.style.display = 'block';

    // Split into lines and find differences
    const leftLines = leftText.split('\n');
    const rightLines = rightText.split('\n');

    // check if the texts are the samex
    if (leftText === rightText) {
        alert('The texts are identical!');          
    }
    
    // Find line-level differences using LCS
    const lineDiff = findLCS(leftLines, rightLines);
    
    let leftHtml = '';
    let rightHtml = '';

    // Function to escape HTML
    const escapeHtml = (str) => str.replace(/&/g, '&amp;')
                                  .replace(/</g, '&lt;')
                                  .replace(/>/g, '&gt;');

    // Process all lines
    for (let i = 0; i < leftLines.length; i++) {
        if (lineDiff.deletions.has(i)) {
            // This line was deleted
            leftHtml += `<div class="deletion"><span class="deletion-inline">${escapeHtml(leftLines[i]) || ' '}</span></div>`;
        } else {
            // This line exists in both files
            const matchingLineIndex = lineDiff.matches.get(i);
            if (leftLines[i] === rightLines[matchingLineIndex]) {
                // Lines are identical
                leftHtml += `<div>${escapeHtml(leftLines[i]) || ' '}</div>`;
            } else {
                // Lines differ - find word-level differences
                const inlineDiff = findInlineDiff(leftLines[i], rightLines[matchingLineIndex]);
                let lineHtml = '';
                for (let j = 0; j < leftLines[i].length; j++) {
                    const word = escapeHtml(leftLines[i][j]);
                    if (inlineDiff.deletions.has(j)) {
                        lineHtml += `<span class="deletion-inline">${word}</span>`;
                    } else {
                        lineHtml += word;
                    }
                }
                leftHtml += `<div>${lineHtml || ' '}</div>`;
            }
        }
    }

    for (let i = 0; i < rightLines.length; i++) {
        if (lineDiff.additions.has(i)) {
            // This line was added
            rightHtml += `<div class="addition"><span class="addition-inline">${escapeHtml(rightLines[i]) || ' '}</span></div>`;
        } else {
            // Find the matching line in the left text
            const matchingLineIndex = Array.from(lineDiff.matches.entries())
                .find(([_, rightIdx]) => rightIdx === i)?.[0];
            
            if (leftLines[matchingLineIndex] === rightLines[i]) {
                // Lines are identical
                rightHtml += `<div>${escapeHtml(rightLines[i]) || ' '}</div>`;
            } else {
                // Lines differ - find word-level differences
                const inlineDiff = findInlineDiff(leftLines[matchingLineIndex], rightLines[i]);
                let lineHtml = '';
                for (let j = 0; j < rightLines[i].length; j++) {
                    const word = escapeHtml(rightLines[i][j]);
                    if (inlineDiff.additions.has(j)) {
                        lineHtml += `<span class="addition-inline">${word}</span>`;
                    } else {
                        lineHtml += word;
                    }
                }
                rightHtml += `<div>${lineHtml || ' '}</div>`;
            }
        }
    }   

    leftDiffDisplay.innerHTML = leftHtml;
    rightDiffDisplay.innerHTML = rightHtml;
    leftDiffDisplay.style.width = (((window.innerWidth -80) / 2)) + 'px';
    rightDiffDisplay.style.width = (((window.innerWidth -80) / 2)) + 'px';
    leftDiffDisplay.style.overflowX = 'auto';
    rightDiffDisplay.style.overflowX = 'auto';


    // Add click handlers to return to edit mode
    const hideHandler = () => {
        leftDiffDisplay.style.display = 'none';
        rightDiffDisplay.style.display = 'none';
        leftTextArea.style.display = 'block';        
        rightTextArea.style.display = 'block';       
    };

    leftDiffDisplay.addEventListener('click', hideHandler);
    rightDiffDisplay.addEventListener('click', hideHandler);
}