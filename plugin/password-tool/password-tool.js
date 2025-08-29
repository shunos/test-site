(function() {
    // HTML要素を取得
    const resultDiv = document.getElementById('result');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const lengthSlider = document.getElementById('length-slider');
    const lengthInput = document.getElementById('length-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const presetButtons = document.getElementById('preset-buttons');
    const generateBtn = document.getElementById('generate');
    const copyAllBtn = document.getElementById('copy-all');
    const passwordDisplay = document.getElementById('password-display');
    const copyMainBtn = document.getElementById('copy-main-btn');
    const copyMessageMain = document.getElementById('copy-message-main');
    const copyMessageAll = document.getElementById('copy-message-all');
    const lengthValueSpan = document.getElementById('length-value');
    
    let passwordLength = 12;

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:",.<>?'
    };

    // 配列をシャッフルする関数（修正済み）
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // 変数を入れ替えて、配列の要素をランダムにシャッフル
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    function generatePassword(length) {
        let charset = "";
        let requiredChars = [];

        if (uppercaseEl.checked) {
            charset += charSets.uppercase;
            requiredChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
        }
        if (lowercaseEl.checked) {
            charset += charSets.lowercase;
            requiredChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
        }
        if (numbersEl.checked) {
            charset += charSets.numbers;
            requiredChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
        }
        if (symbolsEl.checked) {
            charset += charSets.symbols;
            requiredChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
        }

        if (charset.length === 0) {
            return '';
        }

        let passwordChars = requiredChars;
        while (passwordChars.length < length) {
            passwordChars.push(charset[Math.floor(Math.random() * charset.length)]);
        }

        return shuffleArray(passwordChars).join('');
    }

    function calculateStrength(pass) {
        let score = 0;
        if (pass.length === 0) return 0;
        
        score += Math.min(Math.floor(pass.length / 8), 5);

        const hasUpper = /[A-Z]/.test(pass);
        const hasLower = /[a-z]/.test(pass);
        const hasNumbers = /[0-9]/.test(pass);
        const hasSymbols = /[^A-Za-z0-9]/.test(pass);

        if (hasUpper) score++;
        if (hasLower) score++;
        if (hasNumbers) score++;
        if (hasSymbols) score++;

        if (hasUpper && hasLower && hasNumbers && hasSymbols) {
            score++;
        }

        return score;
    }

    function updateStrengthIndicator(pass) {
        const score = calculateStrength(pass);
        const maxScore = 10;
        const percentage = (score / maxScore) * 100;
        
        let color = "rgb(239, 68, 68)"; // red
        let text = "弱";

        if (score >= 7) { 
            color = "rgb(34, 197, 94)"; // green
            text = "強"; 
        } else if (score > 3) { 
            color = "rgb(250, 204, 21)"; // yellow
            text = "中"; 
        }
        if (pass.length === 0) {
            color = "rgb(209, 213, 219)"; // gray
            text = "なし";
        }

        strengthBar.style.width = percentage + "%";
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
    }

    function generatePasswords() {
        let value = parseInt(lengthInput.value, 10);
        const clampedValue = Math.min(Math.max(isNaN(value) ? 4 : value, 4), 40);
        lengthInput.value = clampedValue;
        updateLengthUI(clampedValue);
        passwordLength = clampedValue;
        
        const mainPassword = generatePassword(passwordLength);
        
        if (mainPassword === '') {
            passwordDisplay.textContent = '文字種を選択してください';
            updateStrengthIndicator('');
            resultDiv.innerHTML = '';
            return;
        }

        passwordDisplay.textContent = mainPassword;
        updateStrengthIndicator(mainPassword);

        resultDiv.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            const pass = generatePassword(passwordLength);
            
            const container = document.createElement('div');
            container.className = "relative flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg";

            const span = document.createElement('span');
            span.className = "flex-1 font-mono text-sm truncate mr-4";
            span.textContent = pass;

            const copyBtn = document.createElement('button');
            copyBtn.className = "copy-candidate-btn flex-shrink-0 flex items-center justify-center p-1 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-200";
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
            copyBtn.addEventListener('click', (event) => {
                copyToClipboard(pass, event.currentTarget);
            });
            container.appendChild(span);
            container.appendChild(copyBtn);
            resultDiv.appendChild(container);
        }
    }

    function copyToClipboard(text, clickedElement) {
        if (!text || text === 'パスワード生成' || text === '文字種を選択してください') {
            return;
        }

        try {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            let messageElement;

            if (clickedElement.id === 'copy-main-btn') {
                messageElement = copyMessageMain;
            } else if (clickedElement.id === 'copy-all') {
                messageElement = copyMessageAll;
            } else {
                messageElement = document.createElement('div');
                messageElement.className = 'absolute bottom-full right-0 mb-1 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full opacity-0 transition-opacity duration-300';
                messageElement.textContent = 'コピーしました！';
                clickedElement.parentElement.appendChild(messageElement);
                
                setTimeout(() => {
                    messageElement.classList.remove('opacity-0');
                    messageElement.classList.add('opacity-100');
                }, 10);
            }

            if (messageElement) {
                if (clickedElement.id === 'copy-main-btn' || clickedElement.id === 'copy-all') {
                    messageElement.classList.remove('opacity-0');
                    messageElement.classList.add('opacity-100');
                }

                setTimeout(() => {
                    messageElement.classList.remove('opacity-100');
                    messageElement.classList.add('opacity-0');
                    if (clickedElement.id !== 'copy-main-btn' && clickedElement.id !== 'copy-all') {
                        setTimeout(() => {
                            messageElement.remove();
                        }, 300);
                    }
                }, 1500);
            }
        } catch (err) {
            console.error('コピーに失敗しました: ', err);
        }
    }

    function updateLengthUI(value) {
        const num = parseInt(value, 10);
        if (isNaN(num)) {
            lengthSlider.value = lengthSlider.min;
            lengthInput.value = lengthSlider.min;
            lengthValueSpan.textContent = lengthSlider.min;
            return;
        }
        const clampedNum = Math.min(Math.max(num, 4), 40);
        lengthSlider.value = clampedNum;
        lengthInput.value = clampedNum;
        lengthValueSpan.textContent = clampedNum;
        const max = parseInt(lengthSlider.max, 10);
        const percentage = ((clampedNum - lengthSlider.min) / (max - lengthSlider.min)) * 100;
        lengthSlider.style.setProperty('--range-progress', `${percentage}%`);
        const radio = document.getElementById(`preset-${clampedNum}`);
        if (radio) {
            radio.checked = true;
        } else {
            document.querySelectorAll('input[name="length-preset"]').forEach(r => r.checked = false);
        }
    }

    // イベントリスナー
    lengthInput.addEventListener('input', (e) => {
        updateLengthUI(e.target.value);
    });

    lengthInput.addEventListener('blur', generatePasswords);

    lengthInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            generatePasswords();
        }
    });

    lengthSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        lengthInput.value = value;
        updateLengthUI(value);
    });

    lengthSlider.addEventListener('change', generatePasswords);

    presetButtons.addEventListener('change', (e) => {
        if (e.target.name === 'length-preset') {
            const value = e.target.value;
            lengthInput.value = value;
            updateLengthUI(value);
            generatePasswords();
        }
    });

    generateBtn.addEventListener('click', generatePasswords);
    
    copyMainBtn.addEventListener('click', () => {
        copyToClipboard(passwordDisplay.textContent, copyMainBtn);
    });
    
    copyAllBtn.addEventListener('click', () => {
        const allPasswords = Array.from(resultDiv.querySelectorAll('span'))
            .map(span => span.textContent)
            .join('\n');
        copyToClipboard(allPasswords, copyAllBtn);
    });
    
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', generatePasswords);
    });

    // ページの読み込みが完了した後に初期化
    window.onload = function() {
        updateLengthUI(12);
        generatePasswords();
    };
})();