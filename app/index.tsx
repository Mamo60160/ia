import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Sender = 'bot' | 'user';
type Chip = { label: string; value: string };
type Message = {
  id: string;
  sender: Sender;
  text: string;
  time: string;
  chips?: Chip[];
};
type Reply = { text: string; chips?: Chip[] };

const RDV_SLOTS = ['Mardi 10:00', 'Mercredi 14:30', 'Jeudi 09:00'];
const FAQ_TOPICS: Chip[] = [
  { label: 'Conges', value: 'Infos sur les conges' },
  { label: 'Paie', value: 'Infos sur la paie' },
  { label: 'Teletravail', value: 'Infos sur le teletravail' },
  { label: 'Onboarding', value: "Aide pour l'onboarding" },
  { label: 'Avantages', value: 'Quels sont les avantages' },
];
const DEFAULT_SUGGESTIONS: Chip[] = [
  { label: 'FAQ RH', value: 'Montre-moi la FAQ RH' },
  { label: 'Uploader un CV', value: 'Je veux deposer un CV' },
  { label: 'Prendre RDV', value: 'Je veux prendre un rendez-vous' },
  { label: 'Recrutement', value: 'Je veux un apercu du recrutement' },
];

const getTimeLabel = () =>
  new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getBotReply = (message: string): Reply => {
  const normalized = normalizeText(message);
  const includesAny = (keywords: string[]) =>
    keywords.some((keyword) => normalized.includes(keyword));

  if (includesAny(['bonjour', 'salut', 'hello'])) {
    return {
      text:
        "Bonjour ! Je suis Nimbus, votre assistant RH dans le cloud. Je peux vous aider sur les conges, la paie, le teletravail, l'onboarding, le recrutement et les CV.",
      chips: DEFAULT_SUGGESTIONS,
    };
  }

  if (includesAny(['merci', 'top', 'super'])) {
    return {
      text: "Avec plaisir ! Je reste disponible si vous avez d'autres questions.",
    };
  }

  if (includesAny(['confirme', 'confirmation'])) {
    return {
      text:
        "Parfait, RDV confirme. L'invitation est envoyee et ajoutee au calendrier cloud RH.",
    };
  }

  if (includesAny(['statut', 'suivre'])) {
    return {
      text:
        'Statut candidature : en revue. Prochaine etape : entretien RH. Vous recevrez une notification.',
    };
  }

  if (includesAny(['lettre', 'motivation'])) {
    return {
      text:
        'Lettre ajoutee au dossier candidat (PDF recommande). Le tout est conserve dans le coffre-fort cloud.',
    };
  }

  if (includesAny(['rdv', 'rendez', 'entretien', 'meeting'])) {
    return {
      text:
        'Je peux planifier un RDV de 15 min avec RH. Voici des creneaux disponibles cette semaine.',
      chips: RDV_SLOTS.map((slot) => ({
        label: slot,
        value: `Je confirme ${slot}`,
      })),
    };
  }

  if (includesAny(['faq', 'foire'])) {
    return {
      text: 'Voici les themes de la FAQ RH. Choisissez un sujet.',
      chips: FAQ_TOPICS,
    };
  }

  if (includesAny(['conge', 'conges', 'rtt', 'absence'])) {
    return {
      text:
        'Pour poser un conge : 1) ouvrir le portail RH, 2) choisir les dates, 3) validation manager. Le solde est mis a jour en temps reel.',
      chips: [
        { label: 'Poser un conge', value: 'Je veux poser un conge' },
        { label: 'Voir mon solde', value: 'Quel est mon solde de conges' },
      ],
    };
  }

  if (includesAny(['paie', 'salaire', 'bulletin', 'fiche'])) {
    return {
      text:
        'Les bulletins de paie sont disponibles le 28 du mois dans le coffre-fort RH. En cas de correction, delai moyen : 48h.',
      chips: [
        { label: 'Voir mon bulletin', value: 'Je veux mon bulletin de paie' },
        { label: 'Signaler une erreur', value: 'Je veux signaler une erreur de paie' },
      ],
    };
  }

  if (includesAny(['teletravail', 'remote', 'hybride'])) {
    return {
      text:
        'Politique teletravail : jusqu a 2 jours par semaine, planning partage via le portail cloud RH.',
      chips: [
        { label: 'Demander un jour', value: 'Je veux demander un jour de teletravail' },
        { label: 'Charte', value: 'Afficher la charte teletravail' },
      ],
    };
  }

  if (includesAny(['onboarding', 'integration', 'arrivee', 'arrive', 'nouveau'])) {
    return {
      text:
        "Checklist d'onboarding : contrat signe, materiel livre, acces cloud, point J+7. Tout est suivi dans un tableau unique.",
      chips: [
        { label: 'Checklist', value: "Voir la checklist d'onboarding" },
        { label: 'Acces IT', value: 'Activer mes acces IT' },
      ],
    };
  }

  if (includesAny(['recrutement', 'poste', 'candidature'])) {
    return {
      text:
        'Le module recrutement permet de creer une fiche de poste, diffuser et suivre les candidats en temps reel.',
      chips: [
        { label: 'Deposer un CV', value: 'Je veux deposer un CV' },
        { label: 'Suivre candidature', value: 'Je veux suivre ma candidature' },
      ],
    };
  }

  if (includesAny(['cv', 'televerse', 'upload', 'deposer'])) {
    return {
      text:
        'CV recu et chiffre dans le coffre-fort cloud RH. Format PDF recommande, analyse automatique sous 2 minutes.',
      chips: [
        { label: 'Voir le statut', value: 'Quel est le statut de ma candidature' },
        { label: 'Ajouter une lettre', value: 'Je veux ajouter une lettre de motivation' },
      ],
    };
  }

  if (includesAny(['avantage', 'mutuelle', 'ticket', 'benefit'])) {
    return {
      text:
        'Avantages principaux : mutuelle premium, tickets resto, budget formation et mobilite durable.',
      chips: [
        { label: 'Details mutuelle', value: 'Je veux les details mutuelle' },
        { label: 'Budget formation', value: 'Quel est le budget formation' },
      ],
    };
  }

  if (includesAny(['formation', 'learning', 'competence'])) {
    return {
      text:
        'Catalogue cloud learning : plus de 200 modules. Inscription en 1 clic, suivi des acquis automatique.',
      chips: [
        { label: 'Voir le catalogue', value: 'Ouvrir le catalogue formation' },
        { label: 'Mes credits', value: 'Consulter mes credits formation' },
      ],
    };
  }

  return {
    text:
      "Je peux aider sur la FAQ RH, les conges, la paie, le teletravail, l'onboarding, le recrutement, les CV et les RDV.",
    chips: DEFAULT_SUGGESTIONS,
  };
};

