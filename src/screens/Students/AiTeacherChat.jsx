import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";
import { COLORS, SHADOW } from "../../utils/theme";
import { useResponsiveLayout } from "../../utils/responsive";

// --- 1. THE EXPANDED DATASET ---
const TEACHER_DATA = {
  intents: [
    // ===========================
    // 🏫 COLLEGE LOGISTICS
    // ===========================
    {
      tag: "college_timings",
      patterns: [
        "college time",
        "college timing",
        "class time",
        "schedule",
        "when does college start",
        "when does college end",
        "lecture time",
        "college hours",
        "duration",
        "7:30",
      ],
      responses: [
        "College starts at 7:30 AM sharp and ends at 1:00 PM.",
        "First lecture begins at 7:30 AM. We wrap up by 1:00 PM.",
      ],
    },
    {
      tag: "library",
      patterns: [
        "library",
        "books",
        "borrow",
        "reading room",
        "card",
        "return book",
      ],
      responses: [
        "The Library is located on the 2nd floor. It's open from 8:00 AM to 5:00 PM.",
        "You need your Student ID to borrow books. You can keep a book for 7 days.",
      ],
    },
    {
      tag: "canteen",
      patterns: [
        "canteen",
        "food",
        "lunch",
        "hungry",
        "eat",
        "snack",
        "cafeteria",
        "break",
      ],
      responses: [
        "Lunch break is from 11:30 AM to 12:00 PM.",
        "The Canteen is on the ground floor. Try the samosas or the veg thali!",
      ],
    },
    {
      tag: "syllabus_exams",
      patterns: [
        "syllabus",
        "curriculum",
        "portion",
        "subjects",
        "exam",
        "test",
        "midterm",
        "kt",
        "marks",
      ],
      responses: [
        "You can find the detailed syllabus on the official college website or the notice board.",
        "Internal exams (Mid-terms) are usually held in September. Finals are in April.",
        "Passing marks are 40%. Focus on your practicals!",
      ],
    },
    {
      tag: "results",
      patterns: ["result", "score", "grade", "gpa", "cgpa", "topper"],
      responses: [
        "Results are usually declared 45 days after the final exam.",
        "Check the college portal for your latest GPA scores.",
      ],
    },
    {
      tag: "holidays",
      patterns: ["holiday", "sunday", "vacation", "off", "leave", "festival"],
      responses: [
        "College is closed on Sundays and Public Holidays.",
        "Diwali and Summer vacations are the longest breaks we get!",
      ],
    },
    {
      tag: "faculty",
      patterns: [
        "teacher",
        "sir",
        "mam",
        "madam",
        "professor",
        "principal",
        "staff",
        "faculty",
      ],
      responses: [
        "The Staff Room is on the 1st floor if you need to meet any professor.",
        "Our faculty is very helpful. Approach them during free hours for doubts.",
      ],
    },

    // ===========================
    // 💻 TECH & STUDY
    // ===========================
    {
      tag: "web_development",
      patterns: [
        "html",
        "css",
        "javascript",
        "react",
        "node",
        "frontend",
        "backend",
        "web dev",
        "website",
      ],
      responses: [
        "For Web Dev: Start with HTML/CSS, then master JavaScript. React is the best framework to learn right now.",
        "The DOM (Document Object Model) is how JavaScript interacts with HTML.",
      ],
    },
    {
      tag: "data_science",
      patterns: [
        "python",
        "pandas",
        "numpy",
        "ai",
        "ml",
        "machine learning",
        "data science",
      ],
      responses: [
        "Python is the go-to language for Data Science. Focus on libraries like Pandas and NumPy.",
        "Machine Learning is about training models to make predictions based on data.",
      ],
    },
    {
      tag: "attendance",
      patterns: [
        "attendance",
        "absent",
        "present",
        "low",
        "bunk",
        "75",
        "defaulter",
      ],
      responses: [
        "You need a minimum of 75% attendance to sit for exams.",
        "Check the 'Subject Wise' tab in this app to see your current attendance status.",
        "Don't bunk too many classes! Catching up is harder than attending.",
      ],
    },
    {
      tag: "coding_advice",
      patterns: [
        "code",
        "coding",
        "program",
        "debug",
        "error",
        "learn",
        "stack overflow",
      ],
      responses: [
        "The best way to learn coding is by building projects, not just watching videos.",
        "Stuck on an error? Read the error message carefully and Google it. 99% of the time, someone else had the same issue!",
      ],
    },

    // ===========================
    // 💬 CASUAL CHAT
    // ===========================
    {
      tag: "greeting",
      patterns: [
        "hi",
        "hello",
        "hey",
        "morning",
        "afternoon",
        "evening",
        "yo",
        "start",
      ],
      responses: [
        "Hello! I am your AI Professor. Ask me about College Timings, Coding, or the Library.",
        "Hi there! How can I help you with your studies today?",
      ],
    },
    {
      tag: "wellbeing",
      patterns: ["how are you", "what's up", "how do you do", "doing well"],
      responses: [
        "I'm just a bot, but I'm functioning perfectly! How are your studies going?",
        "I am always ready to help you learn!",
      ],
    },
    {
      tag: "thanks",
      patterns: [
        "thank",
        "thx",
        "cool",
        "great",
        "awesome",
        "ok",
        "okay",
        "nice",
      ],
      responses: [
        "You're welcome! Happy studying.",
        "Glad I could help!",
        "Anytime!",
      ],
    },
    {
      tag: "identity",
      patterns: ["who are you", "your name", "bot", "robot", "real"],
      responses: [
        "I am your Personal AI Teacher for CS & IT studies.",
        "I am a virtual assistant designed to help you navigate college life.",
      ],
    },
    {
      tag: "closing",
      patterns: ["bye", "goodbye", "exit", "leave", "stop", "see you"],
      responses: [
        "Goodbye! Don't forget to complete your assignments.",
        "See you in class! Happy coding.",
      ],
    },
  ],
};

