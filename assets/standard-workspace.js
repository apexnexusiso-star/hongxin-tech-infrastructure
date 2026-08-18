(function () {
  const standardCategories = [
    {
      code: "01",
      title: "机构准入与认可",
      subtitle: "认证机构的资质与认可底座",
      note: "管理认证机构自身资质、认可准则、认可规则和公正保密等基础要求。",
      scopes: ["17021", "17065", "17024", "CNAS 认可"],
    },
    {
      code: "02",
      title: "认证业务依据标准",
      subtitle: "发证和审核的核心依据",
      note: "维护各认证项目的依据标准、版本状态、采标关系和证书转换关注点。",
      scopes: ["9001", "14001", "45001", "22000", "27001", "50001"],
    },
    {
      code: "03",
      title: "审核方法与人员能力",
      subtitle: "审核实施和人员评价方法",
      note: "支撑审核方案策划、人员能力评价、审核员注册和持续能力保持。",
      scopes: ["19011", "审核方法", "人员能力", "注册要求"],
    },
    {
      code: "04",
      title: "专业领域与行业支撑",
      subtitle: "行业审核的技术支撑标准",
      note: "围绕高频行业和专题管理要求，服务专业小类审核判断与风险识别。",
      scopes: ["环境支撑", "职业健康安全", "行业技术", "专题管理"],
    },
    {
      code: "05",
      title: "认证规则与监管",
      subtitle: "认证活动规则与监管技术要求",
      note: "管理 CNCA 等认证规则、实施规则和监管性技术文件。",
      scopes: ["认证规则", "实施规则", "监管要求", "证后管理"],
    },
  ];

  function fallbackEscape(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getCatalog() {
    return Array.isArray(window.HXLC_STANDARD_CATALOG) ? window.HXLC_STANDARD_CATALOG : [];
  }

  function getCategoryItems(categoryCode, catalog) {
    return catalog.filter((item) => item.categoryCode === categoryCode);
  }

  function categoryCount(category, catalog) {
    return getCategoryItems(category.code, catalog).length;
  }

  function uniqueLevels(catalog) {
    return [...new Set(catalog.map((item) => item.level).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "zh-CN", { numeric: true }),
    );
  }

  function sourceLabel(item) {
    if (item.publisher) return item.publisher;
    if (!item.sourceHost) return "待补充来源";
    if (item.sourceHost.includes("samr") || item.sourceHost.includes("openstd")) {
      return "国家标准公开系统";
    }
    if (item.sourceHost.includes("iso.org")) return "ISO";
    if (item.sourceHost.includes("cnas")) return "CNAS";
    return item.sourceHost;
  }

  function renderStandardRow(item, selectedId, escapeHtml) {
    const date = item.implementationDate || item.publishDate || "待核验";
    return `
      <button class="standard-row ${item.id === selectedId ? "active" : ""}" type="button" data-standard-id="${escapeHtml(item.id)}">
        <span class="std-no">${escapeHtml(item.standardNo || item.id)}</span>
        <span class="std-name">
          <strong>${escapeHtml(item.nameCn || "未命名标准")}</strong>
          <small>${escapeHtml(item.nameEn || item.subcategory || "")}</small>
        </span>
        <span class="std-level">${escapeHtml(item.level || "未标注")}</span>
        <span class="std-status">${escapeHtml(item.status || "待核验")}</span>
        <span class="std-date">${escapeHtml(date)}</span>
        <span class="std-source">${escapeHtml(sourceLabel(item))}</span>
      </button>
    `;
  }

  function renderDetail(item, escapeHtml) {
    if (!item) {
      return `
        <div class="standard-detail-empty">
          <strong>请选择一项标准</strong>
          <p>左侧选择分类，并在右侧标准清单中点击某项，即可查看标准用途、版本关系和来源信息。</p>
        </div>
      `;
    }
    const source = item.sourceUrl
      ? `<a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">打开来源链接</a>`
      : "<span>待补充来源链接</span>";
    return `
      <div class="standard-detail-card">
        <div class="standard-detail-head">
          <span>${escapeHtml(item.id)}</span>
          <h3>${escapeHtml(item.standardNo || "未标注标准号")}</h3>
          <p>${escapeHtml(item.nameCn || "未命名标准")}</p>
        </div>
        <div class="standard-summary">
          <strong>标准简介</strong>
          <p>${escapeHtml(item.summary)}</p>
        </div>
        <dl class="standard-meta-grid">
          <div><dt>一级分类</dt><dd>${escapeHtml(item.category)}</dd></div>
          <div><dt>二级标签</dt><dd>${escapeHtml(item.subcategory || "未标注")}</dd></div>
          <div><dt>标准层级</dt><dd>${escapeHtml(item.level || "未标注")}</dd></div>
          <div><dt>状态</dt><dd>${escapeHtml(item.status || "待核验")}</dd></div>
          <div><dt>发布日期</dt><dd>${escapeHtml(item.publishDate || "待核验")}</dd></div>
          <div><dt>实施/有效日期</dt><dd>${escapeHtml(item.implementationDate || "待核验")}</dd></div>
          <div><dt>发布单位</dt><dd>${escapeHtml(item.publisher || "待补充")}</dd></div>
          <div><dt>起草单位</dt><dd>${escapeHtml(item.draftingOrg || "待补充")}</dd></div>
          <div><dt>起草人</dt><dd>${escapeHtml(item.drafters || "待补充")}</dd></div>
          <div><dt>核验日期</dt><dd>${escapeHtml(item.verifiedDate || "待核验")}</dd></div>
        </dl>
        <div class="standard-relation-list">
          <p><strong>适用认证项目：</strong>${escapeHtml(item.applicable || "待补充")}</p>
          <p><strong>采标关系：</strong>${escapeHtml(item.adoption || "未标注")}</p>
          <p><strong>替代/被替代：</strong>${escapeHtml(item.replacement || "未标注")}</p>
          <p><strong>版本提醒：</strong>${escapeHtml(item.versionNote || "暂无特别提醒")}</p>
        </div>
        <div class="standard-copyright-note">
          <strong>全文处理</strong>
          <p>${escapeHtml(item.fullTextPolicy || "标准库仅保存元数据，不保存受版权保护的标准全文。")}</p>
          ${source}
        </div>
      </div>
    `;
  }

  window.renderHxlcStandardWorkspace = function renderHxlcStandardWorkspace(
    container,
    providedEscapeHtml,
  ) {
    const escapeHtml = providedEscapeHtml || fallbackEscape;
    const catalog = getCatalog();
    const levels = uniqueLevels(catalog);
    let activeCode = "01";
    let activeLevel = "all";
    let selectedId = getCategoryItems(activeCode, catalog)[0]?.id || catalog[0]?.id || "";

    container.innerHTML = `
      <section class="standard-page">
        <div class="regulation-hero standard-hero">
          <div>
            <div class="breadcrumb">首页 / 标准规范库 / 标准元数据</div>
            <h1>标准规范库</h1>
            <p>按认证机构使用场景管理标准号、标准名称、状态、发布日期、实施日期、采标关系、适用认证项目和来源链接，不保存受版权保护的标准全文。</p>
          </div>
          <aside class="regulation-summary">
            <span>当前已入库</span>
            <strong>${catalog.length}</strong>
            <small>项标准元数据</small>
          </aside>
        </div>

        <div class="regulation-layout standard-layout">
          <aside class="regulation-sidebar standard-sidebar">
            <h2>标准分类</h2>
            <p>按认证机构使用场景归档，便于审核、复核、培训和版本跟踪。</p>
            ${standardCategories
              .map(
                (category) => `
                  <a class="${category.code === activeCode ? "active" : ""}" href="#standard-list" data-standard-category="${category.code}">
                    <span>${category.code}</span>
                    <strong>${category.title}</strong>
                    <b>${categoryCount(category, catalog)}</b>
                  </a>
                `,
              )
              .join("")}
          </aside>

          <section class="regulation-main standard-main">
            <div class="regulation-toolbar standard-toolbar">
              <div>
                <span>STANDARD METADATA LIBRARY</span>
                <h2>标准检索与版本跟踪</h2>
              </div>
              <button type="button">仅显示元数据</button>
            </div>

            <section class="regulation-library standard-library" id="standard-list">
              <div class="reg-library-head">
                <div>
                  <span>标准规范库 / <b data-standard-category-code>01</b></span>
                  <h2 data-standard-category-title>机构准入与认可</h2>
                  <p data-standard-category-note>管理认证机构自身资质、认可准则、认可规则和公正保密等基础要求。</p>
                </div>
                <strong data-standard-category-count>${catalog.length}</strong>
              </div>

              <div class="reg-category-summary">
                <small data-standard-category-subtitle>认证机构的资质与认可底座</small>
                <div class="reg-scope-row standard-scope-row"></div>
              </div>

              <div class="standard-filterbar">
                <input class="standard-filter-input" type="search" aria-label="搜索标准" placeholder="搜索标准号、名称、适用认证项目、来源..." />
                <select class="standard-level-filter" aria-label="标准层级">
                  <option value="all">全部层级</option>
                  ${levels.map((level) => `<option value="${escapeHtml(level)}">${escapeHtml(level)}</option>`).join("")}
                </select>
              </div>

              <div class="standard-table">
                <div class="standard-table-head">
                  <span>标准号</span>
                  <span>标准名称</span>
                  <span>层级</span>
                  <span>状态</span>
                  <span>日期</span>
                  <span>来源</span>
                </div>
                <div class="standard-list"></div>
              </div>
            </section>

            <aside class="standard-detail"></aside>

            <div class="regulation-note standard-note">
              <strong>建设原则</strong>
              <p>标准库先解决“用哪个版本、适用于哪个认证项目、来源在哪里、是否需要购买全文”这四件事。后续如需使用标准正文，应通过正版采购或授权路径纳入内部受控文件库。</p>
            </div>
          </section>
        </div>
      </section>
    `;

    const categoryLinks = container.querySelectorAll("[data-standard-category]");
    const categoryCodeEl = container.querySelector("[data-standard-category-code]");
    const categoryTitleEl = container.querySelector("[data-standard-category-title]");
    const categorySubtitleEl = container.querySelector("[data-standard-category-subtitle]");
    const categoryNoteEl = container.querySelector("[data-standard-category-note]");
    const categoryCountEl = container.querySelector("[data-standard-category-count]");
    const scopeRow = container.querySelector(".standard-scope-row");
    const list = container.querySelector(".standard-list");
    const detail = container.querySelector(".standard-detail");
    const searchInput = container.querySelector(".standard-filter-input");
    const levelFilter = container.querySelector(".standard-level-filter");

    const render = () => {
      const category =
        standardCategories.find((item) => item.code === activeCode) || standardCategories[0];
      const keyword = (searchInput?.value || "").trim().toLowerCase();
      const filtered = getCategoryItems(category.code, catalog).filter((item) => {
        const levelOk = activeLevel === "all" || item.level === activeLevel;
        const haystack = `${item.id} ${item.category} ${item.subcategory} ${item.level} ${item.standardNo} ${item.nameCn} ${item.nameEn} ${item.status} ${item.applicable} ${item.sourceHost}`.toLowerCase();
        return levelOk && (!keyword || haystack.includes(keyword));
      });

      if (!filtered.some((item) => item.id === selectedId)) {
        selectedId = filtered[0]?.id || "";
      }
      const selected = catalog.find((item) => item.id === selectedId) || filtered[0] || null;

      if (categoryCodeEl) categoryCodeEl.textContent = category.code;
      if (categoryTitleEl) categoryTitleEl.textContent = category.title;
      if (categorySubtitleEl) categorySubtitleEl.textContent = category.subtitle;
      if (categoryNoteEl) categoryNoteEl.textContent = category.note;
      if (categoryCountEl) categoryCountEl.textContent = String(filtered.length);
      if (scopeRow) {
        scopeRow.innerHTML = category.scopes.map((scope) => `<span>${escapeHtml(scope)}</span>`).join("");
      }
      if (list) {
        list.innerHTML = filtered.length
          ? filtered.map((item) => renderStandardRow(item, selectedId, escapeHtml)).join("")
          : '<div class="standard-empty">没有找到匹配的标准元数据。</div>';
      }
      if (detail) detail.innerHTML = renderDetail(selected, escapeHtml);
      categoryLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.standardCategory === activeCode);
      });
    };

    categoryLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        activeCode = link.dataset.standardCategory || "01";
        activeLevel = "all";
        if (searchInput) searchInput.value = "";
        if (levelFilter) levelFilter.value = "all";
        selectedId = getCategoryItems(activeCode, catalog)[0]?.id || "";
        render();
      });
    });
    list?.addEventListener("click", (event) => {
      const row = event.target.closest("[data-standard-id]");
      if (!row) return;
      selectedId = row.dataset.standardId || "";
      render();
    });
    searchInput?.addEventListener("input", render);
    levelFilter?.addEventListener("change", () => {
      activeLevel = levelFilter.value || "all";
      render();
    });
    render();
  };
})();
