import type { Puzzle } from '@/components/widgets/ProofBuilder';
import type { Question } from '@/components/widgets/QuickCheck';
import type { IdentityPreset } from '@/components/widgets/MembershipTable';

// NOTE: inside r`…` never write a dollar sign directly followed by a brace.
const r = String.raw;

export const identities9: IdentityPreset[] = [
  { l: 'A−(B∩C)', r: '(A−B)∩(A−C)', note: 'المثال 9.2 في الكتاب.' },
  { l: '(A∪B)−C', r: 'A∪(B−C)', note: 'هل مكان القوسين مهم هنا؟' },
  { l: 'A−(B−C)', r: '(A−B)−C', note: 'الطرح ليس تجميعياً، كما في الأعداد.' },
  { l: 'A∩(B−C)', r: '(A∩B)−C', note: 'وهذه؟ إن كانت صحيحة فلا مثال مضاد، ويجب برهانها.' },
];

export const puzzles91: Puzzle[] = [
  {
    title: 'دحض بمثال مضاد',
    prop: r`خمّن أحدهم: لكل $a, b \in \mathbb{Z}$، إذا كان $a \mid b^2$ فإن $a \mid b$.`,
    steps: [
      'هذه العبارة كاذبة. مثال مضاد:',
      r`خذ $a = 4$ و$b = 2$.`,
      r`إذن $b^2 = 4$، و$4 \mid 4$، فالمقدَّم صادق.`,
      r`لكن $4 \nmid 2$، فالتالي كاذب.`,
    ],
    distractors: [
      { text: r`خذ $a = 3$ و$b = 3$: $3 \mid 9$ و$3 \mid 3$.`, why: 'هذا مثال تصدق فيه العبارة، فلا يدحض شيئاً.' },
      { text: r`خذ $a = 4$ و$b = 3$: $4 \nmid 3$.`, why: 'المثال المضاد لشرطية يجب أن يجعل المقدَّم صادقاً. هنا 4 لا يقسم 9.' },
    ],
  },
];

export const puzzles92: Puzzle[] = [
  {
    title: 'دحض عبارة وجود',
    prop: r`خمّن أحدهم: يوجد عددان صحيحان $a$ و$b$ بحيث $6a + 9b = 2$.`,
    steps: [
      r`هذه العبارة كاذبة. نبرهن نفيها: لكل $a, b \in \mathbb{Z}$، $6a + 9b \neq 2$.`,
      r`افترض، بقصد الوصول إلى تناقض، أن $6a + 9b = 2$ لعددين صحيحين.`,
      r`إذن $2 = 3(2a + 3b)$، فـ $3 \mid 2$.`,
      r`وهذا تناقض، فالعبارة كاذبة.`,
    ],
    distractors: [{ text: r`جرّبنا $a, b$ من $-10$ إلى $10$ ولم نجد حلاً، فالعبارة كاذبة.`, why: 'لا يكفي ألا تجد مثالاً. نفي عبارة الوجود عبارة «لكل»، وتحتاج برهاناً.' }],
  },
];

export const q9_intro: Question[] = [
  { q: r`لدحض العبارة $P$:`, options: [r`برهن $\sim P$`, r`افشل في برهان $P$`], answer: 0, why: 'عدم إيجاد برهان لا يعني أن العبارة كاذبة. الدحض برهان للنفي.' },
];
export const q9_1: Question[] = [
  { q: r`لدحض «لكل $x \in S$، $P(x)$» يكفي:`, options: [r`عنصر واحد $x \in S$ تكذب له $P(x)$`, 'برهان بالتناقض دائماً'], answer: 0, why: r`النفي «يوجد $x$ بحيث $\sim P(x)$»، ومثال واحد يبرهنه.` },
  { q: r`المثال المضاد لـ «إذا $P(x)$ فإن $Q(x)$» هو $x$ بحيث:`, options: [r`$P(x)$ صادقة و$Q(x)$ كاذبة`, r`$P(x)$ كاذبة`, r`$Q(x)$ صادقة`], answer: 0, why: 'هذه الحالة الوحيدة التي تكذب فيها الشرطية.' },
  { q: 'قلت: «مثال مضاد: n = 11». هل يكفي هذا؟', options: [r`لا، يجب أن تبيّن لماذا يفشل: $f(11) = 121 = 11 \cdot 11$`, 'نعم'], answer: 0, why: 'الكتاب يشترط أن تشرح كيف يجعل المثال العبارة كاذبة.' },
];
export const q9_2: Question[] = [
  { q: r`لدحض «يوجد $x \in S$ بحيث $P(x)$» يجب:`, options: [r`برهان أنه لكل $x \in S$، $\sim P(x)$`, 'إيجاد مثال واحد لا يحقق P'], answer: 0, why: 'النفي عبارة «لكل»، ومثال واحد لا يكفي.' },
  { q: r`«يوجد $x, y, z > 1$ مختلفة بحيث $x^y = y^z$». ماذا تفعل؟`, options: [r`تبرهنها بمثال: $2^{16} = 16^4$`, 'تدحضها'], answer: 0, why: 'ليست كل التخمينات كاذبة. هذه عبارة وجود صادقة.' },
];
export const q9_3: Question[] = [
  { q: r`لدحض $P$ بالتناقض نفترض:`, options: [r`$P$`, r`$\sim P$`], answer: 0, why: r`نبرهن $\sim P$ بالتناقض، فنفترض $\sim\sim P = P$.` },
];
