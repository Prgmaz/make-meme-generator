const axios = require("axios").default;
const express = require("express");
const app = express();
const _ = require('lodash');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
	axios
		.get("https://api.imgflip.com/get_memes")
		.then((memes) => {
			return res.render("index", {
				memes: _.sampleSize(memes.data.data.memes, 10)
			});
		})
		.catch((e) => {
			return res.status(500).send("500 Internal Server Error");
		});
});

app.post("/generate", (req, res) => {
	axios
		.post(
			"https://api.imgflip.com/caption_image",
			{},
			{
				params: {
					template_id: req.body.template_id,
					username: req.body.username,
					password: req.body.password,
					text0: req.body.text0,
					text1: req.body.text1,
				},
			}
		)
		.then((response) => {
			return res.send(`<img src=${response.data.data.url}>`);
		}).catch((e) => {
            return res.status(403).send("403 Client Error")
        });
});

app.get("/error", (req, res) => {
	axios
		.get("http://localhost:3000/")
		.then((data) => {
			return res.send("Everything is working");
		})
		.catch((e) => {
			return res.status(404).send("API is faulty");
		});
});

app.listen(3000, () => {
	console.log("Server is listening on 3000");
});
