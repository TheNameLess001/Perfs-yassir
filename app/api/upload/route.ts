// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import Papa from 'papaparse';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Récupérer les fichiers envoyés par le frontend (Drag & Drop)
    const formData = await request.formData();
    const type = formData.get('type'); // 'restaurants' ou 'orders'
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }

    // 2. Lire le fichier en texte
    const fileText = await file.text();

    // 3. Parser le CSV en JSON avec PapaParse
    const parsedData = Papa.parse(fileText, {
      header: true, // Utilise la première ligne comme clés
      skipEmptyLines: true,
      delimiter: type === 'restaurants' ? ';' : ',', // Tes CSV ont des séparateurs différents !
    });

    const rows = parsedData.data as any[];

    // 4. LOGIQUE D'UPSERT selon le type de fichier
    if (type === 'restaurants') {
      console.log(`Traitement de ${rows.length} restaurants...`);
      
      // On utilise une transaction pour plus de rapidité et sécurité
      await prisma.$transaction(
        rows.map((row) => 
          prisma.restaurant.upsert({
            where: { id: row['Id'] }, // Si cet ID existe -> UPDATE
            update: {
              name: row['Restaurant Name'],
              mainCity: row['Main City'],
              status: row['Restaurant Status'],
              commission: parseFloat(row['Commission %']) || 0,
            },
            create: { // Sinon -> INSERT (Création)
              id: row['Id'],
              name: row['Restaurant Name'],
              mainCity: row['Main City'],
              status: row['Restaurant Status'],
              commission: parseFloat(row['Commission %']) || 0,
            }
          })
        )
      );
    } 
    
    else if (type === 'orders') {
      console.log(`Traitement de ${rows.length} commandes...`);
      
      await prisma.$transaction(
        rows.map((row) => 
          prisma.order.upsert({
            where: { id: row['order id'] },
            update: {
              status: row['status'],
              finalEarnings: parseFloat(row['final earnings']) || 0,
              payableAmount: parseFloat(row['Payable Amount']) || 0,
              deliveryTime: parseFloat(row['delivery time(M)']) || 0,
              cancellationRsn: row['cancellation reason '],
            },
            create: {
              id: row['order id'],
              restaurantId: row['Restaurant ID'], // Relie la commande au bon restau
              status: row['status'],
              orderDate: row['order day'],
              orderTime: row['order time'],
              paymentMethod: row['Payment Method'],
              finalEarnings: parseFloat(row['final earnings']) || 0,
              payableAmount: parseFloat(row['Payable Amount']) || 0,
              deliveryTime: parseFloat(row['delivery time(M)']) || 0,
              cancellationRsn: row['cancellation reason '],
            }
          })
        )
      );
    }

    return NextResponse.json({ success: true, message: "Base de données mise à jour avec succès !" });

  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
