import type { Question } from '@/components/widgets/QuickCheck';

const r = String.raw;
const S = ['عبارة صادقة', 'عبارة كاذبة', 'ليست عبارة'];

export const q2_1: Question[] = [
  { q: r`$\mathbb{Q} \subseteq \mathbb{Z}$`, options: S, answer: 1, why: r`جملة رياضية لها قيمة صدق محددة، وهي كاذبة لأن $\tfrac12 \in \mathbb{Q}$ وليس في $\mathbb{Z}$.` },
  { q: r`احسب $\int_0^1 x\,dx$.`, options: S, answer: 2, why: 'هذا أمر، والأمر لا يوصف بالصدق ولا بالكذب.' },
  { q: r`$x + 1 = 5$`, options: S, answer: 2, why: r`صدقها يعتمد على قيمة $x$، فهي جملة مفتوحة وليست عبارة.` },
  { q: r`لكل عدد حقيقي $x$، $x^2 \ge 0$.`, options: S, answer: 0, why: 'المتغير مقيّد بـ «لكل»، فالجملة كلها صادقة دائماً.' },
  {
    q: 'كل عدد زوجي أكبر من 2 مجموع عددين أوليين. (حدسية غولدباخ)',
    options: ['عبارة، وقيمة صدقها مجهولة', 'ليست عبارة لأن أحداً لا يعرف إن كانت صادقة'],
    answer: 0,
    why: 'العبارة يجب أن تكون صادقة أو كاذبة، لا أن نعرف أيهما. وحدسية غولدباخ إما صادقة أو كاذبة، فهي عبارة.',
  },
];

export const q2_2: Question[] = [
  { q: r`$P$ صادقة و$Q$ كاذبة. ما قيمة $P \vee Q$؟`, options: ['T', 'F'], answer: 0, why: '«أو» تحتاج واحدة صادقة على الأقل.' },
  { q: r`ما قيمة $(2 < 3) \vee (3 < 4)$؟`, options: ['T', 'F'], answer: 0, why: '«أو» في الرياضيات شاملة: كلاهما صادق، فالعبارة صادقة.' },
  { q: r`ما نفي «العدد 7 أولي»؟`, options: ['العدد 7 ليس أولياً', 'العدد 7 مؤلَّف أو زوجي', 'العدد 8 ليس أولياً'], answer: 0, why: 'النفي يقلب قيمة الصدق فقط.' },
  { q: r`كيف تكتب «x موجب لكن y ليس موجباً»؟`, options: [r`$P \wedge {\sim}Q$`, r`$P \vee {\sim}Q$`, r`$ {\sim}(P \wedge Q)$`], answer: 0, why: '«لكن» منطقياً تعني «و».' },
];

export const q2_3: Question[] = [
  { q: r`$P$ كاذبة و$Q$ كاذبة. ما قيمة $P \Rightarrow Q$؟`, options: ['T', 'F'], answer: 0, why: 'الشرط لا يكذب إلا إذا صدق المقدَّم وكذب التالي.' },
  { q: r`ما قيمة «إذا كان $2 + 2 = 5$ فإن القمر من جبن»؟`, options: ['T', 'F'], answer: 0, why: 'المقدَّم كاذب، فالشرط صادق مهما كان التالي.' },
  { q: r`ماذا تعني $P \text{ only if } Q$؟`, options: [r`$P \Rightarrow Q$`, r`$Q \Rightarrow P$`], answer: 0, why: r`لا تصدق $P$ إلا وQ صادقة.` },
  { q: r`«كي تكون الدالة قابلة للاشتقاق، يلزم أن تكون متصلة». ما معناها؟`, options: ['إذا كانت قابلة للاشتقاق فهي متصلة', 'إذا كانت متصلة فهي قابلة للاشتقاق'], answer: 0, why: '«يلزم» (necessary) تضع ما بعدها في موضع التالي.' },
];

