const modules = [
  {
    id: "governance",
    no: "01",
    title: "内部文件库",
    summary: "管理手册、程序文件、三级文件、四级表单和内部运行制度。",
    hero:
      "把认证机构自己的管理体系文件集中管理，形成版本受控、职责清晰、可追溯的内部制度底座。",
    sections: [
      ["一级文件", "管理手册、公正性声明、质量方针、组织职责和认证活动总要求。"],
      ["二级程序", "申请评审、审核实施、认证决定、人员管理、申投诉、证书管理等程序。"],
      ["三级作业", "各岗位作业指导、技术委员会运行、卷宗审定、远程审核控制要求。"],
      ["四级表单", "申请评审表、审核计划、审核报告、复核记录、认证决定记录。"],
      ["运行记录", "内审、管评、人员评价、能力保持、风险评估和纠正措施记录。"],
      ["公开文件", "认证流程、收费规则、证书与标志使用、申投诉渠道和公正性承诺。"],
    ],
    tags: ["管理手册", "程序文件", "MR", "表单", "公正性"],
  },
  {
    id: "rules",
    no: "02",
    title: "认证规则库",
    summary: "各认证领域的认证方案、审核人日、抽样、多场所和证后规则。",
    hero:
      "把不同体系和服务认证规则沉淀为可执行的认证方案，支撑申请评审、派组、审核和证后管理。",
    sections: [
      ["QMS 方案", "质量管理体系及建设施工质量管理体系认证方案、范围界定和审核人日规则。"],
      ["EMS 方案", "环境管理体系认证范围、环境因素风险、法规合规性和现场审核要求。"],
      ["OHSMS 方案", "职业健康安全管理体系风险等级、危险源审核和法规符合性审查。"],
      ["服务认证", "服务特性、服务蓝图、顾客体验、服务能力和暗访抽样要求。"],
      ["能源管理", "能源绩效参数、能源基准、主要能源使用和节能机会识别。"],
      ["证后规则", "监督、再认证、扩大缩小范围、暂停、恢复、撤销和注销。"],
    ],
    tags: ["认证方案", "审核人日", "抽样", "多场所", "证后监督"],
  },
  {
    id: "specialties",
    no: "03",
    title: "技术领域分析",
    summary: "围绕认证领域、行业场景、专业边界、风险特征和人员能力开展技术分析。",
    hero:
      "面向技术委员会、技术人员和专业能力评价，建立覆盖各认证领域的技术分析文件。",
    sections: [
      ["领域目录", "按 QMS、EMS、OHSMS、50430、能源管理、服务认证等方向建立技术领域台账。"],
      ["行业分析", "梳理不同行业的典型过程、关键活动、外包边界和认证风险。"],
      ["专业边界", "明确认证范围、专业能力、类似行业迁移和复杂组织场景的判断依据。"],
      ["风险特征", "识别各领域质量、环境、职业健康安全、能源和法规合规的高风险节点。"],
      ["能力模型", "定义审核员、技术专家、复核人员和认证决定人员的能力要求。"],
      ["更新机制", "跟踪标准变化、监管要求和行业发展对技术领域分析文件的影响。"],
    ],
    tags: ["技术领域", "行业分析", "专业边界", "风险特征", "能力模型"],
  },
  {
    id: "audit",
    no: "04",
    title: "审核作业指导书",
    summary: "面向审核员提供不同领域、行业和专业场景下的审核作业指导。",
    hero:
      "让审核员在进场前理解行业特点、明确审核路径、掌握证据要求，并形成一致的审核方法。",
    sections: [
      ["行业指导书", "机械加工、建筑施工、物业服务、软件服务、教育培训等专业审核作业指导。"],
      ["条款审核法", "按 ISO 9001、14001、45001 条款建立问题链和证据链。"],
      ["过程审核法", "以订单、项目、产品、服务或风险事件为主线实施穿行审核。"],
      ["现场证据", "记录、现场观察、访谈、抽样、照片和数据核验的证据要求。"],
      ["远程审核", "远程审核适用条件、技术手段、证据可信度和限制条件。"],
      ["审核复盘", "审核组内部复盘、优秀报告样例和常见弱项纠偏。"],
    ],
    tags: ["作业指导书", "审核检查表", "证据链", "过程方法", "远程审核"],
  },
  {
    id: "training",
    no: "05",
    title: "培训教材课件",
    summary: "内部培训教材、审核员培训资料、客户课程和培训用 PPT 的统一资料库。",
    hero:
      "把技术文件转化为教材、课件、案例讲解和考试题库，让能力建设可以持续复制。",
    sections: [
      ["内部培训", "新员工、审核管理人员、技术人员、认证决定人员和市场人员合规培训教材。"],
      ["审核员课程", "标准理解、专业能力、审核方法、报告写作和职业操守培训资料。"],
      ["内审员教材", "面向客户组织的质量、环境、职业健康安全内审员培训教材。"],
      ["专题课件", "能源、信息安全、服务认证、双碳、质量提升等专题培训 PPT。"],
      ["题库考试", "课程练习、结业测试、年度能力保持和培训效果评价题库。"],
      ["视频脚本", "课程录制、数字人讲解、公开课和内部微课使用的讲稿资料。"],
    ],
    tags: ["培训教材", "PPT", "题库", "内审员", "继续教育"],
  },
  {
    id: "laws",
    no: "06",
    title: "法律法规库",
    summary: "与认证活动、客户行业和审核领域相关的法律法规及合规要求。",
    hero:
      "建立法规清单、适用性判断和修订影响分析，支撑审核、复核和认证决定中的合规判断。",
    sections: [
      ["认证监管", "认证认可条例、认证机构管理办法、认监委监管文件和专项整治要求。"],
      ["质量法规", "产品质量、计量、特种设备、工程建设等与质量管理相关的法规要求。"],
      ["环境法规", "环境保护、排污许可、固废、危废、环评和污染防治相关法规。"],
      ["职业健康安全", "安全生产、职业病防治、消防、应急管理和劳动保护相关法规。"],
      ["行业法规", "按重点行业维护适用法规清单和审核关注点。"],
      ["修订影响", "法规变化对审核检查表、作业指导书和认证决定复核的影响分析。"],
    ],
    tags: ["认监委", "质量法规", "环境法规", "安全生产", "法规影响"],
  },
  {
    id: "standards",
    no: "07",
    title: "标准文件库",
    summary: "认证依据标准、认可准则、应用说明、标准转换和条款解释文件。",
    hero:
      "以受控方式管理 ISO、GB/T、CNAS、CCAA 等标准文件，形成标准理解和转换应用能力。",
    sections: [
      ["标准清单", "ISO、GB/T、GB、行业标准、团体标准和认证依据版本台账。"],
      ["CNAS 要求", "认可规则、认可准则、应用说明、转换安排和见证评审关注点。"],
      ["CCAA 要求", "审核员注册、继续教育、人员能力和考试相关要求。"],
      ["条款解释", "对关键条款、易混条款和审核证据要求进行解释说明。"],
      ["修订影响", "新标准发布后的认证方案、模板、培训和证书转换影响分析。"],
      ["引用关系", "把标准条款与审核检查表、作业指导书和培训教材建立关联。"],
    ],
    tags: ["ISO", "GB/T", "CNAS", "CCAA", "标准转换"],
  },
  {
    id: "cases",
    no: "08",
    title: "优秀案例库",
    summary: "优秀审核报告、专业分析、培训案例、监管案例和技术争议处理样例。",
    hero:
      "将优秀实践和真实案例沉淀为机构能力，帮助审核员、技术人员和认证决定人员统一判断尺度。",
    sections: [
      ["监管案例", "双随机、一公开、专项整治、现场检查和监管通报的案例学习。"],
      ["不符合案例", "按标准条款、行业过程和严重程度归类的典型不符合。"],
      ["申投诉案例", "客户投诉、证书争议、审核行为投诉和处理闭环。"],
      ["优秀样例", "优秀审核计划、审核报告、专业分析和认证决定记录样例。"],
      ["争议判断", "范围边界、人员能力、审核人日、远程审核和证据充分性的争议案例。"],
      ["经验复盘", "每月技术例会、审核复盘和年度质量分析报告。"],
    ],
    tags: ["优秀报告", "监管案例", "不符合", "申投诉", "复盘"],
  },
];

