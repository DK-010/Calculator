document.addEventListener('DOMContentLoaded', function() {
    const display = document.getElementById('display');
    const digits = document.querySelectorAll('.digit');
    const operators = document.querySelectorAll('.operator');
    const functions = document.querySelectorAll('.function');
    const parentheses = document.querySelectorAll('.parentheses');
    const equalsButton = document.getElementById('equals');
    const clearButton = document.getElementById('clear');
    const offButton = document.getElementById('off');
    const historyButton = document.getElementById('history');
    const backspaceButton = document.getElementById('backspace');
    const memoryButtons = document.querySelectorAll('.memory');
    const dotButton = document.getElementById('dot');
    const percentageButton = document.getElementById('percentage');
    const themeToggleButton = document.getElementById('theme-toggle');
    const doubleZeroButton = document.getElementById('double-zero');

    let currentExpression = '';
    let awaitingNewOperand = true;
    let memory = 0;
    let history = [];
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

    // Function to format numbers woth commas
    function formatNumberWithCommas(number) {
        var parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
      

    // Function to add an entry to history
    function addToHistory(expression, result) {
        history.push({ expression, result });
        if (history.length > 10) {
            history.shift();
        }
        console.log(`Expression: ${expression}, Result: ${result}`);
    }

    // Function to toggle theme
    themeToggleButton.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');

        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            document.querySelector('.calculator').classList.remove('dark-mode');
            document.querySelector('.calculator').classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            document.querySelector('.calculator').classList.remove('light-mode');
            document.querySelector('.calculator').classList.add('dark-mode');
        }
    });

     // Function to display history
        historyButton.addEventListener('click', function() {
            if (history.length > 0) {
                const lastEntry = history[history.length - 1];
                display.value = `${lastEntry.expression} = ${lastEntry.result}`;
            }
        })

    // Function to perform calculations
    function calculate() {
        try {
            // console.log(`Calculating: ${currentExpression}`);
            let result = math.evaluate(currentExpression.replace(/,/g, ''));
            if (!isFinite(result)) {
                throw new Error('Invalid operation');
            }
            addToHistory(currentExpression, result);
            currentExpression = formatNumberWithCommas(result.toString());
            updateDisplay(currentExpression);
            awaitingNewOperand = false;
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
            currentExpression = formatNumberWithCommas(result.toString());
            updateDisplay(currentExpression);
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
        } else if (event.key === 'Enter' || key === '=') {
            // If the key is Enter
            calculate();
            console.log(`Current Expression after calculate: ${currentExpression}`);
            updateDisplay(currentExpression);
        } else if (key === 'Escape') {
            // If the key is Escape
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
        } else if (key === 'c' || key === 'C') {
            // Memory Clear
            handleMemoryFunction('memory-clear');
        } else if (key === 'r' || key === 'R') {
            // Memory Recall
            handleMemoryFunction('memory-recall');
        } else if (key === 'm' || key === 'M') {
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
            handleButtonClick(key);
        }
    });

    // Load math.js and initialize calculator
    loadMathJS(function() {
        console.log('math.js loaded and ready');
    });
});

