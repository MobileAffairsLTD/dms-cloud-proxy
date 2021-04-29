const xadesjs = require("xadesjs");
const { Crypto } = require("@peculiar/webcrypto");

xadesjs.Application.setEngine("NodeJS", new Crypto());
 

export function execEInvoiceSugnature(): string {
    return '';
}