const architectureGrid = document.querySelector("#architecture-grid");
const workspaceView = document.querySelector("#workspace-view");
const navLinks = document.querySelectorAll("[data-route]");
const views = {
  home: document.querySelector("#home-view"),
  book: document.querySelector("#book-view"),
  workspace: workspaceView,
};
const routeAliases = {
  tools: "rules",
};

const guidanceCatalog = Array.isArray(window.HXLC_GUIDANCE_CATALOG)
  ? window.HXLC_GUIDANCE_CATALOG
  : [];

const guidanceSystems = [
  ["all", "全部作业指导书"],
  ["ISO9001", "质量管理体系"],
  ["ISO14001", "环境管理体系"],
  ["ISO45001", "职业健康安全"],
  ["ISO50001", "能源管理体系"],
];

const guidanceSystemOrder = Object.fromEntries(
  guidanceSystems.map(([system], index) => [system, index]),
);

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function guidanceSystemCount(system) {
  if (system === "all") return guidanceCatalog.length;
  return guidanceCatalog.filter((item) => item.system === system).length;
}

function compareGuidanceItems(a, b) {
  const bySystem =
    (guidanceSystemOrder[a.system] ?? 99) - (guidanceSystemOrder[b.system] ?? 99);
  if (bySystem) return bySystem;
  return `${a.code || ""} ${a.title || ""}`.localeCompare(
    `${b.code || ""} ${b.title || ""}`,
    "zh-CN",
    { numeric: true },
  );
}

