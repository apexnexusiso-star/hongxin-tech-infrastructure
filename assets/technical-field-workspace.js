(function () {
  const fallbackSystems = [
    { code: "QMS", title: "质量管理体系", route: "Q", status: "待导入" },
    { code: "EMS", title: "环境管理体系", route: "E", status: "待导入" },
    { code: "OHSMS", title: "职业健康安全", route: "S", status: "待导入" },
    { code: "EnMS", title: "能源管理体系", route: "N", status: "待导入" },
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
    return Array.isArray(window.HXLC_TECHNICAL_FIELD_CATALOG)
      ? window.HXLC_TECHNICAL_FIELD_CATALOG
      : [];
  }

  function labelForDocType(doc) {
    if (doc.docType === "group-analysis") return "技术领域\n分组论证";
    if (doc.docType === "energy-direct") return "能源";
    return doc.code || "基础卡";
  }

  function docMeta(doc) {
    const typeMap = {
      "group-analysis": "分组论证",
      "energy-direct": "专业能力要求",
      "base-card": "基础卡",
    };
    return [doc.fileNo, typeMap[doc.docType] || doc.docTypeLabel, `目录 ${doc.tocItems || 0} 项`]
      .filter(Boolean)
      .join(" · ");
  }

  function renderDocButton(doc, activeUrl, escapeHtml) {
    return `
      <button class="${doc.url === activeUrl ? "active" : ""}" type="button" data-tfa-doc="${escapeHtml(doc.url)}">
        <span>${escapeHtml(labelForDocType(doc))}</span>
        <strong>${escapeHtml(doc.title)}</strong>
        <small>${escapeHtml(docMeta(doc))}</small>
      </button>
    `;
  }

  function renderGroupCard(group, activeGroupId, escapeHtml) {
    const smallText = group.direct
      ? "独立技术领域文件"
      : group.cardCount
        ? `${group.cardCount} 张基础卡 · 1 份分组论证`
        : "1 份分组论证";
    return `
      <button class="${group.id === activeGroupId ? "active" : ""}" type="button" data-tfa-group="${escapeHtml(group.id)}">
        <span>${escapeHtml(group.groupCode)}</span>
        <strong>${escapeHtml(group.groupName)}</strong>
        <small>${escapeHtml(smallText)}</small>
      </button>
    `;
  }

  function systemStatus(item) {
    if (!item) return "待导入";
    const docs = item.totalDocuments || 0;
    if (!item.totalGroups) return "待导入";
    return `${item.totalGroups} 组 · ${docs} 份文件`;
  }

  function buildSystemOptions(catalog) {
    return fallbackSystems.map((system) => {
      const imported = catalog.find((item) => item.system === system.code);
      return {
        ...system,
        title: imported?.systemName || system.title,
        status: systemStatus(imported),
        disabled: !imported || !imported.totalGroups,
      };
    });
  }

  const majorNames = {
    "17": "金属冶炼、金属制品及加工维修",
    "18": "机械设备制造、修理与安装",
    "19": "电子、电气、光学设备制造及修理",
  };

  function majorOptionsForSystem(systemData) {
    const groups = systemData?.groups || [];
    const options = [];
    groups.forEach((group) => {
      const code = group.majorCode || "";
      if (!code || options.some((item) => item.code === code)) return;
      const scopedGroups = groups.filter((item) => item.majorCode === code);
      const docCount = scopedGroups.reduce((sum, item) => sum + 1 + (item.cardCount || 0), 0);
      options.push({
        code,
        label: `${code} 大类`,
        name: majorNames[code] || `${code} 大类技术领域`,
        status: `${scopedGroups.length} 组 · ${docCount} 份文件`,
      });
    });
    return options.sort((a, b) => a.code.localeCompare(b.code, "zh-CN", { numeric: true }));
  }

  window.renderHxlcTechnicalFieldWorkspace = function renderHxlcTechnicalFieldWorkspace(
    container,
    providedEscapeHtml,
  ) {
    const escapeHtml = providedEscapeHtml || fallbackEscape;
    const catalog = getCatalog();
    const systemOptions = buildSystemOptions(catalog);
    const firstAvailable = systemOptions.find((system) => !system.disabled)?.code || "QMS";
    let activeSystem = firstAvailable;
    let activeMajorCode = "";
    let activeGroupId = "";
    let activeDocUrl = "";

    const activeSystemData = () =>
      catalog.find((item) => item.system === activeSystem) ||
      catalog.find((item) => item.totalGroups) ||
      catalog[0];

    container.innerHTML = `
      <section class="tfa-page">
        <div class="regulation-hero tfa-hero">
          <div>
            <div class="breadcrumb">首页 / 技术领域分析 / 体系与分组</div>
            <h1>技术领域分析</h1>
            <p>把专业小类先沉淀为百科式基础卡，再通过分组论证说明共同基础、差异边界、能力迁移和授权评价后果；能源管理体系按独立领域直接展开。</p>
          </div>
          <aside class="regulation-summary">
            <span>当前技术底稿</span>
            <strong data-tfa-total-groups>0</strong>
            <small data-tfa-total-summary>待导入</small>
          </aside>
        </div>

        <div class="tfa-system-row">
          ${systemOptions
            .map(
              (system) => `
                <button class="${system.code === activeSystem ? "active" : ""}" type="button" data-tfa-system="${system.code}" ${system.disabled ? "disabled" : ""}>
                  <span>${escapeHtml(system.route)}</span>
                  <strong>${escapeHtml(system.title)}</strong>
                  <small>${escapeHtml(system.status)}</small>
                </button>
              `,
            )
            .join("")}
        </div>

        <section class="tfa-group-strip">
          <div class="tfa-group-strip-head">
            <div>
              <span data-tfa-system-label></span>
              <h2 data-tfa-system-title></h2>
            </div>
            <label class="tfa-major-control">
              <span>专业大类</span>
              <select data-tfa-major></select>
            </label>
            <p data-tfa-orphan-note></p>
          </div>
          <div class="tfa-group-list"></div>
        </section>

        <div class="tfa-layout">
          <section class="tfa-main">
            <div class="tfa-group-head">
              <div>
                <span data-tfa-group-code></span>
                <h2 data-tfa-group-title></h2>
                <p data-tfa-group-summary></p>
              </div>
              <b data-tfa-group-count></b>
            </div>

            <div class="tfa-reader-layout">
              <aside class="tfa-doc-tree">
                <h3 data-tfa-doc-tree-title>文件树</h3>
                <p data-tfa-doc-tree-note></p>
                <div class="tfa-doc-list"></div>
              </aside>
              <section class="tfa-reader">
                <iframe title="技术领域分析电子书" src=""></iframe>
              </section>
            </div>
          </section>
        </div>
      </section>
    `;

    const systemButtons = container.querySelectorAll("[data-tfa-system]");
    const groupList = container.querySelector(".tfa-group-list");
    const docList = container.querySelector(".tfa-doc-list");
    const iframe = container.querySelector(".tfa-reader iframe");
    const codeEl = container.querySelector("[data-tfa-group-code]");
    const titleEl = container.querySelector("[data-tfa-group-title]");
    const summaryEl = container.querySelector("[data-tfa-group-summary]");
    const countEl = container.querySelector("[data-tfa-group-count]");
    const totalGroupsEl = container.querySelector("[data-tfa-total-groups]");
    const totalSummaryEl = container.querySelector("[data-tfa-total-summary]");
    const systemLabelEl = container.querySelector("[data-tfa-system-label]");
    const systemTitleEl = container.querySelector("[data-tfa-system-title]");
    const orphanNoteEl = container.querySelector("[data-tfa-orphan-note]");
    const majorSelect = container.querySelector("[data-tfa-major]");
    const docTreeTitleEl = container.querySelector("[data-tfa-doc-tree-title]");
    const docTreeNoteEl = container.querySelector("[data-tfa-doc-tree-note]");

    const groupsForActiveSystem = () => {
      const systemData = activeSystemData();
      const groups = systemData?.groups || [];
      if (systemData?.direct || !activeMajorCode) return groups;
      return groups.filter((group) => group.majorCode === activeMajorCode);
    };
    const activeGroup = () => {
      const groups = groupsForActiveSystem();
      return groups.find((group) => group.id === activeGroupId) || groups[0];
    };
    const docsForGroup = (group) => (group ? [group.analysis, ...(group.cards || [])].filter(Boolean) : []);

    const render = () => {
      const systemData = activeSystemData();
      const majors = majorOptionsForSystem(systemData);
      if (!majors.some((major) => major.code === activeMajorCode)) {
        activeMajorCode = majors[0]?.code || "";
        activeGroupId = "";
        activeDocUrl = "";
      }
      const groups = groupsForActiveSystem();
      if (!groups.some((group) => group.id === activeGroupId)) {
        activeGroupId = groups[0]?.id || "";
        activeDocUrl = "";
      }
      const group = activeGroup();
      const docs = docsForGroup(group);
      if (!docs.some((doc) => doc.url === activeDocUrl)) {
        activeDocUrl = docs[0]?.url || "";
      }
      if (groupList) {
        groupList.innerHTML = groups.map((item) => renderGroupCard(item, activeGroupId, escapeHtml)).join("");
      }
      if (majorSelect) {
        majorSelect.innerHTML = majors
          .map(
            (major) => `
              <option value="${escapeHtml(major.code)}" ${major.code === activeMajorCode ? "selected" : ""}>
                ${escapeHtml(`${major.label} · ${major.name} · ${major.status}`)}
              </option>
            `,
          )
          .join("");
        majorSelect.disabled = majors.length <= 1;
      }
      if (docList) {
        docList.innerHTML = docs.map((doc) => renderDocButton(doc, activeDocUrl, escapeHtml)).join("");
      }
      if (iframe) iframe.src = activeDocUrl || "about:blank";
      if (codeEl) codeEl.textContent = group?.groupCode || "";
      if (titleEl) titleEl.textContent = group?.groupName || "暂无分组";
      if (summaryEl) summaryEl.textContent = group?.summary || "";
      if (countEl) countEl.textContent = `${docs.length} 份文件`;
      if (totalGroupsEl) totalGroupsEl.textContent = systemData?.totalGroups || 0;
      if (totalSummaryEl) {
        totalSummaryEl.textContent = systemData
          ? `${systemData.systemName} · ${systemData.totalDocuments || 0} 份文件`
          : "待导入";
      }
      if (systemLabelEl) {
        systemLabelEl.textContent = systemData
          ? `${systemData.system} / 第 ${systemData.majorCode || "-"} 类`
          : "待导入";
      }
      if (systemTitleEl) systemTitleEl.textContent = systemData?.majorName || "技术领域分组";
      const selectedMajor = majors.find((item) => item.code === activeMajorCode);
      if (systemLabelEl) {
        systemLabelEl.textContent = systemData && selectedMajor
          ? `${systemData.system} / ${selectedMajor.label} / ${selectedMajor.status}`
          : systemData
            ? `${systemData.system} / ${systemData.totalGroups || 0} 组`
            : "待导入";
      }
      if (systemTitleEl) {
        systemTitleEl.textContent = selectedMajor?.name || systemData?.systemName || "技术领域分组";
      }
      if (orphanNoteEl) {
        const orphans = systemData?.orphanCards || [];
        orphanNoteEl.innerHTML = orphans.length
          ? `<strong>跨组参考：</strong>${orphans
              .map((card) => `${escapeHtml(card.code)} ${escapeHtml(card.title)}`)
              .join("；")}`
          : systemData?.direct
            ? "能源管理体系按十个独立技术领域直接展示，不拆分为基础卡和分组论证。"
            : "按技术领域包组织分组论证，基础卡随文件补充后自动进入文件树。";
      }
      if (docTreeTitleEl) docTreeTitleEl.textContent = systemData?.direct ? "领域文件" : "文件树";
      if (docTreeNoteEl) {
        docTreeNoteEl.textContent = systemData?.direct
          ? "能源管理体系每组直接打开完整技术领域分析文件。"
          : "先看分组论证，再看组内专业小类基础卡。";
      }
      systemButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.tfaSystem === activeSystem);
      });
    };

    systemButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.disabled) return;
        activeSystem = button.dataset.tfaSystem || activeSystem;
        activeMajorCode = "";
        activeGroupId = "";
        activeDocUrl = "";
        render();
      });
    });
    majorSelect?.addEventListener("change", () => {
      activeMajorCode = majorSelect.value || activeMajorCode;
      activeGroupId = "";
      activeDocUrl = "";
      render();
    });
    groupList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tfa-group]");
      if (!button) return;
      activeGroupId = button.dataset.tfaGroup || activeGroupId;
      activeDocUrl = "";
      render();
    });
    docList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-tfa-doc]");
      if (!button) return;
      activeDocUrl = button.dataset.tfaDoc || activeDocUrl;
      render();
    });
    render();
  };
})();
