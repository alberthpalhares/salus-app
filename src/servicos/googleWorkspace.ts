/**
  Google Workspace Integration Service for Salus
  Uses the user's OAuth access token to interact directly with Google Drive and Google Calendar.
 */

// 1. Google Drive Integration: Export / Sync Family Health Backup
export async function syncSalusToGoogleDrive(accessToken: string, familyName: string, members: any[]) {
  if (!accessToken) {
    throw new Error('Token do Google não disponível. Por favor, faça login novamente com sua conta Google.');
  }

  // A. Search if 'Salus - Histórico de Saúde' folder exists
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Salus - Histórico de Saúde da Família' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  
  const searchRes = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const searchData = await searchRes.json();

  let folderId = '';
  if (searchData.files && searchData.files.length > 0) {
    folderId = searchData.files[0].id;
  } else {
    // Create folder
    const createFolderRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Salus - Histórico de Saúde da Família',
        mimeType: 'application/vnd.google-apps.folder',
      }),
    });
    const folderData = await createFolderRes.json();
    folderId = folderData.id;
  }

  // B. Create a summary text file in the Drive folder
  const today = new Date().toISOString().split('T')[0];
  const summaryContent = `🩺 SALUS - RESUMO COMPACTO DE SAÚDE DA FAMÍLIA
Família: ${familyName}
Data da Sincronização: ${today}

Membros da Família:
${members.map((m) => `- ${m.nome} (${m.especie}) | Nasc: ${m.data_nascimento || 'N/I'} | Sangue: ${m.tipo_sanguineo || 'N/I'}`).join('\n')}

Este arquivo foi sincronizado automaticamente pelo seu Salus App no Google Drive.
  `;

  const metadata = {
    name: `Salus_Resumo_${familyName.replace(/\s+/g, '_')}_${today}.txt`,
    parents: [folderId],
    mimeType: 'text/plain',
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', new Blob([summaryContent], { type: 'text/plain' }));

  const uploadRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: form,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(err.error?.message || 'Erro ao fazer upload para o Google Drive');
  }

  return { success: true, folderId };
}


// 2. Google Calendar Integration: Add Vaccine and Prescriptions Reminders
export async function addVaccineRemindersToCalendar(accessToken: string, vaccines: Array<{ nome: string; proxima?: string; membro: string }>) {
  if (!accessToken) {
    throw new Error('Token do Google não disponível.');
  }

  let addedCount = 0;

  for (const vac of vaccines) {
    if (!vac.proxima) continue;

    const eventDate = vac.proxima; // AAAA-MM-DD
    const event = {
      summary: `🩺 Vacina: ${vac.nome} (${vac.membro})`,
      description: `Lembrete de vacina do Salus App para ${vac.membro}.\nVacina: ${vac.nome}`,
      start: {
        date: eventDate,
      },
      end: {
        date: eventDate,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (res.ok) {
      addedCount++;
    }
  }

  return { success: true, addedCount };
}