function renderGuidanceCard(item) {
  const title = item.title || "未命名作业指导书";
  const meta = [item.fileNo, `目录 ${item.tocItems || 0} 项`].filter(Boolean).join(" · ");
  return `
    <a class="guidance-card" href="${escapeHtml(item.url)}" title="${escapeHtml(title)}">
      <div class="doc-icon"></div>
      <span class="pill">${escapeHtml(item.system || "ISO")}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(meta)}</small>
      <footer><span>HTML 全文 · 表格 ${escapeHtml(item.tables || 0)} 个</span><b></b></footer>
    </a>
  `;
}

function getGuidanceRecommendations() {
  const quota = { ISO9001: 2, ISO14001: 2, ISO45001: 1, ISO50001: 1 };
  const picked = [];
  Object.entries(quota).forEach(([system, count]) => {
    picked.push(
      ...guidanceCatalog
        .filter((item) => item.system === system)
        .sort(compareGuidanceItems)
        .slice(0, count),
    );
  });
  return picked.slice(0, 6);
}

function getCodeTokens(code) {
  const tokens = String(code || "").match(/\d{1,2}(?:\.\d{2}(?:\.\d{2}[A-Za-z]?)?)?/g);
  return tokens?.length ? [...new Set(tokens)] : [String(code || "未分类")];
}

function getItemCodeLevels(item) {
  return getCodeTokens(item.code).map((token) => {
    const parts = token.split(".");
    const major = parts[0] || "未分类";
    const middle = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : major;
    const small = parts.length >= 3 ? `${parts[0]}.${parts[1]}.${parts[2]}` : middle;
    return { major, middle, small };
  });
}

