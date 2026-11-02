// Chapter: systems & C concept questions (HR #5, #7, #10, #11 and likely follow-ups).
window.CHAPTERS.push({
  id: "systems", order: 30, num: "16", group: "概念问答 Concepts", title: "系统与 C 概念", en: "Systems & C concepts",
  blurb: "Stack/Heap · 软件变慢 · IPC · 串口",
  eyebrow: "CONCEPT Q&A",
  qaLabel: "问答卡",
  qaIntro: String.raw`<p>每张卡：先看英文问题，<b>自己用英文说 30–60 秒</b>，再展开中文要点和参考回答对照。参考回答可以朗读，跟读练发音和节奏。标 HR 的是 HR 提到过的原题，其余是同类公司常见的追问。</p>`,
  qa: [
    {
      src: "HR #5", q: "What is the difference between the stack and the heap?", qzh: "栈和堆的区别",
      points: String.raw`
<div class="tblwrap"><table>
<tr><th></th><th>Stack 栈</th><th>Heap 堆</th></tr>
<tr><td>存什么</td><td>局部变量、函数参数、返回地址（栈帧）</td><td><code>malloc</code> / <code>new</code> 动态分配的内存</td></tr>
<tr><td>谁管理</td><td>编译器自动：进函数压栈，返回时弹出</td><td>程序员手动 <code>free</code> / <code>delete</code>（或 GC、智能指针）</td></tr>
<tr><td>速度</td><td>很快，只移动栈指针</td><td>较慢，分配器要找空闲块</td></tr>
<tr><td>大小</td><td>小且固定（Linux 主线程默认约 8MB，Windows 约 1MB）</td><td>大，受虚拟内存限制</td></tr>
<tr><td>生命周期</td><td>函数返回就失效</td><td>直到被释放</td></tr>
<tr><td>典型问题</td><td>递归太深 / 大数组 → stack overflow；返回局部变量地址 → 悬空指针</td><td>内存泄漏、重复释放、碎片化、use-after-free</td></tr>
</table></div>
~~~c
int *bad(void) {
    int x = 42;
    return &x;              // BUG: x 在栈上，函数返回后就无效了
}
int *good(void) {
    int *p = malloc(sizeof(int));   // 堆上，调用者负责 free
    *p = 42;
    return p;
}
~~~
`,
      say: "The stack holds function call frames: local variables, parameters and return addresses. It's managed automatically, allocation is just moving the stack pointer, so it's very fast, but it's small, typically a few megabytes, and the memory disappears when the function returns. The heap is for dynamic allocation with malloc or new. It's much larger and the memory lives until you free it, but allocation is slower and you have to manage it yourself, so the typical bugs are memory leaks, double frees and fragmentation. On the stack, the typical bugs are stack overflow from deep recursion and returning a pointer to a local variable.",
    },
    {
      src: "HR #5", q: "If you don't initialize a variable, what value does it have?", qzh: "变量没有初始化会显示什么",
      points: String.raw`
<div class="tblwrap"><table>
<tr><th>变量类型</th><th>未初始化时的值</th></tr>
<tr><td>全局变量、<code>static</code> 变量</td><td><b>0</b>（放在 .bss 段，程序启动时清零）</td></tr>
<tr><td>局部变量（栈上）</td><td><b>不确定 indeterminate</b>——是这块栈内存之前留下的垃圾值；读取它是未定义行为</td></tr>
<tr><td><code>malloc</code> 的内存</td><td>不确定（不保证清零）</td></tr>
<tr><td><code>calloc</code> 的内存</td><td>0</td></tr>
<tr><td>C++ <code>new int</code> / <code>new int()</code></td><td>不确定 / 0</td></tr>
</table></div>
<p><b>调试版的特殊填充值</b>（MSVC Debug，面试提到会加分）：</p>
<ul>
<li><code>0xCCCCCCCC</code>：未初始化的栈内存（中文环境打印成“烫烫烫”）</li>
<li><code>0xCDCDCDCD</code>：malloc/new 后未初始化的堆内存（“屯屯屯”）</li>
<li><code>0xDDDDDDDD</code> / <code>0xFEEEFEEE</code>：已释放的内存</li>
</ul>
~~~c
#include <stdio.h>
int g;                         // 0
int main(void) {
    static int s;              // 0
    int local;                 // garbage (release 下可能每次不同；debug 下可能是 0xCCCCCCCC)
    printf("%d %d %d\n", g, s, local);
    return 0;
}
~~~
<p>怎么发现：编译警告 <code>-Wall -Wuninitialized</code>、Valgrind（"Conditional jump depends on uninitialised value"）、MemorySanitizer。最好的习惯：声明时就初始化。</p>
`,
      say: "It depends on the storage class. Global and static variables are zero-initialized, because they live in the BSS segment, which is cleared at program start. A local variable on the stack is not initialized at all; it contains whatever was left in that memory, so the value is indeterminate, and reading it is undefined behavior. Memory from malloc is also uninitialized, while calloc gives zeroed memory. In a Visual Studio debug build you often see the pattern 0xCCCCCCCC for uninitialized stack memory and 0xCDCDCDCD for uninitialized heap memory, which makes these bugs easier to spot. I'd catch them with compiler warnings and tools like Valgrind, and the best habit is to initialize at declaration.",
    },
    {
      src: "HR #7", q: "A program gets slower and slower the longer it runs. What could be wrong, and how would you find out?", qzh: "软件越跑越慢，可能是什么问题，怎么定位",
      points: String.raw`
<h3>可能原因</h3>
<ul>
<li><b>内存泄漏</b>：malloc/new 后没有 free/delete → 内存持续增长 → 系统开始换页（swap）→ 越来越慢，最终 OOM。</li>
<li><b>资源泄漏</b>：文件句柄、socket、线程、GDI 句柄没释放 → 达到上限后操作失败或变慢。</li>
<li><b>数据结构无限增长</b>：缓存没有淘汰策略、队列只进不出、日志写到一个越来越大的文件、列表越来越长导致 O(n) 查找变慢。</li>
<li><b>内存碎片</b>：长期频繁分配释放不同大小的块。</li>
<li><b>锁竞争 / 线程越来越多</b>，或者某个后台任务积压。</li>
<li>垃圾回收语言里：对象被意外引用（如全局列表、事件监听没注销），GC 越来越频繁。</li>
</ul>
<h3>定位步骤（先测量，后猜测）</h3>
<ol>
<li><b>监控趋势</b>：随时间记录内存（RSS）、CPU、句柄数、线程数。工具：Windows 任务管理器 / Process Explorer / perfmon，Linux <code>top</code>、<code>ps</code>、<code>vmstat</code>、<code>lsof</code>。内存一直涨 → 泄漏；CPU 一直涨 → 算法或积压问题。</li>
<li><b>复现</b>：用压力测试/长时间运行在测试环境复现，缩短复现时间。</li>
<li><b>内存分析</b>：Valgrind memcheck、AddressSanitizer/LeakSanitizer、heaptrack、Visual Studio 诊断工具、Python <code>tracemalloc</code>；对比两个时间点的堆快照，看哪类对象在增长。</li>
<li><b>CPU 分析</b>：perf、gprof、VTune、py-spy，看热点函数随时间是否变化。</li>
<li><b>日志</b>：给关键操作打时间戳，看哪一步变慢。</li>
<li><b>二分定位</b>：关掉某些模块/回退版本，看问题是否消失。</li>
<li>修复后<b>再跑一次长时间测试</b>确认。</li>
</ol>
`,
      say: "The classic cause is a resource leak. Most often it's memory: something is allocated on every request or every loop iteration and never freed, so memory grows until the system starts swapping. It can also be leaked file handles, sockets or threads, a cache or queue that grows without bound, a log file that keeps growing, or a data structure whose lookups get slower as it fills up. To find it, I would first measure rather than guess: monitor memory, CPU, handle count and thread count over time. If memory keeps climbing, I'd run the program under Valgrind or AddressSanitizer, or compare heap snapshots at two points in time to see what's growing. If CPU is the problem, I'd use a profiler like perf to find the hot path. Timestamps in the logs also help show which step is getting slower. After fixing it, I'd run a long soak test to confirm.",
    },
    {
      src: "HR #10", q: "What are the ways to do inter-process communication (IPC)?", qzh: "进程间通信有哪些方式",
      points: String.raw`
<div class="tblwrap"><table>
<tr><th>方式</th><th>特点</th><th>适用</th></tr>
<tr><td>管道 pipe（匿名）</td><td>单向字节流，只能用于父子进程</td><td><code>ls | grep</code>，父进程读子进程输出</td></tr>
<tr><td>命名管道 FIFO / Named pipe</td><td>有名字，无亲缘关系的进程也能用</td><td>本机两个独立程序</td></tr>
<tr><td>消息队列 message queue</td><td>按消息为单位，有边界，可带优先级</td><td>生产者/消费者</td></tr>
<tr><td>共享内存 shared memory</td><td><b>最快</b>（不用拷贝），但需要信号量/互斥锁自己同步</td><td>大数据量，如图像、采集数据</td></tr>
<tr><td>信号量 semaphore</td><td>主要用于同步，不传数据</td><td>配合共享内存</td></tr>
<tr><td>信号 signal</td><td>异步通知，携带信息很少</td><td>SIGINT、SIGTERM、SIGCHLD</td></tr>
<tr><td>Socket（TCP/UDP、Unix domain socket）</td><td>最通用，可跨机器</td><td>客户端/服务器、分布式</td></tr>
<tr><td>内存映射文件 mmap</td><td>把文件映射到内存，多个进程共享</td><td>大文件共享</td></tr>
<tr><td>文件</td><td>最简单，慢，要处理并发</td><td>配置、批处理</td></tr>
<tr><td>更高层：RPC / gRPC、D-Bus、COM、Windows 消息</td><td>基于上面的机制封装</td><td>服务化系统</td></tr>
</table></div>
<p><b>怎么选</b>：同一台机器、数据量大 → 共享内存 + 信号量；要跨机器或要简单可靠 → socket；父子进程简单传输 → pipe。</p>
`,
      say: "There are several options. Pipes are one-way byte streams, anonymous pipes for parent and child processes and named pipes, or FIFOs, for unrelated processes. Message queues send discrete messages with boundaries. Shared memory is the fastest because there's no copying, but you have to synchronize access yourself with a semaphore or mutex. Signals are for simple asynchronous notifications. Sockets are the most general: Unix domain sockets on the same machine, or TCP and UDP across machines. There are also memory-mapped files, plain files, and higher-level frameworks like RPC or D-Bus built on top of these. I'd choose shared memory for large, high-throughput data on one machine, and sockets when I need to cross machines or want something simple and robust.",
    },
    {
      src: "HR #11", q: "A test station communicates over a serial port. A read function returns an odd number of bytes and a byte is missing. How do you handle it and how do you check?", qzh: "串口通信：读到的字节数是奇数，丢了一个字节，怎么处理、怎么检查",
      points: String.raw`
<h3>先理解为什么会丢字节</h3>
<ul>
<li><b>接收缓冲区溢出 overrun</b>：读得太慢（轮询间隔太长、主线程被阻塞），UART 硬件 FIFO 或驱动缓冲满了，新字节覆盖/丢弃。</li>
<li><b>波特率 / 数据位 / 停止位 / 校验位配置不一致</b>，或时钟误差 → framing error。</li>
<li><b>没有流控</b>（RTS/CTS 硬件流控或 XON/XOFF 软件流控）。</li>
<li>线缆、接地、干扰等硬件问题；电平不匹配（RS-232 vs TTL）。</li>
<li>软件 bug：一次 <code>read()</code> 不保证返回请求的全部字节（可能只返回部分），代码却假设读满了；或者 16 位数据按字节读时没对齐（“odd byte”）。</li>
</ul>
<h3>怎么检查</h3>
<ol>
<li>看 UART <b>错误标志/计数</b>：overrun、framing、parity error（Linux <code>/proc/tty/driver/serial</code> 或 <code>TIOCGICOUNT</code>，Windows <code>ClearCommError</code>）。</li>
<li><b>记录原始十六进制数据</b>（带时间戳），和发送端期望的数据逐字节对比，看丢在哪里、是否有规律（每次满缓冲区时丢？）。</li>
<li><b>环回测试 loopback</b>（TX 接 RX）排除对端问题；用已知固定模式（0x00..0xFF 循环）测试。</li>
<li>用<b>逻辑分析仪 / 示波器</b>看线上的真实波形，判断是线上就没有，还是收到后软件丢了。</li>
<li>降低波特率、开启流控，看问题是否消失 → 判断是否是吞吐/时序问题。</li>
</ol>
<h3>怎么处理（协议层面让丢字节可检测、可恢复）</h3>
<ul>
<li><b>帧格式</b>：帧头（如 0xAA 0x55）+ 长度 + 数据 + 校验（checksum / CRC-16）。长度不对或校验失败就丢弃这一帧，从下一个帧头<b>重新同步</b>。</li>
<li><b>序号</b>：检测整帧丢失；<b>ACK/NAK + 超时重传</b>。</li>
<li><b>读取方式</b>：循环读直到收满期望长度或超时；接收放在独立线程/中断里，写入环形缓冲区，主逻辑再从缓冲区解析；加大驱动缓冲区。</li>
</ul>
<p>练习：「HR 真题」章节的 <a href="#hr--parse-frames">Parse frames and resync</a> 和 <a href="#hr--missing-seq">Find missing sequence numbers</a>。</p>
`,
      say: "First I'd figure out where the byte is lost. Common causes are a receive buffer overrun because the application reads too slowly, a mismatch in baud rate, parity or stop bits, missing flow control, electrical noise, or simply a software bug where the code assumes one read call returns all the requested bytes. To check, I'd look at the UART error counters for overrun, framing and parity errors, log the raw bytes in hex with timestamps and compare them against what the sender transmitted, and do a loopback test with a known pattern. If needed, I'd put a logic analyzer on the line to see whether the byte is actually on the wire. To make the system robust, I'd use a framed protocol with a header, a length field and a checksum or CRC, so a damaged frame is detected and discarded and the receiver resynchronizes on the next header. Sequence numbers with acknowledgements and retransmission handle lost frames. And I'd read in a dedicated thread or interrupt into a ring buffer, looping until the full frame arrives or a timeout expires.",
    },
    {
      src: "常见追问", q: "What is the difference between a process and a thread?", qzh: "进程和线程的区别",
      points: String.raw`
<ul>
<li><b>进程</b>：资源分配的单位，有独立的虚拟地址空间、文件句柄等。一个进程崩溃一般不影响其他进程。创建和切换开销大。进程间通信要用 IPC。</li>
<li><b>线程</b>：CPU 调度的单位，同一进程内的线程<b>共享</b>堆、全局变量、文件句柄，但各有自己的<b>栈</b>和寄存器。创建和切换开销小，通信方便（直接读写共享内存），但要加锁防止竞态条件；一个线程崩溃会导致整个进程崩溃。</li>
</ul>
`,
      say: "A process is an independent program in execution with its own virtual address space and resources, so processes are isolated from each other and need IPC to communicate. A thread is a unit of execution inside a process. Threads in the same process share the heap, global data and open files, but each has its own stack and registers. Threads are cheaper to create and switch, and they can share data directly, but that sharing means you need synchronization to avoid race conditions, and a crash in one thread brings down the whole process.",
    },
    {
      src: "常见追问", q: "What is a race condition? Mutex vs semaphore? What causes a deadlock?", qzh: "竞态条件、互斥锁与信号量、死锁",
      points: String.raw`
<ul>
<li><b>竞态条件</b>：多个线程同时读写共享数据，结果取决于执行顺序。例：两个线程同时 <code>count++</code>（读-改-写不是原子的），结果可能少加。</li>
<li><b>Mutex 互斥锁</b>：同一时刻只允许一个线程进入临界区，有“所有者”，谁加锁谁解锁。</li>
<li><b>Semaphore 信号量</b>：一个计数器，允许最多 N 个线程同时访问（如 N 个缓冲槽位）；也常用于线程/中断间的通知，没有所有者概念。二值信号量看起来像 mutex，但语义不同。</li>
<li><b>死锁四个必要条件</b>：互斥、持有并等待、不可抢占、循环等待。经典场景：线程 A 持有锁 1 等锁 2，线程 B 持有锁 2 等锁 1。</li>
<li><b>预防</b>：所有线程按固定顺序加锁；使用带超时的 try_lock；减小锁的范围；尽量避免持锁时调用外部代码。</li>
</ul>
`,
      say: "A race condition happens when multiple threads access shared data and at least one writes, so the result depends on timing; for example, two threads incrementing the same counter can lose updates because increment is a read-modify-write. A mutex gives exclusive access to a critical section and is owned by the thread that locked it. A semaphore is a counter that lets up to N threads in, or is used for signaling between threads, and has no owner. A deadlock needs four conditions: mutual exclusion, hold and wait, no preemption, and circular wait. The simplest prevention is to always acquire locks in the same global order, or to use timeouts.",
    },
    {
      src: "常见追问", q: "What causes a segmentation fault, and how do you debug one?", qzh: "段错误的原因和调试方法",
      points: String.raw`
<ul>
<li><b>原因</b>：访问了不属于自己或没有权限的内存：空指针解引用、数组越界、使用已释放的内存（use-after-free）、悬空指针、栈溢出（无限递归）、写只读内存（修改字符串字面量）。</li>
<li><b>调试</b>：用 <code>-g</code> 编译后在 gdb 里运行，崩溃时 <code>bt</code> 看调用栈；开启 core dump 事后分析；AddressSanitizer（<code>-fsanitize=address</code>）能精确报告越界和 use-after-free 的位置；Valgrind memcheck。</li>
<li><b>思路</b>：先稳定复现 → 找到崩溃的行 → 看相关指针的值从哪里来 → 往回追。</li>
</ul>
`,
      say: "A segmentation fault means the program touched memory it isn't allowed to access. Typical causes are dereferencing a null or dangling pointer, going past the end of an array, using memory after it's been freed, writing to a string literal, or stack overflow from runaway recursion. To debug it, I compile with debug symbols, reproduce it under gdb and look at the backtrace to find the faulting line, then trace back where the bad pointer came from. AddressSanitizer or Valgrind are very effective because they report the exact invalid access, often before it crashes.",
    },
    {
      src: "常见追问", q: "What is endianness? How can you check it in code?", qzh: "大小端是什么，怎么用代码判断",
      points: String.raw`
<ul>
<li><b>小端 little-endian</b>：低位字节存在低地址。0x12345678 在内存里是 <code>78 56 34 12</code>。x86、大多数 ARM 配置。</li>
<li><b>大端 big-endian</b>：高位字节存在低地址：<code>12 34 56 78</code>。网络字节序（network byte order）是大端，所以要用 <code>htonl</code> / <code>ntohl</code> 转换。</li>
<li>串口/网络协议里多字节字段必须约定字节序，否则对端解析错误。</li>
</ul>
~~~c
int is_little_endian(void) {
    unsigned int x = 1;
    return *(unsigned char *)&x == 1;   // 最低地址的字节是 1 → 小端
}
~~~
~~~py
import sys
sys.byteorder                          # 'little'
(0x12345678).to_bytes(4, "little")     # b'xV4\x12'
~~~
`,
      say: "Endianness is the order in which the bytes of a multi-byte value are stored in memory. Little-endian stores the least significant byte at the lowest address, which is what x86 and most ARM systems use; big-endian stores the most significant byte first, and it's the standard network byte order. To check it in C, I store the integer one and look at the first byte through an unsigned char pointer: if it's one, the machine is little-endian. It matters for serial and network protocols, so both sides must agree on the byte order of multi-byte fields.",
    },
    {
      src: "常见追问", q: "What do the keywords static, volatile and const mean in C?", qzh: "static、volatile、const 的含义",
      points: String.raw`
<ul>
<li><b>static</b>：① 函数内的 static 局部变量：只初始化一次，值在多次调用之间保留，存在数据段而不是栈上。② 文件作用域的 static 全局变量/函数：只在本文件可见（内部链接）。</li>
<li><b>volatile</b>：告诉编译器这个变量可能在程序之外被改变（硬件寄存器、中断服务程序、多线程），每次都要从内存读取，不能优化掉或缓存在寄存器里。典型：串口状态寄存器、ISR 里修改的标志位。注意 volatile 不保证原子性，也不能代替锁。</li>
<li><b>const</b>：只读。<code>const int *p</code>：不能通过 p 改值；<code>int *const p</code>：p 本身不能指向别处。</li>
</ul>
`,
      say: "Static on a local variable means it's initialized once and keeps its value between calls, because it's stored in the data segment rather than on the stack. Static on a global variable or function limits its visibility to that source file. Volatile tells the compiler the value can change outside the normal program flow, for example a hardware register or a flag set by an interrupt handler, so every access must actually read memory and can't be optimized away. It doesn't make operations atomic, though. Const marks something as read-only; with pointers, it matters whether the pointed-to data or the pointer itself is const.",
    },
    {
      src: "常见追问", q: "Polling versus interrupts — which would you use to receive serial data?", qzh: "轮询和中断的区别，串口接收用哪个",
      points: String.raw`
<ul>
<li><b>轮询 polling</b>：主循环不断检查状态位。简单、时序可预测，但浪费 CPU，检查间隔太长会丢数据。</li>
<li><b>中断 interrupt</b>：数据到达时硬件打断 CPU，执行中断服务程序（ISR）。响应快、省 CPU。ISR 要短：只把字节放进环形缓冲区，复杂解析放到主循环。</li>
<li><b>DMA</b>：大量数据时由 DMA 控制器直接搬到内存，CPU 只在块完成时处理。</li>
<li>串口接收一般用 <b>中断（或 DMA）+ 环形缓冲区</b>，避免 overrun 丢字节。</li>
</ul>
`,
      say: "With polling, the main loop repeatedly checks a status flag. It's simple and predictable but wastes CPU time, and if the loop is busy for too long, incoming bytes can be overwritten. With interrupts, the hardware notifies the CPU when data arrives, so the response is fast and the CPU is free otherwise. For serial reception I'd use an interrupt, or DMA for high data rates, and keep the interrupt handler very short: it just pushes the byte into a ring buffer, and the main loop parses frames from that buffer. That's the standard way to avoid overrun errors.",
    },
    {
      src: "常见追问", q: "How do you approach debugging code you've never seen before?", qzh: "面对陌生代码，你怎么调试",
      points: String.raw`
<ol>
<li><b>复现</b>：找到稳定触发问题的最小输入。</li>
<li><b>理解期望行为</b>：问清楚应该输出什么。</li>
<li><b>缩小范围</b>：加日志/打印、断点、单步执行；二分注释掉代码或回退版本（git bisect）。</li>
<li><b>形成假设并验证</b>：一次只改一个地方，观察结果。</li>
<li><b>修复后</b>：加一个回归测试用例，检查同类代码有没有同样的问题。</li>
</ol>
<p>面试时把这套流程<b>边做边说出来</b>，比直接给出答案更重要。</p>
`,
      say: "I start by reproducing the problem reliably with the smallest input I can find, and I make sure I understand what the correct behavior should be. Then I narrow it down: add logging or set breakpoints, step through the suspicious part, or bisect by disabling code or checking older versions. Once I have a hypothesis, I change one thing at a time and verify it. After the fix, I add a regression test and check whether the same mistake exists elsewhere in the code.",
    },
  ],
});
