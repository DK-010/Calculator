document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const digits = document.querySelectorAll('.digit');
    const operators = document.querySelectorAll('.operator');
    const functions = document.querySelectorAll('.function');
    const parentheses = document.querySelectorAll('.parentheses');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const offButton = document.getElementById('off');
    const checkButton = document.getElementById('check');
    const backspaceButton = document.getElementById('backspace');
    const memoryButtons = document.querySelectorAll('.memory');
    const dotButton = document.getElementById('dot');
    const percentageButton = document.getElementById('percentage');
    const themeToggleButton = document.getElementById('theme-toggle');
    const historyToggleButton = document.getElementById('history-toggle');
    const historyView = document.getElementById('history-view');
    const historyContent = document.getElementById('history-content');
    const clearHistoryButton = document.getElementById('clear-history');
    const menuToggleButton = document.getElementById('menu-toggle');
    const menuContent =  document.getElementById('menu-content');
    const keyboardShortcutsBtn = document.getElementById('keyboard-shortcuts-btn');
    const keyboardShortcuts = document.getElementById('keyboard-shortcuts');
    let history = JSON.parse(localStorage.getItem('history')) || [];
    const calculator = document.getElementById('calculator');
    const doubleZeroButton = document.getElementById('double-zero');

    let currentExpression = '';
    let awaitingNewOperand = true;
    let memory = 0;
    let calculatorOn = true;

    // Load math.js dynamically
    function loadMathJS(callback) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/9.4.4/math.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    doubleZeroButton.addEventListener('click', function() {
        handleButtonClick('00');
    });

    // Function to format numbers with commas
    function formatNumberWithCommas(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
      

    // Function to add an entry to history
    function addToHistory(expression, result) {
        // history.push({ expression, result });
        history.push({ expression: formatNumberWithCommas(expression), result: formatNumberWithCommas(result) });
        if (history.length > 20) {
            history.shift();
        }
        updateHistoryView();
        console.log(`Expression: ${expression}, Result: ${result}`);
    }

    // Function to toggle theme
function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        if (calculator) {
            calculator.classList.remove('dark-mode');
            calculator.classList.add('light-mode');
        }
        if (historyView) {
            historyView.classList.remove('dark-mode');
            historyView.classList.add('light-mode');
        }
        themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Show moon icon for light mode
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        if (calculator) {
            calculator.classList.remove('light-mode');
            calculator.classList.add('dark-mode');
        }
        if (historyView) {
            historyView.classList.remove('light-mode');
            historyView.classList.add('dark-mode');
        }
        themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>'; // Show sun icon for dark mode
    }
}

// Handle toggle button click
themeToggleButton.addEventListener('click', () => {
    toggleTheme();
    // Save theme to localStorage when changed
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', currentTheme);
});

// Initial theme setup based on localStorage
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        if (calculator) {
            calculator.classList.add(savedTheme);
        }
        if (historyView) {
            historyView.classList.add(savedTheme);
        }
        themeToggleButton.innerHTML = savedTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    } else {
        // You can detect the user's system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark-mode' : 'light-mode';
        document.body.classList.add(initialTheme);
        if (calculator) {
            calculator.classList.add(initialTheme);
        }
        if (historyView) {
            historyView.classList.add(initialTheme);
        }
        themeToggleButton.innerHTML = initialTheme === 'dark-mode' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    loadHistory();
});

    // Update the history view content
    function updateHistoryView() {
        const fragment = document.createDocumentFragment();
        history.forEach(entry => {
            if (entry && entry.expression && entry.result !== undefined) {
                const entryDiv = document.createElement('div');
                entryDiv.textContent = `${entry.expression} = ${entry.result}`;
                fragment.appendChild(entryDiv);
            }
        });
        historyContent.innerHTML = '';
        historyContent.appendChild(fragment);
    }

    // Event listener for history toggle button
    historyToggleButton.addEventListener('click', toggleHistory);


    // Toggle the history view
        function toggleHistory() {
       if (historyView.classList.contains('hidden')){
            historyView.classList.remove('hidden');
            calculator.classList.add('hidden');
            updateHistoryView();
       } else {
        historyView.classList.add('hidden');
        calculator.classList.remove('hidden');
       }
    }

    // Save history to localStorage
