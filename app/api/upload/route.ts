// Pour chaque ligne du CSV Commandes (Orders)
for (const row of csvData) {
  await prisma.order.upsert({
    where: { orderId: row['order id'] }, // Clé Primaire
    update: {
      status: row.status,
      finalEarnings: row['final earnings'],
      // ... Mettre à jour les champs si l'ID existe déjà
    },
    create: {
      orderId: row['order id'],
      restaurantId: row['Restaurant ID'],
      status: row.status,
      // ... Créer si l'ID n'existe pas
    }
  });
}
