import type { Question } from '@/components/widgets/QuickCheck';

const r = String.raw;

export const q1_1: Question[] = [
  {
    q: r`كم عنصراً في المجموعة $\{1, \{2, 3\}, 4\}$؟`,
    options: ['2', '3', '4'],
    answer: 1,
    why: r`العناصر هي $1$ و$\{2,3\}$ و$4$. المجموعة $\{2,3\}$ عنصر واحد، كصندوق داخل الصندوق.`,
  },
  {
    q: r`ما قيمة $|\{\varnothing\}|$؟`,
    options: ['0', '1', r`غير معرّفة`],
    answer: 1,
    why: r`$\{\varnothing\}$ صندوق يحتوي صندوقاً فارغاً، فله عنصر واحد. أما $|\varnothing| = 0$.`,
  },
  {
    q: r`هل $\{1, 2, 2, 3\} = \{3, 2, 1\}$؟`,
    options: ['نعم', 'لا'],
    answer: 0,
    why: r`الترتيب والتكرار لا يغيّران المجموعة: كلتاهما تحتوي $1, 2, 3$ بالضبط.`,
  },
  {
    q: r`أي العبارات صحيحة؟`,
    options: [r`$2 \in \{\{2\}\}$`, r`$\{2\} \in \{\{2\}\}$`, r`$2 \in \varnothing$`],
    answer: 1,
    why: r`العنصر الوحيد في $\{\{2\}\}$ هو $\{2\}$، وليس $2$.`,
  },
];

export const q1_2: Question[] = [
  {
    q: r`إذا كانت $|A| = 4$ و$|B| = 0$، فما $|A \times B|$؟`,
    options: ['0', '4', '1'],
    answer: 0,
    why: r`لا يوجد عنصر في $B$ يصلح إحداثياً ثانياً، فلا توجد أزواج: $A \times \varnothing = \varnothing$.`,
  },
  {
    q: r`هل $(1, 2) = (2, 1)$؟`,
    options: ['نعم', 'لا'],
    answer: 1,
    why: r`الزوج المرتب يهتم بالترتيب. أما المجموعتان $\{1,2\}$ و$\{2,1\}$ فمتساويتان.`,
  },
  {
    q: r`أي مما يلي عنصر في $\mathbb{R}^2$؟`,
    options: [r`$(\pi, -1)$`, r`$\{\pi, -1\}$`, r`$(1, 2, 3)$`],
    answer: 0,
    why: r`عناصر $\mathbb{R}^2 = \mathbb{R}\times\mathbb{R}$ أزواج مرتبة من عددين حقيقيين، أي نقاط في المستوى.`,
  },
];

export const q1_3: Question[] = [
  {
    q: r`هل $\varnothing \subseteq \{1, 2\}$؟`,
    options: ['نعم', 'لا'],
    answer: 0,
    why: r`لكي تكون خاطئة نحتاج عنصراً في $\varnothing$ ليس في $\{1,2\}$، ولا يوجد أي عنصر في $\varnothing$.`,
  },
  {
    q: r`أي العبارات صحيحة لـ $A = \{1, \{2\}\}$؟`,
    options: [r`$\{2\} \subseteq A$`, r`$\{\{2\}\} \subseteq A$`, r`$2 \in A$`],
    answer: 1,
    why: r`عنصر $\{\{2\}\}$ الوحيد هو $\{2\}$، وهو في $A$. أما $\{2\} \subseteq A$ فتتطلب $2 \in A$، وهذا خطأ.`,
  },
  {
    q: r`كم مجموعة جزئية لـ $\{a, b, c, d, e\}$؟`,
    options: ['10', '25', '32'],
    answer: 2,
    why: r`$2^5 = 32$: قراران (يدخل أو لا) لكل عنصر من العناصر الخمسة.`,
  },
];

export const q1_4: Question[] = [
  {
    q: r`ما $\mathscr{P}(\varnothing)$؟`,
    options: [r`$\varnothing$`, r`$\{\varnothing\}$`, r`$\{\varnothing, \{\varnothing\}\}$`],
    answer: 1,
    why: r`للمجموعة الخالية مجموعة جزئية واحدة هي نفسها، فـ $\mathscr{P}(\varnothing) = \{\varnothing\}$، وعدد عناصرها $2^0 = 1$.`,
  },
  {
    q: r`إذا كانت $|A| = 3$، فما $|\mathscr{P}(\mathscr{P}(A))|$؟`,
    options: ['64', '256', '512'],
    answer: 1,
    why: r`$|\mathscr{P}(A)| = 2^3 = 8$، ثم $|\mathscr{P}(\mathscr{P}(A))| = 2^8 = 256$.`,
  },
  {
    q: r`لأي مجموعة $A$، أي العبارات صحيحة دائماً؟`,
    options: [r`$A \in \mathscr{P}(A)$`, r`$A \subseteq \mathscr{P}(A)$`, r`$\mathscr{P}(A) \in A$`],
    answer: 0,
    why: r`$A$ مجموعة جزئية من نفسها، وعناصر $\mathscr{P}(A)$ هي المجموعات الجزئية من $A$، إذن $A \in \mathscr{P}(A)$.`,
  },
];

