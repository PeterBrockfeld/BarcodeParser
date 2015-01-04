/**
 * P. Brockfeld, 2014-12-27
 *
 * Testing keypress events,
 * see
 * 
 *   https://github.com/PeterBrockfeld/BarcodeParser
 *
 * for details.
 *
 */
var outputString = "";

function logInput(event) {
    'use strict';
    var myKeyCode = event.keyCode,
        myCharCode = event.charCode,
        myWhich = event.which,
        inputField = document.getElementById("barcode");

    /**
     * Here is some code which tries to catch the "Ctrl"+"+" keypress. Try out with
     * the values _your_ scanner sends.
     */

    /* ============== try to catch Ctrl sequences ========
     if (event.ctrlKey && event.which === 43) {
        inputField.value = inputField.value + '<GS>';
        event.preventDefault();
        event.stopPropagation();
    }
    if (event.which === 13) {
        alert(inputField.value);
    }
    */

    outputString = 'keyCode: ' + myKeyCode + ' charCode: ' + myCharCode + ' which: ' + myWhich + '\n';
    console.log(outputString);
}

function init() {
    'use strict';
    var sendbutton = document.getElementById("sendbutton"),
        inputField = document.getElementById("barcode");
    inputField.onkeypress = logInput;
}

// initialize after loading:
window.onload = init;