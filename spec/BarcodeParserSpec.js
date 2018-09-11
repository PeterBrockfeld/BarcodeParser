describe("A parsed GS1 barcode", () => {
    let result;

    beforeEach(() => {
        const fncChar = String.fromCharCode(29); // the ASCII "group separator"
        const barcode = `]C101040123456789011715012910ABC123${fncChar}39329714711${fncChar}310300052539224711${fncChar}42127649716`;

        result = parseBarcode(barcode);
    });

    it("has 7 elements", () => {
        expect(result.parsedCodeItems.length).toBe(7);
    });

    it("has the GTIN element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "01",
            dataTitle: "GTIN",
            data: "04012345678901"
        })]));
    });

    it("has the EXPIRY element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "17",
            dataTitle: "USE BY OR EXPIRY",
            data: new Date(2015, 0, 29, 0, 0, 0, 0)
        })]));
    });

    it("has the BATCH/LOT element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "10",
            dataTitle: "BATCH/LOT",
            data: "ABC123"
        })]));
    });

    it("has the PRICE (ISO) element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "3932",
            dataTitle: "PRICE",
            data: 47.11,
            unit: "971"
        })]));
    });

    it("has the PRICE element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "3922",
            dataTitle: "PRICE",
            data: 47.11
        })]));
    });

    it("has the NET WEIGHT element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "3103",
            dataTitle: "NET WEIGHT (kg)",
            data: 0.525,
            unit: "KGM"
        })]));
    });

    it("has the SHIP TO POST element", () => {
        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "421",
            dataTitle: "SHIP TO POST",
            data: "49716",
            unit: "276"
        })]));
    });
});

describe("A parsed GS1 barcode including the consumer product variant", () => {
    it("has the CPV element", () => {
        const barcode = "]C1229000481118CDB1950224";
        const result = parseBarcode(barcode);

        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "22",
            dataTitle: "CPV",
            data: "9000481118CDB1950224"
        })]));
    });
});

describe("A parsed GS1 barcode", () => {
    it("should behave...", () => {
        const barcode = "]C10100307130640862171905001010059243000024";
        const result = parseBarcode(barcode);

        expect(result.parsedCodeItems).toEqual(jasmine.arrayContaining([jasmine.objectContaining({
            ai: "17",
            dataTitle: "USE BY OR EXPIRY",
            data: new Date(2019, 4, 31, 0, 0, 0, 0)
        })]));
    });
});