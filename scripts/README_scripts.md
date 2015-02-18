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

This function does the main work load: it tries to find a valid AI within the first digits of the `codestring` handled over to it and calls the approbiate parsing function to fill a new `ParsedElement`.

It defines two local auxiliary functions:

* cleanCodestring
* parseFloatingPoint

and seven parsing function for the seven types of data elements:

* parseDate,
* parseFixedLength,
* parseVariableLength,
* parseFixedLengthMeasure,
* parseVariableLengthMeasure,
* parseVariableLengthWithISONumbers and
* parseVariableLengthWithISOChars.

All of these seven function create a new `ParsedElement` and shorten the `codestring`, cutting off the part just parsed.

You'll find some remarks about the single functions within the script.

Finding a valid AI is done by a very big switch; cascading from the first digit to the second and if necaessary to the third and fourth. Once the cascade hits a valid AI, the approbiate parsing function is called with parameters approbiate for the AI.

This *could* have been done by scanning some configuration object, with the AI as a key to the parsing functions and their parameters. On initialization this configuration object could have returned a curry-ed version of one of the parsing functions, which then would have been applied to the `codestring`.

The construction of this configuration object would have been pretty complicated, and you would have had up to three loops over it: one for two-digit AIs, a second for three-digit AIs and perhaps a third round for four-digit AIs.

So I decided to use the switch: it's long and deeply nested, but straightforward. Just jump from one decision to the next (max. three hops), find the parsing function ready for execution and you're done. 
 
## The errors thrown

If `identifyAI` encounters a problem it throws an error. The errors of `identifyAI` are simple numbered, catched by `parseBarcode` and transformed to an error message.

The errors "01" to "31" represent an invalid AI in `codestring`, the message text indicates where the error occured. The error texts start with "invalid AI after".

The errors "32" to "35" are thrown when a data element supposed to contain a valid date *doesn't* contain a valid date. The error texts have the form "invalid ... in date" with "..." as "year", "month" or "day".

The error "36" is thrown when a data element supposed to contain a floating point number *doesn't* contain a floating point number.

## The ISO codes returned

The ISO codes come either 

* from the data element itself or
* are set by the parsing functions because they are implicit to the AI

In the former case they are just handled through, without any checkings. For your convenience the used ISO codes:

|common name | ISO code |
|:-- |:--------------|
| kilograms | KGM |
| meter | MTR |
| square metres | MTK |
| liters | LTR |
| cubic metres | MTQ |
| pounds | LBR |
| inches | INH |
| feet | FOT |
| yard | YRD |
| kilograms per sqare meter | 28 |
| square inches | INK |
| square feet | FTK |
| square yard | YDK |
| troy ounces | APZ |
| U.S. ounces | ONZ |
| U.S. quarts | QT |
| U.S. gallons | GLL |
| cubic inches | INQ |
| cubic feet | FTQ |
| cubic yard | YDQ |
