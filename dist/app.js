const STORAGE_KEY = "nsp-control:v1";

const groups = [
  {
    id: "core", title: "Основа", items: [
      section("passport", "Паспорт проекта", "ID", "Общая информация", "Короткая точка входа в проект: зачем он нужен и кто за него отвечает.", [
        field("purpose", "Назначение проекта", "textarea", "Какую задачу решает проект?", true),
        field("status", "Статус проекта", "select", "", false, ["В разработке", "Эксплуатация", "Поддержка", "Заморожен", "Архив"]),
        field("businessOwner", "Заказчик / бизнес-владелец", "text", "Имя, команда или подразделение"),
        field("techOwner", "Технический ответственный", "text", "Основной владелец знаний"),
        field("backupOwner", "Резервный ответственный", "text", "Кто подхватит проект"),
        field("documentation", "Документация", "url", "Ссылка на основную документацию"),
        field("summary", "Краткое описание архитектуры", "textarea", "Из чего состоит проект — в двух-трёх предложениях", true)
      ]),
      section("frontend", "Фронтенд", "FE", "Фронтенд", "Исходники, размещение, адреса и порядок выпуска клиентской части.", componentFields("фронтенда", true)),
      section("backend", "Бэкенд", "BE", "Бэкенд", "API, серверные компоненты, размещение и эксплуатация.", componentFields("бэкенда", false).concat([
        field("apiUrl", "Адрес API", "url", "https://api.example.ru"),
        field("runtime", "Способ запуска", "text", "Docker Compose, Kubernetes, systemd…")
      ])),
      section("database", "База данных", "DB", "База данных", "Размещение, принадлежность, доступ и возможность восстановления данных.", [
        field("type", "СУБД", "text", "PostgreSQL, MySQL, MongoDB…"),
        field("placement", "Где размещена", "text", "Облако, сервер, кластер"),
        field("ownership", "Модель размещения", "select", "", false, ["Отдельная БД", "Часть EMD Cloud", "Общая БД / схема", "Внешний сервис"]),
        field("environments", "Окружения", "text", "Production, staging, test"),
        field("backup", "Автоматический бэкап", "select", "", false, ["Да", "Нет", "Неизвестно"]),
        field("backupLocation", "Где хранятся бэкапы", "text", "Хранилище и учётная запись"),
        field("backupSchedule", "Частота и срок хранения", "text", "Например: ежедневно, 30 дней"),
        field("restoreTest", "Проверка восстановления", "text", "Когда и кем проверялось"),
        field("restoreGuide", "Как восстановить", "textarea", "Ссылка на инструкцию или краткий порядок", true),
        accessField()
      ]),
      section("storage", "S3 / файлы", "S3", "Файловое хранилище", "Файлы, бакеты, версионирование и резервное копирование.", [
        field("provider", "Провайдер и размещение", "text", "S3, Yandex Object Storage, MinIO…"),
        field("buckets", "Buckets / каталоги", "textarea", "Названия и назначение", true),
        field("data", "Что хранится", "textarea", "Пользовательские загрузки, документы, медиа…", true),
        field("versioning", "Версионирование", "select", "", false, ["Включено", "Выключено", "Неизвестно"]),
        field("backup", "Резервная копия", "select", "", false, ["Есть", "Нет", "Неизвестно"]),
        field("backupLocation", "Где хранится копия", "text", "Независимое хранилище предпочтительно"),
        field("restoreGuide", "Как восстановить", "textarea", "Инструкция или ссылка", true),
        accessField()
      ]),
      section("cdn", "CDN", "CDN", "CDN", "Доставка статики, источники контента и управление кешем.", [
        field("provider", "Провайдер", "text", "Cloudflare, EdgeCenter…"),
        field("purpose", "Что раздаётся", "textarea", "Статика фронтенда, файлы, изображения…", true),
        field("origin", "Источник данных", "text", "S3, фронтенд, сервер"),
        field("domains", "Подключённые домены", "textarea", "Домены и поддомены", true),
        field("purge", "Очистка кеша", "textarea", "Как выполнить purge", true),
        accessField()
      ]),
      section("domains", "Домены и DNS", "DNS", "Домены и DNS", "Регистрация, DNS, сертификаты и контроль продления.", [
        field("domains", "Домены и поддомены", "textarea", "Список адресов и назначение", true),
        field("registrar", "Регистратор", "text", "Где зарегистрированы домены"),
        field("legalOwner", "На кого оформлены", "text", "Корпоративный аккаунт / организация"),
        field("dns", "Управление DNS", "text", "Провайдер и аккаунт"),
        field("renewal", "Продление", "text", "Автопродление, дата, способ оплаты"),
        field("ssl", "SSL-сертификаты", "text", "Где и как выпускаются / продлеваются"),
        accessField()
      ])
    ]
  },
  {
    id: "delivery", title: "Развёртывание", items: [
      section("infrastructure", "Инфраструктура", "INF", "Инфраструктура", "Физическое размещение проекта и возможность пересоздать его ресурсы.", [
        field("hosting", "Где хостится проект", "textarea", "Облако, аккаунт, каталог, сервер", true),
        field("resources", "Ресурсы", "textarea", "VM, контейнеры, Kubernetes, serverless…", true),
        field("network", "Сеть", "textarea", "IP, proxy, балансировщики, firewall, VPN", true),
        field("iac", "Конфигурация инфраструктуры", "text", "Репозиторий Terraform / Ansible или инструкция"),
        field("rebuild", "Можно ли пересоздать", "select", "", false, ["Полностью", "Частично", "Только вручную", "Неизвестно"]),
        accessField()
      ]),
      section("environments", "Окружения", "ENV", "Окружения", "Production, staging, test и отличия между ними.", [
        field("production", "Production", "textarea", "Адреса, назначение, особенности", true),
        field("staging", "Staging", "textarea", "Адреса, назначение, особенности", true),
        field("test", "Test", "textarea", "Адреса, назначение, особенности", true),
        field("development", "Development", "textarea", "Локальный запуск и зависимости", true),
        field("differences", "Ключевые отличия", "textarea", "Данные, мощности, интеграции, конфигурация", true)
      ]),
      section("cicd", "CI/CD и релизы", "CI", "CI/CD и релизы", "Сборка, доставка, ручные операции и безопасный откат.", [
        field("system", "Система CI/CD", "text", "GitHub Actions, GitLab CI, Jenkins…"),
        field("build", "Где выполняется сборка", "text", "Runner, облако, сервер"),
        field("release", "Как выпустить релиз", "textarea", "Шаги или ссылка на runbook", true),
        field("automatic", "Что автоматизировано", "textarea", "Сборка, тесты, деплой, миграции", true),
        field("manual", "Что делается вручную", "textarea", "Обязательные ручные действия", true),
        field("rollback", "Как выполнить откат", "textarea", "Порядок rollback", true),
        field("releaseAccess", "Кто выпускает релизы", "text", "Роли и ответственные")
      ]),
      section("secrets", "Конфигурация и секреты", "SEC", "Конфигурация и секреты", "Только места хранения, владельцы и восстановление — без значений секретов.", [
        field("env", "Переменные окружения", "text", "Где задаются и документируются"),
        field("vault", "Пароли и API-ключи", "text", "Vault / менеджер секретов / защищённое хранилище"),
        field("certificates", "Сертификаты", "text", "Где хранятся и кто продлевает"),
        field("recovery", "Восстановление конфигурации", "textarea", "Что делать при потере окружения или доступа", true),
        accessField(),
        field("warning", "Примечание", "textarea", "Не помещайте сюда значения паролей, токенов и приватных ключей.", true)
      ]),
      section("integrations", "Интеграции", "API", "Внешние интеграции", "Внешние сервисы, точки подключения и владельцы учётных записей.", [
        field("services", "Подключённые сервисы", "textarea", "CRM, платежи, почта, SMS, аналитика…", true),
        field("connections", "API и webhook", "textarea", "Назначение и адреса", true),
        field("accounts", "Владельцы аккаунтов", "textarea", "Корпоративные аккаунты и ответственные", true),
        field("keyStorage", "Где хранятся ключи", "text", "Только место хранения, без значений"),
        field("failure", "Поведение при недоступности", "textarea", "Риски, retry, очередь, ручные действия", true),
        accessField()
      ]),
      section("workers", "Фоновые компоненты", "BG", "Фоновые компоненты", "Очереди, планировщики, обработчики и боты.", [
        field("components", "Компоненты", "textarea", "Очереди, cron, workers, боты", true),
        field("placement", "Где размещены", "textarea", "Серверы, контейнеры, облачные функции", true),
        field("schedule", "Расписание и триггеры", "textarea", "Когда и от чего запускаются", true),
        field("logs", "Логи", "text", "Где смотреть состояние и ошибки"),
        field("recovery", "Перезапуск и восстановление", "textarea", "Безопасный порядок действий", true),
        accessField()
      ])
    ]
  },
  {
    id: "reliability", title: "Надёжность", items: [
      section("monitoring", "Мониторинг", "MON", "Мониторинг и эксплуатация", "Наблюдаемость, уведомления и первые действия при сбое.", [
        field("logs", "Логи", "textarea", "Где смотреть логи компонентов", true),
        field("monitoring", "Мониторинг", "textarea", "Система, дашборды, health checks", true),
        field("alerts", "Уведомления", "textarea", "Какие алерты и куда приходят", true),
        field("recipients", "Получатели", "text", "Команда, канал, дежурный"),
        field("health", "Проверка работоспособности", "textarea", "Быстрый чек-лист", true),
        field("incident", "Действия при сбое", "textarea", "Runbook или краткий порядок", true)
      ]),
      section("backups", "Бэкапы", "BKP", "Данные и восстановление", "Единая карта всех невоспроизводимых данных и контроля резервных копий.", [
        field("criticalData", "Что можно потерять", "textarea", "БД, пользовательские файлы, документы, конфигурация…", true),
        field("sources", "Где находятся оригиналы", "textarea", "Все первичные места хранения", true),
        field("covered", "Что резервируется", "textarea", "Объекты, расписание и способ", true),
        field("notCovered", "Что не резервируется", "textarea", "Осознанные исключения и риски", true),
        field("storage", "Где хранятся бэкапы", "textarea", "Желательно независимо от оригиналов", true),
        field("retention", "Частота и срок хранения", "text", "RPO / retention"),
        field("owner", "Кто контролирует", "text", "Ответственный за проверку"),
        field("lastTest", "Последняя проверка восстановления", "text", "Дата и результат"),
        field("rto", "Время восстановления", "text", "Ожидаемое RTO"),
        field("guide", "Инструкция восстановления", "textarea", "Ссылка или полный порядок", true)
      ]),
      section("access", "Доступы", "ACL", "Доступы и ответственность", "Владение ресурсами, резервные ответственные и восстановление контроля.", [
        field("ownership", "Владельцы ресурсов", "textarea", "Ресурс → корпоративный владелец", true),
        field("admins", "Администраторы", "textarea", "Кто имеет административный доступ", true),
        field("corporateAccounts", "Корпоративные аккаунты", "textarea", "Какие аккаунты являются владельцами", true),
        field("backupOwners", "Резервные ответственные", "textarea", "Минимум один на критичный ресурс", true),
        field("grant", "Как предоставить доступ", "textarea", "Процесс и согласование", true),
        field("revoke", "Как отозвать доступ", "textarea", "Процесс при увольнении / смене роли", true),
        field("recovery", "Как восстановить управление", "textarea", "Действия при потере аккаунта или недоступности владельца", true)
      ])
    ]
  }
];

