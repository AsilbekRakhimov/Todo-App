const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const server = http.createServer((req, res) => {
  const method = req.method
  const reqURL = req.url
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method == "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "DELETE");
    res.end();
    return;
  }
  if (reqURL == "/tasks" && method == "GET") {
    const filePath = path.join(__dirname, "data", "tasks.json");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        throw err;
      } else {
        res.statusCode = 200
        res.end(data);
      }
    });
    return
  }
  if (reqURL.split("/")[1] == "tasks" && method == "GET") {
    const taskId = req.url.split("/")[2];
    const filePath = path.join(__dirname, "data", "tasks.json");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        data = JSON.parse(data);

        let task = "";
        for (let key in data) {
          if (data[key].id == taskId) {
            task = data[key].task;
          }
        }
        if (!task) {
          res.statusCode = 404;
          res.end("Not found");
          return;
        }
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            message: "Task is updated successfully",
            data: task,
          })
        );
      }
    });
    return;
  }
  if (reqURL == "/tasks" && method == "POST") {
    const filePath = path.join(__dirname, "data", "tasks.json");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        throw err;
      } else {
        data = JSON.parse(data);

        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        let dataParsed = {
          id: data[data.length - 1]?.id + 1 || 1,
        };
        req.on("end", () => {
          dataParsed["task"] = JSON.parse(body).task;
          dataParsed["done"] = String(JSON.parse(body).done) || false;
          data.push(dataParsed);
          fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
              throw err
            } else {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  message: "Task is written succesfully",
                })
              );
            }
          });
        });
      }
    });
  return;
}
  if (reqURL.split("/")[1] == "tasks" && req.method == "POST") {
    const taskId = req.url.split("/")[2];
    const filePath = path.join(__dirname, "data", "tasks.json");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        throw err
      } else {
        data = JSON.parse(data);

        let body = "";
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", () => {
          const dataParsed = JSON.parse(body);
          let count = 0;
          for (let key in data) {
            if (data[key].id == taskId) {
              count += 1;
              data[key].task = dataParsed.task || data[key].task;
              data[key].done = dataParsed.done || data[key].done;
            }
          }
          if (!count) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }
          fs.writeFile(filePath, JSON.stringify(data), (err) => {
            if (err) {
              throw err
            } else {
              res.statusCode = 201;
              res.end(
                JSON.stringify({
                  message: "Task is updated successfully",
                })
              );
            }
          });
          
        });
      }
    });
    return;
  } 
  if (reqURL.split("/")[1] == "tasks" && method == "DELETE") {
    const taskId = req.url.split("/")[2];
    const filePath = path.join(__dirname, "data", "tasks.json");
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        throw err
      } else {
        data = JSON.parse(data);
        for (let i = 0; i < data.length; i++) {
          if (data[i].id == taskId) {
            data.splice(i, 1);
          }
        }
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
          if (err) {
            throw err          
          }
          res.statusCode = 200;
          res.end(JSON.stringify({ message: "Task is deleted successfully" }));
        });
      }
    });
    return ;
  }
  res.statusCode = 404;
});

server.listen(port, "localhost", () => {
  console.log(`Server is running....`);
});
