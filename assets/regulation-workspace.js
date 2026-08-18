(function () {
  const regulationCategories = [
    {
      code: "01",
      title: "机构主体与合规运营类",
      subtitle: "CB 的“保命”法则",
      note: "保障认证机构本身合法设立、合法经营，降低机构自身法律风险。",
      scopes: ["认证认可专项", "通用商事劳动", "数据与隐私", "商业秩序"],
      status: "已导入",
    },
    {
      code: "02",
      title: "认可规范与合格评定标准类",
      subtitle: "CB 的“技术与质量”法则",
      note: "确保认证机构技术运作符合评审要求，具备持续发证资质。",
      scopes: ["合格评定标准", "IAF/APAC 规范", "认可规则", "注册与行业规则"],
      status: "待导入",
    },
    {
      code: "03",
      title: "通用体系审核判定依据类",
      subtitle: "审核员的“通用裁判”依据",
      note: "用于 ISO 9001、14001、45001、27001 等通用体系审核时的合规性判定。",
      scopes: ["职业健康安全", "环境保护", "质量与标准化", "信息安全"],
      status: "待导入",
    },
    {
      code: "04",
      title: "特定行业与专业领域专项类",
      subtitle: "审核员的“专业裁判”依据",
      note: "依据 CNAS/IAF 专业代码划分，收纳特定行业审核时的特殊法规要求。",
      scopes: ["食品农产品", "医疗器械", "工程建设", "交通汽车"],
      status: "待导入",
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
    return Array.isArray(window.HXLC_REGULATION_CATALOG)
      ? window.HXLC_REGULATION_CATALOG
      : [];
  }

  function getCategoryItems(categoryCode, catalog) {
    return catalog.filter((item) => item.categoryCode === categoryCode);
  }

  function categoryCount(category, catalog) {
    return getCategoryItems(category.code, catalog).length;
  }

  function renderDocItem(item, escapeHtml) {
    const title = item.title || item.sourceFile || "未命名法规";
    const meta = [item.fileNo, item.pubDate, item.source].filter(Boolean).join(" · ");
    return `
      <a class="reg-doc-item" href="${escapeHtml(item.url)}">
        <span>${escapeHtml(item.code)}</span>
        <div>
          <small>${escapeHtml(item.topic || item.category || "法律法规")}</small>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(meta)}</p>
        </div>
        <b>阅读全文</b>
      </a>
    `;
  }

  function hydrateRegulationLibrary(container, escapeHtml) {
    const catalog = getCatalog();
    const categoryLinks = container.querySelectorAll("[data-reg-category]");
    const categoryCodeEl = container.querySelector("[data-reg-category-code]");
    const categoryTitleEl = container.querySelector("[data-reg-category-title]");
    const categorySubtitleEl = container.querySelector("[data-reg-category-subtitle]");
    const categoryNoteEl = container.querySelector("[data-reg-category-note]");
    const categoryCountEl = container.querySelector("[data-reg-category-count]");
    const scopeRow = container.querySelector(".reg-scope-row");
    const docList = container.querySelector(".reg-doc-list");
    const searchInput = container.querySelector(".regulation-filter-input");
    let activeCode = "01";

    const render = () => {
      const category =
        regulationCategories.find((item) => item.code === activeCode) || regulationCategories[0];
      const keyword = (searchInput?.value || "").trim().toLowerCase();
      const items = getCategoryItems(category.code, catalog).filter((item) => {
        const haystack = `${item.code} ${item.category} ${item.topic} ${item.title} ${item.fileNo} ${item.source}`.toLowerCase();
        return !keyword || haystack.includes(keyword);
      });

      if (categoryCodeEl) categoryCodeEl.textContent = category.code;
      if (categoryTitleEl) categoryTitleEl.textContent = category.title;
      if (categorySubtitleEl) categorySubtitleEl.textContent = category.subtitle;
      if (categoryNoteEl) categoryNoteEl.textContent = category.note;
      if (categoryCountEl) categoryCountEl.textContent = String(items.length);
      if (scopeRow) {
        scopeRow.innerHTML = category.scopes.map((scope) => `<span>${escapeHtml(scope)}</span>`).join("");
      }

      if (docList) {
        docList.innerHTML = items.length
          ? items.map((item) => renderDocItem(item, escapeHtml)).join("")
          : `
            <div class="reg-doc-empty">
              <strong>${escapeHtml(category.title)}暂未导入文件</strong>
              <p>后续把成熟法规文件放入对应目录后，可继续批量转换为电子书并显示在这里。</p>
            </div>
          `;
      }

      categoryLinks.forEach((link) => {
        link.classList.toggle("active", link.dataset.regCategory === activeCode);
      });
    };

    categoryLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        activeCode = link.dataset.regCategory || "01";
        if (searchInput) searchInput.value = "";
        render();
      });
    });
    searchInput?.addEventListener("input", render);
    render();
  }

  window.renderHxlcRegulationWorkspace = function renderHxlcRegulationWorkspace(
    container,
    providedEscapeHtml,
  ) {
    const escapeHtml = providedEscapeHtml || fallbackEscape;
    const catalog = getCatalog();
    const importedCount = catalog.length;

    container.innerHTML = `
      <section class="regulation-page regulation-page-live">
        <div class="regulation-hero">
          <div>
            <div class="breadcrumb">首页 / 法律法规库 / 法规分类</div>
            <h1>法律法规库</h1>
            <p>按照机构运营、认可规范、通用体系审核和特定行业四类管理法规文件，形成可维护、可检索、可扩展的法规依据库。</p>
          </div>
          <aside class="regulation-summary">
            <span>当前已入库</span>
            <strong>${importedCount}</strong>
            <small>项法规电子书</small>
          </aside>
        </div>

        <div class="regulation-layout">
          <aside class="regulation-sidebar reg-classification">
            <h2>法规分类</h2>
            <p>按 7777.docx 的四类结构归档，后续新增法规继续放入对应分类。</p>
            ${regulationCategories
              .map(
                (category) => `
                  <a class="${category.code === "01" ? "active" : ""}" href="#regulation-docs" data-reg-category="${category.code}">
                    <span>${category.code}</span>
                    <strong>${category.title}</strong>
                    <b>${categoryCount(category, catalog)}</b>
                  </a>
                `,
              )
              .join("")}
          </aside>

          <section class="regulation-main">
            <div class="regulation-toolbar">
              <div>
                <span>REGULATION LIBRARY</span>
                <h2>法规文件清单</h2>
              </div>
              <button type="button">四类归档</button>
            </div>

            <section class="regulation-library regulation-library-simple" id="regulation-docs">
              <div class="reg-library-head">
                <div>
                  <span>法律法规库 / <b data-reg-category-code>01</b></span>
                  <h2 data-reg-category-title>机构主体与合规运营类</h2>
                  <p data-reg-category-note>保障认证机构本身合法设立、合法经营，降低机构自身法律风险。</p>
                </div>
                <strong data-reg-category-count>${importedCount}</strong>
              </div>

              <div class="reg-category-summary">
                <small data-reg-category-subtitle>CB 的“保命”法则</small>
                <div class="reg-scope-row"></div>
              </div>

              <div class="reg-library-content">
                <div class="reg-library-tools">
                  <input class="regulation-filter-input" type="search" aria-label="搜索法规名称" placeholder="搜索法规名称、编号、来源或主题..." />
                </div>
                <div class="reg-doc-list"></div>
              </div>
            </section>

            <div class="regulation-note">
              <strong>归档原则</strong>
              <p>法律法规库先按四类大框架归档，不再在右侧额外拆出过多栏目。后续新增法规时，只需要判断它属于机构运营、认可规范、通用审核判定依据还是特定行业专项，再批量入库即可。</p>
            </div>
          </section>
        </div>
      </section>
    `;

    hydrateRegulationLibrary(container, escapeHtml);
  };
})();
