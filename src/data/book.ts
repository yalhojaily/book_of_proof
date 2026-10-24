// Structure of "Book of Proof" (3rd edition, Richard Hammack).
// Page numbers refer to the printed page numbers in the book.

export interface Section {
  id: string; // e.g. "1.1"
  slug: string; // e.g. "1-1"
  ar: string;
  en: string;
  page: number;
}

export interface Chapter {
  num: number;
  slug: string;
  ar: string;
  en: string;
  page: number;
  blurb: string;
  available: boolean;
  sections: Section[];
}

export interface Part {
  num: number;
  roman: string;
  ar: string;
  en: string;
  blurb: string;
  hue: 'blue' | 'green' | 'amber' | 'violet';
  chapters: Chapter[];
}

const s = (id: string, ar: string, en: string, page: number): Section => ({
  id,
  slug: id.replace('.', '-'),
  ar,
  en,
  page,
});

export const parts: Part[] = [
  {
    num: 1,
    roman: 'I',
    ar: 'الأساسيات',
    en: 'Fundamentals',
    blurb: 'اللغة التي تُكتب بها الرياضيات: المجموعات والمنطق والعدّ.',
    hue: 'blue',
    chapters: [
      {
        num: 1,
        slug: 'sets',
        ar: 'المجموعات',
        en: 'Sets',
        page: 3,
        blurb: 'العناصر والانتماء، الضرب الديكارتي، المجموعات الجزئية ومجموعة القوى، والعمليات على المجموعات.',
        available: true,
        sections: [
          s('1.1', 'مدخل إلى المجموعات', 'Introduction to Sets', 3),
          s('1.2', 'الضرب الديكارتي', 'The Cartesian Product', 8),
          s('1.3', 'المجموعات الجزئية', 'Subsets', 12),
          s('1.4', 'مجموعة القوى', 'Power Sets', 15),
          s('1.5', 'الاتحاد والتقاطع والفرق', 'Union, Intersection, Difference', 18),
          s('1.6', 'المتممة', 'Complement', 20),
          s('1.7', 'مخططات فِن', 'Venn Diagrams', 22),
          s('1.8', 'المجموعات المفهرسة', 'Indexed Sets', 25),
          s('1.9', 'المجموعات بوصفها أنظمة أعداد', 'Sets That Are Number Systems', 30),
          s('1.10', 'مفارقة راسل', "Russell's Paradox", 32),
        ],
      },
      {
        num: 2,
        slug: 'logic',
        ar: 'المنطق',
        en: 'Logic',
        page: 34,
        blurb: 'القضايا، أدوات الربط، الشرطيات، جداول الصدق، المكمِّمات والنفي.',
        available: true,
        sections: [
          s('2.1', 'القضايا', 'Statements', 35),
          s('2.2', 'و، أو، ليس', 'And, Or, Not', 39),
          s('2.3', 'العبارات الشرطية', 'Conditional Statements', 42),
          s('2.4', 'العبارات ثنائية الشرط', 'Biconditional Statements', 46),
          s('2.5', 'جداول الصدق', 'Truth Tables for Statements', 48),
          s('2.6', 'التكافؤ المنطقي', 'Logical Equivalence', 50),
          s('2.7', 'المكمِّمات', 'Quantifiers', 53),
          s('2.8', 'المزيد عن العبارات الشرطية', 'More on Conditional Statements', 56),
          s('2.9', 'ترجمة اللغة إلى منطق رمزي', 'Translating English to Symbolic Logic', 57),
          s('2.10', 'نفي العبارات', 'Negating Statements', 59),
          s('2.11', 'الاستدلال المنطقي', 'Logical Inference', 63),
          s('2.12', 'ملاحظة مهمة', 'An Important Note', 64),
        ],
      },
      {
        num: 3,
        slug: 'counting',
        ar: 'العدّ',
        en: 'Counting',
        page: 65,
        blurb: 'مبادئ الضرب والجمع، التباديل والتوافيق، مثلث باسكال، والبرهان التوافقي.',
        available: false,
        sections: [
          s('3.1', 'القوائم', 'Lists', 65),
          s('3.2', 'مبدأ الضرب', 'The Multiplication Principle', 67),
          s('3.3', 'مبدآ الجمع والطرح', 'The Addition and Subtraction Principles', 74),
          s('3.4', 'المضروب والتباديل', 'Factorials and Permutations', 78),
          s('3.5', 'عدّ المجموعات الجزئية', 'Counting Subsets', 85),
          s('3.6', 'مثلث باسكال ونظرية ذات الحدين', "Pascal's Triangle and the Binomial Theorem", 90),
          s('3.7', 'مبدأ التضمين والاستبعاد', 'The Inclusion-Exclusion Principle', 93),
          s('3.8', 'عدّ المجموعات المتعددة', 'Counting Multisets', 96),
          s('3.9', 'مبدآ القسمة وأعشاش الحمام', 'The Division and Pigeonhole Principles', 104),
          s('3.10', 'البرهان التوافقي', 'Combinatorial Proof', 108),
        ],
      },
    ],
  },
  {
    num: 2,
    roman: 'II',
    ar: 'كيف تبرهن العبارات الشرطية',
    en: 'How to Prove Conditional Statements',
    blurb: 'الطرق الثلاث الكبرى للبرهان: المباشر، والعكس النقيض، والتناقض.',
    hue: 'green',
    chapters: [
      {
        num: 4,
        slug: 'direct-proof',
        ar: 'البرهان المباشر',
        en: 'Direct Proof',
        page: 113,
        blurb: 'النظريات والتعريفات، وكيف تنتقل من الفرضية إلى النتيجة خطوة بخطوة.',
        available: false,
        sections: [
          s('4.1', 'النظريات', 'Theorems', 113),
          s('4.2', 'التعريفات', 'Definitions', 115),
          s('4.3', 'البرهان المباشر', 'Direct Proof', 118),
          s('4.4', 'استخدام الحالات', 'Using Cases', 124),
          s('4.5', 'معالجة الحالات المتشابهة', 'Treating Similar Cases', 125),
        ],
      },
      {
        num: 5,
        slug: 'contrapositive-proof',
        ar: 'برهان العكس النقيض',
        en: 'Contrapositive Proof',
        page: 128,
        blurb: 'حين يكون إثبات «إذا لم يكن Q فليس P» أسهل، والتطابق بين الأعداد.',
        available: false,
        sections: [
          s('5.1', 'برهان العكس النقيض', 'Contrapositive Proof', 128),
          s('5.2', 'التطابق في الأعداد الصحيحة', 'Congruence of Integers', 131),
          s('5.3', 'الكتابة الرياضية', 'Mathematical Writing', 133),
        ],
      },
      {
        num: 6,
        slug: 'proof-by-contradiction',
        ar: 'البرهان بالتناقض',
        en: 'Proof by Contradiction',
        page: 137,
        blurb: 'افترض عكس ما تريد، ثم اتبع النتائج حتى تصطدم بالمستحيل.',
        available: false,
        sections: [
          s('6.1', 'برهان العبارات بالتناقض', 'Proving Statements with Contradiction', 138),
          s('6.2', 'برهان الشرطيات بالتناقض', 'Proving Conditional Statements by Contradiction', 141),
          s('6.3', 'الجمع بين الطرق', 'Combining Techniques', 142),
          s('6.4', 'نصائح', 'Some Words of Advice', 143),
        ],
      },
    ],
  },
  {
    num: 3,
    roman: 'III',
    ar: 'المزيد عن البرهان',
    en: 'More on Proof',
    blurb: 'إذا وفقط إذا، الوجود والوحدانية، البراهين على المجموعات، الدحض، والاستقراء.',
    hue: 'amber',
    chapters: [
      {
        num: 7,
        slug: 'non-conditional',
        ar: 'برهان العبارات غير الشرطية',
        en: 'Proving Non-Conditional Statements',
        page: 147,
        blurb: 'براهين «إذا وفقط إذا»، والعبارات المتكافئة، وبراهين الوجود والوحدانية.',
        available: false,
        sections: [
          s('7.1', 'برهان «إذا وفقط إذا»', 'If-and-Only-If Proof', 147),
          s('7.2', 'العبارات المتكافئة', 'Equivalent Statements', 149),
          s('7.3', 'براهين الوجود والوحدانية', 'Existence Proofs; Existence and Uniqueness Proofs', 150),
          s('7.4', 'البراهين البنائية وغير البنائية', 'Constructive Versus Non-Constructive Proofs', 154),
        ],
      },
      {
        num: 8,
        slug: 'proofs-involving-sets',
        ar: 'براهين المجموعات',
        en: 'Proofs Involving Sets',
        page: 157,
        blurb: 'كيف تبرهن $a \\in A$، و$A \\subseteq B$، و$A = B$.',
        available: false,
        sections: [
          s('8.1', 'كيف تبرهن $a \\in A$', 'How to Prove a ∈ A', 157),
          s('8.2', 'كيف تبرهن $A \\subseteq B$', 'How to Prove A ⊆ B', 159),
          s('8.3', 'كيف تبرهن $A = B$', 'How to Prove A = B', 162),
          s('8.4', 'أمثلة: الأعداد التامة', 'Examples: Perfect Numbers', 165),
        ],
      },
      {
        num: 9,
        slug: 'disproof',
        ar: 'الدحض',
        en: 'Disproof',
        page: 172,
        blurb: 'المثال المضاد، ودحض عبارات الوجود، والدحض بالتناقض.',
        available: false,
        sections: [
          s('9.1', 'الأمثلة المضادة', 'Counterexamples', 174),
          s('9.2', 'دحض عبارات الوجود', 'Disproving Existence Statements', 176),
          s('9.3', 'الدحض بالتناقض', 'Disproof by Contradiction', 178),
        ],
      },
      {
        num: 10,
        slug: 'induction',
        ar: 'الاستقراء الرياضي',
        en: 'Mathematical Induction',
        page: 180,
        blurb: 'الاستقراء والاستقراء القوي، وأصغر مثال مضاد، والنظرية الأساسية في الحساب.',
        available: false,
        sections: [
          s('10.1', 'البرهان بالاستقراء', 'Proof by Induction', 182),
          s('10.2', 'البرهان بالاستقراء القوي', 'Proof by Strong Induction', 187),
          s('10.3', 'البرهان بأصغر مثال مضاد', 'Proof by Smallest Counterexample', 191),
          s('10.4', 'النظرية الأساسية في الحساب', 'The Fundamental Theorem of Arithmetic', 192),
          s('10.5', 'أعداد فيبوناتشي', 'Fibonacci Numbers', 193),
        ],
      },
    ],
  },
  {
    num: 4,
    roman: 'IV',
    ar: 'العلاقات والدوال والعدد الأصلي',
    en: 'Relations, Functions and Cardinality',
    blurb: 'علاقات التكافؤ، الدوال وأنواعها، براهين التفاضل، وأحجام اللانهاية.',
    hue: 'violet',
    chapters: [
      {
        num: 11,
        slug: 'relations',
        ar: 'العلاقات',
        en: 'Relations',
        page: 201,
        blurb: 'خصائص العلاقات، علاقات التكافؤ وفصولها، والأعداد الصحيحة بمقياس n.',
        available: false,
        sections: [
          s('11.1', 'العلاقات', 'Relations', 201),
          s('11.2', 'خصائص العلاقات', 'Properties of Relations', 205),
          s('11.3', 'علاقات التكافؤ', 'Equivalence Relations', 210),
          s('11.4', 'فصول التكافؤ والتجزئات', 'Equivalence Classes and Partitions', 215),
          s('11.5', 'الأعداد الصحيحة بمقياس n', 'The Integers Modulo n', 218),
          s('11.6', 'العلاقات بين المجموعات', 'Relations Between Sets', 221),
        ],
      },
      {
        num: 12,
        slug: 'functions',
        ar: 'الدوال',
        en: 'Functions',
        page: 223,
        blurb: 'الدوال المتباينة والغامرة، التركيب، الدوال العكسية، الصورة والصورة العكسية.',
        available: false,
        sections: [
          s('12.1', 'الدوال', 'Functions', 223),
          s('12.2', 'الدوال المتباينة والغامرة', 'Injective and Surjective Functions', 228),
          s('12.3', 'مبدأ أعشاش الحمام مجدداً', 'The Pigeonhole Principle Revisited', 233),
          s('12.4', 'التركيب', 'Composition', 235),
          s('12.5', 'الدوال العكسية', 'Inverse Functions', 238),
          s('12.6', 'الصورة والصورة العكسية', 'Image and Preimage', 242),
        ],
      },
      {
        num: 13,
        slug: 'calculus',
        ar: 'براهين في التفاضل والتكامل',
        en: 'Proofs in Calculus',
        page: 244,
        blurb: 'متباينة المثلث، تعريف النهاية بـ $\\varepsilon$ و$\\delta$، الاتصال، المتتاليات والمتسلسلات.',
        available: false,
        sections: [
          s('13.1', 'متباينة المثلث', 'The Triangle Inequality', 245),
          s('13.2', 'تعريف النهاية', 'Definition of a Limit', 246),
          s('13.3', 'نهايات غير موجودة', 'Limits That Do Not Exist', 249),
          s('13.4', 'قوانين النهايات', 'Limit Laws', 251),
          s('13.5', 'الاتصال والمشتقات', 'Continuity and Derivatives', 256),
          s('13.6', 'النهايات عند اللانهاية', 'Limits at Infinity', 258),
          s('13.7', 'المتتاليات', 'Sequences', 261),
          s('13.8', 'المتسلسلات', 'Series', 265),
        ],
      },
      {
        num: 14,
        slug: 'cardinality',
        ar: 'العدد الأصلي للمجموعات',
        en: 'Cardinality of Sets',
        page: 269,
        blurb: 'متى تتساوى مجموعتان في الحجم؟ القابل للعدّ وغير القابل، ونظرية كانتور–برنشتاين.',
        available: false,
        sections: [
          s('14.1', 'مجموعات متساوية في العدد الأصلي', 'Sets with Equal Cardinalities', 269),
          s('14.2', 'المجموعات القابلة وغير القابلة للعدّ', 'Countable and Uncountable Sets', 275),
          s('14.3', 'مقارنة الأعداد الأصلية', 'Comparing Cardinalities', 280),
          s('14.4', 'نظرية كانتور–برنشتاين–شرودر', 'The Cantor-Bernstein-Schröder Theorem', 284),
        ],
      },
    ],
  },
];

export const allChapters = parts.flatMap((p) => p.chapters.map((c) => ({ ...c, part: p })));

export function findChapter(slug: string) {
  return allChapters.find((c) => c.slug === slug);
}

/** Strip $...$ math markers for plain-text contexts such as <title>. */
export const plain = (s: string) => s.replace(/\$([^$]+)\$/g, (_, m) => m.replace(/\\(in|subseteq)/g, (_x: string, c: string) => (c === 'in' ? '∈' : '⊆')).replace(/\\(varepsilon|delta)/g, (_x: string, c: string) => (c === 'delta' ? 'δ' : 'ε')));
