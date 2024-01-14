import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.set("view engine", "pug");

app.get("/", (req: Request, res: Response) => {
	res.render("me");
});

app.get("/blog", (req: Request, res: Response) => {
	res.render("blog");
});

app.get("/wiki", (req: Request, res: Response) => {
	res.render("wiki");
});

app.get("/products", (req: Request, res: Response) => {
	res.render("products");
});

app.use((req: Request, res: Response) => {
	res.status(404);
	res.render("404");
});

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`);
});
