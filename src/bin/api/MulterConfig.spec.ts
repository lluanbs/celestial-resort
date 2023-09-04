import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import request from 'supertest';
import upload from './MulterConfig';

const app = express();

app.post('/test-upload', upload.single('testfile'), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).send("File missing!");
    return res.status(200).send('File uploaded');
}, (error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).send(error.message);
    } else {
        if (error.message == "Only images (JPEG, JPG, PNG) or PDF files are allowed!") return res.status(400).send(error.message);
        return res.status(500).send(error.message);
    }
});


describe("Multer Configuration", () => {

    it("should successfully upload a JPG file", async () => {
        const mockFile = Buffer.from("JPG mock content");
        const response = await request(app)
            .post('/test-upload')
            .attach('testfile', mockFile, 'test.jpg');

        expect(response.status).toBe(200);
        expect(response.text).toBe('File uploaded');
    });

    it("should successfully upload a JPEG file", async () => {
        const mockFile = Buffer.from("JPEG mock content");
        const response = await request(app)
            .post('/test-upload')
            .attach('testfile', mockFile, 'test.jpeg');

        expect(response.status).toBe(200);
        expect(response.text).toBe('File uploaded');
    });

    it("should successfully upload a PNG file", async () => {
        const mockFile = Buffer.from("PNG mock content");
        const response = await request(app)
            .post('/test-upload')
            .attach('testfile', mockFile, 'test.png');

        expect(response.status).toBe(200);
        expect(response.text).toBe('File uploaded');
    });

    it("should successfully upload a PDF file", async () => {
        const mockFile = Buffer.from("PDF mock content");
        const response = await request(app)
            .post('/test-upload')
            .attach('testfile', mockFile, 'test.pdf');

        expect(response.status).toBe(200);
        expect(response.text).toBe('File uploaded');
    });

    it("should handle request without a file", async () => {
        const response = await request(app).post('/test-upload');

        expect(response.status).toBe(400);
        expect(response.text).toContain('File missing');
    });

    it("should reject a TXT file", async () => {
        const mockFile = Buffer.from("TXT mock content");
        const response = await request(app)
            .post('/test-upload')
            .attach('testfile', mockFile, 'test.txt');

        expect(response.status).toBe(400);
        expect(response.text).toContain('Only images (JPEG, JPG, PNG) or PDF files are allowed!');
    });
});