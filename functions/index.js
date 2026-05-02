const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

setGlobalOptions({
  region: "us-central1",
  timeoutSeconds: 120,
  memory: "1GiB",
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ============================================================
// FUNCTION: generateQuiz — AI used ONLY here
// ============================================================
const STATIC_FALLBACK_QUIZ = {
  questions: [
    {
      question: "ما هو المفهوم الأساسي الذي تتعلمه في هذا الدرس؟",
      options: ["تعلم المفهوم الرئيسي", "تجاهل المحتوى", "البدء من الصفر", "لا شيء من ذلك"],
      correctAnswer: "تعلم المفهوم الرئيسي"
    },
    {
      question: "ما هي أفضل طريقة لإتقان مهارة جديدة؟",
      options: ["التطبيق العملي المستمر", "القراءة فقط", "المشاهدة بدون تطبيق", "الحفظ الأعمى"],
      correctAnswer: "التطبيق العملي المستمر"
    },
    {
      question: "ما الذي يساعدك على فهم المفاهيم التقنية بشكل أعمق؟",
      options: ["بناء مشاريع حقيقية", "مشاهدة الفيديوهات فقط", "قراءة التعريفات", "تخطي التمارين"],
      correctAnswer: "بناء مشاريع حقيقية"
    },
    {
      question: "ما هي أهمية مراجعة المحتوى بعد كل درس؟",
      options: ["تثبيت المعلومات في الذاكرة", "إضاعة الوقت", "ليس لها أهمية", "تشويش الأفكار"],
      correctAnswer: "تثبيت المعلومات في الذاكرة"
    },
    {
      question: "ما هو الأسلوب الأمثل لحل مشكلة برمجية؟",
      options: ["تقسيم المشكلة إلى أجزاء أصغر", "الاستسلام فوراً", "نسخ الكود دون فهم", "تجاهل المشكلة"],
      correctAnswer: "تقسيم المشكلة إلى أجزاء أصغر"
    }
  ]
};

exports.generateQuiz = onCall(async (request) => {
  const { lessonId, title, description, keywords } = request.data || {};

  if (!lessonId || !title) {
    throw new HttpsError("invalid-argument", "lessonId and title are required");
  }

  // ── Step 1: Check Firestore cache ──────────────────────────
  try {
    const cacheRef = db.collection("quizCache").doc(lessonId);
    const cacheSnap = await cacheRef.get();
    if (cacheSnap.exists) {
      logger.info(`Quiz cache hit for lesson: ${lessonId}`);
      return { success: true, data: cacheSnap.data(), fromCache: true };
    }
  } catch (cacheErr) {
    logger.warn("Cache check failed, proceeding to AI:", cacheErr.message);
  }

  // ── Step 2: Generate via Groq AI ───────────────────────────
  const keywordText = keywords && keywords.length > 0
    ? `Keywords to focus on: ${keywords.join(", ")}.`
    : "";

  const systemPrompt = `You are an educational assessment expert. Generate exactly 5 multiple-choice questions based on the lesson content provided.

STRICT RULES:
- Return ONLY valid JSON. No explanation text before or after.
- Exactly 5 questions.
- Each question must have exactly 4 options.
- correctAnswer must be one of the 4 options (exact match).
- Questions must be directly relevant to the lesson content.
- Write questions in Arabic if the lesson title is in Arabic, otherwise in English.

REQUIRED FORMAT:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A"
    }
  ]
}`;

  const userPrompt = `Lesson Title: ${title}
Description: ${description || "No description provided."}
${keywordText}

Generate 5 MCQ questions for this lesson.`;

  let quizData;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    const rawContent = completion.choices[0].message.content;
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("Invalid quiz structure from AI");
    }

    const safeQuestions = parsed.questions.slice(0, 5).map((q) => ({
      question: String(q.question || ""),
      options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : [],
      correctAnswer: String(q.correctAnswer || q.options?.[0] || "")
    }));

    quizData = safeQuestions.length ? safeQuestions : [];
    logger.info(`Quiz generated for lesson: ${lessonId}`);
  } catch (aiError) {
    logger.error("AI quiz generation failed, using fallback:", aiError.message);
    quizData = [
      {
        question: "ما هو HTML؟",
        options: ["لغة برمجة", "لغة ترميز", "قاعدة بيانات", "نظام تشغيل"],
        correctAnswer: "لغة ترميز"
      }
    ];
    
  }

  // ── Step 3: Cache in Firestore ─────────────────────────────
  try {
    await db.collection("quizCache").doc(lessonId).set({
      questions: quizData,
      lessonTitle: title,
      generatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`Quiz cached for lesson: ${lessonId}`);
  } catch (saveErr) {
    console.error("Firestore save failed:", saveErr);
  }

  return { 
    success: true, 
    data: {
      questions: quizData || []
    } 
  };
});