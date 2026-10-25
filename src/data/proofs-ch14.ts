import type { Puzzle } from '@/components/widgets/ProofBuilder';
import type { Question } from '@/components/widgets/QuickCheck';

// NOTE: inside r`…` never write a dollar sign directly followed by a brace.
const r = String.raw;

export const puzzles141: Puzzle[] = [
  {
    title: 'عدد أصلي متساوٍ',
    prop: r`برهن أن $|(0, 1)| = |(0, 5)|$.`,
    steps: [
      r`عرّف $f : (0, 1) \to (0, 5)$ بـ $f(x) = 5x$. (إذا كان $0 < x < 1$ فإن $0 < 5x < 5$.)`,
      r`**متباينة:** إذا كان $5a = 5b$ فإن $a = b$.`,
      r`**غامرة:** ليكن $y \in (0, 5)$. إذن $\frac{y}{5} \in (0, 1)$ و$f\left(\frac{y}{5}\right) = y$.`,
      r`إذن $f$ تقابل، فـ $|(0, 1)| = |(0, 5)|$.`,
    ],
    distractors: [{ text: r`الفترة $(0, 5)$ أطول بخمس مرات، فعددها الأصلي أكبر.`, why: 'الطول ليس العدد الأصلي. المعيار وجود تقابل.' }],
  },
];

export const q14_1: Question[] = [
  { q: r`$|A| = |B|$ تعني:`, options: [r`يوجد تقابل $f : A \to B$`, 'A وB متساويتان', 'لهما الطول نفسه'], answer: 0, why: 'التعريف 14.1.' },
  { q: r`هل $|\mathbb{N}| = |\mathbb{Z}|$؟`, options: ['نعم', 'لا، ℤ أكبر بمرتين'], answer: 0, why: 'المبرهنة 14.1: 0، 1، −1، 2، −2، … تقابل.' },
  { q: r`هل $|\mathbb{N}| = |\mathbb{R}|$؟`, options: ['لا', 'نعم'], answer: 0, why: 'المبرهنة 14.2: حجة كانتور القطرية.' },
];
export const q14_2: Question[] = [
  { q: 'المجموعة A قابلة للعدّ لا نهائياً إذا:', options: [r`$|A| = |\mathbb{N}|$`, 'كانت لا نهائية'], answer: 0, why: 'التعريف 14.2. و ℝ لا نهائية لكنها غير قابلة للعدّ.' },
  { q: r`$\mathbb{Q}$:`, options: ['قابلة للعدّ', 'غير قابلة للعدّ لأنها كثيفة'], answer: 0, why: 'المبرهنة 14.4: المسار القطري.' },
  { q: r`إذا كانت A وB قابلتين للعدّ لا نهائياً، فإن $A \times B$:`, options: ['قابلة للعدّ لا نهائياً', 'غير قابلة للعدّ'], answer: 0, why: 'المبرهنة 14.5.' },
];
export const q14_3: Question[] = [
  { q: r`$|A| < |\mathcal{P}(A)|$:`, options: ['لكل مجموعة A', 'للمجموعات المنتهية فقط'], answer: 0, why: 'المبرهنة 14.7: لا توجد دالة غامرة من A إلى P(A).' },
  { q: 'كم «حجماً» للانهاية؟', options: ['عدد لا نهائي: ⁦|ℕ| < |P(ℕ)| < |P(P(ℕ))| < …⁩', 'اثنان: قابلة للعدّ وغير قابلة'], answer: 0, why: 'بتطبيق المبرهنة 14.7 مراراً.' },
];
export const q14_4: Question[] = [
  { q: 'مبرهنة كانتور–برنشتاين–شرودر:', options: [r`إذا وُجدت متباينة $A \to B$ ومتباينة $B \to A$ فإن $|A| = |B|$`, 'كل دالة متباينة تقابل'], answer: 0, why: 'تكفي متباينتان، دون بناء التقابل صراحة.' },
  { q: 'فرضية المتصل تقول:', options: [r`لا توجد مجموعة $A$ مع $|\mathbb{N}| < |A| < |\mathbb{R}|$`, r`$|\mathbb{N}| = |\mathbb{R}|$`], answer: 0, why: 'وقد بُرهن أنه لا يمكن برهانها ولا دحضها من مسلمات نظرية المجموعات المعتادة.' },
];
