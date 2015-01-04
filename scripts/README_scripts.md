# What's that script about?

## Table of Contents

* [How it works](#how-it-works)
* [The errors thrown](#the-errors-thrown)
* [The ISO codes returned](#the-iso-codes-returned)

## How it works

The script is a self executing anonymous function which gives you the variable (and function) `parseBarcode()`. This function accepts exactly one parameter: `barcode`, the string with the barcode data.

The function starts declaring some variables:

 * the `fncChar`: simply the ASCII group separator, which is used for delimiting variable length data elements
 * the `answer`: declared as an empty object, it will be populated during the execution of the code
 * the `restOfBarcode`: the function will parse the `barcode` element by element. `restOfBarcode` holds, umm ... the rest, the part not parsed yet. At the end, it will be empty again.
 * the `symbologyIdentifier`: simply the three first characters of `barcode`. If the scanning device doesn't suppress them, they identify which barcode symbology (DataMatrix, GS1-128, QR code ...) was used.
 * the `firstElement`: initialized as empty, it holds the results of parsing the first element of `restOfBarcode`.
 
Then two auxiliary functions are declared:

 
 * [the constructor ParsedElement](#the-constructor-parsed-element) and
 * [the function identifyAI](#the-function-identifyAI)
 
The latter does the heavy lifting: it looks for the first digits of the `codestring` given to it as a parameter and tries to identify these first digits as a valid AI. If this succeeds, it will return an object consisting of

 * a new `ParsedElement` which contains the data followed by the identified AI and its interpretation and
 * the `codestring` **without** the part already interpreted
 
If it doesn't succeed it throws an error.

The main routine of `parseBarcode()` is pretty simple: 

1. if there is a known `symbologyIdentifier` chop it off from `barcode`, 
2. move the rest to `restOfBarcode`,
3. intialize `answer.parsedCodeItems` as an empty array
4. apply `identifyAI` to `restOfBarcode`,
5. collect the new `ParsedElement` returned by `identifyAI` into `answer.parsedCodeItems`
6. assign the (shortened) rest (also returned by `identifyAI`) to `restOfBarcode`
7. if `restOfBarcode` isn't empty yet go back to point 4.
8. Return the `answer`.
 
### the constructor ParsedElement
 
 This function constructs new *parsed elements*, the single elements which will form the returned array of interpreted data elements.
 
### the function identifyAI

TBD
 
 
## The errors thrown

TBD

## The ISO codes returned

TBD
