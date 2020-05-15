const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(express.json());

const PORT = 3333;

const projects = [];

/**
 * MIDDLEWARES
 */

function logRequests (request, response, next) {
  const { method, url } = request;

  const logLabel = `Method: ${method.toUpperCase()} | Route: "${url}"`;

  console.log(logLabel);

  return next();
}

function validationProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project ID'});
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validationProjectId);
/**
 * ROUTES
 */

app.get('/', (request, response) => {
  return response.json({
    avatar_url: 'https://media-exp1.licdn.com/dms/image/C4D03AQF6R64AXnwp0g/profile-displayphoto-shrink_400_400/0?e=1594857600&v=beta&t=MPj7RCNFVwFkc9IBNYXKzTckLD6wjw3s4XqrtKzSwDM',
    message: 'Welcome, you are accessing my first API',
    developer: 'Edgar Ribeiro',
    whats_app: '+55 71 99963-9062',
    email: 'ribeiro.edgar@outlook.com.br',
    github: 'http://github.com/eneto774',
    linkedin: 'https://www.linkedin.com/in/ribeiro-edgar/'
 });
});

app.get('/projects', (request, response) => {

  const { title } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;
  return response.status(200).json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  if (!(title && owner)) {
    return response.status(400).json({ error: 'Not exists content in request'})
  }

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.status(200).json(project);
});

app.put('/projects/:id', (request, response) => {

  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id );

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.status(200).json(project)
})

app.delete('/projects/:id', (request, response) => {

  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id === id );

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
})


app.listen(PORT, () => {
  console.log(`🟢 Back-end started in http://localhost:${PORT}`)
});
