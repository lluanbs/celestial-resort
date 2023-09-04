/**
 * @fileoverview This module contains a function that creates and saves a PDF reservation document.
 */

import fs from 'fs';
import path from 'path';
import { PDFDocument } from "pdf-lib";
import { IReservation } from '../../app/interfaces/IReservation';

/**
 * The interface for the payload object passed to the default exported function.
 *
 * @typedef {Object} PDFReservationDocument
 * @property {string | number | string[] | number[]} rooms_numbers - The room numbers.
 * @property {string} total_price - The total price of the reservation.
 */
interface PDFReservationDocument extends Partial<IReservation> {
    rooms_numbers: string[] | number[] | string | number;
    total_price: string;
};

/**
 * This is a default exported asynchronous function that takes a payload object, creates a PDF reservation document, 
 * and saves it in the './download/' directory. 
 *
 * @param {PDFReservationDocument} payload - The payload object containing the data for the reservation document.
 *
 * @example
 * // create and save a PDF reservation document
 * functionName({
 *     id: 123,
 *     user_name: 'John Doe',
 *     check_in_date: '2021-12-31',
 *     check_out_date: '2022-01-01',
 *     rooms_numbers: ['101', '102'],
 *     total_price: '200'
 * });
 */
export default async (payload: PDFReservationDocument) => {
    const fileName = payload.id + '.pdf';
    const PDF_PATH = path.join('./download/', fileName);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const FONT_SIZE_TITLE = 24;
    const FONT_SIZE_SUBTITLE = 20;
    const FONT_SIZE_CONTENT = 16;
    const MARGIN = 50;
    let currentYPosition = 350;

    /**
     * This is a local function that draws text on the PDF page at the current Y position and updates the current Y position.
     *
     * @param {string} text - The text to be drawn.
     * @param {number} fontSize - The font size of the text.
     */
    const drawText = (text: string, fontSize: number) => {
        page.drawText(text, {
            x: MARGIN,
            y: currentYPosition,
            size: fontSize
        });
        currentYPosition -= fontSize + 10;
    };

    drawText(`Reserva Confirmada para: ${payload.user_name}`, FONT_SIZE_TITLE);
    drawText(`Data de checkin: ${payload.check_in_date}`, FONT_SIZE_CONTENT);
    drawText(`Data de checkout: ${payload.check_out_date}`, FONT_SIZE_CONTENT);
    drawText(`Quartos: ${payload.rooms_numbers}`, FONT_SIZE_CONTENT);
    drawText(`Valor: ${payload.total_price}`, FONT_SIZE_CONTENT);

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(PDF_PATH, pdfBytes);
};