export const q2_4: Question[] = [
  { q: r`ما عكس (converse) العبارة $P \Rightarrow Q$؟`, options: [r`$Q \Rightarrow P$`, r`$ {\sim}Q \Rightarrow {\sim}P$`, r`$ {\sim}P \Rightarrow {\sim}Q$`], answer: 0, why: 'العكس يبدّل المقدَّم والتالي.' },
  { q: r`متى تكون $P \Leftrightarrow Q$ صادقة؟`, options: ['حين تتساوى قيمتا الصدق', 'حين تكون P صادقة فقط', 'حين تختلف قيمتا الصدق'], answer: 0, why: 'كلتاهما صادقة أو كلتاهما كاذبة.' },
  { q: r`هل «$x$ زوجي $\Leftrightarrow$ $x^2$ زوجي» صادقة لكل عدد صحيح $x$؟`, options: ['نعم', 'لا'], answer: 0, why: r`الاتجاهان صحيحان. ستبرهن الاتجاه الصعب ($x^2$ زوجي $\Rightarrow$ $x$ زوجي) في الفصل 5.` },
];

export const q2_5: Question[] = [
  { q: r`كم صفاً في جدول صدق عبارة فيها $P, Q, R, S$؟`, options: ['8', '12', '16'], answer: 2, why: r`$2^4 = 16$، كما في عدّ المجموعات الجزئية.` },
  { q: r`$({\sim}P) \vee Q$ أم $ {\sim}(P \vee Q)$: أيهما يعني $ {\sim}P \vee Q$؟`, options: [r`$({\sim}P) \vee Q$`, r`$ {\sim}(P \vee Q)$`], answer: 0, why: 'النفي كإشارة السالب: يخص ما بعده مباشرة فقط.' },
  { q: r`$(P \wedge {\sim}P) \Rightarrow Q$ صادقة:`, options: ['دائماً', 'أحياناً', 'أبداً'], answer: 0, why: r`$P \wedge {\sim}P$ كاذبة دائماً، والشرط بمقدَّم كاذب صادق.` },
];

export const q2_6: Question[] = [
  { q: r`أي عبارة تكافئ $P \Rightarrow Q$؟`, options: [r`$ {\sim}Q \Rightarrow {\sim}P$`, r`$Q \Rightarrow P$`, r`$ {\sim}P \Rightarrow {\sim}Q$`], answer: 0, why: 'العكس النقيض يكافئ الأصل دائماً، والعكس لا.' },
  { q: r`$ {\sim}(P \wedge Q) = $`, options: [r`$ {\sim}P \vee {\sim}Q$`, r`$ {\sim}P \wedge {\sim}Q$`], answer: 0, why: 'دي مورغان: النفي يقلب ∧ إلى ∨.' },
  { q: r`هل $P \Rightarrow Q$ تكافئ $ {\sim}P \vee Q$؟`, options: ['نعم', 'لا'], answer: 0, why: r`كلتاهما كاذبة فقط حين $P$ صادقة و$Q$ كاذبة.` },
];

export const q2_7: Question[] = [
  { q: r`$\forall x \in \mathbb{R},\ x^2 > 0$`, options: ['صادقة', 'كاذبة'], answer: 1, why: r`مثال مضاد: $x = 0$.` },
  { q: r`$\exists n \in \mathbb{Z},\ n^2 = n$`, options: ['صادقة', 'كاذبة'], answer: 0, why: r`$n = 0$ أو $n = 1$.` },
  { q: r`$\exists y \in \mathbb{Z},\ \forall x \in \mathbb{Z},\ x + y = x$`, options: ['صادقة', 'كاذبة'], answer: 0, why: r`$y = 0$ يصلح لكل $x$ معاً.` },
  { q: r`$\exists y \in \mathbb{Z},\ \forall x \in \mathbb{Z},\ x + y = 0$`, options: ['صادقة', 'كاذبة'], answer: 1, why: r`لا يوجد $y$ واحد يعاكس كل الأعداد معاً. أما $\forall x, \exists y$ فصادقة.` },
  { q: '«كل الطلاب لم ينجحوا» في الاستعمال الرياضي تعني:', options: ['لم ينجح أي طالب', 'ليس كل الطلاب نجحوا'], answer: 0, why: 'لذلك قل «ليس كل…» حين تقصد أن بعضهم لم ينجح.' },
];

