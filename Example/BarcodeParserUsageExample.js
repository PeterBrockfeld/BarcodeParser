/**
 *  P. Brockfeld, 2014-06-18
 *
 * Example for parsing GS1 barcodes,
 *
 * see
 * 
 * https://github.com/PeterBrockfeld/BarcodeParser
 *
 * for details.
 */

var inputField = {},
    parsedElementsOutput = {},
    sendbutton = {},
    fncChar = String.fromCharCode(29),
    showstring = "",
    tableRow = "",
    tableCell = "";

function interpreteBarcode() {
    'use strict';

    function addTableRow(element, index, array) {
        /* builds up a single row for the output table
         */

        /*first cell: the AI of the element:
         */
        tableRow = document.createElement("tr");
        tableCell = document.createElement("td");
        tableCell.innerHTML = element.ai;
        tableRow.appendChild(tableCell);
        /*second cell: the title or name of the element
         */
        tableCell = document.createElement("td");
        tableCell.innerHTML = element.dataTitle;
        tableRow.appendChild(tableCell);
        /* third cell: the value or contents of the element*/
        tableCell = document.createElement("td");
        tableCell.innerHTML = element.data;
        tableRow.appendChild(tableCell);
        /* fourth cell: the unit of measurement/the currency*/
        tableCell = document.createElement("td");
        tableCell.innerHTML = element.unit;
        tableRow.appendChild(tableCell);
        /*row finished: append to table 
         */
        parsedElementsOutput.appendChild(tableRow);
    }




    // here, we finally use the library function ...
    try {
        var barcode = document.getElementById("barcode").value,
            /**
             * sometimes malconfigured scanners replace the FNC1 by
             * some other character or sequence of characters.
             *
             * Here you could fix this behaviour.
             *
             * Example: the scanner sends "^" instead of ASCII 29:
             *
             * var re = /\^/g;
             *
             * barcode = barcode.replace(re, String.fromCharCode(29));
             *
             */

            symbologyIdentification = document.getElementById("symbologyIdentification"),
            answer = parseBarcode(barcode);

        symbologyIdentification.innerHTML = answer.codeName;

        // clear previous entries of "parsedElementsOutput":
        var prevRows = document.getElementsByTagName("tr"),
            numberOfPrevRows = prevRows.length,
            i = 0;

        for (i = 0; i < numberOfPrevRows; i = i + 1) {
            // delete the first element
            prevRows[0].parentNode.removeChild(prevRows[0]);
        }

        //    attach headerlines:
        tableRow = document.createElement("tr");
        tableCell = document.createElement("th");
        tableCell.innerHTML = "AI";
        tableRow.appendChild(tableCell);

        tableCell = document.createElement("th");
        tableCell.innerHTML = "Title";
        tableRow.appendChild(tableCell);

        tableCell = document.createElement("th");
        tableCell.innerHTML = "Contents";
        tableRow.appendChild(tableCell);

        tableCell = document.createElement("th");
        tableCell.innerHTML = "Unit/Currency";
        tableRow.appendChild(tableCell);

        /* header row finished: append to table 
         */
        parsedElementsOutput.appendChild(tableRow);
        answer.parsedCodeItems.forEach(addTableRow);
    } catch (e) {
        alert(e);
    }
}

/**
 * barcode scanners operating as a HID send some control sequence
 * when they encounter a <GS> in the scanned barcode. This behaviour may
 * cause unpleasant results:
 *
 *  - the scanner sends the keycode for "Ctrl" + "]"
 *  - the HID driver transforms the code according to the current keyboard layout
 *  - for a german keyboard this is the sequence "Ctrl" + "+", which increases the
 *    zoom factor of the browser, for other keyboards ... who knows?
 *
 * The function here catches these control sequences and transforms them to
 * a proper <GS> within the input field.
 */
function catchGroupSeparatorAndEnter(event) {
    'use strict';
    /** 
     *  !!! adjust here for YOUR scanning device !!!
     *
     * event.which === 43 is "+" on a german keyboard
     */
    if (event.ctrlKey && event.which === 43) {
        inputField.value = inputField.value + fncChar;
        event.preventDefault();
        event.stopPropagation();
    }
    if (event.which === 13) {
        interpreteBarcode();
    }
}

function init() {
    'use strict';
    inputField = document.getElementById("barcode");
    sendbutton = document.getElementById("sendbutton");
    parsedElementsOutput = document.getElementById("parsedElementsOutput");
    sendbutton.onclick = interpreteBarcode;
    inputField.onkeypress = catchGroupSeparatorAndEnter;
}

// initialize after loading:
window.onload = init;