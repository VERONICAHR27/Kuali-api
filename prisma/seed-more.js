const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Comenzando a crear datos adicionales...');
  
  try {
    // 1. Crear nuevas plantillas
    const templates = await prisma.template.createMany({
      data: [
        {
          title: "Invitación a webinar",
          body: "Hola {{firstName}}, te invitamos a nuestro próximo webinar sobre oportunidades en {{companyName}}."
        },
        {
          title: "Oferta de trabajo",
          body: "Estimado/a {{firstName}}, tenemos una excelente oportunidad como {{role}} que podría interesarte."
        }
      ],
      skipDuplicates: true
    });
    
    console.log(`✅ Plantillas creadas: ${templates.count}`);
    
    // 2. Crear un nuevo lead
    // Primero obtenemos una company existente
    const company = await prisma.company.findFirst();
    
    if (!company) {
      throw new Error("No se encontró ninguna empresa. Ejecuta primero el seed principal.");
    }
    
    const newLead = await prisma.lead.create({
      data: {
        firstName: "Ana María",
        lastName: "Sánchez",
        email: "ana.sanchez@correo.pe",
        phoneNumber: "+51912345678",
        linkedinUrl: "https://linkedin.com/in/anasanchez",
        role: "Marketing Specialist",
        seniority: "Senior",
        company: { connect: { id: company.id } }
      }
    });
    
    console.log(`✅ Nuevo lead creado: ${newLead.firstName} ${newLead.lastName}`);
    
    // 3. Crear un contacto usando una plantilla existente
    // Obtenemos una plantilla
    const template = await prisma.template.findFirst();
    
    if (!template) {
      throw new Error("No se encontró ninguna plantilla. Asegúrate que se crearon correctamente.");
    }
    
    const newContact = await prisma.contact.create({
      data: {
        lead: { connect: { id: newLead.id } },
        template: { connect: { id: template.id } },
        sentAt: new Date(),
        status: "Enviado"
      }
    });
    
    console.log(`✅ Nuevo contacto creado: ID ${newContact.id}`);
    
    // 4. Mostrar resumen de datos en la base de datos
    const companiesCount = await prisma.company.count();
    const leadsCount = await prisma.lead.count();
    const templatesCount = await prisma.template.count();
    const contactsCount = await prisma.contact.count();
    
    console.log('\n📊 RESUMEN DE DATOS EN LA BASE DE DATOS:');
    console.log(`- Empresas: ${companiesCount}`);
    console.log(`- Leads: ${leadsCount}`);
    console.log(`- Plantillas: ${templatesCount}`);
    console.log(`- Contactos: ${contactsCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error en la ejecución:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 