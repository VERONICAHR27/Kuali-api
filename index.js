const express = require('express');
const prisma = require('./prismaClient');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- RUTAS PARA COMPANIES ---
app.get('/companies', async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener companies' });
  }
});

app.post('/companies', async (req, res) => {
  const { name, sector } = req.body;
  try {
    const company = await prisma.company.create({ data: { name, sector } });
    res.status(201).json(company);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear company' });
  }
});

// --- RUTAS PARA LEADS ---
app.get('/leads', async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({ include: { company: true } });
    res.json(leads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener leads' });
  }
});

app.post('/leads', async (req, res) => {
  const {
    firstName, lastName, email, phoneNumber,
    linkedinUrl, role, seniority, companyId
  } = req.body;

  try {
    const lead = await prisma.lead.create({
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        linkedinUrl,
        role,
        seniority,
        company: { connect: { id: companyId } },
      },
    });
    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear lead' });
  }
});

// Arranque del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
