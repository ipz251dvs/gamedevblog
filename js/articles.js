/* ============================================================
   ДАНІ СТАТЕЙ
   Кожен ключ — унікальний ID статті.
   ============================================================ */
const ARTICLES = {

  /* === Стаття: Фізика в Unity === */
  physics: {
    tag:   'Unity · Фізика',
    title: 'Повний гайд по фізиці в Unity 6: Rigidbody, колізії та фізичні матеріали',
    meta:  ['12 червня 2025', '18 хв читання', '4 200 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>Навіщо розуміти фізику?</h2>
<p>Більшість початківців у Unity просто додають Rigidbody до об'єкта і сподіваються, що «воно само запрацює». Перший час це дійсно так. Але коли гра ускладнюється — персонаж застряє в стінах, об'єкти тремтять, колізії спрацьовують невчасно. Ця стаття допоможе розібратися з фізикою Unity раз і назавжди.</p>
<h2>Rigidbody: основи та підводні камені</h2>
<p>Rigidbody — компонент, що передає управління об'єктом фізичному движку. Без нього об'єкт статичний, з ним — підпорядковується гравітації та силам.</p>
<p><strong>Collision Detection Mode</strong> — критичний параметр. Discrete (за замовчуванням) перевіряє колізії раз на кадр. Для швидких об'єктів об'єкт може «пролетіти крізь стіну» між кадрами. Варіанти:</p>
<ul>
  <li><strong>Continuous</strong> — перевіряє між кадрами зі статичними колайдерами</li>
  <li><strong>Continuous Dynamic</strong> — перевіряє і з іншими Rigidbody, але дорожче</li>
  <li><strong>Continuous Speculative</strong> — найдешевший варіант для більшості задач</li>
</ul>
<div class="code-b"><span class="cm">// Оголошення компонента фізики як поля класу</span>
<span class="kw">private</span> Rigidbody rb;

<span class="kw">void</span> Start() {
    <span class="cm">// Кешуємо посилання в Start(), а не в Update() — для продуктивності</span>
    rb = GetComponent&lt;Rigidbody&gt;();
}

<span class="kw">void</span> FixedUpdate() {
    <span class="cm">// УВАГА: рух фізичних об'єктів — тільки у FixedUpdate!</span>
    <span class="cm">// transform.position ламає фізику і колізії.</span>
    Vector3 dir = <span class="kw">new</span> Vector3(Input.GetAxis(<span class="st">"Horizontal"</span>), 0, Input.GetAxis(<span class="st">"Vertical"</span>));
    rb.MovePosition(rb.position + dir * speed * Time.fixedDeltaTime);
}</div>
<h2>Типи Collider</h2>
<ul>
  <li><strong>Box Collider</strong> — найшвидший, ідеальний для платформ</li>
  <li><strong>Sphere Collider</strong> — для куль і снарядів</li>
  <li><strong>Capsule Collider</strong> — стандарт для персонажів</li>
  <li><strong>Mesh Collider</strong> — точний, але повільний. Не використовуй для рухомих об'єктів!</li>
</ul>
<div class="tip-b"><p>Кілька Box/Sphere Collider на одному об'єкті дешевші, ніж один Mesh Collider з сотнями полігонів.</p></div>
<h2>Physics Materials</h2>
<div class="code-b"><span class="cm">// Програмне створення фізичного матеріалу "лід"</span>
PhysicMaterial ice = <span class="kw">new</span> PhysicMaterial(<span class="st">"Ice"</span>);
ice.dynamicFriction = 0.05f; <span class="cm">// тертя під час руху</span>
ice.staticFriction  = 0.05f; <span class="cm">// тертя в стані спокою</span>
ice.bounciness      = 0.0f;  <span class="cm">// пружність (0 = не відскакує)</span>
ice.frictionCombine = PhysicMaterialCombine.Minimum;
GetComponent&lt;Collider&gt;().material = ice;</div>
<h2>Висновки</h2>
<p>Переміщай об'єкти через FixedUpdate та методи Rigidbody, використовуй примітивні колайдери, правильно налаштовуй Collision Detection Mode. Ці три правила вирішать 90% проблем з фізикою.</p>`
  },

  /* === Стаття: Шейдери === */
  shaders: {
    tag:   'Шейдери · HLSL',
    title: 'HLSL шейдери в Unity: від нуля до ефекту дощу на склі',
    meta:  ['20 травня 2025', '22 хв читання', '3 800 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>Що таке шейдери?</h2>
<p>Шейдер — це програма, що виконується на відеокарті (GPU) і визначає, як рендерити кожен піксель. Unity надає Shader Graph для візуального редагування, але код відкриває більше можливостей.</p>
<h2>Структура URP-шейдера</h2>
<div class="code-b">Shader <span class="st">"Custom/RainOnGlass"</span> {
    Properties {
        <span class="cm">// Параметри видно в Inspector Unity</span>
        _MainTex    (<span class="st">"Текстура"</span>,      2D)    = <span class="st">"white"</span> {}
        _RainSpeed  (<span class="st">"Швидкість"</span>,     Float) = 1.0
        _DropSize   (<span class="st">"Розмір краплі"</span>, Float) = 0.5
        _Distortion (<span class="st">"Спотворення"</span>,  Float) = 0.02
    }
    SubShader {
        Tags { <span class="st">"RenderType"</span>=<span class="st">"Transparent"</span> }
        Pass {
            HLSLPROGRAM
            <span class="kw">#pragma</span> vertex vert   <span class="cm">// точка входу вершинного шейдера</span>
            <span class="kw">#pragma</span> fragment frag <span class="cm">// точка входу фрагментного шейдера</span>
            ENDHLSL
        }
    }
}</div>
<h2>Функція краплі дощу</h2>
<div class="code-b"><span class="cm">// Повертає "маску" краплі в позиції UV</span>
<span class="kw">float2</span> RainDrop(<span class="kw">float2</span> uv, <span class="kw">float</span> t) {
    uv.y += t * _RainSpeed;            <span class="cm">// анімуємо рух вниз</span>
    <span class="kw">float2</span> cell = floor(uv);           <span class="cm">// яка клітинка сітки</span>
    <span class="kw">float2</span> pos  = frac(uv);            <span class="cm">// позиція всередині клітинки [0..1]</span>
    <span class="kw">float2</span> drop = hash(cell)*0.6+0.2;  <span class="cm">// псевдовипадкова позиція краплі</span>
    <span class="kw">float</span>  dist = length(pos - drop);  <span class="cm">// відстань від поточного пікселя</span>
    <span class="kw">return</span> smoothstep(_DropSize, 0.0, dist); <span class="cm">// м'який круглий край</span>
}</div>
<div class="tip-b"><p>Обчислюй дорогі функції (шум, хеш) у vertex shader і передавай через varying — GPU обробляє вершини набагато рідше ніж пікселі.</p></div>
<h2>Заломлення через зміщення UV</h2>
<div class="code-b"><span class="cm">// Градієнт краплі дає напрямок "лінзи"</span>
<span class="kw">float2</span> offset = <span class="kw">float2</span>(ddy(drop), ddx(drop)) * _Distortion;
<span class="kw">float4</span> bg = SAMPLE_TEXTURE2D(_MainTex, sampler_MainTex, uv + offset);
<span class="kw">return</span> bg; <span class="cm">// пікселі фону зміщені — ефект скла</span></div>`
  },

  /* === Стаття: Godot === */
  godot: {
    tag:   'Godot 4 · Огляд',
    title: 'Godot 4 у 2025: чи варто переходити з Unity після скандалу з Runtime Fee?',
    meta:  ['28 травня 2025', '10 хв читання', '3 100 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>Що трапилось у вересні 2023?</h2>
<p>Unity оголосила Runtime Fee — плату за кожну установку гри. Спільнота відреагувала різко: сотні студій оголосили перехід на альтернативи, Godot отримав рекордні пожертвування. Unity відкликала анонс, але довіра була підірвана.</p>
<h2>Що нового у Godot 4</h2>
<ul>
  <li><strong>Vulkan рендерер</strong> — значно потужніший за попередній OpenGL</li>
  <li><strong>GDScript 2.0</strong> — типізація, лямбди, краща продуктивність</li>
  <li><strong>C# через .NET 6</strong> — повноцінна підтримка</li>
  <li><strong>Покращений 3D</strong> — PBR матеріали та глобальне освітлення</li>
</ul>
<h2>GDScript — простий синтаксис</h2>
<div class="code-b"><span class="cm"># Рух персонажа у Godot 4 — мінімум коду</span>
<span class="kw">extends</span> CharacterBody2D

<span class="kw">const</span> SPEED = 200.0  <span class="cm"># пікселів на секунду</span>
<span class="kw">const</span> JUMP  = -400.0 <span class="cm"># від'ємне = вгору</span>

<span class="kw">func</span> _physics_process(delta):
    <span class="kw">if not</span> is_on_floor():
        velocity.y += get_gravity().y * delta <span class="cm"># гравітація</span>
    <span class="kw">if</span> Input.is_action_just_pressed(<span class="st">"jump"</span>) and is_on_floor():
        velocity.y = JUMP  <span class="cm"># стрибок</span>
    <span class="kw">var</span> dir = Input.get_axis(<span class="st">"left"</span>, <span class="st">"right"</span>)
    <span class="cm"># тернарний оператор: рухаємось або гальмуємо</span>
    velocity.x = dir * SPEED if dir else move_toward(velocity.x, 0, SPEED)
    move_and_slide() <span class="cm"># вбудований рух з колізіями</span></div>
<div class="tip-b"><p>Для 2D-ігор у 2025 Godot 4 — серйозна альтернатива. Для складного 3D Unity досі має більше ресурсів та інструментів.</p></div>`
  },

  /* === Стаття: Blueprints vs C++ === */
  blueprints: {
    tag:   'Unreal Engine · C++',
    title: 'Blueprints проти C++ в Unreal Engine 5: коли що обирати',
    meta:  ['5 червня 2025', '12 хв читання', '2 700 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>Дві системи — одна мета</h2>
<p>Unreal Engine пропонує два підходи до програмування: візуальний Blueprints і класичний C++. Обидва повноцінні — але мають різні сильні сторони.</p>
<h2>Коли залишатись у Blueprints</h2>
<ul>
  <li>Прототипування та швидкий ітеративний процес</li>
  <li>Ігрова логіка рівня, кат-сцени, налаштування камери</li>
  <li>Робота в команді з дизайнерами без досвіду програмування</li>
  <li>UI/UX через UMG Widget Blueprints</li>
</ul>
<h2>Коли переходити на C++</h2>
<ul>
  <li>Критичні для продуктивності системи: AI, симуляції, мережевий код</li>
  <li>Власні компоненти, які використовуються в багатьох місцях</li>
  <li>Складні алгоритми: пошук шляху, процедурна генерація</li>
  <li>Інтеграція сторонніх бібліотек</li>
</ul>
<div class="tip-b"><p>Золоте правило: пиши базову логіку в C++, відкривай її у Blueprints через UFUNCTION та UPROPERTY — дизайнери зможуть налаштовувати параметри без коду.</p></div>`
  },

  /* === Стаття: Audio === */
  audio: {
    tag:   'Аудіо · FMOD',
    title: 'FMOD та Unity: адаптивна музика, що реагує на стан гри',
    meta:  ['14 травня 2025', '9 хв читання', '1 900 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>Чому не вистачає стандартного AudioSource?</h2>
<p>Unity AudioSource добре справляється з простими задачами: відтворити звук, зупинити, змінити гучність. Але для динамічної музики, що реагує на стан гри — потрібен FMOD.</p>
<h2>Інтеграція FMOD у Unity</h2>
<p>Завантажуємо FMOD Studio та Unity Integration з fmod.com. Імпортуємо пакет у проєкт через Package Manager.</p>
<div class="code-b"><span class="cm">// Відтворення події FMOD з параметром</span>
<span class="kw">using</span> FMODUnity;
<span class="kw">using</span> FMOD.Studio;

<span class="kw">public class</span> MusicManager : MonoBehaviour {
    EventInstance musicInstance;

    <span class="kw">void</span> Start() {
        <span class="cm">// Запускаємо подію (event) з FMOD Studio</span>
        musicInstance = RuntimeManager.CreateInstance(<span class="st">"event:/Music/MainTheme"</span>);
        musicInstance.start();
    }

    <span class="cm">// Встановлюємо параметр "Intensity" (0.0 — спокійно, 1.0 — бій)</span>
    <span class="kw">public void</span> SetIntensity(<span class="kw">float</span> value) {
        musicInstance.setParameterByName(<span class="st">"Intensity"</span>, value);
    }
}</div>
<div class="tip-b"><p>FMOD безкоштовний для ігор з доходом до $200 000 на рік — ідеально для indie-розробників.</p></div>`
  },

  /* === Стаття: Оптимізація === */
  optim: {
    tag:   'Unity · Оптимізація',
    title: 'Unity Profiler: як знизити навантаження на CPU на 40%',
    meta:  ['8 травня 2025', '15 хв читання', '2 400 переглядів', 'Автор: Владислав Демчук'],
    body: `
<h2>З чого починається оптимізація</h2>
<p>Ніколи не оптимізуй наосліп. Спочатку вимір, потім виправляй. Unity Profiler — твій головний інструмент.</p>
<h2>Типові вузькі місця</h2>
<ul>
  <li><strong>GetComponent у Update()</strong> — кешуй посилання в Start()</li>
  <li><strong>Знаходження об'єктів</strong> — Find() та FindObjectOfType() дуже повільні</li>
  <li><strong>Instantiate/Destroy</strong> — використовуй Object Pooling</li>
  <li><strong>Некешовані рядки</strong> — string concatenation у Update() породжує garbage</li>
</ul>
<div class="code-b"><span class="cm">// ПОГАНО: GetComponent кожен кадр = ~0.5ms зайвих витрат</span>
<span class="kw">void</span> Update() {
    GetComponent&lt;Renderer&gt;().material.color = Color.red;
}

<span class="cm">// ДОБРЕ: кешуємо в Awake/Start</span>
Renderer rend;
<span class="kw">void</span> Awake() { rend = GetComponent&lt;Renderer&gt;(); }
<span class="kw">void</span> Update() { rend.material.color = Color.red; }</div>
<h2>Object Pooling — основа продуктивності</h2>
<div class="code-b"><span class="cm">// Unity 2021+ має вбудований ObjectPool&lt;T&gt;</span>
<span class="kw">var</span> pool = <span class="kw">new</span> ObjectPool&lt;GameObject&gt;(
    createFunc:     () => Instantiate(bulletPrefab),
    actionOnGet:    obj => obj.SetActive(<span class="kw">true</span>),
    actionOnRelease:obj => obj.SetActive(<span class="kw">false</span>),
    actionOnDestroy:obj => Destroy(obj),
    maxSize: 50
);</div>
<div class="tip-b"><p>Після оптимізації завжди порівнюй Profiler до та після змін — щоб підтвердити реальний приріст продуктивності числами.</p></div>`
  },

  /* === Туторіал 1 === */
  t1: {
    tag:   'Туторіал · Початківці',
    title: 'Unity з нуля: перша 2D-платформерна гра за 7 днів',
    meta:  ['Туторіал', '4.5 годин', 'Unity 6', 'Початківець'],
    body: `
<h2>Що ми створимо</h2>
<p>Повноцінна 2D-платформерна гра: персонаж з анімацією, платформи, ворог, збирання монет, підрахунок очок. Наприкінці — публікація на itch.io.</p>
<h2>День 1: Встановлення та інтерфейс</h2>
<p>Завантажуємо Unity Hub з unity.com/download. Обираємо шаблон «2D (URP)». Знайомимося з вікнами: Scene View, Hierarchy, Inspector, Project Window, Console.</p>
<h2>День 2: Персонаж та рух</h2>
<div class="code-b"><span class="kw">public class</span> PlayerController : MonoBehaviour {
    [SerializeField] <span class="kw">float</span> speed = 8f;
    [SerializeField] <span class="kw">float</span> jump  = 12f;
    Rigidbody2D rb;
    <span class="kw">bool</span> grounded;

    <span class="kw">void</span> Start() { rb = GetComponent&lt;Rigidbody2D&gt;(); }

    <span class="kw">void</span> Update() {
        <span class="kw">float</span> h = Input.GetAxisRaw(<span class="st">"Horizontal"</span>);
        rb.velocity = <span class="kw">new</span> Vector2(h * speed, rb.velocity.y);
        <span class="kw">if</span> (Input.GetKeyDown(KeyCode.Space) && grounded) {
            rb.AddForce(Vector2.up * jump, ForceMode2D.Impulse);
            grounded = <span class="kw">false</span>;
        }
    }
    <span class="kw">void</span> OnCollisionEnter2D(Collision2D c) {
        <span class="kw">if</span> (c.gameObject.CompareTag(<span class="st">"Ground"</span>)) grounded = <span class="kw">true</span>;
    }
}</div>
<h2>Дні 3–4: Анімація через Animator</h2>
<p>Нарізаємо спрайт-аркуш через Sprite Editor. Створюємо Animation Clips: Idle, Run, Jump. В Animator Controller налаштовуємо переходи через параметри Speed та IsGrounded.</p>
<h2>День 5: Монети та рахунок</h2>
<p>Prefab монети з Collider2D (IsTriger = true). GameManager зберігає рахунок — клас Singleton. Canvas + TextMeshPro відображає поточний рахунок.</p>
<h2>Дні 6–7: Ворог і публікація</h2>
<p>Простий ворог патрулює між двома точками. Удар зверху — вмирає. Удар збоку — гравець втрачає HP. Публікація: File → Build Settings → WebGL → Build → itch.io upload.</p>`
  },

  /* === Туторіали 2–6 (скорочені) === */
  t2: {
    tag:   'Туторіал · C#',
    title: 'C# для геймдеву: все необхідне без зайвої теорії',
    meta:  ['Туторіал', '3 години', 'C# / Unity', 'Початківець'],
    body: `
<h2>Навіщо C# для Unity?</h2>
<p>Unity використовує C# як основну мову скриптингу. Тут ми вивчаємо лише те, що реально потрібне в геймдеві — без академічної зайвості.</p>
<h2>Змінні та типи</h2>
<div class="code-b"><span class="kw">int</span>   score   = 0;      <span class="cm">// ціле число — рахунок</span>
<span class="kw">float</span> speed   = 5.5f;   <span class="cm">// дійсне число — швидкість</span>
<span class="kw">bool</span>  isAlive = <span class="kw">true</span>;  <span class="cm">// булеве — живий?</span>
<span class="kw">string</span> name  = <span class="st">"Hero"</span>; <span class="cm">// рядок — ім'я персонажа</span></div>
<h2>Корутини — «пауза» без блокування</h2>
<div class="code-b"><span class="cm">// Корутина: чекаємо 2 секунди, потім щось робимо</span>
IEnumerator SpawnEnemy() {
    <span class="kw">yield return new</span> WaitForSeconds(2f);
    Instantiate(enemyPrefab, spawnPoint.position, Quaternion.identity);
}
<span class="cm">// Запуск корутини</span>
StartCoroutine(SpawnEnemy());</div>
<div class="tip-b"><p>Уникай string concatenation у Update() — використовуй StringBuilder або кешовані рядки для UI, щоб не генерувати garbage collector pause.</p></div>`
  },
  t3: {
    tag:   'Туторіал · AI',
    title: 'AI для ігор: NavMesh, State Machine та поведінка ворогів',
    meta:  ['Туторіал', '6 годин', 'Unity 6', 'Середній'],
    body: `
<h2>Finite State Machine для AI</h2>
<p>State Machine — основа поведінки NPC. Ворог має стани: Patrol → Chase → Attack → Dead. Переходи між станами визначаються умовами (дистанція до гравця, HP).</p>
<div class="code-b"><span class="kw">enum</span> EnemyState { Patrol, Chase, Attack, Dead }

EnemyState currentState = EnemyState.Patrol;

<span class="kw">void</span> Update() {
    <span class="kw">switch</span> (currentState) {
        <span class="kw">case</span> EnemyState.Patrol: DoPatrol(); <span class="kw">break</span>;
        <span class="kw">case</span> EnemyState.Chase:  DoChase();  <span class="kw">break</span>;
        <span class="kw">case</span> EnemyState.Attack: DoAttack(); <span class="kw">break</span>;
    }
}</div>
<h2>NavMesh Agent</h2>
<p>NavMesh — «карта» прохідного простору. Запікаємо через Window → AI → Navigation. NavMeshAgent автоматично прокладає шлях та уникає перешкод.</p>
<div class="code-b">NavMeshAgent agent;
<span class="kw">void</span> DoChase() {
    agent.SetDestination(player.position); <span class="cm">// йди до гравця</span>
}</div>
<div class="tip-b"><p>Не викликай SetDestination() кожен кадр — це дорого. Оновлюй ціль раз на 0.2–0.5 секунди через InvokeRepeating або корутину.</p></div>`
  },
  t4: {
    tag:   'Туторіал · Мультиплеєр',
    title: 'Мультиплеєр в Unity: Netcode for GameObjects + Relay',
    meta:  ['Туторіал', '8 годин', 'Unity 6 + UGS', 'Середній'],
    body: `
<h2>Архітектура мережевої гри</h2>
<p>Unity Netcode використовує модель Host/Client: один гравець є сервером (Host), інші підключаються до нього через Unity Relay — без власного сервера.</p>
<div class="code-b"><span class="cm">// NetworkManager — серце мережевої гри</span>
<span class="cm">// Додаємо компонент до об'єкта "NetworkManager" у сцені</span>

<span class="cm">// Запуск як Host (сервер + клієнт одночасно)</span>
NetworkManager.Singleton.StartHost();

<span class="cm">// Підключення як Client</span>
NetworkManager.Singleton.StartClient();</div>
<h2>Синхронізація змінних через NetworkVariable</h2>
<div class="code-b"><span class="kw">public class</span> PlayerHealth : NetworkBehaviour {
    <span class="cm">// Автоматично синхронізується між усіма клієнтами</span>
    NetworkVariable&lt;<span class="kw">int</span>&gt; hp = <span class="kw">new</span>(100);

    <span class="cm">// Лише сервер може змінювати значення</span>
    [ServerRpc]
    <span class="kw">public void</span> TakeDamageServerRpc(<span class="kw">int</span> dmg) {
        hp.Value -= dmg;
    }
}</div>
<div class="tip-b"><p>Ніколи не довіряй даним від клієнта. Вся важлива логіка (нанесення шкоди, переміщення предметів) повинна виконуватися на сервері через ServerRpc.</p></div>`
  },
  t5: {
    tag:   'Туторіал · GPU',
    title: 'Compute Shaders в Unity: прискорення симуляцій на GPU',
    meta:  ['Туторіал', '10 годин', 'Unity URP', 'Просунутий'],
    body: `
<h2>CPU vs GPU для симуляцій</h2>
<p>CPU обробляє задачі послідовно — ідеально для логіки з умовами. GPU має тисячі ядер для паралельних обчислень — ідеально для симуляцій частинок, fluid simulation, клітинних автоматів.</p>
<h2>Структура Compute Shader</h2>
<div class="code-b"><span class="cm">// Файл: ParticleSimulation.compute</span>
<span class="kw">#pragma</span> kernel SimulateParticles

struct Particle {
    float3 position;
    float3 velocity;
};

RWStructuredBuffer&lt;Particle&gt; particles; <span class="cm">// буфер читання/запису</span>
<span class="kw">float</span> deltaTime;

[numthreads(64, 1, 1)] <span class="cm">// 64 потоки в групі</span>
<span class="kw">void</span> SimulateParticles(uint3 id : SV_DispatchThreadID) {
    Particle p = particles[id.x];
    p.velocity.y -= 9.81 * deltaTime; <span class="cm">// гравітація</span>
    p.position   += p.velocity * deltaTime;
    particles[id.x] = p;
}</div>
<div class="tip-b"><p>numthreads має бути кратним 32 (warp size на NVIDIA). Значення 64 або 128 — оптимальні для більшості задач.</p></div>`
  },
  t6: {
    tag:   'Туторіал · Публікація',
    title: 'Як опублікувати гру на Steam, itch.io та Google Play',
    meta:  ['Туторіал', '2.5 години', 'Всі движки', 'Початківець'],
    body: `
<h2>itch.io — найпростіший старт</h2>
<p>itch.io безкоштовний, без реєстраційного збору. Ідеально для game jam проєктів та перших ігор. Підтримує WebGL, Windows, Mac, Linux.</p>
<h2>Steam Direct — серйозна платформа</h2>
<p>Реєстраційний збір: $100 за кожну гру. Steamworks SDK надає досягнення, таблиці лідерів, хмарне збереження. Перевірка займає від 3 до 5 робочих днів.</p>
<div class="tip-b"><p>Почни з wishlist-кампанії за 3–6 місяців до релізу. 1000 wishlists до релізу — реалістична ціль для indie-розробника без бюджету на рекламу.</p></div>
<h2>Google Play — мобільний ринок</h2>
<p>Реєстраційний збір: $25 (одноразово). Unity Build Settings → Android. Потрібен Android SDK та keystore для підпису APK. Google перевіряє додатки від кількох годин до 7 днів.</p>`
  }
};
