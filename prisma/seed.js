const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Comenzando el seeding...');
  
  try {
    // Crear una empresa
    const company = await prisma.company.create({
      data: {
        name: "Empresa Peruana S.A.C.",
        sector: "Tecnología"
      }
    });
    
    console.log('Empresa creada:', company);
    
    // Crear un lead
    const lead = await prisma.lead.create({
      data: {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@ejemplo.pe",
        phoneNumber: "+51987654321",
        role: "Desarrollador",
        seniority: "Mid",
        company: { connect: { id: company.id } }
      }
    });
    
    console.log('Lead creado:', lead);
    
    console.log('✅ Seeding completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  }
}

main()
  .then(async () => {
    console.log('Desconectando Prisma...');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error en la ejecución del seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 