export const q2_9: Question[] = [
  { q: '«واحد على الأقل من x وy زوجي»', options: [r`$(x \text{ even}) \vee (y \text{ even})$`, r`$(x \text{ even}) \wedge (y \text{ even})$`], answer: 0, why: 'وجود كلمة «و» في الجملة لا يعني ∧: المعنى «أحدهما أو كلاهما».' },
  { q: '«كل عدد أولي أكبر من 2 فردي»', options: [r`$\forall p \in P,\ p > 2 \Rightarrow p \text{ odd}$`, r`$\forall p \in P,\ p > 2 \wedge p \text{ odd}$`], answer: 0, why: r`الصيغة الثانية تقول إن كل عدد أولي أكبر من 2، وهذا كاذب (2 أولي).` },
  { q: '«بعض الأعداد الحقيقية ليس لها جذر تربيعي حقيقي»', options: [r`$\exists x \in \mathbb{R},\ \forall y \in \mathbb{R},\ y^2 \neq x$`, r`$\forall x \in \mathbb{R},\ \exists y \in \mathbb{R},\ y^2 \neq x$`], answer: 0, why: r`«بعض» = ∃، و«ليس لها جذر» = لا يوجد $y$ يحقق $y^2 = x$.` },
  { q: '«لا يوجد عدد صحيح أكبر من كل الأعداد الصحيحة»', options: [r`$ {\sim}(\exists n \in \mathbb{Z},\ \forall m \in \mathbb{Z},\ n \ge m)$`, r`$\exists n \in \mathbb{Z},\ {\sim}(\forall m \in \mathbb{Z},\ n \ge m)$`], answer: 0, why: 'النفي يقع على العبارة كلها «يوجد عدد أكبر من الكل».' },
];

export const q2_10: Question[] = [
  { q: r`نفي $\forall x \in X,\ P(x)$:`, options: [r`$\exists x \in X,\ {\sim}P(x)$`, r`$\forall x \in X,\ {\sim}P(x)$`], answer: 0, why: 'ليس الكل يحقق الشرط = يوجد من لا يحققه.' },
  { q: r`نفي $P \Rightarrow Q$:`, options: [r`$P \wedge {\sim}Q$`, r`$ {\sim}P \Rightarrow {\sim}Q$`, r`$P \Rightarrow {\sim}Q$`], answer: 0, why: 'الشرط يكذب فقط حين يصدق المقدَّم ويكذب التالي.' },
  { q: '«كل ثعبان في هذه الحديقة سام». نفيها:', options: ['يوجد ثعبان في هذه الحديقة غير سام', 'كل ثعبان في هذه الحديقة غير سام', 'لا يوجد ثعبان سام في هذه الحديقة'], answer: 0, why: 'نفي ∀ هو ∃ مع نفي الشرط.' },
];

export const q2_12: Question[] = [
  { q: r`أي هذه ليس مكافئاً لـ $P \Rightarrow Q$؟`, options: [r`$Q \Rightarrow P$`, r`$ {\sim}Q \Rightarrow {\sim}P$`, r`$ {\sim}P \vee Q$`], answer: 0, why: 'العكس لا يكافئ الأصل.' },
  { q: r`نفي «لكل $\varepsilon > 0$ يوجد $\delta > 0$ بحيث …»:`, options: [r`يوجد $\varepsilon > 0$ بحيث لكل $\delta > 0$ ليس …`, r`لكل $\varepsilon \le 0$ يوجد $\delta \le 0$ …`], answer: 0, why: 'المكمِّمات تنقلب، والقيود (ε > 0) تبقى كما هي.' },
  { q: r`من $P \vee Q$ و$ {\sim}Q$ نستنتج:`, options: [r`$P$`, r`$ {\sim}P$`, 'لا شيء'], answer: 0, why: 'قاعدة الحذف.' },
  { q: r`«$x$ زوجي» وحدها:`, options: ['جملة مفتوحة', 'عبارة صادقة', 'عبارة كاذبة'], answer: 0, why: r`تعتمد على $x$. لكن «إذا كان $x$ زوجياً فإن $x^2$ زوجي» عبارة، لأن فيها «لكل» ضمنية.` },
];
