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

    // Function to add an entry to history
    function addToHistory(expression, result) {
        history.push({ expression, result });
        if (history.length > 10) {
            history.shift();
        }
        console.log(`Expression: ${expression}, Result: ${result}`);
    }

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
            let result = math.evaluate(currentExpression);
            if (!isFinite(result)) {
                throw new Error('Invalid operation');
            }
            addToHistory(currentExpression, result);
            currentExpression = result.toString();
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
        display.value = value;
    }

    // Function to handle button clicks
    function handleButtonClick(value) {
        if (!calculatorOn) return; // Ignore input if calculator is off
        currentExpression += value;
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
                // handleButtonClick(` ${this.innerText} `);
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
        }, 2000); // Clear the display after 2 seconds
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
    // Start from the end of currentExpression
    let lastIndex = currentExpression.length - 1;
    
    // Loop backwards to find the index of the last non-space character or operator
    while (lastIndex >= 0) {
        if (currentExpression[lastIndex] !== ' ') {
            break; // Exit loop if a non-space character is found
        }
        lastIndex--; // Move left in the string to skip spaces
    }

    // Find the next meaningful character or operator to delete
    while (lastIndex >= 0) {
        if (currentExpression[lastIndex] === ' ') {
            lastIndex--; // Skip any remaining spaces
        } else {
            break; // Exit loop when a non-space character/operator is found
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
        // if (!calculatorOn) return; // Ignore input if calculator is off
        try {
            let result = math.evaluate(currentExpression) / 100;
            currentExpression = result.toString();
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
        let currentValue = parseFloat(display.value);
        switch (func) {
            case 'memory-clear':
                memory = 0;
                break;
            case 'memory-recall':
                updateDisplay(memory);
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
        // if (!calculatorOn) return;
        let value = parseFloat(display.value);
        if (isNaN(value)) {
        console.log('Error: Invalid number');
        return;
    }
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
                if (isNaN(exponent)) {
                    result = 'Error';
                } else {
                    result = `${value}^${exponent} = ${Math.pow(value, exponent)}`;
                }
                break;
            default:
                result = 'Error';
                break;
        }
        if (result === 'Error') {
        updateDisplay(result);
        currentExpression = '';
        awaitingNewOperand = true;
        console.log(`Error: ${result}`);
    } else {
        updateDisplay(result);
        const splitResult = result.split('=');
        currentExpression = splitResult.length > 1 ? splitResult[1].trim() : '';
        awaitingNewOperand = true;
        console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
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
        } else if (key === 'Enter') {
            // If the key is Enter
            calculate();
            updateDisplay(currentExpression);
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
                    lastIndex--; // Skip any remaining spaces
            } else {
                break;
            }
        }
            currentExpression = currentExpression.slice(0, lastIndex);
            updateDisplay(currentExpression);
        } else if (key === 'Escape') {
            // If the key is Escape
            clearCalculator();
            updateDisplay('0');
            setTimeout(() => {
                updateDisplay('');
            }, 2000);
        } else if (key === '(' || key === ')') {
            // If the key is a parenthesis
            handleButtonClick(key);
        } else if (key === '.') {
            // Dot functionality
            if (!currentExpression.includes('.')) {
                handleButtonClick(key);
            }
        } else if (key === 'c' || key === 'C') {
            // Memory Clear
            handleMemoryFunction('memory-clear');
        } else if (key === 'r' || key === 'R') {
            // Memory Recall
            handleMemoryFunction('memory-recall');
        } else if (key === 'm' || key === 'M') {
            // Memory Add
            handleMemoryFunction('memory-add');
        } else if (key === 'n' || key === 'N') {
            // Memory Subtract
            handleMemoryFunction('memory-subtract');
        } else if (key === '%') {
            // Percentage functionality
            let value = parseFloat(currentExpression);
            if (!isNaN(value)) {
                value /= 100;
                currentExpression = value.toString();
                updateDisplay(currentExpression);
            }
        }
        console.log(`Key Pressed: ${key}`);
        console.log(`Current Expression: ${currentExpression}, Awaiting New Operand: ${awaitingNewOperand}`);
    });

    // Load math.js and initialize calculator
    loadMathJS(function() {
        console.log('math.js loaded and ready');
        // You can put any additional initialization code here if needed
    });
});
