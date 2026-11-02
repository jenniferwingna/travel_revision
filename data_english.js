// Chapters: English interview answers, Playground.
window.CHAPTERS.push({
  id: "english", order: 3, num: "EN", group: "起步 Warm-up", title: "英文面试表达", en: "Speaking English in the interview",
  blurb: "自我介绍 · 经验 · 项目 · 边写边说",
  eyebrow: "HR #1 #2 #3",
  qaLabel: "英文模板",
  qaIntro: String.raw`<p>下面是回答模板，<b>方括号 [ ] 里的内容请换成你自己的真实信息</b>（入职时间、职位名称、具体数字等），没有把握的数字不要说。每段都可以朗读，建议先慢速跟读 3 遍，再脱稿说。自我介绍控制在 60–90 秒。</p>
<div class="note warn"><b class="lbl">注意</b>这家公司的题偏 C / 底层 / 测试站。自我介绍最后一句要把你的经历和他们的工作连起来：自动化测试、评测、排查问题、写工具。</div>`,
  qa: [
    {
      src: "HR #1", q: "Tell me about yourself.", qzh: "用英语介绍自己（60–90 秒）",
      points: String.raw`
<p><b>结构：现在 → 过去 → 为什么是你们</b></p>
<ol><li>我是谁、现在做什么（1–2 句）</li><li>最相关的 1–2 个经历和成果</li><li>之前的经历 / 教育背景（1 句）</li><li>为什么申请这个职位（1 句）</li></ol>
<p>避免：按时间顺序念简历、说太多和职位无关的细节、背诵腔。</p>`,
      say: "Hi, I'm [name]. I'm currently a [job title] at [company], where I work on [main area]. My main work there is [one or two concrete responsibilities], and recently I [one concrete result you can back up].\n\nBefore that, I [previous role or project in one sentence].\n\nI have a [degree] in [subject] from [university].\n\nWhat connects my work is [a theme such as testing, quality, or debugging]. That's why this role interests me, and I'd like to bring that experience to your team.",
    },
    {
      src: "HR #2", q: "Tell me about your software experience.", qzh: "软件方面的经验（语言、工具、开发流程）",
      points: String.raw`
<ul>
<li>按“语言 → 做过什么 → 工具/流程”说，每项配一个具体例子。</li>
<li>如实说明 C/C++ 的熟练程度：如果主要用 Python，就说“主要语言是 Python，C 在学校和 [项目] 中用过，能读懂并调试”。不要夸大。</li>
<li>工具：Git、Linux 命令行、调试（日志、断点）、测试框架（如 pytest）。</li>
</ul>`,
      say: "My main language is [language]. I've used it for [how long] to build [kinds of tools or systems]. I also have a foundation in [other languages], so I'm comfortable reading lower-level code and debugging it.\n\nDay to day I use Git, work on Linux from the command line, and write automated tests. A lot of my work is troubleshooting: I trace logs and intermediate outputs to find which step failed, reproduce it with a minimal case, and then fix or report it.\n\nI'm also used to working in a team process: design documents, code review, and turning test results into clear reports.",
    },
    {
      src: "HR #3", q: "Walk me through a project you're proud of.", qzh: "讲一个项目（STAR 结构）",
      points: String.raw`
<p><b>STAR</b>：Situation 背景 → Task 你的任务 → Action 你具体做了什么（占一半时间，用 “I”）→ Result 结果（有数字就说数字，没有就说定性的影响）。</p>
<p>准备一个“遇到的难点 / 如果重做会怎么改”的追问答案。</p>`,
      say: "One project I'm proud of is [project].\n\nThe situation was that [the problem the team had].\n\nMy task was to [your responsibility]. I [the main things you did, using I].\n\nThe result was that [the outcome, with a real number if you have one].",
    },
    {
      src: "常见", q: "Why do you want to leave your current job / join us?", qzh: "为什么离职 / 为什么选我们",
      points: String.raw`<p>保持正面：讲“想要什么”，不抱怨现公司。可以提：想在更国际化的环境用英语工作、更专注于测试/质量方向、对公司产品感兴趣（面试前查一下他们做什么产品）。</p>`,
      say: "I've learned a lot in my current role, especially about [skill]. Now I'm looking for [what you want next], and your company's work on [their product or field] is a good match. I think my experience in [relevant experience] would be useful here.",
    },
    {
      src: "常见", q: "Tell me about a difficult bug you solved.", qzh: "讲一个难排查的问题",
      points: String.raw`<p>选一个真实例子。重点讲<b>排查过程</b>：怎么复现、怎么缩小范围、怎么验证假设、最后的根因、之后怎么避免再发生。这道题和 HR 第 6、7 题考的是同一种能力。</p>`,
      say: "One example was when [the symptom]. I first reproduced it with a small case, then compared a good run and a bad run step by step. That narrowed it down to [the component], where [the root cause]. After fixing it, I added a check so the same problem would be caught automatically next time.",
    },
    {
      src: "做题时", q: "Phrases for coding out loud", qzh: "边写代码边说的常用句子",
      points: String.raw`
~~~text
Clarifying
  "Just to make sure I understand: the input is ..., and I should return ..."
  "Can the input be empty? Can there be duplicates or negative numbers?"
  "Is it okay to modify the input array in place?"
Planning
  "My first idea is a brute-force approach, which would be O(n squared)."
  "We can improve that by using a hash map to remember what we've seen."
  "Let me write down the steps before I code."
Coding
  "I'll use two pointers, one at each end."
  "This loop runs until the pointers meet."
  "I'm adding a guard here for the empty case."
Testing
  "Let me walk through it with a small example."
  "Now some edge cases: an empty list, one element, all the same values."
  "I think there's an off-by-one error here. Let me fix that."
Complexity
  "This runs in O(n) time and uses O(1) extra space."
When stuck
  "Let me think about this for a moment."
  "Could you give me a hint about which direction to take?"
~~~`,
      say: "Just to make sure I understand, the input is a sorted list and I should return the indices of the two numbers. Can the list be empty? My first idea is a brute force with two nested loops, which is O(n squared). Since the list is sorted, I can do better with two pointers. Let me walk through it with a small example. Now some edge cases. This runs in O(n) time and uses constant extra space.",
    },
    {
      src: "结尾", q: "Do you have any questions for us?", qzh: "你有什么问题要问我们",
      points: String.raw`<p>一定要问 1–2 个，显示兴趣。不要第一轮就问薪资和假期。</p>`,
      say: "What does a typical day look like for someone in this role?\n\nWhat kind of systems would I be testing or developing, and which languages and tools does the team use most?\n\nHow do you measure success for this position in the first six months?",
    },
  ],
});

window.CHAPTERS.push({
  id: "playground", order: 40, num: "▶", group: "工具 Tools", title: "自由练习区", en: "Playground",
  blurb: "随便写 Python 试代码",
  eyebrow: "SCRATCHPAD", kind: "playground",
});
