import express from 'express';
import { Response } from 'express';

export class App {

	public run(): void {

		var app = express();

		app.get("/test", (_, response: Response, __) => {

			response.json(["Hello", "World", "!"]);
		});

		app.listen(3000, () => {

			console.log("Server running on port 3000");
		});
	}
}