const CloudBackdrop = () => (
  <View pointerEvents="none" style={styles.cloudBackdrop}>
    <Text style={[styles.cloud, styles.cloudOne]}>☁️</Text>
    <Text style={[styles.cloud, styles.cloudTwo]}>☁️</Text>
    <Text style={[styles.cloud, styles.cloudThree]}>☁️</Text>
  </View>
);

const MessageBubble = ({
  message,
  onChipPress,
}: {
  message: Message;
  onChipPress: (value: string) => void;
}) => {
  const isUser = message.sender === 'user';

  return (
    <View style={styles.messageGroup}>
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowBot]}>
        {!isUser ? (
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>☁️</Text>
          </View>
        ) : null}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {message.text}
          </Text>
          <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.botTimeText]}>
            {message.time}
          </Text>
        </View>
      </View>
      {message.chips?.length ? (
        <View style={[styles.chipRow, isUser ? styles.chipRowUser : styles.chipRowBot]}>
          {message.chips.map((chip) => (
            <TouchableOpacity
              key={`${message.id}-${chip.label}`}
              onPress={() => onChipPress(chip.value)}
              style={styles.messageChip}
            >
              <Text style={styles.messageChipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default function App() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const messageCounter = useRef(1);
  const [inputValue, setInputValue] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const createMessage = (sender: Sender, text: string, chips?: Chip[]): Message => ({
    id: `msg-${messageCounter.current++}`,
    sender,
    text,
    time: getTimeLabel(),
    chips,
  });

  const [messages, setMessages] = useState<Message[]>(() => [
    createMessage(
      'bot',
      "Bienvenue ! Je suis Nimbus, le chatbot RH cloud. Dites-moi ce dont vous avez besoin.",
      DEFAULT_SUGGESTIONS
    ),
    createMessage(
      'bot',
      "Vous pouvez aussi utiliser les actions rapides ci-dessous pour une demo commerciale.",
      [
        { label: 'FAQ RH', value: 'Montre-moi la FAQ RH' },
        { label: 'Uploader un CV', value: 'Je veux deposer un CV' },
        { label: 'Prendre RDV', value: 'Je veux prendre un rendez-vous' },
      ]
    ),
  ]);

  const appendMessages = (nextMessages: Message[]) => {
    setMessages((prev) => [...prev, ...nextMessages]);
  };

  const sendUserMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    const userMessage = createMessage('user', trimmed);
    const reply = getBotReply(trimmed);
    const botMessage = createMessage('bot', reply.text, reply.chips);
    appendMessages([userMessage, botMessage]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) {
      return;
    }
    const toSend = inputValue;
    setInputValue('');
    sendUserMessage(toSend);
  };

  const handleUpload = () => {
    const fileName = 'CV_Cloud_Demo.pdf';
    setUploadedFileName(fileName);
    sendUserMessage(`J'ai televerse ${fileName}.`);
  };

  const handleSlotPick = (slot: string) => {
    sendUserMessage(`Je confirme ${slot}.`);
  };

  return (
    <LinearGradient colors={['#EAF6FF', '#D2ECFF', '#B7D9FF']} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <CloudBackdrop />
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Nimbus RH ☁️</Text>
              <Text style={styles.headerSubtitle}>
                Assistant RH cloud pour demos commerciales
              </Text>
            </View>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>DEMO</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statText}>☁️ 24/7</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>🔐 Donnees chiffrees</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statText}>⚡ Reponse 1s</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions rapides</Text>
            <View style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionIcon}>📘</Text>
                <Text style={styles.actionTitle}>FAQ RH</Text>
              </View>
              <Text style={styles.actionSubtitle}>
                Conges, paie, teletravail, onboarding, avantages
              </Text>
              <View style={styles.actionChips}>
                {FAQ_TOPICS.map((topic) => (
                  <TouchableOpacity
                    key={topic.label}
                    onPress={() => sendUserMessage(topic.value)}
                    style={styles.actionChip}
                  >
                    <Text style={styles.actionChipText}>{topic.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionIcon}>📄</Text>
                <Text style={styles.actionTitle}>Uploader un CV</Text>
              </View>
              <Text style={styles.actionSubtitle}>PDF / DOCX, stockage cloud securise</Text>
              <View style={styles.uploadRow}>
                <Text style={styles.uploadFile} numberOfLines={1}>
                  {uploadedFileName ?? 'Aucun fichier selectionne'}
                </Text>
                <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                  <Text style={styles.uploadButtonText}>Choisir</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <Text style={styles.actionIcon}>🗓️</Text>
                <Text style={styles.actionTitle}>Prendre RDV</Text>
              </View>
              <Text style={styles.actionSubtitle}>Creneaux de 15 min avec RH</Text>
              <View style={styles.actionChips}>
                {RDV_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => handleSlotPick(slot)}
                    style={styles.actionChip}
                  >
                    <Text style={styles.actionChipText}>{slot}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Conversation</Text>
            <View style={styles.chatCard}>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onChipPress={sendUserMessage}
                />
              ))}
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Posez une question RH..."
                  placeholderTextColor="#7D8CA3"
                  value={inputValue}
                  onChangeText={setInputValue}
                  onSubmitEditing={handleSend}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                  <Text style={styles.sendButtonText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: '#0B1F36',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  android: {
    elevation: 4,
  },
  web: {
    shadowColor: 'rgba(11, 31, 54, 0.15)',
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
});

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  cloudBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cloud: {
    position: 'absolute',
    opacity: 0.2,
    color: '#FFFFFF',
  },
  cloudOne: {
    top: 20,
    right: 30,
    fontSize: 140,
  },
  cloudTwo: {
    top: 140,
    left: 10,
    fontSize: 100,
  },
  cloudThree: {
    bottom: 80,
    right: 40,
    fontSize: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 22,
    padding: 18,
    ...cardShadow,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0B2C4A',
  },
  headerSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#4B6C8F',
  },
  headerBadge: {
    backgroundColor: '#1F7AE0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginLeft: 12,
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  statPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    ...cardShadow,
  },
  statText: {
    fontSize: 12,
    color: '#365A7E',
    fontWeight: '600',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2C4A',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    ...cardShadow,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2C4A',
  },
  actionSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#4B6C8F',
  },
  actionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  actionChip: {
    backgroundColor: '#E6F1FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  actionChipText: {
    fontSize: 12,
    color: '#1F5AA8',
    fontWeight: '600',
  },
  uploadRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadFile: {
    flex: 1,
    fontSize: 12,
    color: '#2C4E72',
  },
  uploadButton: {
    backgroundColor: '#1F7AE0',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  chatCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 18,
    padding: 16,
    ...cardShadow,
  },
  messageGroup: {
    marginBottom: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E7F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  botAvatarText: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: '#F0F7FF',
    borderTopLeftRadius: 6,
  },
  userBubble: {
    backgroundColor: '#1F7AE0',
    borderTopRightRadius: 6,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botText: {
    color: '#1B3C5A',
  },
  userText: {
    color: '#FFFFFF',
  },
  timeText: {
    fontSize: 10,
    marginTop: 6,
  },
  botTimeText: {
    color: '#5E7A99',
  },
  userTimeText: {
    color: '#DDEBFF',
    textAlign: 'right',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chipRowBot: {
    marginLeft: 36,
  },
  chipRowUser: {
    justifyContent: 'flex-end',
  },
  messageChip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C9E0FF',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  messageChipText: {
    color: '#1F5AA8',
    fontSize: 12,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5FAFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1B3C5A',
  },
  sendButton: {
    backgroundColor: '#1F7AE0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