function saveHistory() {
    localStorage.setItem('history', JSON.stringify(history));
}

// Load history from localStorage
function loadHistory() {
    const savedHistory = localStorage.getItem('history');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        updateHistoryView();
    }
}

// Clear history function
function clearHistory() {
    history = [];
    updateHistoryView();
    saveHistory();
}

// Event listener for clearing history
clearHistoryButton.addEventListener('click', () => {
    if (confirm('Are ypu sure you want to clear the history?')) {
        clearHistory();
    }
});

// Call loadHistory when the page loads
loadHistory();

// Function to menu-toggle
menuToggleButton.addEventListener('click', () =>{
    if (menuContent.classList.contains('hidden')) {
        menuContent.classList.remove('hidden');
        menuContent.classList.add('show');
    } else {
        menuContent.classList.remove('show');
        menuContent.classList.add('hidden');
    }
});

// function to show keyboard shortcuts
keyboardShortcutsBtn.addEventListener('click', () => {
    keyboardShortcuts.classList.toggle('hidden');
    keyboardShortcuts.classList.toggle('show');
})

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menuContent.contains(event.target) && !menuToggleButton.contains(event.target)) {
        menuContent.classList.remove('show');
        menuContent.classList.add('hidden');
        keyboardShortcuts.classList.add('hidden');
        keyboardShortcuts.classList.remove('show');
    }
});

     // Function to display check
        checkButton.addEventListener('click', function() {
            if (history.length > 0) {
                const lastEntry = history[history.length - 1];
                display.value = `${lastEntry.expression} = ${lastEntry.result}`;
            }
        })

    // Function to perform calculations
    function calculate() {
        try {
            let result = math.evaluate(currentExpression.replace(/,/g, ''));
            if (!isFinite(result)) {
                throw new Error('Invalid operation');
            }
            addToHistory(currentExpression, result);
            currentExpression = formatNumberWithCommas(result.toString());
            updateDisplay(currentExpression);
            awaitingNewOperand = true;
            console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
        } catch (error) {
            display.value = 'Error';
            currentExpression = '';
            awaitingNewOperand = true;
            console.log(`Error: ${error.message}`);
        }
    }

    // Function to update the display
    function updateDisplay(value) {
        display.value = formatNumberWithCommas(value);
    }

    // Function to handle button clicks
    function handleButtonClick(value) {
        if (!calculatorOn) return;
    
        // Special handling for "00"
        if (value === '00') {
            // If the current expression is empty or ends with an operator, treat "00" as a standalone entry
            if (currentExpression.trim() === '' || /[\+\-\*\/]$/.test(currentExpression)) {
                currentExpression += '00';
            } else {
                // Append "00" to the last number if it's valid
                let parts = currentExpression.split(/([+\-*/])/); // Split by operators
                let lastPart = parts.pop().trim(); // Get last operand
    
                if (lastPart === '') {
                    // If the last part is empty, just add "00"
                    currentExpression += '00';
                } else {
                    // Append "00" to the last number
                    parts.push(lastPart + '00');
                    currentExpression = parts.join('');
                }
            }
        } else {
            // Handle other values (numbers, operators, etc.)
            currentExpression += value;
        }
    
        updateDisplay(currentExpression);
        awaitingNewOperand = false;
        console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
    }
    

    // Adding event listeners to digit buttons
    digits.forEach(digit => {
        digit.addEventListener('click', function () {
            if (calculatorOn) {
            handleButtonClick(this.innerText);
        }
        });
    });

    // Adding event listeners to operator buttons
    operators.forEach(operator => {
        operator.addEventListener('click', function () {
            const operatorValue= this.getAttribute('data-operator');
            if (currentExpression && !awaitingNewOperand) {
                handleButtonClick(` ${operatorValue} `);
                awaitingNewOperand = true;
                console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
            }
        });
    });

    // Adding event listeners to scientific function buttons
    functions.forEach(func => {
        func.addEventListener('click', function () {
            applyFunction(this.getAttribute('data-func'));
        });
    });

    // Adding event listeners to parentheses buttons
    parentheses.forEach(paren => {
        paren.addEventListener('click', function() {
            handleButtonClick(this.getAttribute('data-paren'));
        });
    });

    // Function to clear the calculator
    function clearCalculator() {
        currentExpression = '';
        awaitingNewOperand = true;
        updateDisplay('');
    }

    // Equals button functionality
    equalsButton.addEventListener('click', calculate);

    // Clear button functionality
    clearButton.addEventListener('click', function() {
        if (!calculatorOn) {
            calculatorOn = true;
            display.value = '0';
        } else {
        clearCalculator();
        display.value = '0';
        setTimeout(() => {
            display.value = '';
        }, 2000);
    }
 });

    // Off button functionality
    offButton.addEventListener('click', function() {
        clearCalculator();
        display.value = 'OFF';
        calculatorOn = false;
        setTimeout(() => {
            display.value = '';
        }, 2000);
    });

        // Backspace button functionality
        backspaceButton.addEventListener('click', function() {
            let lastIndex = currentExpression.length - 1;
            
            while (lastIndex >= 0) {
                if (currentExpression[lastIndex] !== ' ') {
                    break;
                }
                lastIndex--;
            }
        
            while (lastIndex >= 0) {
                if (currentExpression[lastIndex] === ' ') {
                    lastIndex--;
                } else {
                    break;
                }
            }
            
                // Remove the last non-space character and update display
                currentExpression = currentExpression.slice(0, lastIndex);
                updateDisplay(currentExpression);
                console.log(`Current Expression: ${currentExpression}`);
            });

    // Dot button functionality
    dotButton.addEventListener('click', function() {
        if (!currentExpression.includes('.')) {
            handleButtonClick('.');
        }
    });

    // Percentage button functionality
    percentageButton.addEventListener('click', function() {
        try {
            let result = math.evaluate(currentExpression.replace(/,/g, '')) / 100;
            let expression = currentExpression + " / 100";
            currentExpression = formatNumberWithCommas(result.toString());
            updateDisplay(currentExpression);
            addToHistory(expression, result);
            awaitingNewOperand = true;
            console.log(`Percentage Result: ${result}`);
        } catch (error) {
            display.value = 'Error';
            currentExpression = '';
            awaitingNewOperand = true;
            console.log(`Error: ${error.message}`);
        }
    });

    // Memory functions
    memoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleMemoryFunction(this.id);
        });
    });

    // Function to handle memory functions
    function handleMemoryFunction(func) {
        // if (!calculatorOn) return; 
        let currentValue = parseFloat(display.value.replace(/,/g, '')); // Remove commas for memory operations
        switch (func) {
            case 'memory-clear':
                memory = 0;
                break;
            case 'memory-recall':
                updateDisplay(formatNumberWithCommas(memory));
                currentExpression = memory.toString();
                break;
            case 'memory-add':
                if (!isNaN(currentValue)) {
                    memory += currentValue;
                }
                break;
            case 'memory-subtract':
                if (!isNaN(currentValue)) {
                    memory -= currentValue;
                }
                break;
        }
        console.log(`Memory: ${memory}`);
    }

    // Function to apply scientific functions
    function applyFunction(func) {
        try{
            let value = parseFloat(display.value.replace(/,/g, ''));
            let result;
            switch (func) {
                case 'sin':
                    result = `sin(${value}) = ${Math.sin(value)}`;
                    break;
                case 'cos':
                    result = `cos(${value}) = ${Math.cos(value)}`;
                    break;
                case 'tan':
                    result = `tan(${value}) = ${Math.tan(value)}`;
                    break;
                case 'log':
                    result = `log(${value}) = ${Math.log(value)}`;
                    break;
                case 'log10':
                    result = `log10(${value}) = ${Math.log10(value)}`;
                    break;
                case 'sqrt':
                    result = `√(${value}) = ${Math.sqrt(value)}`;
                    break;
                case 'exp':
                    result = `exp(${value}) = ${Math.exp(value)}`;
                    break;
                case 'pow':
                    let exponent = parseFloat(prompt('Enter the exponent:'));
                    result = Math.pow(value, exponent);
                    break;
                default:
                    throw new Error('Unknown function');
                }
                display.value = result;
                currentExpression = result.toString();
                awaitingNewOperand = true;
                addToHistory(currentExpression, result);
                console.log(`Function Result: ${result}`);
            } catch (error) {
                display.value = 'Error';
                currentExpression = '';
                awaitingNewOperand = true;
                console.log(`Error: ${error.message}`);
             }
    }

    // Adding keyboard support
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        if (key === 'o' || key === 'O') {
            if (!calculatorOn) {
                calculatorOn = true;
                display.value = '0';
                currentExpression = '';
                awaitingNewOperand = true;
            }
            return;
        }
        
        if (!calculatorOn) return;
        if (!isNaN(key)) {
            // If the key is a digit
            handleButtonClick(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            // If the key is an operator
            if (currentExpression && !awaitingNewOperand) {
                handleButtonClick(` ${key} `);
                awaitingNewOperand = false;
                console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
            }
        } else if (key === 'Enter') {
            // If the key is Enter
            calculate();
            console.log(`Current Expression after calculate: ${currentExpression}`);
            updateDisplay(currentExpression);
        } else if (key === 'Escape') {
            // If the key is Escape
            event.preventDefault();
            clearCalculator();
            updateDisplay('0');
            setTimeout(() => {
                updateDisplay('');
            }, 2000);
        } else if (key === 'Backspace') {
            // If the key is Backspace
            let lastIndex = currentExpression.length -1;
            while (lastIndex >= 0) {
                if (currentExpression[lastIndex] !==' '){
                    break;
                }
                lastIndex--;
            }
            while(lastIndex >= 0) {
                if (currentExpression[lastIndex] === ' ') {
                    lastIndex--;
            } else {
                break;
            }
        }
            currentExpression = currentExpression.slice(0, lastIndex);
            updateDisplay(currentExpression);
    } else if (key === '.') {
        if (!currentExpression.includes('.')) {
            handleButtonClick('.');
        }
    } else if (key === 'p') {
        let currentValue = parseFloat(display.value.replace(/,/g, ''));
        display.value = formatNumberWithCommas((currentValue / 100).toString());
        currentExpression = display.value;
        } else if (key === '(' || key === ')') {
            // If the key is a parenthesis
            handleButtonClick(key);
        } else if (key === 'e' || key === 'E') {
            // Memory Clear
            handleMemoryFunction('memory-clear');
        } else if (key === 'r' || key === 'R') {
            // Memory Recall
            handleMemoryFunction('memory-recall');
        } else if (key === 'a' || key === 'A') {
            // Memory Add
            handleMemoryFunction('memory-add');
        } else if (key === 's' || key === 'S') {
            // Memory Subtract
            handleMemoryFunction('memory-subtract');
        } else if (key === '%') {
            try {
            let result = math.evaluate(currentExpression) / 100;
            currentExpression = result.toString();
            updateDisplay(currentExpression);
            awaitingNewOperand = true;
            } catch (error) {
                display.value = 'Error';
                currentExpression = '';
                awaitingNewOperand = true;
                console.log(`Error: ${error.message}`);
            }
        } else if (key === '00') {
            handleButtonClick('00');
        } else if (key === 'f' || key === 'F') {
            // Turn calculator OFF
            clearCalculator();
            display.value = 'OFF';
            calculatorOn = false;
            setTimeout(() => {
                display.value = '';
            }, 2000);
        } else if (key === 'h' || key === 'H') {
            toggleHistory();
        } else if (key === 'd' || key === 'D') {
            toggleTheme();
        } else if (key === 'c' || key === 'C') {
            clearHistory();
        }
    });

    // Load math.js and initialize calculator
    loadMathJS(function() {
        console.log('math.js loaded and ready');
    });
});

