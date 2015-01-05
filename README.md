# JavaScript GS1 barcode parser
 
## Table of Contents

* [Purpose](#purpose)
* [Disclaimer](#disclaimer)
* [The Specification](#the-specification)
* [About GS1 barcodes](#about-gs1-barcodes)
 * [about the structure of GS1 barcodes](#about-the-structure-of-gs1-barcodes)
* [Use case](#use-case)
* [How to use it](#how-to-use-it)
 * [Limitations](#limitations)
* [A simple scanning application as example](#a-simple-scanning-application-as-example)
* [About barcode scanning devices](#about-barcode-scanning-devices)
 * [Keypress detecting](#key-press-detecting)
 * [The Barcodes](#the-barcodes)
* [License](#license) 


## Purpose

The barcode parser is a library for handling the contents of GS1 barcodes. GS1 barcodes are used for several purposes, from a humble barcode on a product you buy to complex barcodes describing the contents of a whole pallet. Especially the two dimensional barcodes can hold a *lot* of information.

The barcode parser makes it easier to access it.

The barcode parser contains a single function for parsing GS1-barcodes, yielding the single elements in a format processable by JavaScript.

The barcode parser is meant to be used in JavaScript applications which 

* take data from a barcode scanning device or a barcode reading application 
* process the data and
* perform some action based on the contents of the barcode

## Disclaimer

The library is my own humble interpretation of the GS1 specification. Neither is it endorsed, supported, approved or recommended by GS1, nor do I have any affiliations with GS1.

## The Specification

The full "GS1 General Specifications" can be found on http://www.gs1.org/genspecs. It's a 478 pages document. The barcode parser is based on the *Version 14, Issue 1, Jan 2014* of this specification.

## About GS1 barcodes

GS1 barcodes are able to contain information about a product: its GTIN ("Global Trade Item Number", formerly known as UPC or EAN), the weight or dimensions of the item, its price, the lot/batch code, the date when it was fabricated and so on.

### About the structure of GS1 barcodes

A GS1 barcode is a concatenation of *data elements*. Each single element starts with an *application identifier* ("AI"), a two to four digits number. The number is followed by the actual information.

A *data element* is delimited either by

* the end of the whole barcode,
* a specification that states that this information has a fixed count of characters or digits
* a special character (named FNC1)

The *application identifiers* and their properties are described in the third chapter of the "GS1 General Specifications" (see below).

The GS1 barcode is started by a *symbology identifier*; a three character sequence denoting the type of barcode used. The *symbology identifier* is followed by an arbitrary number of *data elements*, thus the whole barcode represents a long string of digits, letters and some interspersed "FNC1"s.

The BarcodeParser takes this string and decomposes it into its single elements.

### Use case

You have a JavaScript application which takes barcodes in one of the GS1-formats. The conversion barcode → string has been made by a barcode scanning device or some other application. You got a string looking somehow like that:

    ]C101040123456789011715012910ABC1233932978471131030005253922471142127649716

You want to extract some data out of the scanned code, e.g. the lot/batch number or the Best Before Date, and process it. The library takes the string and dissects it to an array of single elements:

|AI | Title | Contents | Unit/Currency |
|:-- |:-----|:-------|:--------------|
|01 |GTIN | 04012345678901 | |
|17 |USE BY OR EXPIRY | Thu Jan 29 2015 00:00:00 GMT+0100 (CET) | |
|10 |BATCH/LOT | ABC123 | |
|3932 |PRICE | 47.11 | 978 |
|3103 |NET WEIGHT (kg) | 0.525 | KGM |
|3922 |PRICE | 47.11 | |
|421 |SHIP TO POST | 49716 | 276 |


## How to use it

The library is located in the `scripts` directory; in its uncompressed form and in a version minified with the `uglifyjs` tool (see https://github.com/mishoo/UglifyJS2).

Load the library into your application:

```html
<script src="./scripts/BarcodeParser.js"></script>
```

and use the single one function `parseBarcode()` of the library, handling over the barcode string:

```javascript
try {
        var barcode = document.getElementById("barcode").value,
            answer = parseBarcode(barcode);
        // handle the answer ...    
} catch (e) {
    alert(e);
}
```

The function returns an object containing two elements:

* `codeName`: a barcode type identifier (a simple string denoting the type of barcode) and
* `parsedCodeItems`: an array of objects, each with four attributes:
 * `ai`: the application identifier
 * `title`: the title of the element, i.e. a short description
 * `data`: the contents, either a string, a number or a date
 * `unit`: the unit of measurement, a country code, a currency; denoted in ISO codes.

From the example above: `parseBarcode()` will return an object with "GS1-128" in its attribute `codeName`, the fourth element of `parsedCodeItems` is an object which has the attributes

* "3932" as `ai`,
* "PRICE" as `title`,
* "47.11" as `data` (a floating point number) and
* "978" as `unit` (the ISO code for €)

Some remarks about how the function works can be found in `README_scripts.md` within the `scripts` folder.

### Limitations

The `parseBarcode()` function doesn't do any checks for plausibility. If the code you handle over to the function contains e.g. an invalid GTIN or some invalid ISO code the function will happily return this invalid content.

## A simple scanning application as example

The directory `Example` contains an example using the barcode parser. It has three components:

* a HTML page with 
 * a form for input and 
 * a (empty) `<table>` for the output,
* some JavaScript code for 
 * accessing the input, 
 * calling the `parseBarcode()` function and 
 * filling the table using the returned object
* some CSS for styling the page

If you have no scanning device at hand, you can use the string in "ScannedBarcode.txt" to copy &amp; paste it into the input field of the example.

## About barcode scanning devices

GS1 barcodes are usually scanned using a barcode scanning device. If you use GS1 barcodes with a web application, you'll probably have a setup where the barcode scanner behaves as a keyboard ("HID").

This works fine for most characters, but has one big drawback: the FNC1.

### The FNC1

The FNC1 is a non-printable control character used to delimit GS1 Element Strings of variable length.

The barcode types GS1 DataMatrix and GS1 QR Code use the ASCII group separator ("GS", ASCII 29, 0x1D; Unicode U+001D) as FNC1.

This non-printable character won't be found on any keyboard. So the scanner sends a Ctrl-sequence as a replacement. The canonical sequence for GS is "Ctrl"+"]".

So if you use a ```<input>``` field in your website the browser will receive the control sequence "Ctrl" + "]". Depending on your setup the browser will react in some way to this control sequence.

Things get messy when you use a non-english keyboard. For example: on german keyboards the key left beside the enter key is used for the "+" sign. On an english keyboard there is the "]". If the scanner is operated as a HID **and** configured to behave like a *german* keyboard, the scanner sends "Ctrl" + "+", which causes most browsers to increase their zoom factor.

So you have two things to do:

* identify the sequence your scanner sends to the browser when a group separator is scanned
* catch these keyboard events and transform them into a group separator within the input field

The ```BarcodeParserUsageExample.js``` does the latter part for a scanner which sends (emulating a german keyboard) a "Ctrl" + "+" if it encounters a group separator in the barcode.

### Key Press Detecting

The directory ```KeypressDetecting``` contains a simple HTML page to explore what kind of control sequence *your* scanner sends. It has an input field and logs the values (```keyCode```, ```charCode``` and ```which```) of the keypresses to the console.

### The Barcodes

As an example the directory `Barcodes` contains five barcodes, three of them containing the same data:

* a GS1-128-Code,
* a GS1-DataMatrix-Code and 
* a GS1-QR-Code.

The other two just contain three characters: "1", the "&lt;GS&gt;" group separator and "3". They can be used to find out what *your* scanner sends when it encounters a "&lt;GS&gt;" in a barcode.

You can print them using the "ExamplesForBarcode.pdf".

## License

Copyright (c) 2014-2015 Peter Brockfeld. See the LICENSE.md file for license rights and limitations (MIT).