// --- 2. LOGIC ENGINE ---
const getAiResponse = (input) => {
  const lowerInput = input.trim().toLowerCase();

  // 1. Iterate through all categories (intents)
  for (const intent of TEACHER_DATA.intents) {
    // 2. Check each keyword pattern
    for (const pattern of intent.patterns) {
      // 3. If the user's sentence contains the keyword
      if (lowerInput.includes(pattern)) {
        const responses = intent.responses;
        // Return a random response from that category
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  // 4. Default Fallback
  return "I didn't understand that. Try asking about 'College Timings', 'Library Rules', 'Python', or check your 'Attendance'.";
};

// --- Animated Message Bubble ---
const MessageBubble = ({ text, isUser, timestamp }) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text
        style={[styles.messageText, isUser ? styles.userText : styles.aiText]}
      >
        {text}
      </Text>
      <Text
        style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.aiTimestamp,
        ]}
      >
        {timestamp}
      </Text>
    </Animated.View>
  );
};

export default function AiTeacherChat() {
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I am your AI Teacher. Ask me about College Timings, Exams, or Coding!",
      isUser: false,
      time: "Now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    // 2. Process AI Response with Delay
    setTimeout(() => {
      // Call logic engine
      const responseText = getAiResponse(currentInput);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.headerInner, { paddingHorizontal: gutter, maxWidth: contentMaxWidth }]}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../../assets/teacher.png")}
                style={styles.avatar}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Professor</Text>
              <Text style={styles.headerSubtitle}>Always here to help</Text>
            </View>
          </View>
        </View>

        {/* Chat List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              text={item.text}
              isUser={item.isUser}
              timestamp={item.time}
            />
          )}
          contentContainerStyle={[
            styles.chatList,
            { paddingHorizontal: gutter, maxWidth: contentMaxWidth, alignSelf: "center", width: "100%" },
          ]}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={{ marginBottom: 10 }}>
              {isTyping && (
                <Text style={styles.typingText}>AI is typing...</Text>
              )}
            </View>
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={[styles.inputInner, { paddingHorizontal: gutter, maxWidth: contentMaxWidth }]}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline={true}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: inputText.trim() ? COLORS.primary : "#C7D2FE" },
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Header
  header: {
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    ...SHADOW.soft,
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: "600",
  },

  // Chat List
  chatList: {
    paddingTop: 16,
    paddingBottom: 10,
    flexGrow: 1,
  },
    inputContainer: {
      backgroundColor: COLORS.surface,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
      paddingVertical: 10,
      alignItems: "center",
    },
    inputInner: {
      width: "100%",
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
    },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    ...SHADOW.soft,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  aiText: {
    color: COLORS.text,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 5,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  aiTimestamp: {
    color: COLORS.textMuted,
  },
  typingText: {
    marginLeft: 10,
    color: COLORS.textMuted,
    fontStyle: "italic",
    marginTop: 5,
  },

  // Input Area
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 0,
    color: COLORS.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: {
    fontSize: 20,
    color: "#fff",
    marginLeft: 2,
    marginTop: -2,
  },
});
