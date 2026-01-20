const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 5173;
const filePath = path.join(process.cwd(), "web-demo.html");

const server = http.createServer((req, res) => {
  const url = req.url || "/";

  if (url === "/" || url === "/index.html") {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("Erreur serveur: impossible de charger web-demo.html");
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(data);
    });
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("404 - Ressource non trouvee");
});

server.listen(port, () => {
  console.log(`Demo web en cours sur http://localhost:${port}`);
  console.log("Ouvrez ce lien dans votre navigateur.");
});
