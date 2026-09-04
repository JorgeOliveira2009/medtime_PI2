import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Faz a notificação aparecer (som + alerta) mesmo com o app aberto em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Cria o canal de notificação no Android (obrigatório a partir do Android 8) */
export async function configurarCanalNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('remedios', {
      name: 'Lembretes de remédios',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

/** Pede permissão de notificação ao usuário (só mostra o prompt se ainda não decidiu) */
export async function solicitarPermissaoNotificacoes(): Promise<boolean> {
  const { status: statusAtual } = await Notifications.getPermissionsAsync();
  let status = statusAtual;

  if (status !== 'granted') {
    const resposta = await Notifications.requestPermissionsAsync();
    status = resposta.status;
  }

  return status === 'granted';
}

/**
 * Agenda uma notificação diária e recorrente no horário do remédio (formato "HH:mm").
 * Retorna o id da notificação agendada (guarde-o para poder cancelar depois),
 * ou null se o horário for inválido ou a permissão não tiver sido concedida.
 */
export async function agendarNotificacaoRemedio(
  nome: string,
  horario: string
): Promise<string | null> {
  const permitido = await solicitarPermissaoNotificacoes();
  if (!permitido) return null;

  const [horaStr, minutoStr] = horario.split(':');
  const hora = parseInt(horaStr, 10);
  const minuto = parseInt(minutoStr, 10);
  if (isNaN(hora) || isNaN(minuto)) return null;

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '💊 Hora do remédio',
        body: `Está na hora de tomar: ${nome}`,
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hora,
        minute: minuto,
        repeats: true,
        channelId: Platform.OS === 'android' ? 'remedios' : undefined,
      },
    });
    return id;
  } catch (err) {
    console.error('Erro ao agendar notificação:', err);
    return null;
  }
}

/** Cancela uma notificação agendada anteriormente (ex: ao remover o remédio) */
export async function cancelarNotificacaoRemedio(notificationId?: string) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (err) {
    console.error('Erro ao cancelar notificação:', err);
  }
}