const admin = require('firebase-admin');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

admin.initializeApp({
  projectId: "smart-path-b8649"
});

const db = admin.firestore();

async function seed() {
  console.log("Starting seed process...");

  // 1. Categories
  const categoriesData = [
    { name: "برمجة وتطوير (Programming)" },
    { name: "تصميم (UI/UX Design)" },
    { name: "تسويق (Digital Marketing)" },
    { name: "أعمال (Business & Entrepreneurship)" },
    { name: "لغات (Languages & Translation)" }
  ];

  const categoryIds = {};
  for (const cat of categoriesData) {
    const docRef = await db.collection('categories').add({
      name: cat.name,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    categoryIds[cat.name] = docRef.id;
  }
  console.log("✅ Added Categories");

  // 2. Roadmaps (Learning Paths)
  const roadmapsData = [
    {
      title: "تطوير واجهات المستخدم الشامل (Frontend Track)",
      description: "مسار متكامل لتعلم تطوير واجهات المستخدم باستخدام مفاهيم متقدمة و React بالإضافة إلى إدارة الحالة المتقدمة.",
      categoryId: categoryIds["برمجة وتطوير (Programming)"],
      level: "متوسط",
      totalWeeks: 8,
      instructorName: "أحمد علي",
      contentSource: "YouTube",
      sourceLink: "https://www.youtube.com/watch?v=ihRRf3EjTV8&list=PLYyqC4bNbCIdSZ-JayMLl4WO2Cr995vyS",
      averageRating: 0,
      ratingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "التصميم وتجربة المستخدم (UI/UX Masterclass)",
      description: "تعلم أساسيات التصميم وإنشاء واجهات مميزة باستخدام Figma وكيفية دراسة سيكولوجية المستخدم.",
      categoryId: categoryIds["تصميم (UI/UX Design)"],
      level: "مبتدئ",
      totalWeeks: 4,
      instructorName: "سارة خالد",
      contentSource: "Coursera",
      sourceLink: "https://coursera.org",
      averageRating: 0,
      ratingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "أساسيات التسويق الرقمي الحديث",
      description: "ابنِ أسس التسويق الحديث عبر منصات التواصل وصياغة المحتوى الجذاب لبناء علامات تجارية ناجحة.",
      categoryId: categoryIds["تسويق (Digital Marketing)"],
      level: "مبتدئ",
      totalWeeks: 6,
      instructorName: "محمد عمر",
      contentSource: "Udemy",
      sourceLink: "https://udemy.com",
      averageRating: 0,
      ratingCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  const roadmapIds = {};
  for (const rm of roadmapsData) {
    const docRef = await db.collection('roadmaps').add(rm);
    roadmapIds[rm.title] = docRef.id;
  }
  console.log("✅ Added Roadmaps");

  // Add 1 sample week and 1 sample lesson to the first roadmap
  const firstRoadmapRef = db.collection('roadmaps').doc(roadmapIds["تطوير واجهات المستخدم الشامل (Frontend Track)"]);
  const weekRef = await firstRoadmapRef.collection('weeks').add({
    weekNumber: 1,
    weekGoal: "التعرف على أساسيات الويب وبناء أول صفحة باستخدام HTML و CSS",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  await firstRoadmapRef.collection('weeks').doc(weekRef.id).collection('lessons').add({
    title: "مقدمة شاملة في HTML5",
    description: "شرح كافة وسوم الميتا المهيكلة للنص ودلالاتها في صفحة الويب.",
    source: "YouTube",
    resourceLink: "https://youtube.com",
    estimatedHours: 2,
    order: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log("✅ Added Weeks and Lessons inside Roadmaps");

  // 3. Tools (Resources)
  const toolsData = [
    {
      name: "React Developer Tools",
      description: "إضافة متصفح مفيدة جداً لفحص أداء وتكوين تطبيقات React واكتشاف الأخطاء.",
      categoryId: categoryIds["برمجة وتطوير (Programming)"],
      link: "https://chrome.google.com/webstore",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "Figma",
      description: "أداة السحابة الرائدة في تصميم واجهات وتجارب المستخدم التي تدعم التعديل التعاوني.",
      categoryId: categoryIds["تصميم (UI/UX Design)"],
      link: "https://figma.com",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      name: "Google Analytics 4",
      description: "أهم أداة مجانية للتحكم وفهم وتحليل زيارات وأداء موقعك الإلكتروني لزيادة المبيعات.",
      categoryId: categoryIds["تسويق (Digital Marketing)"],
      link: "https://analytics.google.com",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  for (const tool of toolsData) {
    await db.collection('resources').add(tool);
  }
  console.log("✅ Added Tools");

  // 4. Applications (Projects)
  const appsData = [
    {
      title: "تطبيق مهام ديناميكي (React To-Do)",
      description: "تطبيق حديث لإدارة المهام باستخدام React و Firebase لتعلم إدارة الحالة وقواعد البيانات.",
      categoryId: categoryIds["برمجة وتطوير (Programming)"],
      level: "Beginner",
      link: "https://github.com",
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      title: "تصميم واجهة متجر إلكتروني مكثف",
      description: "مشروع تطبيقي يشمل تصميم شاشات الدفع، وإضافة السلة، والتسوق لمتجر ملابس.",
      categoryId: categoryIds["تصميم (UI/UX Design)"],
      level: "Intermediate",
      link: "https://dribbble.com",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2928&ixlib=rb-4.0.3",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  for (const app of appsData) {
    await db.collection('applications').add(app);
  }
  console.log("✅ Added Applications");

  console.log("Seed finished successfully! 🎉");
}

seed().catch(console.error).finally(() => process.exit(0));
