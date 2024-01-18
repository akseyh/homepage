"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const marked_1 = require("marked");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const gray_matter_1 = __importDefault(require("gray-matter"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.static("public"));
app.set("view engine", "pug");
app.get("/", (req, res) => {
    res.render("me");
});
app.get("/blog", (req, res) => {
    const dir = path_1.default.join(__dirname, "../contents");
    const fileNames = fs_1.default.readdirSync(dir);
    const perPage = 5;
    const totalPage = Math.ceil(fileNames.length / perPage);
    const page = Number(req.query.page) || 1;
    if (totalPage < page)
        return res.redirect("?page=1");
    const files = fileNames.map((file) => {
        var _a;
        const filedir = path_1.default.join(__dirname, `../contents/${file}`);
        const readFile = fs_1.default.readFileSync(filedir);
        const { data } = (0, gray_matter_1.default)(readFile);
        const [day, month, year] = ((_a = data === null || data === void 0 ? void 0 : data.date) === null || _a === void 0 ? void 0 : _a.split("/")) || [null, null, null];
        const date = day && month && year ? new Date(`${year}-${month}-${day}`) : new Date();
        return {
            slug: file.split(".")[0],
            title: (data === null || data === void 0 ? void 0 : data.title) || file.split(".")[0],
            short: data === null || data === void 0 ? void 0 : data.short,
            date,
            prettyDate: data === null || data === void 0 ? void 0 : data.date,
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
app.get("/blog/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const dir = path_1.default.join(__dirname, `../contents/${slug}.md`);
        const readFile = fs_1.default.readFileSync(dir);
        const { data, content } = (0, gray_matter_1.default)(readFile);
        const markdown = (0, marked_1.marked)(content);
        res.render("content", {
            markdown,
            date: data.date,
            title: data.title,
        });
    }
    catch (err) {
        console.log(err);
        res.status(404);
        res.render("404");
    }
});
app.get("/wiki", (req, res) => {
    res.render("wiki");
});
app.get("/products", (req, res) => {
    res.render("products");
});
app.use((req, res) => {
    res.status(404);
    res.render("404");
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
