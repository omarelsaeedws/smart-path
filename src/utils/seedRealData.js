import { addCategory } from "../services/categoryService";
import { addRoadmap, addWeek, addLesson } from "../services/roadmapService";
import { addResource } from "../services/resourceService";
import { addApplication } from "../services/applicationService";

export const seedDatabase = async () => {
  if (!window.confirm("Are you sure you want to seed the database with experimental realistic data?")) return;
  console.log("Starting seed process...");

  try {
    // 1. Categories
    const categoriesData = [
      { name: "برمجة وتطوير (Programming)" },
      { name: "تصميم (UI/UX Design)" },
      { name: "تسويق (Digital Marketing)" },
      { name: "أعمال (Business & Entrepreneurship)" },
      { name: "ذكاء اصطناعي (Artificial Intelligence)" }
    ];

    const categoryIds = {};
    for (const cat of categoriesData) {
      // addCategory expects an object with { name: string }
      const docId = await addCategory(cat);
      if (docId) categoryIds[cat.name] = docId;
    }
    console.log("✅ Added Categories", categoryIds);

    // 2. Roadmaps (Learning Paths)
    const roadmapsData = [
      {
        title: "تطوير واجهات المستخدم الشامل (Frontend Track)",
        description: "مسار متكامل لتعلم تطوير واجهات المستخدم باستخدام مفاهيم متقدمة و React بالإضافة إلى إدارة الحالة المتقدمة.",
        categoryId: categoryIds["برمجة وتطوير (Programming)"] || "",
        level: "متوسط",
        totalWeeks: 8,
        instructorName: "أحمد علي",
        contentSource: "YouTube",
        sourceLink: "https://youtube.com",
        averageRating: 0,
        ratingCount: 0
      },
      {
        title: "التصميم وتجربة المستخدم (UI/UX Masterclass)",
        description: "تعلم أساسيات التصميم وإنشاء واجهات مميزة باستخدام Figma وكيفية دراسة سيكولوجية المستخدم.",
        categoryId: categoryIds["تصميم (UI/UX Design)"] || "",
        level: "مبتدئ",
        totalWeeks: 4,
        instructorName: "سارة خالد",
        contentSource: "Coursera",
        sourceLink: "https://coursera.org",
        averageRating: 0,
        ratingCount: 0
      },
      {
        title: "هندسة النماذج اللغوية (Prompt Engineering)",
        description: "احترف كتابة الأوامر للنماذج اللغوية الكبيرة مثل ChatGPT وتعلم كيفية أتمتة المهام الذكية.",
        categoryId: categoryIds["ذكاء اصطناعي (Artificial Intelligence)"] || "",
        level: "متقدم",
        totalWeeks: 3,
        instructorName: "محمود سامي",
        contentSource: "Udemy",
        sourceLink: "https://udemy.com",
        averageRating: 0,
        ratingCount: 0
      }
    ];

    const frontendRoadmapRef = await addRoadmap(roadmapsData[0]);
    const frontendId = frontendRoadmapRef.id;

    // Frontend - Week 1: HTML & Basics
    const feW1Ref = await addWeek(frontendId, { weekNumber: 1, weekGoal: "إتقان أساسيات الويب و HTML5 وبناء هيكل المواقع" });
    const feW1Id = feW1Ref.id;
    await addLesson(frontendId, feW1Id, { order: 1, title: "مقدمة عامة عن الإنترنت وكيف يعمل الويب", description: "شرح بروتوكولات HTTP وكيفية تواصل المتصفح مع الخادم.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });
    await addLesson(frontendId, feW1Id, { order: 2, title: "الوسوم الدلالية في HTML5", description: "استخدام Semantic Tags لبناء صفحات صديقة لمحركات البحث.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 3 });
    await addLesson(frontendId, feW1Id, { order: 3, title: "النماذج (Forms) وإرسال البيانات", description: "كيفية جمع بيانات المستخدم عبر النماذج التفاعلية وربطها بالواجهة.", source: "مقال", resourceLink: "https://developer.mozilla.org", estimatedHours: 1 });

    // Frontend - Week 2: CSS Mastery
    const feW2Ref = await addWeek(frontendId, { weekNumber: 2, weekGoal: "تنسيق الصفحات بمهارة عالية باستخدام CSS و Flexbox/Grid" });
    const feW2Id = feW2Ref.id;
    await addLesson(frontendId, feW2Id, { order: 1, title: "أساسيات وتناغم الألوان في CSS", description: "الألوان، الخطوط، والمسافات (Box Model).", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });
    await addLesson(frontendId, feW2Id, { order: 2, title: "التحكم بالتموضع: Flexbox vs Grid", description: "تدريب عملي على تخطيط وتنسيق واجهات معقدة ومرنة.", source: "Course", resourceLink: "https://coursera.org", estimatedHours: 4 });
    await addLesson(frontendId, feW2Id, { order: 3, title: "التصميم المتجاوب (Responsive Design)", description: "جعل موقعك متوافقاً مع الهواتف الذكية والشاشات الكبيرة.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });

    // Frontend - Week 3: JavaScript Core
    const feW3Ref = await addWeek(frontendId, { weekNumber: 3, weekGoal: "تحريك واجهات الويب بإضافة التفاعلية من خلال جافاسكريبت" });
    const feW3Id = feW3Ref.id;
    await addLesson(frontendId, feW3Id, { order: 1, title: "المتغيرات، وأنواع البيانات الأساسية", description: "تعلم أساسيات لغة البرمجة الأهم في الويب وتطبيقها.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });
    await addLesson(frontendId, feW3Id, { order: 2, title: "التحكم في نموذج كائنات المستند (DOM)", description: "كيفية التحكم في نصوص وعناصر صفحة الويب وتغييرها تفاعلياً.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 4 });

    // Frontend - Week 4: React Basics
    const feW4Ref = await addWeek(frontendId, { weekNumber: 4, weekGoal: "تأسيس بنية تطبيقات الويب الحديثة باستخدام مكتبة React" });
    const feW4Id = feW4Ref.id;
    await addLesson(frontendId, feW4Id, { order: 1, title: "أساسيات المكونات (Components) والخصائص (Props)", description: "كيفية بناء واجهة قابلة لإعادة الاستخدام.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });
    await addLesson(frontendId, feW4Id, { order: 2, title: "إدارة الحالة الأساسية (State)", description: "التفاعل مع المستخدم باستخدام useState.", source: "Coursera", resourceLink: "https://coursera.org", estimatedHours: 4 });

    // Frontend - Week 5: Advanced React
    const feW5Ref = await addWeek(frontendId, { weekNumber: 5, weekGoal: "احتراف إدارة الحالة المتقدمة والتوجيه داخل التطبيق" });
    const feW5Id = feW5Ref.id;
    await addLesson(frontendId, feW5Id, { order: 1, title: "التأثيرات الجانبية (useEffect)", description: "جلب البيانات من الخوادم ومزامنتها مع المكونات.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 4 });
    await addLesson(frontendId, feW5Id, { order: 2, title: "التوجيه (React Router)", description: "انشاء تطبيقات ذات صفحات متعددة دون إعادة تحميل الصفحة.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 2 });


    // UX/UI Path additions
    const uiuxRoadmapRef = await addRoadmap(roadmapsData[1]);
    const uiuxId = uiuxRoadmapRef.id;

    // UI/UX - Week 1: Figma & Wireframing
    const uxW1Ref = await addWeek(uiuxId, { weekNumber: 1, weekGoal: "التأسيس في أداة فيجما ورسم الواجهات الهيكلية (Wireframes)" });
    const uxW1Id = uxW1Ref.id;
    await addLesson(uiuxId, uxW1Id, { order: 1, title: "شرح شامل لواجهة فيجما (Figma)", description: "التعرف على مساحات العمل والموارد والمكتبات في فيجما.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });
    await addLesson(uiuxId, uxW1Id, { order: 2, title: "أساسيات تخطيط الشاشات (Wireframing)", description: "تحويل الأفكار إلى مخططات بسيطة مبدئية بدون ألوان.", source: "Coursera", resourceLink: "https://coursera.org", estimatedHours: 3 });

    // UI/UX - Week 2: User Research
    const uxW2Ref = await addWeek(uiuxId, { weekNumber: 2, weekGoal: "دراسة سلوك المستخدم وبناء شخصيات المستخدمين (Personas)" });
    const uxW2Id = uxW2Ref.id;
    await addLesson(uiuxId, uxW2Id, { order: 1, title: "كيفية إجراء مقابلات المستخدمين الناجحة", description: "جمع البيانات النوعية وتحليلها.", source: "مقال", resourceLink: "https://nngroup.com", estimatedHours: 2 });
    await addLesson(uiuxId, uxW2Id, { order: 2, title: "بناء مسار المستخدم (User Journey)", description: "كيفية رسم الخطوات التي يتخذها المستخدم لإتمام مهمة.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });

    // UI/UX - Week 3: Visual Design
    const uxW3Ref = await addWeek(uiuxId, { weekNumber: 3, weekGoal: "مبادئ التصميم المرئي وبناء أنظمة التصميم (Design Systems)" });
    const uxW3Id = uxW3Ref.id;
    await addLesson(uiuxId, uxW3Id, { order: 1, title: "اختيار الخطوط، الألوان ونظرية التباين", description: "كيف تبني هوية بصرية مريحة للعين.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 4 });
    await addLesson(uiuxId, uxW3Id, { order: 2, title: "المسافات البيضاء والتحكم في الشبكة (Grid System)", description: "تطبيق التوازن والمحاذاة في تصميم الواجهات.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });

    // UI/UX - Week 4: Prototyping
    const uxW4Ref = await addWeek(uiuxId, { weekNumber: 4, weekGoal: "التصميم التفاعلي وصنع النماذج الأولية (Prototyping)" });
    const uxW4Id = uxW4Ref.id;
    await addLesson(uiuxId, uxW4Id, { order: 1, title: "تطوير النماذج التفاعلية في فيجما", description: "إنشاء روابط وتفاعلات تحاكي حركة التطبيق الفعلية.", source: "Coursera", resourceLink: "https://coursera.org", estimatedHours: 3 });
    await addLesson(uiuxId, uxW4Id, { order: 2, title: "التأثيرات الحركية (Micro-interactions)", description: "إضافة لمسات سحرية بالتوجيهات والحركات الدقيقة.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });

    // UI/UX - Week 5: Testing & Handoff
    const uxW5Ref = await addWeek(uiuxId, { weekNumber: 5, weekGoal: "اختبار سهولة الاستخدام وتسليم المشروع للمطورين" });
    const uxW5Id = uxW5Ref.id;
    await addLesson(uiuxId, uxW5Id, { order: 1, title: "أساليب اختبار قابلية الاستخدام (Usability Testing)", description: "كيف تراقب مستخدماً وهو يجرب نموذجك وتستخرج المشاكل.", source: "مقال", resourceLink: "https://nngroup.com", estimatedHours: 3 });
    await addLesson(uiuxId, uxW5Id, { order: 2, title: "تسليم التصميم للمبرمجين (Developer Handoff)", description: "كيفية ترتيب الطبقات وتجهيز الأصول لمرحلة التطوير المريحة.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 2 });


    // AI Path additions
    const aiRoadmapRef = await addRoadmap(roadmapsData[2]);
    const aiId = aiRoadmapRef.id;

    // AI - Week 1: Foundational Theory
    const aiW1Ref = await addWeek(aiId, { weekNumber: 1, weekGoal: "فهم بنية النماذج اللغوية (LLMs) وصياغة أول أوامر برمجية (Prompts)" });
    const aiW1Id = aiW1Ref.id;
    await addLesson(aiId, aiW1Id, { order: 1, title: "مقدمة في الذكاء الاصطناعي التوليدي", description: "شرح نظري لأساسيات التعلم العميق وكيف يعمل ChatGPT.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });
    await addLesson(aiId, aiW1Id, { order: 2, title: "هندسة الأوامر الأساسية 101", description: "كيف تصيغ أوامراً محددة للحصول على أفضل إجابة من الذكاء الاصطناعي.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 3 });

    // AI - Week 2: Advanced Prompting
    const aiW2Ref = await addWeek(aiId, { weekNumber: 2, weekGoal: "تقنيات متقدمة في كتابة الأوامر كـ Few-Shot و Chain-of-Thought" });
    const aiW2Id = aiW2Ref.id;
    await addLesson(aiId, aiW2Id, { order: 1, title: "استراتيجية (Zero-Shot & Few-Shot)", description: "كيف تبرمج النموذج بإعطائه أمثلة قبل التنفيذ.", source: "مقال", resourceLink: "https://promptingguide.ai", estimatedHours: 2 });
    await addLesson(aiId, aiW2Id, { order: 2, title: "تقنية سلسلة الأفكار (Chain-of-Thought)", description: "دفع النموذج لتحليل المشاكل المعقدة خطوة بخطوة لمنع ההלוوسة.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });

    // AI - Week 3: Content & Marketing Automation
    const aiW3Ref = await addWeek(aiId, { weekNumber: 3, weekGoal: "تسخير الذكاء الاصطناعي لأتمتة إنشاء المحتوى وحملات التسويق" });
    const aiW3Id = aiW3Ref.id;
    await addLesson(aiId, aiW3Id, { order: 1, title: "كتابة نصوص البيع و الإعلانات المستهدفة", description: "استخدام النماذج للوصول لنبرة العلامة التجارية المطلوبة.", source: "Coursera", resourceLink: "https://coursera.org", estimatedHours: 3 });
    await addLesson(aiId, aiW3Id, { order: 2, title: "توليد الصور الإبداعية بواسطة Midjourney", description: "كيف تكتب Prompt مثالي لتصميم الصور.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 2 });

    // AI - Week 4: App Integration via API
    const aiW4Ref = await addWeek(aiId, { weekNumber: 4, weekGoal: "المستوى المتقدم المبرمج: ربط ChatGPT بتطبيقاتك الخاصة عن طريق الـ API" });
    const aiW4Id = aiW4Ref.id;
    await addLesson(aiId, aiW4Id, { order: 1, title: "التعرف على OpenAI API", description: "كيفية انشاء مفاتيح وبناء أول طلب برمجي وتلقي الردود عبر Node.js.", source: "Udemy", resourceLink: "https://udemy.com", estimatedHours: 5 });
    await addLesson(aiId, aiW4Id, { order: 2, title: "استخدام نموذج الأسعار و إدارة التوكنز", description: "كيف تحسب التكاليف وتحد من إسراف استهلاك الذكاء الاصطناعي.", source: "مقال", resourceLink: "https://openai.com", estimatedHours: 1 });

    // AI - Week 5: Specialized AI Agents
    const aiW5Ref = await addWeek(aiId, { weekNumber: 5, weekGoal: "بناء وكلاء الذكاء الاصطناعي المتخصصين (AI Agents & RAG)" });
    const aiW5Id = aiW5Ref.id;
    await addLesson(aiId, aiW5Id, { order: 1, title: "تعريف الـ AI Agents ومدلولها التنفيذي", description: "تفويض مهام بحثية وعملية لعملاء برمجيين.", source: "YouTube", resourceLink: "https://youtube.com", estimatedHours: 3 });
    await addLesson(aiId, aiW5Id, { order: 2, title: "أساسيات نظام الاسترجاع المولد (RAG)", description: "كيف تدخل ملفاتك وبيانات شركتك الخاصة داخل سياق المحادثة بشكل آمن.", source: "Course", resourceLink: "https://coursera.org", estimatedHours: 4 });

    console.log("✅ Added Full Roadmaps, Weeks, and Lessons!");

    // 3. Tools (Resources)
    const toolsData = [
      {
        name: "React Developer Tools",
        description: "إضافة متصفح مفيدة جداً لفحص أداء وتكوين تطبيقات React واكتشاف الأخطاء.",
        categoryId: categoryIds["برمجة وتطوير (Programming)"] || "",
        category: "برمجة وتطوير (Programming)", // backward compat
        link: "https://chrome.google.com/webstore"
      },
      {
        name: "Figma",
        description: "أداة السحابة الرائدة في تصميم واجهات وتجارب المستخدم التي تدعم التعديل التعاوني.",
        categoryId: categoryIds["تصميم (UI/UX Design)"] || "",
        category: "تصميم (UI/UX Design)",
        link: "https://figma.com"
      },
      {
        name: "Google Analytics 4",
        description: "أهم أداة مجانية للتحكم وفهم وتحليل زيارات وأداء موقعك الإلكتروني لزيادة المبيعات.",
        categoryId: categoryIds["تسويق (Digital Marketing)"] || "",
        category: "تسويق (Digital Marketing)",
        link: "https://analytics.google.com"
      },
      {
        name: "Hugging Face",
        description: "مكتبة ومجتمع مفتوح المصدر لنماذج الذكاء الاصطناعي الجاهزة.",
        categoryId: categoryIds["ذكاء اصطناعي (Artificial Intelligence)"] || "",
        category: "ذكاء اصطناعي (Artificial Intelligence)",
        link: "https://huggingface.co"
      }
    ];

    for (const tool of toolsData) {
      await addResource(tool);
    }
    console.log("✅ Added Tools");

    // 4. Applications (Projects)
    const appsData = [
      {
        title: "تطبيق مهام ديناميكي (React To-Do)",
        description: "تطبيق حديث لإدارة المهام باستخدام React و Firebase لتعلم إدارة الحالة وقواعد البيانات.",
        categoryId: categoryIds["برمجة وتطوير (Programming)"] || "",
        level: "Beginner",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3"
      },
      {
        title: "تصميم واجهة متجر إلكتروني مكثف",
        description: "مشروع تطبيقي يشمل تصميم شاشات الدفع، وإضافة السلة، والتسوق لمتجر ملابس.",
        categoryId: categoryIds["تصميم (UI/UX Design)"] || "",
        level: "Intermediate",
        link: "https://dribbble.com",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2928&ixlib=rb-4.0.3"
      },
      {
        title: "بوت رد آلي ذكي (AI Chatbot)",
        description: "مشروع لبرمجة روبوت محادثة يعتمد على OpenAI API للإجابة على استفسارات المستخدمين.",
        categoryId: categoryIds["ذكاء اصطناعي (Artificial Intelligence)"] || "",
        level: "Advanced",
        link: "https://github.com",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2000&ixlib=rb-4.0.3"
      }
    ];

    for (const app of appsData) {
      await addApplication(app);
    }
    console.log("✅ Added Applications");

    alert("تم الانتهاء من إضافة البيانات التجريبية بنجاح! 🎉");
  } catch (error) {
    console.error("Error seeding DB:", error);
    alert("حدث خطأ أثناء إضافة البيانات. تفقد الـ Console.");
  }
};
