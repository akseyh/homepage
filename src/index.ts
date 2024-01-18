import express, { Request, Response } from "express";
import { marked } from "marked";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("view engine", "pug");

app.get("/", (req: Request, res: Response) => {
	res.render("me");
});

app.get("/blog", (req: Request, res: Response) => {
	const dir = path.join(__dirname, "../contents");
	const fileNames = fs.readdirSync(dir);

	const perPage = 5;
	const totalPage = Math.ceil(fileNames.length / perPage);
	const page = Number(req.query.page) || 1;
	if (totalPage < page) return res.redirect("?page=1");

	const files = fileNames.map((file) => {
		const filedir = path.join(__dirname, `../contents/${file}`);
		const readFile = fs.readFileSync(filedir);
		const { data } = matter(readFile);

		const [day, month, year] = data?.date?.split("/") || [null, null, null];
		const date =
			day && month && year ? new Date(`${year}-${month}-${day}`) : new Date();

		return {
			slug: file.split(".")[0],
			title: data?.title || file.split(".")[0],
			short: data?.short,
			date,
			prettyDate: data?.date,
		};
	});

	const filteredFiles = files
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice((page - 1) * perPage, page * perPage);

	res.render("blog", {
		files: filteredFiles,
		totalPage,
		page,
	});
});

app.get("/blog/:slug", async (req: Request, res: Response) => {
	try {
		const slug = req.params.slug;
		const dir = path.join(__dirname, `../contents/${slug}.md`);
		const readFile = fs.readFileSync(dir);

		const { data, content } = matter(readFile);
		const markdown = marked(content);

		res.render("content", {
			markdown,
			date: data.date,
			title: data.title,
		});
	} catch (err) {
		console.log(err);
		res.status(404);
		res.render("404");
	}
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
