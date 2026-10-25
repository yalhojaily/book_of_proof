import type { Puzzle } from '@/components/widgets/ProofBuilder';
import type { Question } from '@/components/widgets/QuickCheck';

// NOTE: inside r`…` never write a dollar sign directly followed by a brace.
const r = String.raw;

export const puzzles132: Puzzle[] = [
  {
    title: 'نهاية خطية',
    prop: r`برهن أن $\lim_{x \to 1} (5x - 2) = 3$.`,
    steps: [
      r`ليكن $\varepsilon > 0$.`,
      r`خذ $\delta = \frac{\varepsilon}{5}$.`,
      r`افترض أن $0 < |x - 1| < \delta$.`,
      r`إذن $|(5x - 2) - 3| = |5x - 5| = 5|x - 1| < 5\delta = \varepsilon$.`,
      r`إذن بتعريف النهاية $\lim_{x \to 1} (5x - 2) = 3$.`,
    ],
    distractors: [
      { text: r`خذ $\varepsilon = 0.1$.`, why: 'ε ليس اختيارك. البرهان يجب أن يعمل لكل ⁦ε > 0⁩، فنبدأ بـ ε عام.' },
      { text: r`خذ $\delta = 5\varepsilon$.`, why: 'هذا يعطي ⁦5|x − 1| < 25ε⁩، وهو أكبر من ε. نحتاج ⁦δ = ε/5⁩.' },
    ],
  },
];

export const puzzles137: Puzzle[] = [
  {
    title: 'تقارب متتالية',
    prop: r`برهن أن المتتالية $\left\{\frac{3n + 1}{n}\right\}$ تتقارب إلى 3.`,
    steps: [
      r`ليكن $\varepsilon > 0$.`,
      r`خذ $N$ عدداً صحيحاً بحيث $N > \frac{1}{\varepsilon}$.`,
      r`افترض أن $n > N$.`,
      r`إذن $\left|\frac{3n + 1}{n} - 3\right| = \frac{1}{n} < \frac{1}{N} < \varepsilon$.`,
      'إذن المتتالية تتقارب إلى 3.',
    ],
    distractors: [{ text: r`الحدود $4, 3.5, 3.33, 3.25, \dots$ تقترب من 3، فالمتتالية تتقارب.`, why: 'الحساب العددي يقنع، لكن البرهان يحتاج N لكل ε.' }],
  },
];

export const q13_1: Question[] = [
  { q: r`متباينة المثلث:`, options: [r`$|x - y| \le |x - z| + |z - y|$`, r`$|x + y| = |x| + |y|$`], answer: 0, why: r`والثانية خاطئة عموماً: $|1 + (-1)| = 0 \neq 2$.` },
];
export const q13_2: Question[] = [
  { q: r`في تعريف $\lim_{x \to c} f(x) = L$، من يختار ε ومن يختار δ؟`, options: ['ε يُعطى أولاً (أي قيمة)، ثم نجد δ يعتمد عليه', 'نختار الاثنين معاً'], answer: 0, why: r`$\forall \varepsilon > 0, \exists \delta > 0$: الترتيب مهم.` },
  { q: r`لماذا الشرط $0 < |x - c|$؟`, options: [r`لأن قيمة $f(c)$ نفسها لا تهم النهاية`, 'لأن x موجب'], answer: 0, why: 'قد لا تكون f معرّفة عند c أصلاً.' },
];
export const q13_3: Question[] = [
  { q: r`$\lim_{x \to c} f(x) \neq L$ تعني:`, options: [r`يوجد $\varepsilon > 0$ بحيث لكل $\delta > 0$ يوجد $x$ مع $0 < |x - c| < \delta$ و$|f(x) - L| \ge \varepsilon$`, r`لكل ε يوجد δ لا يعمل`], answer: 0, why: 'نفي ∀∃∀ هو ∃∀∃ مع نفي الشرط.' },
];
export const q13_4: Question[] = [
  { q: r`في برهان قاعدة الجمع، لماذا نأخذ $\varepsilon/2$ لكل دالة؟`, options: [r`لأن $\frac{\varepsilon}{2} + \frac{\varepsilon}{2} = \varepsilon$ بعد متباينة المثلث`, 'لأن عندنا دالتين'], answer: 0, why: 'متباينة المثلث تجمع الخطأين، فنقسم ε بينهما.' },
];
export const q13_5: Question[] = [
  { q: 'f متصلة عند c تعني:', options: [r`$\lim_{x \to c} f(x) = f(c)$`, r`$f(c)$ معرّفة فقط`], answer: 0, why: 'التعريف 13.3: النهاية موجودة وتساوي القيمة.' },
  { q: 'إذا كانت f قابلة للاشتقاق عند c فهي متصلة عند c. والعكس؟', options: [r`خاطئ: $|x|$ متصلة عند 0 وغير قابلة للاشتقاق`, 'صحيح'], answer: 0, why: 'المبرهنة 13.10 في اتجاه واحد.' },
];
export const q13_6: Question[] = [
  { q: r`في تعريف $\lim_{x \to \infty} f(x) = L$، ما الذي يحل محل δ؟`, options: [r`عدد $N$ بحيث $x > N$ يعطي $|f(x) - L| < \varepsilon$`, 'لا شيء'], answer: 0, why: '«قريب من c» يصبح «كبير بما يكفي».' },
];
export const q13_7: Question[] = [
  { q: r`$\{a_n\}$ تتقارب إلى $L$ تعني:`, options: [r`لكل $\varepsilon > 0$ يوجد $N$ بحيث $n > N$ يعطي $|a_n - L| < \varepsilon$`, r`$a_n = L$ لعدد كبير من n`], answer: 0, why: 'التعريف 13.5.' },
  { q: r`$\{(-1)^n\}$:`, options: ['متباعدة', 'تتقارب إلى 0'], answer: 0, why: 'الحدود تقفز بين −1 و1.' },
];
export const q13_8: Question[] = [
  { q: r`$\sum a_k$ تتقارب إلى S تعني:`, options: ['متتالية مجاميعها الجزئية تتقارب إلى S', r`$a_k \to S$`], answer: 0, why: 'التعريف 13.7.' },
  { q: r`إذا كان $a_k \to 0$ فهل $\sum a_k$ تتقارب؟`, options: [r`ليس بالضرورة: $\sum \frac{1}{k}$ تتباعد`, 'نعم'], answer: 0, why: 'اختبار التباعد يعمل في اتجاه واحد فقط.' },
];
