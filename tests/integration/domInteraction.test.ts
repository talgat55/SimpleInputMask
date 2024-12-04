import SimpleInputMask from "../../src/simpleInputMask";

test("Input updates correctly with mask", () => {

    const input = document.createElement("input");

    const mask = new SimpleInputMask({ mask: "(###) ###-####" });

    mask.attach(input);

    input.value = "1234567890";
    input.dispatchEvent(new Event("input"));

    expect(input.value).toBe("(123) 456-7890");

    mask.detach();
});
