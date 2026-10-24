import type { Puzzle } from '@/components/widgets/ProofBuilder';
import type { Question } from '@/components/widgets/QuickCheck';
import type { IdentityPreset } from '@/components/widgets/MembershipTable';

// NOTE: inside r`…` never write a dollar sign directly followed by a brace.
const r = String.raw;

export const puzzles82: Puzzle[] = [
  {
    title: 'احتواء بالقسمة',
    prop: r`برهن أن $\{x \in \mathbb{Z} : 4 \mid x\} \subseteq \{x \in \mathbb{Z} : 8 \mid x^2\}$.`,
    steps: [
      r`افترض أن $a \in \{x \in \mathbb{Z} : 4 \mid x\}$.`,
      r`إذن $a \in \mathbb{Z}$ و$4 \mid a$، فـ $a = 4c$ لعدد صحيح $c$.`,
      r`إذن $a^2 = 16c^2 = 8(2c^2)$، فـ $8 \mid a^2$.`,
      r`إذن $a \in \{x \in \mathbb{Z} : 8 \mid x^2\}$.`,
      r`أثبتنا أن كل عنصر في المجموعة الأولى عنصر في الثانية، فالأولى مجموعة جزئية من الثانية.`,
    ],
    distractors: [
      { text: r`مثلاً $4 \in$ الأولى، و$4^2 = 16$ و$8 \mid 16$.`, why: 'مثال واحد لا يبرهن الاحتواء. يجب أن تبدأ بعنصر عام a.' },
      { text: r`افترض أن $a \in \{x \in \mathbb{Z} : 8 \mid x^2\}$.`, why: 'هذا يبدأ من المجموعة الثانية، فيبرهن الاحتواء المعاكس.' },
    ],
  },
  {
    title: 'المجموعات الجزئية ومجموعة القوة',
    prop: r`لتكن $A$ و$B$ مجموعتين. إذا كان $A \subseteq B$ فإن $\mathcal{P}(A) \subseteq \mathcal{P}(B)$.`,
    steps: [
      r`افترض أن $A \subseteq B$.`,
      r`لنبرهن $\mathcal{P}(A) \subseteq \mathcal{P}(B)$، افترض أن $X \in \mathcal{P}(A)$.`,
      r`إذن $X \subseteq A$، بتعريف مجموعة القوة.`,
      r`وبما أن $X \subseteq A$ و$A \subseteq B$، فإن $X \subseteq B$.`,
      r`إذن $X \in \mathcal{P}(B)$، فـ $\mathcal{P}(A) \subseteq \mathcal{P}(B)$.`,
    ],
    distractors: [{ text: r`إذن $X \in A$.`, why: r`عناصر $\mathcal{P}(A)$ مجموعات جزئية من A، لا عناصر فيها: $X \subseteq A$ لا $X \in A$.` }],
  },
];

export const puzzles83: Puzzle[] = [
  {
    title: 'تساوي مجموعتين',
    prop: r`لتكن $A$ و$B$ مجموعتين في مجموعة شاملة $U$. برهن أن $A - B = A \cap \overline{B}$.`,
    steps: [
      r`أولاً $A - B \subseteq A \cap \overline{B}$: افترض أن $x \in A - B$. إذن $x \in A$ و$x \notin B$.`,
      r`إذن $x \in A$ و$x \in \overline{B}$، فـ $x \in A \cap \overline{B}$.`,
      r`ثانياً $A \cap \overline{B} \subseteq A - B$: افترض أن $x \in A \cap \overline{B}$. إذن $x \in A$ و$x \in \overline{B}$.`,
      r`إذن $x \in A$ و$x \notin B$، فـ $x \in A - B$.`,
      r`بما أن كلاً منهما مجموعة جزئية من الأخرى، فهما متساويتان.`,
    ],
    distractors: [{ text: r`بما أن $A - B \subseteq A \cap \overline{B}$، فهما متساويتان.`, why: 'احتواء واحد لا يكفي. يجب برهان الاتجاهين.' }],
  },
];

export const identities8: IdentityPreset[] = [
  { l: "(A∪B)'", r: "A'∩B'", note: 'قانون دي مورغان للمجموعات (التمرين 11).' },
  { l: 'A∪(B∩C)', r: '(A∪B)∩(A∪C)', note: 'قانون التوزيع (التمرين 8).' },
  { l: 'A−(B∪C)', r: '(A−B)∩(A−C)', note: 'التمرين 13.' },
  { l: 'A∩B', r: 'A∪C', rel: 'sub', note: 'احتواء: كل صف فيه x في الأيسر، يكون فيه x في الأيمن.' },
  { l: 'A∪B', r: 'A∩B', rel: 'sub', note: 'هذا الاحتواء خاطئ. انظر الصفوف الحمراء.' },
];

export const q8_1: Question[] = [
  { q: r`لتبرهن $a \in \{x \in S : P(x)\}$:`, options: [r`تحقق أن $a \in S$ وأن $P(a)$ صادقة`, r`تحقق أن $P(a)$ صادقة فقط`, 'اكتب كل عناصر المجموعة'], answer: 0, why: 'شرطان: الانتماء إلى المجموعة الأم، ثم الخاصية.' },
  { q: r`هل $0 \in \{3x^3 + 2 : x \in \mathbb{Z}\}$؟`, options: ['لا', 'نعم'], answer: 0, why: r`$3x^3 + 2 = 0$ تعني $x^3 = -\frac23$، ولا يوجد عدد صحيح يحقق ذلك.` },
];
export const q8_2: Question[] = [
  { q: r`أول سطر في برهان $A \subseteq B$ (مباشر):`, options: [r`افترض $a \in A$`, r`افترض $a \in B$`, r`افترض $A \subseteq B$`], answer: 0, why: r`$A \subseteq B$ تعني «إذا $a \in A$ فإن $a \in B$».` },
  { q: r`أي هذه صحيح دائماً؟`, options: [r`$A \cap B \subseteq A$`, r`$A \subseteq A \cap B$`], answer: 0, why: 'الثانية تفشل إذا كان في A عنصر ليس في B. يقول الكتاب: إن لم ترَ هذا فراجع الموضوع.' },
];
export const q8_3: Question[] = [
  { q: r`لتبرهن $A = B$:`, options: [r`برهن $A \subseteq B$ و$B \subseteq A$`, r`برهن $A \subseteq B$`, 'اعرض مخطط فن'], answer: 0, why: 'الاحتواءان معاً، ومخطط فن يقنع لكنه ليس برهاناً.' },
  { q: r`في المثال 8.11 لماذا احتجنا $C \neq \varnothing$؟`, options: [r`لنأخذ عنصراً $c \in C$ ونكوّن الزوج $(a, c)$`, 'لا حاجة إليه'], answer: 0, why: r`لو كانت $C$ خالية لكان $A \times C = B \times C = \varnothing$ دائماً، مهما كانت A وB.` },
];
export const q8_4: Question[] = [
  { q: 'هل برهن الكتاب أن كل عدد تام زوجي؟', options: ['لا، هذا سؤال مفتوح', 'نعم'], answer: 0, why: r`برهن $A \subseteq P$، وأن $A$ هي الأعداد التامة الزوجية. أما وجود أعداد تامة فردية فمجهول.` },
  { q: r`$2^{11} - 1 = 2047$. هل $2^{10}(2^{11} - 1)$ تام؟`, options: ['لا، لأن 2047 = 23 × 89 ليس أولياً', 'نعم'], answer: 0, why: 'الوصفة تشترط أن يكون 2ⁿ − 1 أولياً.' },
];
