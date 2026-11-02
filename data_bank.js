// Chapter: question-bank checklist gathered from common C / OS / embedded interview lists.
window.CHAPTERS.push({
  id: "bank", order: 31, num: "17", group: "概念问答 Concepts", title: "高频题库清单", en: "Question bank checklist",
  blurb: "按题型穷举，逐条自测",
  eyebrow: "CHECKLIST",
  qaLabel: "题型清单",
  qaIntro: String.raw`<p>根据 GeeksforGeeks 的 C 语言面试 70 题、操作系统面试 103 题、位运算技巧清单，以及 HR 给的题目风格（C / 底层 / 测试站），整理出这家公司最可能问到的题型。每张卡是一类题：<b>表格左边是问题，右边是一句话答案</b>。先遮住右边自己回答，答不上来的再去对应章节复习。「系统与 C 概念」章节里已有详细讲解的题，这里只列一句话。</p>`,
  qa: [
    {
      src: "C 基础", q: "C language basics", qzh: "C 语言基础概念",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>问题</th><th>一句话答案</th></tr>
<tr><td>i++ 和 ++i 的区别</td><td>i++ 先用旧值再加 1；++i 先加 1 再用新值。单独一条语句时没区别。同一表达式里多次修改 i（如 <code>i = i++ + ++i</code>）是未定义行为。</td></tr>
<tr><td>= 和 ==</td><td>赋值 vs 比较。<code>if (x = 0)</code> 永远为假，还把 x 改了；有人写成 <code>if (0 == x)</code> 防错。</td></tr>
<tr><td>声明 declaration vs 定义 definition</td><td>声明告诉编译器名字和类型（可以多次，如 <code>extern int x;</code>）；定义真正分配存储（只能一次）。</td></tr>
<tr><td>extern 的作用</td><td>声明变量/函数在别的文件里定义，用于跨文件共享全局变量。</td></tr>
<tr><td>宏 macro vs 函数</td><td>宏是预处理阶段的文本替换，没有类型检查、没有调用开销，但有副作用陷阱：<code>#define SQ(x) x*x</code> 中 <code>SQ(1+2)</code> = 1+2*1+2 = 5。参数和整体都要加括号。</td></tr>
<tr><td>#include &lt;&gt; vs ""</td><td>&lt;&gt; 先在系统头文件目录找；"" 先在当前目录找。</td></tr>
<tr><td>头文件保护</td><td><code>#ifndef X_H / #define X_H / #endif</code> 或 <code>#pragma once</code>，防止重复包含。</td></tr>
<tr><td>struct vs union</td><td>struct 每个成员有自己的空间，大小 ≥ 各成员之和（含对齐填充）；union 所有成员共用同一块内存，大小 = 最大成员。union 常用于同一数据的不同解释（如字节和整数互转）。</td></tr>
<tr><td>结构体对齐 padding</td><td><code>struct {char c; int i;}</code> 通常是 8 字节而不是 5，因为 int 要 4 字节对齐。成员按从大到小排列可以减少填充；协议结构体常用 <code>#pragma pack(1)</code>。</td></tr>
<tr><td>enum</td><td>一组命名的整数常量，比 #define 更有类型意义，调试器能显示名字。</td></tr>
<tr><td>typedef</td><td>给类型起别名：<code>typedef unsigned char uint8;</code>，与 #define 不同，它由编译器处理。</td></tr>
<tr><td>call by value vs by reference</td><td>C 只有值传递；想在函数里修改调用者的变量要传指针（地址）。</td></tr>
<tr><td>while vs do-while</td><td>do-while 至少执行一次。</td></tr>
<tr><td>编译错误 / 运行时错误 / 逻辑错误</td><td>语法类型问题 / 运行时崩溃（除零、段错误）/ 能运行但结果错（最难查）。</td></tr>
<tr><td>编译的四个阶段</td><td>预处理（展开宏和 include）→ 编译（生成汇编）→ 汇编（生成目标文件 .o）→ 链接（合并成可执行文件，解析符号）。“undefined reference” 是链接错误。</td></tr>
<tr><td>无分号打印 Hello World / 不用临时变量交换</td><td><code>if (printf("Hello")) {}</code>；<code>a ^= b; b ^= a; a ^= b;</code>（a、b 是同一变量时会清零）或 <code>a = a + b; b = a - b; a = a - b;</code>（可能溢出）。</td></tr>
</table></div>`,
    },
    {
      src: "指针与内存", q: "Pointers & memory", qzh: "指针和内存（这类公司最爱问）",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>问题</th><th>一句话答案</th></tr>
<tr><td>malloc / calloc / realloc / free</td><td>malloc(n) 分配 n 字节不初始化；calloc(cnt, size) 分配并清零；realloc 改变大小，可能搬到新地址（要用返回值，失败返回 NULL 且原内存还在）；free 释放，只能释放一次。</td></tr>
<tr><td>malloc 失败怎么办</td><td>返回 NULL，必须检查后再使用。</td></tr>
<tr><td>NULL / 野指针 wild / 悬空指针 dangling / void 指针</td><td>NULL 指向“无”；野指针是未初始化的指针；悬空指针指向已经释放或已失效的内存；void* 是通用指针，使用前要转换类型，不能直接解引用或做算术。</td></tr>
<tr><td>悬空指针 vs 内存泄漏</td><td>悬空指针：内存已释放但指针还在用（危险访问）；内存泄漏：内存没释放但已经没有指针指向它（浪费）。free 后把指针置 NULL 可避免前者。</td></tr>
<tr><td>数组 vs 指针</td><td>数组名在大多数表达式里会退化成指向首元素的指针，但数组不是指针：<code>sizeof(arr)</code> 是整个数组大小，<code>sizeof(ptr)</code> 是指针大小（4 或 8）。数组作为函数参数传进去后就只是指针了。</td></tr>
<tr><td>指针运算</td><td><code>p + 1</code> 前进 <code>sizeof(*p)</code> 字节，不是 1 字节。两个指针相减得到元素个数。</td></tr>
<tr><td>二级指针 double pointer</td><td>指向指针的指针。用途：在函数里修改调用者的指针（如链表头插入 <code>void push(Node **head, int v)</code>）、字符串数组 <code>char **argv</code>。</td></tr>
<tr><td>const int *p / int *const p / const int *const p</td><td>指向的值不能改 / 指针本身不能改 / 都不能改。从右往左读。</td></tr>
<tr><td>函数指针</td><td><code>int (*fp)(int, int) = add;</code> 用于回调（如 qsort 的比较函数）、状态机、驱动接口表。</td></tr>
<tr><td>strcpy vs strncpy / strcmp vs strncmp</td><td>带 n 的版本限制最多处理 n 个字符，防止缓冲区溢出；但 strncpy 在源串过长时不会自动补 '\0'，要手动加。</td></tr>
<tr><td>char 数组 vs 字符串字面量</td><td><code>char a[] = "hi"</code> 是可修改的数组拷贝（3 字节含 '\0'）；<code>char *p = "hi"</code> 指向只读区，修改会崩溃。</td></tr>
<tr><td>缓冲区溢出 buffer overflow</td><td>写超出数组边界，破坏相邻内存或返回地址；用 gets/strcpy/sprintf 不检查长度是常见原因，改用 fgets/strncpy/snprintf。</td></tr>
<tr><td>程序内存布局</td><td>从低地址到高地址：代码段 text → 已初始化数据 data → 未初始化数据 bss（清零）→ 堆 heap（向上长）…… 栈 stack（向下长）。</td></tr>
<tr><td>内存泄漏怎么避免、怎么查</td><td>谁分配谁释放、每个错误分支都要释放、C++ 用 RAII/智能指针；用 Valgrind、ASan/LeakSanitizer、长时间运行观察内存趋势。</td></tr>
<tr><td>double free / use-after-free</td><td>同一块内存释放两次或释放后继续访问，会破坏堆管理结构，导致崩溃或安全漏洞。</td></tr>
</table></div>`,
    },
    {
      src: "位运算", q: "Bit tricks you may be asked to write or explain", qzh: "位运算技巧（看代码猜功能的主要来源）",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>代码</th><th>作用</th></tr>
<tr><td><code>n &amp; (n - 1)</code></td><td>清掉最低位的 1；循环计数 = 1 的个数（HR 原题）</td></tr>
<tr><td><code>n &amp;&amp; !(n &amp; (n - 1))</code></td><td>是否 2 的幂（HR 原题）</td></tr>
<tr><td><code>n &amp; -n</code></td><td>只保留最低位的 1</td></tr>
<tr><td><code>x ^ y</code> 的 1 的个数</td><td>两个数有多少位不同（汉明距离）</td></tr>
<tr><td><code>a ^= b; b ^= a; a ^= b;</code></td><td>不用临时变量交换</td></tr>
<tr><td><code>(x &gt;&gt; k) &amp; 1</code> / <code>x | (1&lt;&lt;k)</code> / <code>x &amp; ~(1&lt;&lt;k)</code> / <code>x ^ (1&lt;&lt;k)</code></td><td>读 / 置 1 / 清 0 / 翻转第 k 位（寄存器操作必备）</td></tr>
<tr><td><code>(x &amp; 0xFF00) &gt;&gt; 8</code></td><td>取高字节</td></tr>
<tr><td><code>((x &amp; 0xFF) &lt;&lt; 8) | ((x &gt;&gt; 8) &amp; 0xFF)</code></td><td>16 位字节交换（大小端转换）</td></tr>
<tr><td><code>x &amp; 1</code></td><td>奇偶判断</td></tr>
<tr><td><code>x &lt;&lt; 3</code>, <code>x &gt;&gt; 1</code></td><td>乘 8，除 2（对无符号数）</td></tr>
<tr><td><code>(x + 7) &amp; ~7</code></td><td>向上对齐到 8 的倍数（内存对齐）</td></tr>
<tr><td><code>x ^ (x &gt;&gt; 1)</code></td><td>二进制转格雷码</td></tr>
<tr><td>1 ^ 2 ^ ... ^ n</td><td>按 n % 4 = 0,1,2,3 分别等于 n, 1, n+1, 0</td></tr>
<tr><td>最高位的 1（MSB）</td><td>不断 <code>n &gt;&gt;= 1</code> 计数；Python <code>n.bit_length() - 1</code></td></tr>
<tr><td>判断 01 交替（如 0b10101）</td><td><code>y = n ^ (n &gt;&gt; 1)</code> 应该全是 1，即 <code>y &amp; (y + 1) == 0</code></td></tr>
</table></div>
<p>本章练习题里有其中几个的编程版。</p>`,
    },
    {
      src: "输出预测", q: "Predict the output — classic C traps", qzh: "看代码说输出（C 经典陷阱）",
      points: String.raw`
~~~c
/* 1 */ unsigned int u = 1; int i = -1;
        if (i < u) printf("A"); else printf("B");     // B：i 被转成 unsigned，-1 变成 0xFFFFFFFF
/* 2 */ #define SQ(x) x * x
        printf("%d", SQ(2 + 3));                       // 11：展开成 2 + 3 * 2 + 3
/* 3 */ void f(int a[]) { printf("%zu", sizeof(a)); }  // 8（64 位）：数组参数退化成指针
/* 4 */ char c = 200; printf("%d", c);                 // -56（char 有符号时）
/* 5 */ int x = 5; if (x = 0) printf("zero"); else printf("%d", x);   // 0：赋值不是比较
/* 6 */ switch (2) { case 1: printf("1"); case 2: printf("2"); case 3: printf("3"); }  // 23：没有 break 会贯穿
/* 7 */ for (unsigned i = 3; i >= 0; i--) printf("%u ", i);  // 死循环：unsigned 永远 >= 0
/* 8 */ int a = 7 / 2, b = -7 / 2, m = -7 % 2;          // 3, -3, -1：C 向零截断
/* 9 */ printf("%d", (int)sizeof(char) + (int)sizeof('a'));   // C: 1 + 4 = 5（'a' 在 C 里是 int）；C++: 2
/*10 */ int arr[5] = {1, 2}; printf("%d", arr[4]);       // 0：部分初始化，其余为 0
/*11 */ static int n; int *p = NULL; printf("%d", n);   // 0：static 自动清零
/*12 */ uint8_t v = 255; v++; printf("%u", v);          // 0：无符号溢出会回绕（有符号溢出是未定义行为）
~~~
`,
      say: "Here the comparison mixes a signed int and an unsigned int, so the signed value is converted to unsigned, and minus one becomes a very large number. That's why the condition is false and it prints B. I would fix it by casting explicitly or by avoiding mixed signed and unsigned comparisons.",
    },
    {
      src: "操作系统", q: "Operating system questions", qzh: "操作系统常见题",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>问题</th><th>一句话答案</th></tr>
<tr><td>进程状态</td><td>新建 → 就绪 ready → 运行 running →（等 I/O）阻塞 waiting → 就绪 …… → 终止。</td></tr>
<tr><td>上下文切换 context switch</td><td>保存当前进程/线程的寄存器和状态，恢复另一个的；有开销，线程切换比进程切换便宜（不用换地址空间）。</td></tr>
<tr><td>虚拟内存</td><td>每个进程看到独立、连续的地址空间，由 MMU 通过页表映射到物理内存；内存不够时把页换到磁盘。</td></tr>
<tr><td>分页 vs 分段</td><td>分页按固定大小的页，无外部碎片；分段按逻辑单元（代码、数据、栈），大小不一。</td></tr>
<tr><td>缺页 page fault / 抖动 thrashing</td><td>访问的页不在内存时触发缺页，由 OS 调入；内存严重不足时大部分时间都在换页，叫抖动——这也是“软件越跑越慢”的一个表现。</td></tr>
<tr><td>内部碎片 vs 外部碎片</td><td>分配的块比需要的大而浪费 / 空闲内存总量够但不连续。</td></tr>
<tr><td>调度算法</td><td>FCFS 先来先服务、SJF 短作业优先、Round Robin 时间片轮转、优先级调度（可能饥饿，用 aging 解决）。</td></tr>
<tr><td>抢占式 vs 非抢占式</td><td>OS 可以强行打断正在运行的任务 / 只能等任务主动让出 CPU。</td></tr>
<tr><td>僵尸进程 / 孤儿进程</td><td>子进程已结束但父进程没 wait 回收，残留进程表项 / 父进程先结束，子进程被 init 收养。</td></tr>
<tr><td>临界区 critical section</td><td>访问共享资源的代码段，同一时间只能一个线程执行，用锁保护。</td></tr>
<tr><td>同一个非递归 mutex 加锁两次</td><td>自己等自己 → 死锁（或报错，取决于实现）。</td></tr>
<tr><td>死锁的处理</td><td>预防（破坏四个条件之一，如固定加锁顺序）、避免（银行家算法）、检测和恢复（杀进程、回滚）。</td></tr>
<tr><td>用户态 vs 内核态 / 系统调用</td><td>普通程序在用户态运行，访问硬件、文件等要通过系统调用陷入内核态。</td></tr>
<tr><td>缓冲 buffer vs 缓存 cache</td><td>buffer 用于平衡两端速度差（如串口接收缓冲）；cache 保存常用数据的副本以加快访问。</td></tr>
<tr><td>实时系统 RTOS</td><td>保证在截止时间内响应；硬实时（错过即失败）vs 软实时。测试设备、汽车电子常用。</td></tr>
</table></div>`,
    },
    {
      src: "嵌入式 / 测试站", q: "Embedded & test-station questions", qzh: "嵌入式、硬件接口、测试站相关",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>问题</th><th>一句话答案</th></tr>
<tr><td>UART / SPI / I²C 区别</td><td>UART：异步、2 根线（TX/RX）、点对点、双方约定波特率。SPI：同步、4 根线（SCLK/MOSI/MISO/CS）、全双工、速度快、一主多从靠片选。I²C：同步、2 根线（SDA/SCL）、靠地址区分多个设备、速度较慢、有 ACK。</td></tr>
<tr><td>UART 一帧的格式</td><td>起始位（0）+ 5–9 个数据位（低位先发）+ 可选校验位 + 1–2 个停止位（1）。常见配置 9600/115200 8N1。</td></tr>
<tr><td>波特率 baud rate</td><td>每秒传多少个符号（对 UART 就是位）。115200 8N1 每字节 10 位，约 11520 字节/秒。双方误差一般要小于 2–3%。</td></tr>
<tr><td>奇偶校验 parity</td><td>额外一位让 1 的个数为奇数/偶数，只能检测单个位错误，不能纠正。</td></tr>
<tr><td>checksum vs CRC</td><td>校验和是简单相加，速度快但检错能力弱（字节顺序互换就查不出）；CRC 基于多项式除法，能检测突发错误，串口/网络/存储都常用。</td></tr>
<tr><td>RS-232 vs RS-485 vs TTL</td><td>RS-232 用正负电压，点对点，距离短；RS-485 差分信号，抗干扰、距离远、可多点总线；TTL 是芯片直接的 0/3.3V 或 5V 电平，不能直接接 RS-232。</td></tr>
<tr><td>流控 flow control</td><td>硬件 RTS/CTS 或软件 XON/XOFF，接收方忙时让发送方暂停，防止溢出丢字节。</td></tr>
<tr><td>看门狗 watchdog</td><td>一个定时器，程序要定期“喂狗”；程序卡死没喂就自动复位系统。</td></tr>
<tr><td>中断服务程序 ISR 的注意事项</td><td>要短、不能阻塞、不要调用 printf/malloc，共享变量用 volatile 并注意原子性。</td></tr>
<tr><td>环形缓冲区 ring buffer</td><td>固定大小数组 + 读写下标取模，适合一个生产者（ISR）一个消费者（主循环），见「栈与队列」章节。</td></tr>
<tr><td>去抖 debounce</td><td>按键/开关机械抖动会产生多次跳变；用延时或连续采样多次一致才确认。</td></tr>
<tr><td>测试站一个测试流程怎么设计</td><td>初始化仪器 → 发命令给被测设备 DUT → 读测量值 → 和上下限比较判 Pass/Fail → 记录日志和结果 → 异常时重试或报警。每一步都要有超时和错误处理。</td></tr>
<tr><td>测量结果偶尔失败（flaky）怎么办</td><td>先收集数据看是否随机：重复测量统计分布、看环境（温度、接触、线缆）、检查时序（等待时间够不够）、检查仪器校准；不要简单地加重试掩盖问题。</td></tr>
<tr><td>Pass/Fail 阈值和测量误差</td><td>测量值接近上下限时，噪声会让结果来回跳；可以设置保护带 guard band、多次测量取平均、记录原始值而不只记录 Pass/Fail。</td></tr>
</table></div>`,
    },
    {
      src: "测试", q: "Software testing questions", qzh: "软件测试常见题",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>问题</th><th>一句话答案</th></tr>
<tr><td>单元测试 / 集成测试 / 系统测试 / 回归测试</td><td>测单个函数 / 测模块之间的配合 / 测整个系统是否满足需求 / 改动后重新跑已有测试，确认没把旧功能弄坏。</td></tr>
<tr><td>黑盒 vs 白盒</td><td>只看输入输出不看实现 / 根据代码结构设计用例（覆盖每个分支）。</td></tr>
<tr><td>边界值分析 / 等价类划分</td><td>重点测边界（最小、最大、刚好越界）；把输入分成行为相同的几类，每类测一个代表。</td></tr>
<tr><td>给 foo(n) 设计测试用例</td><td>0、1、2 的幂、全 1、最大值、最小值、负数、典型值；每个用例写清期望输出。</td></tr>
<tr><td>怎么测试一个排序函数</td><td>空数组、一个元素、已排序、逆序、全相同、有重复、有负数、大数组；检查结果有序且是原数组的排列。</td></tr>
<tr><td>Bug 报告要包含什么</td><td>标题、环境/版本、复现步骤、期望结果、实际结果、日志/截图、出现频率、严重程度。</td></tr>
<tr><td>assert 的作用</td><td>在调试版检查“不应该发生”的条件，失败时立即停下并报告位置；不能用于处理正常的运行时错误。</td></tr>
</table></div>`,
    },
    {
      src: "算法题", q: "Coding problems most often asked in this kind of interview", qzh: "这类公司常见的编程题（都已在练习里）",
      points: String.raw`<div class="tblwrap"><table>
<tr><th>题目</th><th>在哪练</th></tr>
<tr><td>反转字符串 / 反转单词 / 回文 / 数单词 / 词频</td><td><a href="#strings">字符串</a>、<a href="#hash">哈希表</a></td></tr>
<tr><td>数 1 的个数 / 2 的幂 / 字节和 / 反转位 / 交换两数</td><td><a href="#bits">位运算</a>、本章练习</td></tr>
<tr><td>斐波那契（递归和非递归）/ 阶乘 / 质数 / 反转数字 / 阿姆斯特朗数</td><td><a href="#python">Python 速查</a>、<a href="#recursion">递归</a>、本章练习</td></tr>
<tr><td>数组：最大/第二大、去重、移动零、两数之和、合并有序数组</td><td><a href="#arrays">数组与双指针</a></td></tr>
<tr><td>链表：反转、找中点、判环、合并、删除倒数第 n 个</td><td><a href="#linkedlist">链表</a></td></tr>
<tr><td>二分查找及其变体（HR 原题 findSmallestValueToPass）</td><td><a href="#bsearch">二分查找</a></td></tr>
<tr><td>排序：冒泡、插入、快排、归并，以及它们的复杂度</td><td><a href="#sorting">排序</a></td></tr>
<tr><td>栈：括号匹配、用栈实现队列、最小栈</td><td><a href="#stack">栈与队列</a></td></tr>
<tr><td>串口帧解析、序号检查</td><td><a href="#hr">HR 真题</a></td></tr>
</table></div>`,
    },
  ],
  problems: [],
});