function field(id, label, type = "text", placeholder = "", wide = false, options = []) {
  return { id, label, type, placeholder, wide, options };
}

function accessField() {
  return field("access", "У кого есть доступ", "textarea", "Роли, команды и резервный ответственный", true);
}

function componentFields(name, frontend) {
  const list = [
    field("source", "Исходники", "url", `Ссылка на репозиторий ${name}`),
    field("hosting", "Где размещён", "text", "Провайдер, аккаунт, проект / сервер"),
    field("build", "Где собирается", "text", "CI/CD, runner или локально"),
    field("deploy", "Как развёртывается", "textarea", "Автоматически или вручную; ссылка на инструкцию", true),
    field("environments", "Окружения", "text", "Production, staging, test"),
    field("domain", frontend ? "Домен" : "Публичный адрес", "url", "https://example.ru"),
    field("logs", "Логи", "text", "Где смотреть логи и ошибки"),
    accessField()
  ];
  if (frontend) list.splice(6, 0, field("cdn", "CDN", "text", "Используется ли CDN и какой"));
  return list;
}

function section(id, label, icon, title, description, fields) {
  return { id, label, icon, title, description, fields };
}

const sections = groups.flatMap(group => group.items.map(item => ({ ...item, group: group.title })));
const byId = Object.fromEntries(sections.map(item => [item.id, item]));