function countBy(items, keyFn) {
  const counts = new Map();
  items.forEach((item) => {
    getItemCodeLevels(item).forEach((levels) => {
      const key = keyFn(levels, item);
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  return counts;
}

function sortCodes(values) {
  return [...values].sort((a, b) => String(a).localeCompare(String(b), "zh-CN", { numeric: true }));
}

function renderCodeButton(code, count, level, activeCode) {
  return `
    <button class="${code === activeCode ? "active" : ""}" type="button" data-code-level="${level}" data-code-value="${escapeHtml(code)}">
      <span>${escapeHtml(code)}</span>
      <b>${count}</b>
    </button>
  `;
}

function hydrateGuidanceCatalog() {
  if (!guidanceCatalog.length) return;

  const domainList = workspaceView.querySelector(".domain-list");
  const cards = workspaceView.querySelector(".guidance-cards");
  const browser = workspaceView.querySelector(".guidance-browser");
  const searchInput = workspaceView.querySelector(".guidance-search input");
  const searchButton = workspaceView.querySelector(".search-action");
  const intro = workspaceView.querySelector(".recommend-head p");
  const sampleLink = workspaceView.querySelector(".guidance-note a");
  let activeSystem = "all";
  let selectedMajor = "";
  let selectedMiddle = "";
  let selectedSmall = "";

  if (intro) {
    intro.textContent = `精选展示 6 项，完整目录请从左侧体系进入大类、中类、小类逐级浏览。`;
  }

  if (sampleLink && guidanceCatalog[0]) {
    sampleLink.href = guidanceCatalog[0].url;
  }

  if (domainList) {
    domainList.innerHTML = guidanceSystems
      .map(([system, label], index) => {
        const count = guidanceSystemCount(system);
        return `
          <button class="${index === 0 ? "active" : ""}" type="button" data-guidance-system="${system}">
            <span>${label}</span><b>${count}</b>
          </button>
        `;
      })
      .join("");
  }

  const renderRecommendations = () => {
    if (!cards) return;
    const keyword = (searchInput?.value || "").trim().toLowerCase();
    if (keyword) {
      const filtered = guidanceCatalog
        .filter((item) => {
          const haystack = `${item.system} ${item.code} ${item.title} ${item.fileNo}`.toLowerCase();
          return haystack.includes(keyword);
        })
        .sort(compareGuidanceItems)
        .slice(0, 12);
      cards.innerHTML = filtered.length
        ? filtered.map(renderGuidanceCard).join("")
        : '<div class="guidance-empty">没有找到匹配的作业指导书。</div>';
      return;
    }

    const recommended = getGuidanceRecommendations();
    cards.innerHTML = recommended.map(renderGuidanceCard).join("");
  };

  const renderBrowser = () => {
    if (!browser) return;
    if (activeSystem === "all") {
      browser.innerHTML = `
        <div class="browser-empty">
          <strong>请选择左侧一个管理体系</strong>
          <p>进入后可按专业代码逐级选择大类、中类和小类，最后打开对应作业指导书全文。</p>
        </div>
      `;
      return;
    }

    const systemItems = guidanceCatalog.filter((item) => item.system === activeSystem).sort(compareGuidanceItems);
    const majorCounts = countBy(systemItems, (levels) => levels.major);
    if (!selectedMajor || !majorCounts.has(selectedMajor)) {
      selectedMajor = sortCodes(majorCounts.keys())[0] || "";
    }

    const majorItems = systemItems.filter((item) =>
      getItemCodeLevels(item).some((levels) => levels.major === selectedMajor),
    );
    const middleCounts = countBy(majorItems, (levels) => levels.middle);
    if (!selectedMiddle || !middleCounts.has(selectedMiddle)) {
      selectedMiddle = sortCodes(middleCounts.keys())[0] || "";
    }

    const middleItems = majorItems.filter((item) =>
      getItemCodeLevels(item).some((levels) => levels.middle === selectedMiddle),
    );
    const smallCounts = countBy(middleItems, (levels) => levels.small);
    if (!selectedSmall || !smallCounts.has(selectedSmall)) {
      selectedSmall = sortCodes(smallCounts.keys())[0] || "";
    }

    const smallItems = middleItems.filter((item) =>
      getItemCodeLevels(item).some((levels) => levels.small === selectedSmall),
    );
    const systemLabel = guidanceSystems.find(([system]) => system === activeSystem)?.[1] || activeSystem;
    browser.innerHTML = `
      <div class="browser-head">
        <div>
          <span>${escapeHtml(activeSystem)}</span>
          <h3>${escapeHtml(systemLabel)}分类浏览</h3>
          <p>按专业代码逐级定位：大类 ${majorCounts.size} 项，中类 ${middleCounts.size} 项，当前小类 ${smallItems.length} 份文件。</p>
        </div>
        <a href="${escapeHtml(systemItems[0]?.url || "#")}">打开本体系首项 <i></i></a>
      </div>
      <div class="code-browser">
        <section>
          <h4>大类</h4>
          <div class="code-list">
            ${sortCodes(majorCounts.keys()).map((code) => renderCodeButton(code, majorCounts.get(code), "major", selectedMajor)).join("")}
          </div>
        </section>
        <section>
          <h4>中类</h4>
          <div class="code-list">
            ${sortCodes(middleCounts.keys()).map((code) => renderCodeButton(code, middleCounts.get(code), "middle", selectedMiddle)).join("")}
          </div>
        </section>
        <section>
          <h4>小类与文件</h4>
          <div class="small-list">
            ${sortCodes(smallCounts.keys())
              .map((code) => {
                const matched = middleItems.filter((item) =>
                  getItemCodeLevels(item).some((levels) => levels.small === code),
                );
                return `
                  <button class="${code === selectedSmall ? "active" : ""}" type="button" data-code-level="small" data-code-value="${escapeHtml(code)}">
                    <span>${escapeHtml(code)}</span>
                    <b>${matched.length}</b>
                  </button>
                `;
              })
              .join("")}
          </div>
          <div class="file-list">
            ${smallItems
              .map(
                (item) => `
                  <a href="${escapeHtml(item.url)}">
                    <span>${escapeHtml(item.code || selectedSmall)}</span>
                    <strong>${escapeHtml(item.title)}</strong>
                    <small>${escapeHtml(item.fileNo)} · HTML 全文</small>
                  </a>
                `,
              )
              .join("")}
          </div>
        </section>
      </div>
    `;
  };

  const applyFilter = () => {
    renderRecommendations();
    renderBrowser();
  };

  const applySearchOnly = () => {
    const keyword = (searchInput?.value || "").trim().toLowerCase();
    renderRecommendations();
    if (keyword && browser) {
      browser.innerHTML = `
        <div class="browser-empty">
          <strong>检索结果已显示在上方</strong>
          <p>清空搜索框后，可继续使用左侧体系分类进行大类、中类、小类浏览。</p>
        </div>
      `;
    } else {
      renderBrowser();
    }
  };

  domainList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-guidance-system]");
    if (!button) return;
    activeSystem = button.dataset.guidanceSystem;
    selectedMajor = "";
    selectedMiddle = "";
    selectedSmall = "";
    domainList
      .querySelectorAll("button")
      .forEach((item) => item.classList.toggle("active", item === button));
    applyFilter();
  });

  browser?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-code-level]");
    if (!button) return;
    const level = button.dataset.codeLevel;
    const value = button.dataset.codeValue;
    if (level === "major") {
      selectedMajor = value;
      selectedMiddle = "";
      selectedSmall = "";
    } else if (level === "middle") {
      selectedMiddle = value;
      selectedSmall = "";
    } else if (level === "small") {
      selectedSmall = value;
    }
    renderBrowser();
  });

  searchInput?.addEventListener("input", applySearchOnly);
  searchButton?.addEventListener("click", applySearchOnly);
  applyFilter();
}

