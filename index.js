const express = require("express");

const server = express();

server.listen(3000);

///

const projects = [];

server.use(express.json());
server.use((req, res, next) => {
  console.time("ReqResTime");
  next();
  console.timeEnd("ReqResTime");
});

function checkExistsProject(req, res, next) {
  if (!projects.some(p => p.id == req.params.id))
    return res.status(400).json("Project not found");

  return next();
}

server.post("/projects", (req, res) => {
  const { project } = req.body;

  project.id = projects.length + 1;
  projects.push(project);

  return res.json(project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkExistsProject, (req, res) => {
  const { title } = req.body;
  const project = projects.find(p => p.id == req.params.id);
  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkExistsProject, (req, res) => {
  const index = projects.findIndex(p => p.id == req.params.id);
  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkExistsProject, (req, res) => {
  const { task } = req.body;

  const project = projects.find(p => p.id == req.params.id);
  project.tasks.push(task);

  return res.json(project);
});
