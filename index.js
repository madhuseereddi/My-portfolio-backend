const express = require('express');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Open the database connection
const DbServer = async () => {
  return open({
    filename: './mydatabase.db',
    driver: sqlite3.Database
  });
};

let db;

// Initialize the database and create tables if they don't exist
const initializeTables = async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      message TEXT NOT NULL
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      imglink TEXT NOT NULL,
      languages_used TEXT NOT NULL,
      description TEXT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      usage TEXT NOT NULL,
      logolink TEXT NOT NULL
    )
  `);
};

// Feedback Routes

// Add Feedback
app.post('/feedback', async (request, response) => {
  const { email, message } = request.body;
  const postFeedbackQuery = `
    INSERT INTO feedback (email, message)
    VALUES ('${email}', '${message}')
  `;
  await db.run(postFeedbackQuery);
  response.send('Feedback Submitted');
});

// Get All Feedback
app.get('/feedback', async (request, response) => {
  const getFeedbackQuery = `SELECT * FROM feedback`;
  const feedbackList = await db.all(getFeedbackQuery);
  response.send(feedbackList);
});

// Projects Routes

// Add Project
app.post('/projects', async (request, response) => {
  const { name, link, imglink, languages_used, description } = request.body;
  const postProjectQuery = `
    INSERT INTO projects (name, link, imglink, languages_used, description)
    VALUES ('${name}', '${link}', '${imglink}', '${languages_used}', '${description}')
  `;
  await db.run(postProjectQuery);
  response.send('Project Added');
});

// Get All Projects
app.get('/projects', async (request, response) => {
  const getProjectsQuery = `SELECT * FROM projects`;
  const projectsList = await db.all(getProjectsQuery);
  response.send(projectsList);
});

// Skills Routes

// Add Skill
app.post('/skills', async (request, response) => {
  const { name, description, usage, logolink } = request.body;
  const postSkillQuery = `
    INSERT INTO skills (name, description, usage, logolink)
    VALUES ('${name}', '${description}', '${usage}', '${logolink}')
  `;
  await db.run(postSkillQuery);
  response.send('Skill Added');
});

// Get All Skills
app.get('/skills', async (request, response) => {
  const getSkillsQuery = `SELECT * FROM skills`;
  const skillsList = await db.all(getSkillsQuery);
  response.send(skillsList);
});

// Start the server and initialize the database
DbServer().then(database => {
  db = database;
  initializeTables().then(() => {
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  });
});