let state = loadState();
let activeId = state.activeId && byId[state.activeId] ? state.activeId : "passport";
let saveTimer;

const el = id => document.getElementById(id);
const tree = el("tree");
const form = el("sectionForm");

function blankState() {
  return { version: 1, projectName: "Новый проект", activeId: "passport", sections: {} };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed && parsed.sections ? parsed : blankState();
  } catch { return blankState(); }
}

function saveState() {
  state.activeId = activeId;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  el("saveState").textContent = "Сохранено локально";
  el("saveState").parentElement.querySelector("i").style.background = "var(--accent)";
}

function scheduleSave() {
  el("saveState").textContent = "Сохраняем…";
  el("saveState").parentElement.querySelector("i").style.background = "var(--amber)";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 350);
}

function sectionData(id) {
  if (!state.sections[id]) state.sections[id] = { notApplicable: false, values: {} };
  if (!state.sections[id].values) state.sections[id].values = {};
  return state.sections[id];
}

function completion(id) {
  const def = byId[id];
  const data = sectionData(id);
  if (data.notApplicable) return { percent: 100, status: "na" };
  const filled = def.fields.filter(f => String(data.values[f.id] || "").trim()).length;
  const percent = Math.round((filled / def.fields.length) * 100);
  return { percent, status: percent === 100 ? "done" : percent > 0 ? "partial" : "empty" };
}