function renderArchitecture() {
  architectureGrid.innerHTML = modules
    .map(
      (item) => `
        <button class="architecture-card" type="button" data-route="${item.id}">
          <b>${item.no}</b>
          <strong>${item.title}</strong>
          <span>${item.summary}</span>
        </button>
      `,
    )
    .join("");
}

function renderAuditWorkspace() {
  workspaceView.innerHTML = `
    <section class="guidance-page">
      <div class="guidance-hero">
        <div class="guidance-copy">
          <div class="breadcrumb">首页 / 专业知识库 / 作业指导书</div>
          <h1>作业指导书专栏</h1>
          <p>将行业经验转化为结构化、可检索、可执行的审核方法</p>
          <div class="section-label"><span></span>WORK GUIDANCE LIBRARY</div>
        </div>
        <aside class="guidance-banner is-visual-only" aria-label="作业指导书技术图"></aside>
      </div>

      <div class="guidance-search">
        <span class="search-icon" aria-hidden="true"></span>
        <input type="search" aria-label="检索作业指导书" placeholder="搜索指导书名称、专业代码、审核要点或适用行业......" />
        <button class="filter-button" type="button">体系范围 <b>全部体系</b><i></i></button>
        <button class="filter-button" type="button">文件状态 <b>现行有效</b><i></i></button>
        <button class="search-action" type="button">检索指导书</button>
      </div>

      <div class="guidance-layout">
        <aside class="guidance-sidebar">
          <h2>专业领域</h2>
          <p>按管理体系与技术领域浏览</p>
          <div class="domain-list">
            <button class="active" type="button"><span>全部作业指导书</span><b>168</b></button>
            <button type="button"><span>质量管理体系</span><b>74</b></button>
            <button type="button"><span>环境管理体系</span><b>46</b></button>
            <button type="button"><span>职业健康安全</span><b>39</b></button>
            <button type="button"><span>医疗器械质量</span><b>9</b></button>
          </div>
          <div class="quick-links">
            <strong>快速入口</strong>
            <a href="#specialties" data-route="specialties">专业代码对照表</a>
            <a href="#rules" data-route="rules">指导书编制规则</a>
          </div>
        </aside>

        <section class="guidance-main">
          <div class="recommend-head">
            <div>
              <h2>推荐与最新发布</h2>
              <p>优先展示现行有效、使用频率高的指导书</p>
            </div>
            <div class="segmented">
              <button class="active" type="button">全部</button>
              <button type="button">最新</button>
              <button type="button">下载最多</button>
            </div>
          </div>

          <div class="guidance-cards">
            <a class="guidance-card" href="books/iso45001-31-12-warehouse.html">
              <div class="doc-icon"></div>
              <span class="pill">ISO 45001</span>
              <strong>仓储和存储<br />职业健康安全审核指导书</strong>
              <small>HLC-OHS-31.12 · V1.0</small>
              <footer><span>2026-07-03 更新 · HTML 全文</span><b></b></footer>
            </a>
            <a class="guidance-card" href="books/iso45001-31-12-warehouse.html">
              <div class="doc-icon"></div>
              <span class="pill">ISO 9001</span>
              <strong>通用机械制造<br />质量管理审核指导书</strong>
              <small>HLC-QMS-18.01 · V2.1</small>
              <footer><span>2026-07-28 更新 · PDF 3.8 MB</span><b></b></footer>
            </a>
            <a class="guidance-card" href="books/iso45001-31-12-warehouse.html">
              <div class="doc-icon"></div>
              <span class="pill">ISO 14001</span>
              <strong>电子信息产品制造<br />环境管理审核指导书</strong>
              <small>HLC-EMS-19.02 · V2.0</small>
              <footer><span>2026-07-08 更新 · PDF 3.4 MB</span><b></b></footer>
            </a>
          </div>

          <div class="guidance-browser"></div>

          <div class="guidance-note">
            <div>
              <h2>编制与使用说明</h2>
              <p>每份指导书均关联适用专业小类、典型风险、审核证据与版本记录。 如发现现场适用性问题，可提交技术反馈并进入修订流程。</p>
            </div>
            <a href="books/iso45001-31-12-warehouse.html">查看真实全文样例 <span></span></a>
          </div>
        </section>
      </div>
      <div class="guidance-foot">
        <span>HLC CERTIFICATION · INTERNAL TECHNICAL KNOWLEDGE PORTAL</span>
        <span>受控文件 · 登录后查看完整内容</span>
      </div>
    </section>
  `;
  hydrateGuidanceCatalog();
}

