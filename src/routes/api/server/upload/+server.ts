import { writeFile } from "fs/promises";
import path from "path";
// import { RequestHandler } from "@sveltejs/kit";

import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    try {
        const data = await request.formData();
        const file = data.get("file") as File;

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Define file path
        const filePath = path.resolve("static/uploads", file.name);

        // Save file
        await writeFile(filePath, buffer);

        return new Response(JSON.stringify({ message: "File uploaded successfully", filePath }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        return new Response("Internal server error", { status: 500 });
    }
};