function overallCompletion() {
  let total = 0, filled = 0;
  sections.forEach(def => {
    const data = sectionData(def.id);
    if (data.notApplicable) return;
    total += def.fields.length;
    filled += def.fields.filter(f => String(data.values[f.id] || "").trim()).length;
  });
  return total ? Math.round(filled / total * 100) : 0;
}

function renderTree() {
  tree.innerHTML = `
    <div class="tree-root">
      <div class="root-label"><span>${escapeHtml(state.projectName || "Новый проект")}</span></div>
      <div class="tree-groups">
        ${groups.map(group => `
          <div class="tree-group" data-group="${group.id}">
            <button class="group-label" type="button"><span>${group.title}</span><span class="chevron">⌄</span></button>
            <div class="group-items">
              ${group.items.map(item => {
                const done = completion(item.id);
                return `<button class="tree-node ${activeId === item.id ? "active" : ""}" type="button" data-section="${item.id}" data-search="${item.label.toLowerCase()}">
                  <span class="node-icon">${item.icon}</span><span>${item.label}</span><i class="node-status ${done.status}"></i>
                </button>`;
              }).join("")}
            </div>
          </div>`).join("")}
      </div>
    </div>`;

  tree.querySelectorAll(".tree-node").forEach(button => button.addEventListener("click", () => {
    activeId = button.dataset.section;
    renderAll();
    el("treePanel").classList.remove("open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  tree.querySelectorAll(".group-label").forEach(button => button.addEventListener("click", () => button.parentElement.classList.toggle("collapsed")));
  applyTreeSearch();
}

function renderSection() {
  const def = byId[activeId];
  const data = sectionData(activeId);
  const score = completion(activeId);
  el("sectionKicker").textContent = def.group;
  el("sectionTitle").textContent = def.title;
  el("sectionDescription").textContent = def.description;
  el("sectionScore").innerHTML = `<strong>${score.percent}%</strong><span>${data.notApplicable ? "не используется" : "заполнено"}</span>`;
  el("notApplicable").checked = !!data.notApplicable;
  form.classList.toggle("disabled", !!data.notApplicable);
  form.innerHTML = def.fields.map(f => renderField(f, data.values[f.id] || "")).join("");

  form.querySelectorAll("input, textarea, select").forEach(input => {
    updateFieldState(input);
    input.addEventListener("input", () => {
      data.values[input.name] = input.value;
      updateFieldState(input);
      updateProgress();
      updateTreeStatuses();
      scheduleSave();
    });
  });

  const index = sections.findIndex(item => item.id === activeId);
  el("prevButton").disabled = index === 0;
  el("prevButton").style.opacity = index === 0 ? ".35" : "1";
  el("nextButton").textContent = index === sections.length - 1 ? "Завершить →" : "Следующий раздел →";
}

function renderField(def, value) {
  let control;
  if (def.type === "textarea") {
    control = `<textarea class="${def.wide ? "tall" : ""}" name="${def.id}" placeholder="${escapeAttr(def.placeholder)}">${escapeHtml(value)}</textarea>`;
  } else if (def.type === "select") {
    control = `<select name="${def.id}"><option value="">Не выбрано</option>${def.options.map(option => `<option ${value === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select>`;
  } else {
    control = `<input name="${def.id}" type="${def.type}" value="${escapeAttr(value)}" placeholder="${escapeAttr(def.placeholder)}" autocomplete="off" />`;
  }
  const safety = activeId === "secrets" && def.id === "warning" ? "Не указывайте секретные значения." : "";
  return `<div class="field ${def.wide ? "wide" : ""}"><label>${def.label}</label>${control}${safety ? `<small>${safety}</small>` : ""}</div>`;
}

function updateFieldState(input) {
  input.closest(".field").classList.toggle("has-value", !!input.value.trim());
}

function renderAll() {
  renderTree();
  renderSection();
  updateProgress();
  scheduleSave();
}

function updateTreeStatuses() {
  document.querySelectorAll(".tree-node").forEach(node => {
    const status = completion(node.dataset.section).status;
    node.querySelector(".node-status").className = `node-status ${status}`;
  });
  const current = completion(activeId);
  const currentData = sectionData(activeId);
  el("sectionScore").innerHTML = `<strong>${current.percent}%</strong><span>${currentData.notApplicable ? "не используется" : "заполнено"}</span>`;
}

function updateProgress() {
  const percent = overallCompletion();
  el("progressValue").textContent = `${percent}%`;
  el("progressBar").style.width = `${percent}%`;
  const open = sections.filter(s => !sectionData(s.id).notApplicable && completion(s.id).percent < 100).length;
  el("progressHint").textContent = open ? `Осталось разделов: ${open}` : "Паспорт проекта заполнен";
}

function applyTreeSearch() {
  const q = el("treeSearch").value.trim().toLowerCase();
  document.querySelectorAll(".tree-group").forEach(group => {
    let visible = 0;
    group.querySelectorAll(".tree-node").forEach(node => {
      const match = !q || node.dataset.search.includes(q);
      node.hidden = !match;
      if (match) visible++;
    });
    group.hidden = !visible;
    if (q) group.classList.remove("collapsed");
  });
}

function navigate(delta) {
  const index = sections.findIndex(item => item.id === activeId);
  const next = sections[index + delta];
  if (next) { activeId = next.id; renderAll(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  else if (delta > 0) openModal("exportModal");
}

function makeMarkdown() {
  const date = new Intl.DateTimeFormat("ru-RU", { dateStyle: "long" }).format(new Date());
  let md = `# ${state.projectName || "Паспорт проекта"}\n\n> Технический паспорт проекта · обновлён ${date}\n\n`;
  md += `**Полнота:** ${overallCompletion()}%\n\n`;
  for (const group of groups) {
    md += `## ${group.title}\n\n`;
    for (const def of group.items) {
      const data = sectionData(def.id);
      md += `### ${def.title}\n\n`;
      if (data.notApplicable) { md += `_Не используется в проекте._\n\n`; continue; }
      let any = false;
      for (const f of def.fields) {
        const value = String(data.values[f.id] || "").trim();
        if (!value) continue;
        any = true;
        md += `**${f.label}**\n\n${value}\n\n`;
      }
      if (!any) md += `_Информация не заполнена._\n\n`;
    }
  }
  md += `---\n\nСоздано в NSP Control. Значения паролей, токенов и приватных ключей в отчёт не включаются.\n`;
  return md;
}

function makeAgentPrompt() {
  const gaps = sections.filter(s => !sectionData(s.id).notApplicable && completion(s.id).percent < 100).map(s => `- ${s.title}: ${100 - completion(s.id).percent}% данных не заполнено`).join("\n");
  const schema = sections.map(s => `- ${s.id}: ${s.fields.map(f => f.id).join(", ")}`).join("\n");
  return `# Задача: технический паспорт проекта «${state.projectName || "Новый проект"}»

Ты запущен в корне действующего IT-проекта. Проведи безопасный read-only аудит и подготовь технический паспорт проекта для импорта в NSP Control.

## Порядок работы

1. Сначала самостоятельно исследуй репозиторий: README и документацию, структуру исходников, package/dependency manifests, Docker, IaC, CI/CD, deployment-конфигурацию, примеры env-файлов, настройки доменов, БД, S3/CDN, мониторинга и бэкапов.
2. Опирайся только на подтверждённые факты. Для каждого важного вывода укажи источник: путь к файлу, конфигурацию или команду проверки.
3. Никогда не выводи значения паролей, токенов, приватных ключей, connection strings и других секретов. Можно указать только имена переменных, место хранения и владельцев доступа.
4. Не изменяй проект и внешние системы. Не проверяй реальные учётные данные входом.
5. После самостоятельного анализа составь короткий список того, чего установить не удалось, и задай владельцу только необходимые вопросы.
6. После ответов подготовь:
   - читаемый Markdown-отчёт;
   - JSON для импорта в NSP Control по схеме ниже.

## Текущие пробелы

${gaps || "Все разделы заполнены — проверь актуальность и подтверждения."}

## JSON-схема

Верни объект вида:

\`\`\`json
{
  "version": 1,
  "projectName": "Название проекта",
  "activeId": "passport",
  "sections": {
    "passport": {
      "notApplicable": false,
      "values": { "purpose": "...", "status": "..." }
    }
  }
}
\`\`\`

Допустимые разделы и поля:

${schema}

Не добавляй выдуманные значения. Неизвестные поля оставляй пустыми строками. Если раздел точно не используется, установи \`notApplicable: true\`.
`;
}

function exportJson() {
  const payload = { ...state, projectName: state.projectName, activeId };
  download(`${slugify(state.projectName)}.nsp-control.json`, JSON.stringify(payload, null, 2), "application/json");
}

function importData(raw) {
  const parsed = typeof raw === "string" ? JSON.parse(stripCodeFence(raw)) : raw;
  if (!parsed || typeof parsed !== "object" || !parsed.sections) throw new Error("Не найдена структура sections");
  const clean = blankState();
  clean.projectName = String(parsed.projectName || "Новый проект").slice(0, 160);
  clean.activeId = byId[parsed.activeId] ? parsed.activeId : "passport";
  for (const def of sections) {
    const incoming = parsed.sections[def.id];
    if (!incoming) continue;
    clean.sections[def.id] = { notApplicable: !!incoming.notApplicable, values: {} };
    for (const f of def.fields) {
      const value = incoming.values?.[f.id];
      clean.sections[def.id].values[f.id] = value == null ? "" : String(value).slice(0, 20000);
    }
  }
  state = clean;
  activeId = clean.activeId;
  el("projectName").value = clean.projectName;
  saveState(); renderAll(); closeModal("importModal"); toast("Данные импортированы");
}

function stripCodeFence(text) {
  return text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function download(name, content, type) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function slugify(value) {
  return (value || "project").toLowerCase().trim().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "") || "project";
}

function openModal(id) {
  if (id === "promptModal") el("agentPrompt").value = makeAgentPrompt();
  el(id).hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  el(id).hidden = true;
  document.body.style.overflow = "";
}

function toast(message) {
  const target = el("toast"); target.textContent = message; target.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => target.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}
function escapeAttr(value) { return escapeHtml(value); }

el("projectName").value = state.projectName || "Новый проект";
el("projectName").addEventListener("input", event => {
  state.projectName = event.target.value; const root = document.querySelector(".root-label span"); if (root) root.textContent = state.projectName || "Новый проект"; scheduleSave();
});
el("treeSearch").addEventListener("input", applyTreeSearch);
el("notApplicable").addEventListener("change", event => {
  sectionData(activeId).notApplicable = event.target.checked; renderSection(); updateTreeStatuses(); updateProgress(); scheduleSave();
});
el("prevButton").addEventListener("click", () => navigate(-1));
el("nextButton").addEventListener("click", () => navigate(1));
el("exportButton").addEventListener("click", () => openModal("exportModal"));
el("importButton").addEventListener("click", () => openModal("importModal"));
el("agentPromptButton").addEventListener("click", () => openModal("promptModal"));
el("downloadMd").addEventListener("click", () => { download(`${slugify(state.projectName)}.md`, makeMarkdown(), "text/markdown"); toast("Markdown-отчёт готов"); });
el("downloadJson").addEventListener("click", () => { exportJson(); toast("JSON сохранён"); });
el("downloadPrompt").addEventListener("click", () => download(`${slugify(state.projectName)}-agent-prompt.md`, makeAgentPrompt(), "text/markdown"));
el("copyPrompt").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(makeAgentPrompt()); toast("Промпт скопирован"); }
  catch { el("agentPrompt").select(); document.execCommand("copy"); toast("Промпт скопирован"); }
});
el("jsonFileInput").addEventListener("change", async event => {
  const file = event.target.files[0]; if (!file) return;
  el("jsonPaste").value = await file.text();
});
el("applyJson").addEventListener("click", () => {
  try { importData(el("jsonPaste").value); el("importError").textContent = ""; }
  catch (error) { el("importError").textContent = `Не удалось импортировать: ${error.message}`; }
});
el("resetButton").addEventListener("click", () => {
  if (!confirm("Очистить все локально сохранённые данные этого проекта?")) return;
  state = blankState(); activeId = "passport"; el("projectName").value = state.projectName; saveState(); renderAll(); toast("Форма очищена");
});
el("mobileMenuButton").addEventListener("click", () => el("treePanel").classList.toggle("open"));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModal(backdrop.id); }));
document.addEventListener("keydown", event => { if (event.key === "Escape") document.querySelectorAll(".modal-backdrop:not([hidden])").forEach(modal => closeModal(modal.id)); });

renderAll();