function renderWorkspace(moduleId) {
  const item = modules.find((module) => module.id === moduleId) || modules[0];
  if (item.id === "audit") {
    renderAuditWorkspace();
    return;
  }
  workspaceView.innerHTML = `
    <div class="workspace-hero">
      <div>
        <div class="eyebrow"><span></span>${item.no} / ${item.title}</div>
        <h1>${item.title}</h1>
        <p>${item.hero}</p>
      </div>
      <div class="workspace-badge">
        <span>HXLC 技术底盘</span>
        <img src="assets/hxlc-logo.png" alt="宏信联诚认证 Logo" />
      </div>
    </div>
    <div class="workspace-layout">
      <aside class="side-menu">
        ${modules
          .map(
            (module) => `
              <button type="button" class="${module.id === item.id ? "active" : ""}" data-route="${module.id}">
                ${module.no} ${module.title}
              </button>
            `,
          )
          .join("")}
      </aside>
      <section class="content-panel">
        <div class="content-head">
          <div>
            <h2>${item.title}架构</h2>
            <p>${item.summary}</p>
          </div>
          <a class="open-book" href="books/iso45001-31-12-warehouse.html">真实电子书样例</a>
        </div>
        <div class="library-grid">
          ${item.sections
            .map(
              ([title, description]) => `
                <article class="library-card">
                  <strong>${title}</strong>
                  <p>${description}</p>
                </article>
              `,
            )
            .join("")}
        </div>
        <div class="tag-row">
          ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
      </section>
    </div>
  `;
}

function setActiveView(rawRoute) {
  const route = routeAliases[rawRoute] || rawRoute;
  const isBook = route === "book";
  const isHome = route === "home" || !route;
  const isModule = modules.some((module) => module.id === route);

  Object.values(views).forEach((view) => view.classList.remove("active"));

  if (isBook) {
    views.book.classList.add("active");
  } else if (isModule) {
    renderWorkspace(route);
    views.workspace.classList.add("active");
  } else {
    views.home.classList.add("active");
  }

  navLinks.forEach((link) => {
    const target = link.dataset.route;
    const canonicalTarget = routeAliases[target] || target;
    link.classList.toggle("active", canonicalTarget === route || target === rawRoute);
  });

  if (window.location.hash.slice(1) !== rawRoute) {
    window.history.replaceState(null, "", `#${isHome ? "home" : rawRoute}`);
  }
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-route]");
  if (!trigger) return;
  const route = trigger.dataset.route;
  if (!route) return;
  event.preventDefault();
  setActiveView(route);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

window.addEventListener("hashchange", () => {
  setActiveView(window.location.hash.slice(1) || "home");
});

renderArchitecture();
setActiveView(window.location.hash.slice(1) || "home");