export const q1_5: Question[] = [
  {
    q: r`$A = \{1,2,3\}$ و$B = \{3,4\}$. ما $A - B$؟`,
    options: [r`$\{1,2\}$`, r`$\{4\}$`, r`$\{1,2,4\}$`],
    answer: 0,
    why: r`نحذف من $A$ كل ما ينتمي إلى $B$، أي العنصر $3$.`,
  },
  {
    q: r`متى يكون $A \cap B = A$؟`,
    options: [r`عندما $A \subseteq B$`, r`عندما $B \subseteq A$`, r`عندما $A = \varnothing$ فقط`],
    answer: 0,
    why: r`التقاطع يأخذ من $A$ ما هو في $B$. فإذا كانت كل عناصر $A$ في $B$ بقيت $A$ كما هي.`,
  },
  {
    q: r`هل $A - B = B - A$ دائماً؟`,
    options: ['نعم', 'لا'],
    answer: 1,
    why: r`مثال مضاد: $A = \{1\}$، $B = \varnothing$. حينها $A - B = \{1\}$ و$B - A = \varnothing$.`,
  },
];

export const q1_6: Question[] = [
  {
    q: r`في $U = \mathbb{Z}$، ما متممة مجموعة الأعداد الزوجية؟`,
    options: [r`الأعداد الفردية`, r`$\varnothing$`, r`الأعداد الطبيعية`],
    answer: 0,
    why: r`كل عدد صحيح ليس زوجياً فهو فردي.`,
  },
  {
    q: r`ما $\overline{\overline{A}}$؟`,
    options: [r`$A$`, r`$U$`, r`$\varnothing$`],
    answer: 0,
    why: r`ما ليس خارج $A$ هو داخل $A$.`,
  },
  {
    q: r`$A = \{1, 2\}$. هل نستطيع حساب $\overline{A}$؟`,
    options: [r`نعم: $\overline{A} = \varnothing$`, r`لا، حتى نعرف المجموعة الشاملة $U$`],
    answer: 1,
    why: r`المتممة تعتمد على $U$: في $U = \{1,2,3\}$ هي $\{3\}$، وفي $U = \mathbb{N}$ هي $\{3, 4, 5, \ldots\}$.`,
  },
];

export const q1_8: Question[] = [
  {
    q: r`$A_1 = \{1,2\}$، $A_2 = \{2,3\}$، $A_3 = \{2,4\}$. ما $\bigcap_{i=1}^{3} A_i$؟`,
    options: [r`$\{2\}$`, r`$\{1,2,3,4\}$`, r`$\varnothing$`],
    answer: 0,
    why: r`العنصر الوحيد المشترك بين الثلاث هو $2$.`,
  },
  {
    q: r`ما $\bigcup_{n \in \mathbb{N}} \{n\}$؟`,
    options: [r`$\mathbb{N}$`, r`$\{1\}$`, r`$\mathbb{Z}$`],
    answer: 0,
    why: r`نجمع المجموعات $\{1\}, \{2\}, \{3\}, \ldots$ فنحصل على كل الأعداد الطبيعية.`,
  },
];

export const q1_9: Question[] = [
  {
    q: r`ما الباقي حين نقسم $a = -7$ على $b = 3$ وفق خوارزمية القسمة؟`,
    options: ['-1', '1', '2'],
    answer: 2,
    why: r`$-7 = (-3)\cdot 3 + 2$، والشرط $0 \le r < 3$ يمنع الباقي السالب.`,
  },
  {
    q: r`أي هذه المجموعات ليس لها أصغر عنصر؟`,
    options: [r`$\{n \in \mathbb{N} : n > 100\}$`, r`$\{1/n : n \in \mathbb{N}\}$`, r`$\{2, 4, 6, \ldots\}$`],
    answer: 1,
    why: r`لأي $1/n$ يوجد $1/(n+1)$ أصغر منه. مبدأ الترتيب الحسن يخص الأعداد الطبيعية لا الحقيقية.`,
  },
];
